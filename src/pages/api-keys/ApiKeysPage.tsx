import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Colors, Size } from "@/types";
import { ApiKeyForm, ApiKeyList } from "@/components/ApiKeys";
import { Modal } from "@/components/Modal/Modal";
import { CopyButton } from "@/components/CopyButton";
import { useBemm } from "@/utils/bemm";
import type { ApiKey } from "@/types/apikey";
import "./ApiKeysPage.scss";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { useTranslation } from "react-i18next";

/**
 * API Keys management page component.
 * Displays a list of API keys with options to create, edit, and reveal keys.
 * @returns {JSX.Element} The rendered API keys page.
 */
export const ApiKeysPage: React.FC = () => {
  const bemm = useBemm("api-keys-page");
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiKey | undefined>(undefined);
  const [revealKey, setRevealKey] = useState<string | null>(null);

  /**
   * Opens the modal for creating a new API key.
   */
  const handleAddKey = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  /**
   * Opens the modal for editing an existing API key.
   * @param {ApiKey} key - The API key to edit.
   */
  const handleEditKey = (key: ApiKey) => {
    setEditing(key);
    setModalOpen(true);
  };

  /**
   * Closes the modal and resets editing state.
   */
  const handleModalClose = () => {
    setModalOpen(false);
    setEditing(undefined);
  };

  return (
    <div className={bemm()}>
      <PageHeader
        title={t("app.apiKeysCardTitle")}
        description={t("apiKeys.description")}
        image="/keys.png"
        actions={
          <Button
            size={Size.MEDIUM}
            color={Colors.PRIMARY}
            icon="plus"
            onClick={handleAddKey}
          >
            {t("app.addKey")}
          </Button>
        }
      />
      <div className={bemm("container")}>
        <Card featured hoverable className={bemm("main-card")}>
          <ApiKeyList onEdit={handleEditKey} onCreate={handleAddKey} />
        </Card>
      </div>

      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
        title={editing ? t("modal.editTitle") : t("modal.createTitle")}
      >
        <ApiKeyForm
          initialKey={editing}
          onSaved={(k) => {
            handleModalClose();
            if (!editing) setRevealKey(k.key);
          }}
          onCancel={handleModalClose}
        />
      </Modal>

      <Modal
        open={!!revealKey}
        onClose={() => setRevealKey(null)}
        title={t("modal.revealTitle", { defaultValue: "Your new API key" })}
      >
        <p>
          {t("modal.revealDesc")}
        </p>
        {revealKey && (
          <div style={{ display: "grid", gap: "var(--space-s)" }}>
            <code style={{ fontSize: "1.1rem", wordBreak: "break-all" }}>
              {revealKey}
            </code>
            <CopyButton
              text={revealKey}
              size={Size.SMALL}
              color={Colors.PRIMARY}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};
