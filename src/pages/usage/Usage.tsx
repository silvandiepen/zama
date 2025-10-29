import React, { useEffect, useState } from "react";
import { Card } from "@/components/Card/Card";
import { useKeys } from "@/store/keys";
import { getKeyStats } from "@/services/mockStats";
import { Bar24h } from "@/components/Charts/Bar24h";
import { BarSeries } from "@/components/Charts/BarSeries";
import { useTranslation } from "react-i18next";
import { useBemm } from "@/utils/bemm";
import "./Usage.scss";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Colors } from "../../types";

export const Usage: React.FC = () => {
  const { state } = useKeys();
  const { t } = useTranslation();
  const bemm = useBemm("usage");
  const [agg24h, setAgg24h] = useState<number[]>([]);
  const [agg7d, setAgg7d] = useState<number[]>([]);
  const [agg30d, setAgg30d] = useState<number[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d">(
    "24h"
  );
  
  useEffect(() => {
    (async () => {
      const stats = await Promise.all(
        state.items.map((k) => getKeyStats(k.id))
      );
      // 24h aggregation
      const arrays24 = stats.map((s) => s.last24h);
      const totals24 = Array.from({ length: 24 }, (_, i) =>
        arrays24.reduce((sum, arr) => sum + (arr[i] || 0), 0)
      );
      setAgg24h(totals24);
      // 7d aggregation (use last14Days; take last 7)
      const arrays14 = stats.map((s) => s.last14Days);
      const totals7 = Array.from({ length: 7 }, (_, i) =>
        arrays14.reduce((sum, arr) => sum + (arr[arr.length - 7 + i] || 0), 0)
      );
      setAgg7d(totals7);
      // 30d aggregation (synthesize by repeating 14-day data ~2x + random)
      const totals30 = Array.from({ length: 30 }, (_, i) =>
        arrays14.reduce((sum, arr) => {
          const src = arr[i % arr.length] || 0;
          return sum + Math.round(src * (0.8 + Math.random() * 0.4));
        }, 0)
      );
      setAgg30d(totals30);
    })();
  }, [state.items]);

  // Load optional static dataset from /usage.json
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/usage.json");
        if (!res.ok) return;
        const json: {
          last24h?: number[];
          last7d?: number[];
          last30d?: number[];
        } = await res.json();
        if (json.last24h && json.last24h.length === 24) setAgg24h(json.last24h);
        if (json.last7d && json.last7d.length === 7) setAgg7d(json.last7d);
        if (json.last30d && json.last30d.length === 30) setAgg30d(json.last30d);
      } catch {}
    })();
  }, []);

  const series =
    selectedPeriod === "24h"
      ? agg24h
      : selectedPeriod === "7d"
      ? agg7d
      : agg30d;
  const totalRequests = series.reduce((sum, val) => sum + val, 0);
  const averageRequests = Math.round(
    totalRequests /
      (selectedPeriod === "24h" ? 24 : selectedPeriod === "7d" ? 7 : 30)
  );
  const peakRequests = Math.max(...series, 0);

  return (
    <div className={bemm()}>
      <PageHeader title={t("usage.title")} description={t("usage.subtitle")} />

      <div className={bemm("container")}>
        {/* Stats Grid */}
        <div className={bemm("stats-grid")}>
          <Card color={Colors.PRIMARY} title={t("usage.totalRequests")}>
            <div className={bemm("stat-value")}>
              {totalRequests.toLocaleString()}
            </div>
          </Card>
          <Card color={Colors.PRIMARY} title={t("usage.averageRequests")}>
            <div className={bemm("stat-value")}>
              {averageRequests.toLocaleString()}
            </div>
          </Card>
          <Card  color={Colors.PRIMARY} title={t("usage.peakRequests")}>
            <div className={bemm("stat-value")}>
              {peakRequests.toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className={bemm("charts-section")}>
          <Card color={Colors.PRIMARY} title={t("usage.usageOverview")} description={t("usage.aggregate24h")}>
            <div className={bemm("chart-header")}>
              <div className={bemm("period-selector")}>
                <button
                  className={bemm("period-button", {
                    active: selectedPeriod === "24h",
                  })}
                  onClick={() => setSelectedPeriod("24h")}
                >
                  24h
                </button>
                <button
                  className={bemm("period-button", {
                    active: selectedPeriod === "7d",
                  })}
                  onClick={() => setSelectedPeriod("7d")}
                >
                  7d
                </button>
                <button
                  className={bemm("period-button", {
                    active: selectedPeriod === "30d",
                  })}
                  onClick={() => setSelectedPeriod("30d")}
                >
                  30d
                </button>
              </div>
            </div>
            <div className={bemm("chart-content")}>
              {selectedPeriod === "24h" ? (
                <Bar24h data={agg24h} />
              ) : selectedPeriod === "7d" ? (
                <BarSeries
                  labels={["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "Today"]}
                  data={agg7d}
                />
              ) : (
                <BarSeries
                  labels={Array.from({ length: 30 }, (_, i) => `${i + 1}`)}
                  data={agg30d}
                />
              )}
            </div>
          </Card>

          <Card>
            <div className={bemm("chart-header")}>
              <h2 className={bemm("chart-title")}>
                {t("usage.tableTitle", { defaultValue: "Requests (table)" })}
              </h2>
              <p className={bemm("chart-subtitle")}>
                {t("usage.tableSubtitle", {
                  defaultValue: "Current period breakdown",
                })}
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {(selectedPeriod === "24h"
                      ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
                      : series.map((_, i) => `${i + 1}`)
                    ).map((label, i) => (
                      <th
                        key={i}
                        style={{ textAlign: "right", padding: "4px 6px" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {(selectedPeriod === "24h" ? agg24h : series).map(
                      (v, i) => (
                        <td
                          key={i}
                          style={{ textAlign: "right", padding: "4px 6px" }}
                        >
                          {v}
                        </td>
                      )
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Key-specific usage */}
          {state.items.length > 0 && (
            <Card>
              <div className={bemm("chart-header")}>
                <h2 className={bemm("chart-title")}>{t("usage.keyUsage")}</h2>
                <p className={bemm("chart-subtitle")}>
                  {t("usage.performance")}
                </p>
              </div>
              <div className={bemm("key-list")}>
                {state.items.map((key) => (
                  <div key={key.id} className={bemm("key-item")}>
                    <div className={bemm("key-info")}>
                      <div className={bemm("key-name")}>{key.title}</div>
                      <div className={bemm("key-requests")}>
                        {key.revoked ? t("usage.revoked") : t("usage.active")}
                      </div>
                    </div>
                    <div className={bemm("key-stats")}>
                      <div className={bemm("key-chart")} />
                      <div className={bemm("key-number")}>
                        {Math.floor(Math.random() * 1000)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
