import React from "react";
import { useBemm } from "@/utils/bemm";
import { useKeys } from "@/store/keys";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Colors, Size } from "@/types";
import { Modal } from "@/components/Modal/Modal";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { CopyButton } from "@/components/CopyButton";
import { useFeatureFlags } from "@/store/featureFlags";
import { useToast } from "@/store/toast";
import "./apikeys.scss";
import { formatDateTime } from "@/utils/datetime";

import type { ApiKey } from "@/types/apikey";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "open-icon";

type Props = { onEdit?: (key: ApiKey) => void; onCreate?: () => void };

/**
 * List component that displays API keys with actions for viewing, editing, copying,
 * regenerating, revoking, and deleting keys. Shows encrypted keys with badges and
 * provides modal confirmations for destructive actions.
 * @param {Props} props - Component props
 * @param {(key: ApiKey) => void} [props.onEdit] - Callback function called when editing a key
 * @param {() => void} [props.onCreate] - Callback function called when creating a new key
 * @returns {JSX.Element} The rendered API key list component.
 */
export const ApiKeyList: React.FC<Props> = ({ onEdit, onCreate }) => {
  const bemm = useBemm("apikeys");
  const { state, deleteKey, revokeKey, regenerateKey, decryptKey } = useKeys();
  const { flags } = useFeatureFlags();
  const { addToast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [confirmKey, setConfirmKey] = React.useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = React.useState<string | null>(null);
  const [revealKey, setRevealKey] = React.useState<string | null>(null);

  /**
   * Copies an API key to the clipboard after decrypting it. Shows toast notifications
   * for success/failure states.
   * @param {string} keyId - The ID of the API key to copy
   * @returns {Promise<void>}
   */
  const onCopyKey = async (keyId: string) => {
    try {
      // Decrypt the key for copying
      const decryptedKey = await decryptKey(keyId);
      if (!decryptedKey) {
        addToast({
          title: t("toast.errorTitle", { defaultValue: "Error" }),
          message: t("toast.decryptFailed", { defaultValue: "Failed to decrypt key" }),
          variant: "error",
        });
        return;
      }
      
      await navigator.clipboard.writeText(decryptedKey);
      addToast({
        title: t("toast.copiedTitle"),
        message: t("toast.copiedMsg"),
        variant: "success",
      });
    } catch (e) {
      console.error("Copy failed", e);
      addToast({
        title: t("toast.errorTitle", { defaultValue: "Error" }),
        message: t("toast.copyFailed", { defaultValue: "Failed to copy key" }),
        variant: "error",
      });
    }
  };

  if (state.loading && state.items.length === 0) {
    return (
      <div className={bemm("loading")}>
        <EmptyState icon="loader" title={t("list.loading")} size="large" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <EmptyState
        icon="key"
        title={t("list.empty")}
        description={t("list.emptyDescription")}
        action={
          <Button
            color={Colors.PRIMARY}
            icon="plus"
            onClick={() => onCreate?.()}
          >
            {t("btn.createFirstKey")}
          </Button>
        }
        size="large"
      />
    );
  }

  return (
    <>
      <ul className={bemm("list")}>
        {state.items
          .sort((a, b) => {
            // Revoked keys go to bottom
            if (a.revoked && !b.revoked) return 1;
            if (!a.revoked && b.revoked) return -1;
            // Otherwise sort by creation date (newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .map((k) => (
            <li
              key={k.id}
              className={bemm("item", {
                revoked: k.revoked,
                removing: deletingId === k.id,
              })}
            >
            <div className={bemm("meta")}>
              <Link
                to={`/keys/${k.id}`}
                className={bemm("item-link")}
                style={{ textDecoration: "none" }}
              >
                <div className={bemm("title")}>{k.title}</div>
              </Link>
              {flags.enableDescriptions && k.description && (
                <div className={bemm("description")}>{k.description}</div>
              )}
              <div className={bemm("created")}>
                {t("list.created")} {formatDateTime(k.createdAt)}
              </div>
              {k.revoked && (
                <div className={bemm("revoked-label")}>
                  {t("list.revoked")}
                </div>
              )}
              {k.revoked && k.revokedAt && (
                <div className={bemm("revoked-date")}>
                  {formatDateTime(k.revokedAt)}
                </div>
              )}
            </div>
            <div className={bemm("controls")}>
              <div className={bemm("key-display")}>
                <code className={bemm("key")}>
                  {k.key}
                </code>
                <Badge variant="success" size="small" icon="🔒">
                  {k.encryptionInfo?.algorithm || 'Encrypted'}
                </Badge>
              </div>
              <Button
                size={Size.SMALL}
                iconOnly={true}
                onClick={async () => {
                  const updated = await regenerateKey(k.id);
                  if (updated) {
                    setRevealKey(updated.key);
                    addToast({
                      title: t("toast.updatedTitle"),
                      message: t("toast.updatedMsg", { title: k.title }),
                      variant: "success",
                    });
                  }
                }}
                icon={Icons.ARROW_RELOAD_UP_DOWN}
                tooltip={t("btn.regenerate", { defaultValue: "Regenerate" })}
                variant="ghost"
                disabled={k.revoked}
              />
              {flags.enableCopy && (
                <Button
                  size={Size.SMALL}
                  onClick={() => {
                    onCopyKey(k.id);
                  }}
                  variant="ghost"
                  disabled={k.revoked}
                  iconOnly={true}
                  icon={Icons.CLIPBOARD}
                  tooltip={t("btn.copy")}
                />
              )}

              <Button
                size={Size.SMALL}
                iconOnly={true}
                icon={Icons.EDIT_M}
                onClick={() => { onEdit?.(k); }}
                variant="ghost"
                tooltip={k.revoked ? t('usage.revoked') : t("btn.edit")}
                disabled={k.revoked}
              />
                {flags.enableRevoke && !k.revoked && (
                  <Button
                    size={Size.SMALL}
                    iconOnly={true}
                    color={Colors.WARNING}
                    icon={Icons.CIRCLED_MULTIPLY}
                    onClick={() => { setConfirmRevokeId(k.id); setConfirmKey(k.title); }}
                    variant="ghost"
                    tooltip={t("btn.revoke")}
                  />
                )}
              <Button
                size={Size.SMALL}
                iconOnly={true}
                icon={Icons.TRASH}
                variant="ghost"
                color={Colors.ERROR}
                onClick={() => {
                  setConfirmId(k.id);
                  setConfirmKey(k.title);
                }}
                tooltip={t("btn.delete")}
              />
            </div>

            <Button
              className={bemm("view-button")}
              onClick={() => navigate(`/keys/${k.id}`)}
            >
              {t("btn.view")}
            </Button>
          </li>
        ))}
      </ul>
      <Modal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        title={t("modal.deleteTitle")}
      >
        <p>{t("modal.deleteConfirm", { title: confirmKey || "" })}</p>
        <div
          style={{ display: "flex", gap: ".5rem", justifyContent: "flex-end" }}
        >
          <Button onClick={() => setConfirmId(null)}>{t("form.cancel")}</Button>
          <Button
            color={Colors.ERROR}
            onClick={async () => {
              if (!confirmId) return;
              setDeletingId(confirmId);
              setConfirmId(null);
              setTimeout(async () => {
                await deleteKey(confirmId);
                setDeletingId(null);
                addToast({
                  title: t("toast.deletedTitle"),
                  message: t("toast.deletedMsg", { title: confirmKey || "" }),
                  variant: "error",
                });
              }, 220);
            }}
          >
            {t("btn.delete")}
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!confirmRevokeId}
        onClose={() => setConfirmRevokeId(null)}
        title={t('modal.revokeTitle', { defaultValue: 'Revoke API Key' })}
      >
        <p>{t('modal.revokeConfirm', { title: confirmKey || '', defaultValue: 'Are you sure you want to revoke "{{title}}"? This cannot be undone.' })}</p>
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end' }}>
          <Button onClick={() => setConfirmRevokeId(null)}>{t('form.cancel')}</Button>
          <Button
            color={Colors.WARNING}
            onClick={async () => {
              if (!confirmRevokeId) return;
              await revokeKey(confirmRevokeId);
              setConfirmRevokeId(null);
              addToast({
                title: t('toast.revokedTitle'),
                message: t('toast.revokedMsg', { title: confirmKey || '' }),
                variant: 'warning',
              });
            }}
          >
            {t('btn.revoke')}
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!revealKey}
        onClose={() => setRevealKey(null)}
        title={t("modal.revealTitle", { defaultValue: "Your new encrypted API key" })}
      >
        <p>
          {t("modal.revealDesc", {
            defaultValue:
              "This key is encrypted using Zama TFHE and is only shown once. Please store it securely now.",
          })}
        </p>
        {revealKey && (
          <div style={{ display: "grid", gap: "var(--space)" }}>
            <div
              style={{
                background: "color-mix(in srgb, var(--color-success), transparent 10%)",
                border: "1px solid color-mix(in srgb, var(--color-success), transparent 30%)",
                padding: "var(--space)",
                borderRadius: "var(--border-radius-s)",
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "var(--space-xs)", 
                marginBottom: "var(--space-s)",
                fontSize: "var(--font-size-s)",
                fontWeight: "600",
                color: "var(--color-success-text)"
              }}>
                🔒 Encrypted with Zama TFHE
              </div>
              <div style={{ 
                fontSize: "var(--font-size-xs)", 
                opacity: 0.7,
                marginBottom: "var(--space-s)"
              }}>
                Post-Quantum Secure Encryption • Algorithm: TFHE v1.0.0
              </div>
            </div>
            
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "var(--space-s)",
                alignItems: "center",
              }}
            >
              <code
                className={bemm("key")}
                style={{
                  fontSize: "1rem",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                {revealKey}
              </code>
            <CopyButton
                text={revealKey}
                size={Size.MEDIUM}
                color={Colors.PRIMARY}
                style={{ alignSelf: "start" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size={Size.MEDIUM}
                onClick={() => setRevealKey(null)}
                color={Colors.SECONDARY}
              >
                {t("btn.ok", { defaultValue: "Ok" })}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
