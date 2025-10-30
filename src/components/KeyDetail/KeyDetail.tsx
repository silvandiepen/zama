import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useKeys } from "@/store/keys";
import type { ApiKey } from "@/types/apikey";
import { useBemm } from "@/utils/bemm";
import { Bar24h } from "@/components/Charts/Bar24h";
import { Line14d } from "@/components/Charts/Line14d";
import { getKeyStats, type KeyStats } from "@/services/mockStats";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card/Card";
import { Colors, Size } from "@/types";
import "./keydetail.scss";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/Modal/Modal";
import { ApiKeyForm } from "@/components/ApiKeys/ApiKeyForm";
import { useToast } from "@/store/toast";
import { formatDateTime } from "@/utils/datetime";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Icons } from "open-icon";

export const KeyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state, loadKeys, decryptKey } = useKeys();
  const [keyItem, setKeyItem] = useState<ApiKey | undefined>(undefined);
  const [stats, setStats] = useState<KeyStats | undefined>(undefined);
  const bemm = useBemm("keydetail");
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!state.items.length) loadKeys();
  }, []);

  useEffect(() => {
    const item = state.items.find((k) => k.id === id);
    setKeyItem(item);
    if (id) getKeyStats(id).then(setStats);
  }, [state.items, id]);

  if (!id) return null;
  if (!keyItem) return <p>{t("list.loading")}</p>;

  return (
    <>
      <PageHeader
        title={keyItem.title}
        description={`${t("list.created")} ${formatDateTime(
          keyItem.createdAt
        )}`}
        image="/usage.png"
        actions={
          <Link to="/keys">
            <Button icon="arrow-left" variant="ghost" size={Size.SMALL}>
              {t("btn.back")}
            </Button>
          </Link>
        }
      />
      <div className={bemm("")}>
        <div className={bemm("container")}>
          <h3>
            {t("details.usage")}
          </h3>
          <div className={bemm("stats")}>
            <Card className={bemm("stat")} color={Colors.PRIMARY} title={t("details.requests")}>
              <div className={bemm("stat-number")}>
                {stats?.totalCalls ?? "–"}
              </div>
            </Card>
            <Card className={bemm("stat")} color={Colors.PRIMARY} title={t("details.errors")}>
              <div className={bemm("stat-number")}>
                {stats?.totalErrors ?? "–"}
              </div>
            </Card>
          </div>
          <div className={bemm("charts")}>
            <Card title={t("details.last24h")}>
              <Bar24h data={stats?.last24h || []} />
            </Card>
            <Card title={t("details.last14days")}>
              <Line14d data={stats?.last14Days || []} />
            </Card>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-l)" }}>
          <h3
            style={{
              margin: 0,
              marginBottom: "var(--space-m)",
              fontSize: "var(--font-size-l)",
            }}
          >
            {t("form.accessRules")}
          </h3>
          <div className={bemm("rights")}>
            <Card className={bemm("right")} color={Colors.SECONDARY} title={t("details.readAccess")}>
              <div className={bemm("chips")}>
                {keyItem.readRules.length === 0 && (
                  <span className={bemm("chip")}>–</span>
                )}
                {keyItem.readRules.map((r) => (
                  <span key={`r-${r}`} className={bemm("chip")}>
                    {r}
                  </span>
                ))}
              </div>
            </Card>
            <Card className={bemm("right")} color={Colors.SECONDARY} title={t("details.writeAccess")}>
              <div className={bemm("chips")}>
                {keyItem.writeRules.length === 0 && (
                  <span className={bemm("chip")}>–</span>
                )}
                {keyItem.writeRules.map((r) => (
                  <span key={`w-${r}`} className={bemm("chip")}>
                    {r}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card style={{ marginTop: "var(--space-l)" }}>
          <div style={{ display: "flex", gap: "var(--space-s)" }}>
            <Button
              color={Colors.SECONDARY}
              onClick={async () => {
                try {
                  // Decrypt the key for copying
                  const decryptedKey = await decryptKey(keyItem.id);
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
                } catch (error) {
                  console.error("Copy failed", error);
                  addToast({
                    title: t("toast.errorTitle", { defaultValue: "Error" }),
                    message: t("toast.copyFailed", { defaultValue: "Failed to copy key" }),
                    variant: "error",
                  });
                }
              }}
              icon={Icons.CLIPBOARD}
            >
              {t("btn.copy")}
            </Button>
            <Button
              onClick={() => setEditOpen(true)}
              icon={Icons.EDIT_M}
              disabled={keyItem.revoked}
            >
              {t("btn.edit")}
            </Button>
          </div>
        </Card>
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title={t("form.accessRules")}
        >
          <ApiKeyForm
            initialKey={keyItem}
            onSaved={() => setEditOpen(false)}
            onCancel={() => setEditOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};
