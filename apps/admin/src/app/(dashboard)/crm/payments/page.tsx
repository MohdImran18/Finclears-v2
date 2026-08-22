"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search, RefreshCw } from "lucide-react";

import {
  getCompanyPayments,
  type CompanyPayment,
} from "@/lib/api/payments/paymentApi";

function money(
  value: number | string | null | undefined,
  currency = "INR"
) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusStyle(status: string) {
  switch (status) {
    case "success":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "failed":
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };

    case "pending":
      return {
        background: "#fef3c7",
        color: "#92400e",
      };

    default:
      return {
        background: "#f1f5f9",
        color: "#475569",
      };
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<CompanyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const response = await getCompanyPayments({
        page,
        per_page: 20,
        search: search.trim() || undefined,
        status: status || undefined,
      });

      setPayments(response.data || []);
      setLastPage(response.meta?.last_page || 1);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      console.error("Unable to load payments.", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, [page, status]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    setPage(1);
    loadPayments();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 24,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <CreditCard size={24} />

                <h1
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Payments
                </h1>
              </div>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                }}
              >
                Customer payment and Cashfree transaction history.
              </p>
            </div>

            <button
              type="button"
              onClick={loadPayments}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                borderRadius: 9,
                padding: "10px 14px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* FILTERS */}
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                position: "relative",
                flex: 1,
              }}
            >
              <Search
                size={17}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 12,
                  color: "#94a3b8",
                }}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, order or transaction..."
                style={{
                  width: "100%",
                  height: 42,
                  boxSizing: "border-box",
                  border: "1px solid #cbd5e1",
                  borderRadius: 9,
                  padding: "0 12px 0 38px",
                  outline: "none",
                }}
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={{
                height: 42,
                border: "1px solid #cbd5e1",
                borderRadius: 9,
                padding: "0 12px",
                background: "#ffffff",
              }}
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            <button
              type="submit"
              style={{
                height: 42,
                border: 0,
                borderRadius: 9,
                padding: "0 18px",
                background: "#0f172a",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </form>

          {error && (
            <div
              style={{
                marginBottom: 18,
                padding: 12,
                borderRadius: 9,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
              }}
            >
              {error}
            </div>
          )}

          {/* SUMMARY */}
          <div
            style={{
              marginBottom: 18,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            Total payments: <strong>{total}</strong>
          </div>

          {/* TABLE */}
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 1100,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >
                  {[
                    "Payment",
                    "Company",
                    "Order",
                    "Amount",
                    "Gateway",
                    "Transaction",
                    "Status",
                    "Paid At",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "13px 14px",
                        textAlign: "left",
                        fontSize: 12,
                        color: "#64748b",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 50,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      Loading payments...
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        padding: 50,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      style={{
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <td style={tdStyle}>
                        <strong>#{payment.id}</strong>
                        <div style={mutedStyle}>
                          {payment.gateway_order_id || "—"}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        {payment.company?.company_name || "—"}
                      </td>

                      <td style={tdStyle}>
                        {payment.order ? (
                          <>
                            <strong>{payment.order.order_no}</strong>
                            <div style={mutedStyle}>
                              {payment.order.service_name}
                            </div>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {money(payment.amount, payment.currency || "INR")}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {(payment.payment_gateway || "—").toUpperCase()}
                      </td>

                      <td style={tdStyle}>
                        {payment.gateway_transaction_id || "—"}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            ...statusStyle(payment.payment_status),
                            display: "inline-block",
                            padding: "5px 9px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {payment.payment_status}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {formatDate(
                          payment.paid_at || payment.created_at
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && payments.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 18,
              }}
            >
              <span
                style={{
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                Page {page} of {lastPage}
              </span>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  style={paginationStyle(page <= 1)}
                >
                  Previous
                </button>

                <button
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  style={paginationStyle(page >= lastPage)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "14px",
  fontSize: 13,
  color: "#334155",
  verticalAlign: "middle",
};

const mutedStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 11,
  color: "#94a3b8",
};

function paginationStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid #cbd5e1",
    background: disabled ? "#f8fafc" : "#ffffff",
    color: disabled ? "#94a3b8" : "#334155",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
  };
}