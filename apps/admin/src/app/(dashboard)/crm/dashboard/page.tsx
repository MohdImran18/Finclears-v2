"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Clock3,
  TrendingUp,
  RefreshCw,
  Target,
  AlertTriangle,
  Activity,
  BarChart3,
} from "lucide-react";

import {
  getCrmDashboard,
  type CrmDashboardData,
} from "@/lib/api/crm/crmDashboardApi";

export default function CrmDashboardPage() {
  const [data, setData] = useState<CrmDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await getCrmDashboard();

      setData(response.data);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load CRM dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="dashboardPage">
        <div className="loadingBox">
          Loading CRM dashboard...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="dashboardPage">
        <div className="errorBox">
          <strong>CRM Dashboard</strong>
          <span>{error || "No dashboard data available."}</span>

          <button type="button" onClick={loadDashboard}>
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </main>
    );
  }

  const { summary } = data;

  const statusEntries = Object.entries(
    data.status_breakdown || {}
  );

  const priorityEntries = Object.entries(
    data.priority_breakdown || {}
  );

  return (
    <main className="dashboardPage">
      <div className="dashboardContainer">
        <header className="header">
          <div>
            <div className="eyebrow">
              <BarChart3 size={14} />
              CRM / DASHBOARD
            </div>

            <h1>Lead Dashboard</h1>

            <p>
              Track lead pipeline, ownership, activity and sales performance.
            </p>
          </div>

          <button
            type="button"
            className="refreshButton"
            onClick={loadDashboard}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </header>

        <section className="metrics">
          <Metric
            icon={<Users size={18} />}
            label="Total Leads"
            value={summary.total_leads}
          />

          <Metric
            icon={<Target size={18} />}
            label="New Leads"
            value={summary.new_leads}
          />

          <Metric
            icon={<Clock3 size={18} />}
            label="Contacted"
            value={summary.contacted_leads}
          />

          <Metric
            icon={<TrendingUp size={18} />}
            label="Converted"
            value={summary.converted_leads}
          />

          <Metric
            icon={<UserCheck size={18} />}
            label="Unassigned"
            value={summary.unassigned_leads}
          />

          <Metric
            icon={<AlertTriangle size={18} />}
            label="Expiring Soon"
            value={summary.expiring_soon}
          />
        </section>

        <section className="valueGrid">
          <div className="valueCard">
            <span>Pipeline Value</span>
            <strong>
              ₹{summary.pipeline_value.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="valueCard">
            <span>Converted Value</span>
            <strong>
              ₹{summary.converted_value.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="valueCard">
            <span>Conversion Rate</span>
            <strong>{summary.conversion_rate}%</strong>
          </div>

          <div className="valueCard">
            <span>Active Ownership</span>
            <strong>{summary.active_ownership}</strong>
          </div>
        </section>

        <section className="grid2">
          <Panel title="Lead Status">
            {statusEntries.length ? (
              statusEntries.map(([name, count]) => (
                <BreakdownRow
                  key={name}
                  label={formatLabel(name)}
                  value={count}
                  total={summary.total_leads}
                />
              ))
            ) : (
              <Empty />
            )}
          </Panel>

          <Panel title="Lead Priority">
            {priorityEntries.length ? (
              priorityEntries.map(([name, count]) => (
                <BreakdownRow
                  key={name}
                  label={formatLabel(name)}
                  value={count}
                  total={summary.total_leads}
                />
              ))
            ) : (
              <Empty />
            )}
          </Panel>
        </section>

        <section className="grid2">
          <Panel title="Leads by Owner">
            {data.leads_by_owner.length ? (
              data.leads_by_owner.map((item) => (
                <div
                  className="simpleRow"
                  key={String(item.assigned_to)}
                >
                  <div>
                    <strong>
                      {item.name || "Unassigned"}
                    </strong>
                  </div>

                  <span>{item.total}</span>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </Panel>

          <Panel title="Leads by Source">
            {data.leads_by_source.length ? (
              data.leads_by_source.map((item) => (
                <div
                  className="simpleRow"
                  key={String(item.source_id)}
                >
                  <div>
                    <strong>
                      {item.name || "Unknown Source"}
                    </strong>
                  </div>

                  <span>{item.total}</span>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </Panel>
        </section>

        <section className="grid2">
          <Panel title="Leads by Service">
            {data.leads_by_service.length ? (
              data.leads_by_service.map((item) => (
                <div
                  className="simpleRow"
                  key={String(item.service_id)}
                >
                  <div>
                    <strong>
                      {item.title || "No Service"}
                    </strong>
                  </div>

                  <span>{item.total}</span>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </Panel>

          <Panel title="Upcoming Follow-ups">
            {data.upcoming_followups.length ? (
              data.upcoming_followups.map((item: any, index) => (
                <div className="simpleRow" key={index}>
                  <div>
                    <strong>
                      {item.subject ||
                        item.lead?.name ||
                        "Follow-up"}
                    </strong>

                    <small>
                      {item.follow_up_at
                        ? new Date(
                            item.follow_up_at
                          ).toLocaleString()
                        : ""}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <Empty text="No upcoming follow-ups." />
            )}
          </Panel>
        </section>

        <section className="activityCard">
          <div className="panelHeader">
            <div>
              <Activity size={16} />
              Recent Activity
            </div>
          </div>

          {data.recent_activity.length ? (
            <div className="activityList">
              {data.recent_activity.map((item) => (
                <div
                  className="activityRow"
                  key={item.id}
                >
                  <div className="activityDot" />

                  <div className="activityContent">
                    <strong>
                      {item.subject ||
                        formatLabel(item.type)}
                    </strong>

                    <p>
                      {item.description ||
                        "Activity recorded."}
                    </p>

                    <small>
                      {item.lead?.name || "Lead"}{" "}
                      {item.user?.name
                        ? `· ${item.user.name}`
                        : ""}
                      {" · "}
                      {item.activity_at
                        ? new Date(
                            item.activity_at
                          ).toLocaleString()
                        : ""}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="No recent activity." />
          )}
        </section>
      </div>

      <style jsx>{`
        .dashboardPage {
          min-height: 100%;
          background: #f5f8fb;
          padding: 26px;
        }

        .dashboardContainer {
          max-width: 1480px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 22px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #1769aa;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
        }

        h1 {
          margin: 6px 0 4px;
          color: #102a43;
          font-size: 26px;
        }

        .header p {
          margin: 0;
          color: #627d98;
          font-size: 12px;
        }

        .refreshButton {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid #d5e2ec;
          border-radius: 8px;
          background: #fff;
          color: #1769aa;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 12px;
        }

        .metric {
          border: 1px solid #dde7ef;
          border-radius: 12px;
          background: #fff;
          padding: 16px;
        }

        .metricIcon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #edf5fb;
          color: #1769aa;
        }

        .metricLabel {
          margin-top: 11px;
          color: #627d98;
          font-size: 11px;
        }

        .metricValue {
          margin-top: 3px;
          color: #102a43;
          font-size: 23px;
          font-weight: 800;
        }

        .valueGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .valueCard {
          border: 1px solid #dde7ef;
          border-radius: 12px;
          background: #fff;
          padding: 16px;
        }

        .valueCard span {
          display: block;
          color: #627d98;
          font-size: 11px;
        }

        .valueCard strong {
          display: block;
          margin-top: 6px;
          color: #102a43;
          font-size: 21px;
        }

        .grid2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 14px;
        }

        .panel,
        .activityCard {
          border: 1px solid #dde7ef;
          border-radius: 12px;
          background: #fff;
          padding: 16px;
        }

        .panelTitle {
          margin-bottom: 13px;
          color: #173b56;
          font-size: 13px;
          font-weight: 800;
        }

        .breakdownRow,
        .simpleRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #edf2f6;
        }

        .breakdownRow:last-child,
        .simpleRow:last-child {
          border-bottom: 0;
        }

        .breakdownLeft {
          min-width: 0;
        }

        .breakdownName {
          color: #486581;
          font-size: 11px;
          text-transform: capitalize;
        }

        .bar {
          height: 5px;
          margin-top: 7px;
          overflow: hidden;
          border-radius: 20px;
          background: #edf2f6;
        }

        .barFill {
          height: 100%;
          border-radius: inherit;
          background: #1769aa;
        }

        .breakdownValue,
        .simpleRow > span {
          color: #102a43;
          font-size: 12px;
          font-weight: 800;
        }

        .simpleRow strong {
          display: block;
          color: #243b53;
          font-size: 11px;
        }

        .simpleRow small {
          display: block;
          margin-top: 4px;
          color: #829ab1;
          font-size: 10px;
        }

        .activityCard {
          margin-top: 14px;
        }

        .panelHeader {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
          color: #173b56;
          font-size: 13px;
          font-weight: 800;
        }

        .activityRow {
          display: grid;
          grid-template-columns: 14px 1fr;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid #edf2f6;
        }

        .activityRow:last-child {
          border-bottom: 0;
        }

        .activityDot {
          width: 9px;
          height: 9px;
          margin-top: 5px;
          border-radius: 50%;
          background: #1769aa;
        }

        .activityContent strong {
          color: #243b53;
          font-size: 11px;
        }

        .activityContent p {
          margin: 4px 0;
          color: #627d98;
          font-size: 11px;
          line-height: 1.5;
        }

        .activityContent small {
          color: #829ab1;
          font-size: 9px;
        }

        .loadingBox,
        .errorBox {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 10px;
          color: #627d98;
          font-size: 12px;
        }

        .errorBox {
          color: #b42318;
        }

        .errorBox button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid #d8e3ec;
          border-radius: 7px;
          background: #fff;
          color: #1769aa;
          cursor: pointer;
        }

        .empty {
          padding: 20px 0;
          color: #829ab1;
          font-size: 11px;
          text-align: center;
        }

        @media (max-width: 1100px) {
          .metrics {
            grid-template-columns: repeat(3, 1fr);
          }

          .valueGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .dashboardPage {
            padding: 16px;
          }

          .header {
            flex-direction: column;
          }

          .metrics,
          .valueGrid,
          .grid2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="metric">
      <div className="metricIcon">{icon}</div>
      <div className="metricLabel">{label}</div>
      <div className="metricValue">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel">
      <div className="panelTitle">{title}</div>
      {children}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const width =
    total > 0
      ? Math.min(100, (value / total) * 100)
      : 0;

  return (
    <div className="breakdownRow">
      <div className="breakdownLeft">
        <div className="breakdownName">{label}</div>

        <div className="bar">
          <div
            className="barFill"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>

      <div className="breakdownValue">
        {value}
      </div>
    </div>
  );
}

function Empty({
  text = "No data available.",
}: {
  text?: string;
}) {
  return <div className="empty">{text}</div>;
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}