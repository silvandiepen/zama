import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Colors, Size } from "@/types";
import { Icon } from "@/components/Icon/Icon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKeys } from "@/store/keys";
import { useTheme } from "@/store/theme";
import { useBemm } from "@/utils/bemm";
import { getKeyStats, type KeyStats } from "@/services/mockStats";
import { Bar24h } from "@/components/Charts/Bar24h";
import "./dashboard.scss";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Icons } from "open-icon";

/**
 * Dashboard page component displaying API key statistics and quick actions.
 * Shows total keys, requests, recent activity, and error rate with charts.
 * @returns {JSX.Element} The rendered dashboard page.
 */
export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { state: keyState } = useKeys();
  const { theme } = useTheme();
  const bemm = useBemm("dashboard");
  const [stats, setStats] = React.useState<KeyStats | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  /**
   * Loads statistics data and sets up animation observers.
   */
  React.useEffect(() => {
    const loadStats = async () => {
      const data = await getKeyStats();
      setStats(data);
    };
    loadStats();
    const tm = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(tm);
  }, []);

  /**
   * Sets up IntersectionObserver for scroll animations.
   */
  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const nodes = document.querySelectorAll('[data-animate]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.2 });
    nodes.forEach(n => io.observe(n));
    return () => io.disconnect();
  }, []);

  const activeKeys = keyState.items.filter((k) => !k.revoked);
  const totalRequests = stats?.totalCalls ?? 0;
  const recentActivity = activeKeys.filter((key) => {
    const lastUsed = key.createdAt;
    const hoursSince =
      (Date.now() - new Date(lastUsed).getTime()) / (1000 * 60 * 60);
    return hoursSince < 24;
  }).length;

  const quickStats = [
    {
      title: t("dashboard.stats.totalKeys"),
      value: activeKeys.length,
      icon: "key",
      color: Colors.PRIMARY,
      link: "/keys",
    },
    {
      title: t("dashboard.stats.totalRequests"),
      value: totalRequests.toLocaleString(),
      icon: "activity",
      color: Colors.SUCCESS,
      link: "/usage",
    },
    {
      title: t("dashboard.stats.recentActivity"),
      value: recentActivity,
      icon: "clock",
      color: Colors.INFO,
      link: "/usage",
    },
    {
      title: t("dashboard.stats.errorRate"),
      value: stats ? `${((stats.totalErrors / stats.totalCalls) * 100).toFixed(1)}%` : "0%",
      icon: "alert",
      color: Colors.ERROR,
      link: "/usage",
    },
  ];

  const quickActions = [
    {
      title: t("dashboard.actions.createKey"),
      description: t("dashboard.actions.createKeyDesc"),
      icon: Icons.ADD_M,
      color: Colors.PRIMARY,
      link: "/keys",
    },
    {
      title: t("dashboard.actions.viewUsage"),
      description: t("dashboard.actions.viewUsageDesc"),
      icon: Icons.CHART_CANDLES,
      color: Colors.INFO,
      link: "/usage",
    },
    {
      title: t("dashboard.actions.readDocs"),
      description: t("dashboard.actions.readDocsDesc"),
      icon: Icons.BOOKCASE,
      color: Colors.SECONDARY,
      link: "/docs",
    },
    {
      title: t("dashboard.actions.getStarted"),
      description: t("dashboard.actions.getStartedDesc"),
      icon: Icons.PLAYBACK_PLAY,
      color: Colors.SUCCESS,
      link: "/docs",
    },
  ];

  const recentKeys = activeKeys.slice(0, 3).map((key) => ({
    ...key,
    status: t("dashboard.recentKeys.active"),
    statusColor: Colors.SUCCESS,
  }));

  return (
    <div className={bemm('', { loaded })}>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.subtitle")}
        image="/dashboard.png"
      />

      {/* Quick Stats */}
      <div className={bemm("layout")}>
        <div className={bemm("stats-grid")}>
          {quickStats.map((stat, index) => (
            <Link key={index} to={stat.link} className={bemm("stat-card")} data-animate="pop">
              <Card
                color={stat.color}
                hoverable
                featured
                className={bemm("stat-content")}
                title={stat.title}
                icon={stat.icon}
              >
                <div className={bemm("stat-value")}>{stat.value}</div>
              </Card>
            </Link>
          ))}
        </div>

        <div className={bemm("main-grid")}>
          {/* Quick Actions */}
          <div className={bemm("actions-section")}>
            <h2 className={bemm("section-title")}>
              {t("dashboard.quickActions")}
            </h2>
            <div className={bemm("actions-grid")}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={bemm("action-card")}
                  data-animate="pop"
                >
                  <Card color={action.color} hoverable>
                    <div className={bemm("action-content")}>
                      <div className={bemm("action-icon")}>
                        <Icon name={action.icon} />
                      </div>
                      <h3 className={bemm("action-title")}>{action.title}</h3>
                      <p className={bemm("action-description")}>
                        {action.description}
                      </p>
                      <div className={bemm("action-arrow")}>
                        <Icon name="arrow-right" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Chart and Recent Activity */}
          <div className={bemm("activity-section")}>
            <div className={bemm("chart-card")}>
              <Card title={t("dashboard.requests24h")}>
                {stats ? (
                  <Bar24h data={stats.hourlyData} />
                ) : (
                  <div className={bemm("loading")}>
                    <Icon name="loader" className={bemm("loading-icon")} />
                    <span>{t("common.loading")}</span>
                  </div>
                )}
              </Card>
            </div>

            <div className={bemm("recent-keys")}>
              <Card title={t("dashboard.recentKeys.title")}>
                {recentKeys.length > 0 ? (
                  <div className={bemm("recent-list")}>
                    {recentKeys.map((key) => (
                      <Link
                        key={key.id}
                        to={`/keys/${key.id}`}
                        className={bemm("recent-item")}
                        data-animate="slide"
                      >
                        <div className={bemm("recent-content")}>
                          <div className={bemm("recent-header")}>
                            <span className={bemm("recent-name")}>
                              {key.title}
                            </span>
                            <span
                              className={bemm("recent-status")}
                              style={{
                                color: `var(--color-${key.statusColor})`,
                              }}
                            >
                              {key.status}
                            </span>
                          </div>
                          <code className={bemm("recent-key")}>
                            {key.key.slice(0, 8)}...
                          </code>
                        </div>
                      </Link>
                    ))}
                    {activeKeys.length > 3 && (
                      <Link to="/keys" className={bemm("view-all")}>
                        {t("dashboard.recentKeys.viewAll")} {t('dashboard.recentKeys.more', { count: activeKeys.length - 3 })}
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className={bemm("empty-state")}>
                    <Icon name="key" className={bemm("empty-icon")} />
                    <p>{t("dashboard.recentKeys.empty")}</p>
                    <Link to="/keys">
                      <Button size={Size.SMALL} color={Colors.PRIMARY}>
                        {t("dashboard.actions.createKey")}
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className={bemm("status-section")}>
          <Card title={t("dashboard.systemStatus")}>
            <div className={bemm("status-grid")}>
              <div className={bemm("status-item")} data-animate="fade">
                <div
                  className={bemm("status-indicator", { online: true })}
                ></div>
                <span className={bemm("status-label")}>
                  {t("dashboard.status.api")}
                </span>
                <span className={bemm("status-value")}>
                  {t("dashboard.status.operational")}
                </span>
              </div>
              <div className={bemm("status-item")} data-animate="fade">
                <div
                  className={bemm("status-indicator", { online: true })}
                ></div>
                <span className={bemm("status-label")}>
                  {t("dashboard.status.database")}
                </span>
                <span className={bemm("status-value")}>
                  {t("dashboard.status.operational")}
                </span>
              </div>
              <div className={bemm("status-item")} data-animate="fade">
                <div
                  className={bemm("status-indicator", { online: true })}
                ></div>
                <span className={bemm("status-label")}>
                  {t("dashboard.status.auth")}
                </span>
                <span className={bemm("status-value")}>
                  {t("dashboard.status.operational")}
                </span>
              </div>
              <div className={bemm("status-item")} data-animate="fade">
                <div
                  className={bemm("status-indicator", {
                    online: theme === "dark",
                  })}
                ></div>
                <span className={bemm("status-label")}>
                  {t("dashboard.status.theme")}
                </span>
                <span className={bemm("status-value")}>{theme}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
