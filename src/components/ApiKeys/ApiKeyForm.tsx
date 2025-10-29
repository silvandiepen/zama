import React, { useEffect, useState } from "react";
import { useBemm } from "@/utils/bemm";
import { Button } from "@/components/Button";
import { Colors } from "@/types";
import { useKeys } from "@/store/keys";
import { useToast } from "@/store/toast";
import { TextInput } from "@/components/Input/TextInput";
import { Textarea } from "@/components/Input/Textarea";
import { SwitchButton } from "@/components/Input/SwitchButton";
import type { ApiKey } from "@/types/apikey";
import { useTranslation } from "react-i18next";
import "./ApiKeyForm.scss";

type Props = {
  initialKey?: ApiKey;
  onSaved?: (k: ApiKey) => void;
  onCancel?: () => void;
};

type AccessLevel = 'none' | 'read' | 'readwrite';

const RESOURCES: Array<{ id: string; title: string; description: string }> = [
  { id: 'users', title: 'Users', description: 'Access to user accounts and profiles.' },
  { id: 'projects', title: 'Projects', description: 'Access to projects, metadata, and status.' },
  { id: 'keys', title: 'API Keys', description: 'Manage API keys and credentials.' },
  { id: 'settings', title: 'Settings', description: 'Access to application configuration.' },
];

/**
 * Form component for creating and editing API keys with configurable access levels.
 * Provides fields for title, description, and resource-specific read/write permissions.
 * @param {Props} props - Component props
 * @param {ApiKey} [props.initialKey] - Optional initial key data for editing mode
 * @param {(k: ApiKey) => void} [props.onSaved] - Callback function called when key is saved
 * @param {() => void} [props.onCancel] - Callback function called when form is cancelled
 * @returns {JSX.Element} The rendered API key form component.
 */
export const ApiKeyForm: React.FC<Props> = ({ initialKey, onSaved, onCancel }) => {
  const bemm = useBemm("apikey-form");
  const { createKey, updateKey, state } = useKeys();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const isRevoked = Boolean(initialKey?.revoked);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState<Record<string, AccessLevel>>(() => {
    const obj: Record<string, AccessLevel> = {};
    RESOURCES.forEach(r => { obj[r.id] = 'none'; });
    // default give read to keys for convenience
    obj['keys'] = 'read';
    return obj;
  });

  useEffect(() => {
    if (initialKey) {
      setTitle(initialKey.title);
      setDescription(initialKey.description || "");
      const next: Record<string, AccessLevel> = {};
      RESOURCES.forEach(r => {
        const canWrite = (initialKey.writeRules || []).includes(r.id);
        const canRead = (initialKey.readRules || []).includes(r.id);
        next[r.id] = canWrite ? 'readwrite' : canRead ? 'read' : 'none';
      });
      setAccess(next);
    }
  }, [initialKey]);
  
  /**
   * Handles form submission by validating input and either creating a new API key
   * or updating an existing one. Shows toast notifications for success/failure states
   * and resets form when creating new keys.
   * @returns {Promise<void>}
   */
  const onGenerate = async () => {
    if (!title.trim()) {
      addToast({ title: t('toast.missingTitleTitle'), message: t('toast.missingTitleMsg'), variant: "warning" });
      return;
    }
    const readRules = RESOURCES.filter(r => access[r.id] === 'read' || access[r.id] === 'readwrite').map(r => r.id);
    const writeRules = RESOURCES.filter(r => access[r.id] === 'readwrite').map(r => r.id);

    if (initialKey) {
      const updated = await updateKey({ id: initialKey.id, title: title.trim(), description: description.trim() || undefined, readRules, writeRules });
      if (updated) {
        addToast({ title: t('toast.updatedTitle'), message: t('toast.updatedMsg', { title: updated.title }), variant: "success" });
        onSaved?.(updated);
      }
    } else {
      const created = await createKey({ title: title.trim(), description: description.trim() || undefined, readRules, writeRules });
      addToast({ title: t('toast.createdTitle'), message: t('toast.createdMsg', { title: created.title }), variant: "success" });
      setTitle("");
      setDescription("");
      const reset: Record<string, AccessLevel> = {};
      RESOURCES.forEach(r => { reset[r.id] = r.id === 'keys' ? 'read' : 'none'; });
      setAccess(reset);
      onSaved?.(created);
    }
  };

  return (
    <form className={bemm("")}
      onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
      {isRevoked && (
        <div className={bemm('notice')} style={{
          padding: 'var(--space-s)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--border-radius-s)',
          background: 'color-mix(in srgb, var(--color-warning), transparent 92%)',
          marginBottom: 'var(--space)'
        }}>
          {t('form.revokedCannotEdit', { defaultValue: 'This key is revoked and cannot be edited.' })}
        </div>
      )}
      <TextInput
        id="title"
        label={t('form.title')}
        placeholder={t('form.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isRevoked}
        required
      />
      <Textarea
        id="description"
        label={t('form.description')}
        placeholder={t('form.description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isRevoked}
        help={t('form.descriptionHelp')}
        rows={3}
      />
      <div className={bemm("section")}>
        <div className={bemm("section-title")}>{t('form.accessRules')}</div>
        <div className={bemm("resources")}>
          {RESOURCES.map((r) => (
            <div key={r.id} className={bemm("resource") }>
              <div className={bemm("resource-info")}>
                <div className={bemm("resource-title")}>{r.title}</div>
                <div className={bemm("resource-desc")}>{r.description}</div>
              </div>
              <SwitchButton
                value={access[r.id]}
                onChange={(val) => setAccess(prev => ({ ...prev, [r.id]: val as AccessLevel }))}
                options={[
                  { value: 'none', label: t('form.disabled') },
                  { value: 'read', label: t('form.read') },
                  { value: 'readwrite', label: t('form.readwrite') },
                ]}
                disabled={isRevoked}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={bemm("actions")}>
        <Button color={Colors.PRIMARY} type="submit" disabled={state.loading || isRevoked}>{initialKey ? t('form.save') : t('form.generate')}</Button>
        {onCancel && (
          <Button color={Colors.SECONDARY} type="button" onClick={onCancel}>{t('form.cancel')}</Button>
        )}
      </div>
    </form>
  );
};
