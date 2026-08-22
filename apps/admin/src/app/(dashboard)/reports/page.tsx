"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  CreditCard,
  IndianRupee,
  Users,
  UserPlus,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

type ReportState = {
  orders: number;
  payments: number;
  revenue: number;
  customers: number;
  leads: number;
  users: number;
};

function getToken() {
  if (typeof window === "undefined") return "";

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

async function fetchApi(path: string) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

function extractList(response: any): any[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

function extractTotal(response: any): number {
  if (typeof response?.meta?.total === "number") {
    return response.meta.total;
  }

  if (typeof response?.data?.meta?.total === "number") {
    return response.data.meta.total;
  }

  return extractList(response).length;
}

function getAmount(payment: any): number {
  return Number(
    payment?.amount ??
      payment?.paid_amount ??
      payment?.total_amount ??
      0
  );
}

function isSuccessfulPayment(payment: any): boolean {
  const status = String(
    payment?.payment_status ??
      payment?.status ??
      ""
  ).toLowerCase();

  return [
    "success",
    "successful",
    "paid",
    "completed",
  ].includes(status);
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportState>({
    orders: 0,
    payments: 0,
    revenue: 0,
    customers: 0,
    leads: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const [
        ordersResponse,
        paymentsResponse,
        customersResponse,
        leadsResponse,
        usersResponse,
      ] = await Promise.all([
        fetchApi("/orders?per_page=100"),
        fetchApi("/payments?per_page=100"),
        fetchApi("/customers?per_page=100"),
        fetchApi("/leads?per_page=100"),
        fetchApi("/users?per_page=100"),
      ]);

      const payments = extractList(paymentsResponse);

      const revenue = payments
        .filter(isSuccessfulPayment)
        .reduce((sum, payment) => {
          return sum + getAmount(payment);
        }, 0);

      setReport({
        orders: extractTotal(ordersResponse),
        payments: extractTotal(paymentsResponse),
        revenue,
        customers: extractTotal(customersResponse),
        leads: extractTotal(leadsResponse),
        users: extractTotal(usersResponse),
      });
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(
        "Unable to load reports. Please check your API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              <BarChart3 size={15} />
              ADMIN REPORTS
            </div>

            <h1 style={titleStyle}>Reports & Analytics</h1>

            <p style={subtitleStyle}>
              Live business overview from your existing APIs.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            style={refreshButtonStyle}
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <section style={gridStyle}>
          <ReportCard
            icon={<ShoppingCart size={21} />}
            title="Orders"
            value={loading ? "—" : report.orders.toLocaleString()}
            subtitle="Total orders"
          />

          <ReportCard
            icon={<CreditCard size={21} />}
            title="Payments"
            value={loading ? "—" : report.payments.toLocaleString()}
            subtitle="Total payment transactions"
          />

          <ReportCard
            icon={<IndianRupee size={21} />}
            title="Revenue"
            value={
              loading
                ? "—"
                : `₹${report.revenue.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}`
            }
            subtitle="Successful payments"
          />

          <ReportCard
            icon={<Users size={21} />}
            title="Customers"
            value={loading ? "—" : report.customers.toLocaleString()}
            subtitle="Total customers"
          />

          <ReportCard
            icon={<UserPlus size={21} />}
            title="Leads"
            value={loading ? "—" : report.leads.toLocaleString()}
            subtitle="Total leads"
          />

          <ReportCard
            icon={<TrendingUp size={21} />}
            title="Users"
            value={loading ? "—" : report.users.toLocaleString()}
            subtitle="Admin users"
          />
        </section>

        <section style={infoCardStyle}>
          <div style={infoHeaderStyle}>
            <BarChart3 size={19} />
            <div>
              <h2 style={infoTitleStyle}>
                Business Overview
              </h2>

              <p style={infoSubtitleStyle}>
                Current totals fetched from the admin APIs.
              </p>
            </div>
          </div>

          <div style={summaryGridStyle}>
            <SummaryRow
              label="Orders"
              value={report.orders}
            />

            <SummaryRow
              label="Payments"
              value={report.payments}
            />

            <SummaryRow
              label="Customers"
              value={report.customers}
            />

            <SummaryRow
              label="Leads"
              value={report.leads}
            />

            <SummaryRow
              label="Users"
              value={report.users}
            />

            <SummaryRow
              label="Successful Revenue"
              value={`₹${report.revenue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}`}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ReportCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div style={cardStyle}>
      <div style={cardTopStyle}>
        <div style={iconBoxStyle}>{icon}</div>
        <span style={cardTitleStyle}>{title}</span>
      </div>

      <div style={valueStyle}>{value}</div>

      <div style={cardSubtitleStyle}>{subtitle}</div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div style={summaryRowStyle}>
      <span>{label}</span>

      <strong>
        {typeof value === "number"
          ? value.toLocaleString("en-IN")
          : value}
      </strong>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1400,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  marginBottom: 24,
};

const eyebrowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: "#2563eb",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".14em",
};

const titleStyle: React.CSSProperties = {
  margin: "7px 0 4px",
  color: "#102a50",
  fontSize: 30,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#71839b",
  fontSize: 13,
};

const refreshButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 15px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #dbe5f1",
  borderRadius: 9,
  background: "#fff",
  color: "#40536d",
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 14,
  border: "1px solid #fecaca",
  borderRadius: 10,
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 13,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 20,
};

const cardTopStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const iconBoxStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  background: "#eff6ff",
  color: "#2563eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardTitleStyle: React.CSSProperties = {
  color: "#52657e",
  fontSize: 12,
  fontWeight: 750,
};

const valueStyle: React.CSSProperties = {
  marginTop: 18,
  color: "#102a50",
  fontSize: 28,
  fontWeight: 800,
};

const cardSubtitleStyle: React.CSSProperties = {
  marginTop: 5,
  color: "#94a3b8",
  fontSize: 11,
};

const infoCardStyle: React.CSSProperties = {
  marginTop: 20,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 22,
};

const infoHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#2563eb",
};

const infoTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#102a50",
  fontSize: 17,
  fontWeight: 800,
};

const infoSubtitleStyle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#71839b",
  fontSize: 11,
};

const summaryGridStyle: React.CSSProperties = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "13px 14px",
  border: "1px solid #edf2f7",
  borderRadius: 9,
  color: "#52657e",
  fontSize: 12,
};