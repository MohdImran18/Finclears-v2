"use client";

import React from "react";

import { useEffect, useState } from "react";
import {
  Download,
  RefreshCw,
  BarChart3,
} from "lucide-react";

import {
  exportLeadReports,
  getLeadReports,
} from "@/lib/api/reports/leadReportsApi";

export default function ReportsPage() {
  const [from, setFrom] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10)
  );

  const [to, setTo] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const response = await getLeadReports(from, to);
      setReport(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{
      minHeight: "100%",
      padding: 26,
      background: "#f5f8fb"
    }}>
      <div style={{ maxWidth: 1450, margin: "0 auto" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20
        }}>
          <div>
            <div style={{
              color: "#1769aa",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".08em"
            }}>
              CRM / REPORTS
            </div>

            <h1 style={{
              margin: "6px 0",
              color: "#102a43"
            }}>
              Lead Reports
            </h1>

            <p style={{
              margin: 0,
              color: "#627d98",
              fontSize: 12
            }}>
              Sales performance and lead analytics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportLeadReports(from, to)}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: "1px solid #d5e2ec",
              background: "#fff",
              color: "#1769aa",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              gap: 7,
              alignItems: "center"
            }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </header>

        <section style={{
          display: "flex",
          gap: 10,
          marginBottom: 18
        }}>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />

          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />

          <button
            type="button"
            onClick={load}
            style={{
              height: 38,
              padding: "0 14px",
              borderRadius: 8,
              border: 0,
              background: "#1769aa",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
          >
            <RefreshCw size={14} />
            Apply
          </button>
        </section>

        {loading ? (
          <div style={{ padding: 50, textAlign: "center" }}>
            Loading report...
          </div>
        ) : report ? (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 12
            }}>
              {[
                ["Total Leads", report.summary.total_leads],
                ["Converted", report.summary.converted_leads],
                ["Lost", report.summary.lost_leads],
                ["Conversion %", `${report.summary.conversion_rate}%`],
                ["Pipeline", `â‚¹${Number(report.summary.pipeline_value).toLocaleString("en-IN")}`],
                ["Revenue", `â‚¹${Number(report.summary.revenue).toLocaleString("en-IN")}`],
              ].map(([label, value]) => (
                <div key={String(label)} style={{
                  padding: 16,
                  background: "#fff",
                  border: "1px solid #dde7ef",
                  borderRadius: 12
                }}>
                  <div style={{
                    color: "#627d98",
                    fontSize: 11
                  }}>
                    {label}
                  </div>
                  <strong style={{
                    display: "block",
                    marginTop: 5,
                    color: "#102a43",
                    fontSize: 21
                  }}>
                    {value}
                  </strong>
                </div>
              ))}
            </div>

            <ReportTable
              title="Source Performance"
              rows={report.source_performance}
              nameKey="name"
            />

            <ReportTable
              title="Employee Performance"
              rows={report.employee_performance}
              nameKey="name"
            />

            <ReportTable
              title="Service Performance"
              rows={report.service_performance}
              nameKey="title"
            />

            <ReportTable
              title="Lost Lead Analysis"
              rows={report.lost_reasons}
              nameKey="reason"
              compact
            />

            <div style={{
              marginTop: 14,
              padding: 18,
              background: "#fff",
              border: "1px solid #dde7ef",
              borderRadius: 12
            }}>
              <h3 style={{ margin: "0 0 14px", color: "#173b56" }}>
                Follow-up Performance
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 14
              }}>
                <Stat label="Total" value={report.followup_performance?.total ?? 0} />
                <Stat label="Completed" value={report.followup_performance?.completed ?? 0} />
                <Stat label="Pending" value={report.followup_performance?.pending ?? 0} />
                <Stat label="Cancelled" value={report.followup_performance?.cancelled ?? 0} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

function ReportTable({
  title,
  rows,
  nameKey,
  compact = false,
}: {
  title: string;
  rows: any[];
  nameKey: string;
  compact?: boolean;
}) {
  return (
    <section style={{
      marginTop: 14,
      padding: 18,
      background: "#fff",
      border: "1px solid #dde7ef",
      borderRadius: 12
    }}>
      <h3 style={{
        margin: "0 0 14px",
        color: "#173b56"
      }}>
        {title}
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: compact
          ? "1fr 120px"
          : "2fr repeat(4,120px)",
        gap: 8,
        fontSize: 11
      }}>
        <strong>Name</strong>

        {!compact && (
          <>
            <strong>Total</strong>
            <strong>Converted</strong>
            <strong>Lost</strong>
            <strong>Value</strong>
          </>
        )}

        {rows?.map((row, index) => (
          <React.Fragment key={index}>
            <span>{row[nameKey] || "Unknown"}</span>

            {compact ? (
              <span>{row.total}</span>
            ) : (
              <>
                <span>{row.total}</span>
                <span>{row.converted}</span>
                <span>{row.lost}</span>
                <span>
                  â‚¹{Number(row.value || 0).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div style={{
        color: "#627d98",
        fontSize: 11
      }}>
        {label}
      </div>

      <strong style={{
        display: "block",
        marginTop: 4,
        color: "#102a43",
        fontSize: 20
      }}>
        {value}
      </strong>
    </div>
  );
}
