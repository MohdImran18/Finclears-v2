"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getOrders } from "@/lib/api/orders/orderApi";
import type { Order } from "@/types/order/order";

const statusOptions = [
  ["", "All Status"],
  ["draft", "Draft"],
  ["pending", "Pending"],
  ["assigned", "Assigned"],
  ["documents_pending", "Documents Pending"],
  ["processing", "Processing"],
  ["verification", "Verification"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
];

const priorityOptions = [
  ["", "All Priority"],
  ["low", "Low"],
  ["medium", "Medium"],
  ["high", "High"],
  ["urgent", "Urgent"],
];

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders({
        page,
        per_page: 15,
        search: search.trim() || undefined,
        status: status || undefined,
        priority: priority || undefined,
      });

      setOrders(response.data || []);

      setLastPage(response.meta?.last_page || 1);
      setTotal(response.meta?.total || 0);
    } catch (err: any) {
      console.error("Unable to load orders.", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [page, status, priority]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    loadOrders();
  }

  function formatAmount(amount: number | string) {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusLabel(value?: string) {
    return (
      statusOptions.find(([key]) => key === value)?.[1] ||
      value ||
      "-"
    );
  }

  function getPriorityLabel(value?: string) {
    return (
      priorityOptions.find(([key]) => key === value)?.[1] ||
      value ||
      "-"
    );
  }

  function getStatusStyle(status?: string) {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap" as const,
    };

    if (status === "completed") {
      return {
        ...base,
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (status === "cancelled") {
      return {
        ...base,
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (status === "processing" || status === "verification") {
      return {
        ...base,
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (status === "assigned") {
      return {
        ...base,
        background: "#f3e8ff",
        color: "#7e22ce",
      };
    }

    return {
      ...base,
      background: "#fef3c7",
      color: "#92400e",
    };
  }

  function getPriorityStyle(priority?: string) {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 9px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
    };

    if (priority === "urgent") {
      return {
        ...base,
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (priority === "high") {
      return {
        ...base,
        background: "#ffedd5",
        color: "#c2410c",
      };
    }

    if (priority === "low") {
      return {
        ...base,
        background: "#f1f5f9",
        color: "#475569",
      };
    }

    return {
      ...base,
      background: "#e0f2fe",
      color: "#0369a1",
    };
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#64748b",
                letterSpacing: 1.2,
                marginBottom: 8,
              }}
            >
              CRM MANAGEMENT
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                color: "#0f172a",
              }}
            >
              Orders
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              Manage customer orders, processing and payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders()}
            style={{
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              borderRadius: 10,
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <SummaryCard
            title="Total Orders"
            value={total}
          />

          <SummaryCard
            title="Current Page"
            value={orders.length}
          />

          <SummaryCard
            title="Page"
            value={`${page} / ${lastPage}`}
          />
        </div>

        {/* Filters */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            padding: 18,
            marginBottom: 20,
          }}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(260px, 1fr) 180px 180px auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order, customer, service..."
              style={inputStyle}
            />

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              style={inputStyle}
            >
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
              style={inputStyle}
            >
              {priorityOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                height: 42,
                padding: "0 20px",
                border: "none",
                borderRadius: 9,
                background: "#0f172a",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
              padding: 14,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              overflowX: "auto",
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
                    borderBottom:
                      "1px solid #e2e8f0",
                  }}
                >
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Service</Th>
                  <Th>Amount</Th>
                  <Th>Priority</Th>
                  <Th>Status</Th>
                  <Th>Assigned To</Th>
                  <Th>Date</Th>
                  <Th>Action</Th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: 50,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: 60,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom:
                          "1px solid #f1f5f9",
                      }}
                    >
                      <td style={tdStyle}>
                        <div
                          style={{
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {order.order_no}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "#94a3b8",
                            marginTop: 3,
                          }}
                        >
                          #{order.id}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#334155",
                          }}
                        >
                          {order.customer_name || "-"}
                        </div>

                        {order.customer_email && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 3,
                            }}
                          >
                            {order.customer_email}
                          </div>
                        )}

                        {order.customer_mobile && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              marginTop: 2,
                            }}
                          >
                            {order.customer_mobile}
                          </div>
                        )}
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#334155",
                          }}
                        >
                          {order.service_name}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <strong>
                          {formatAmount(order.amount)}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={getPriorityStyle(
                            order.priority
                          )}
                        >
                          {getPriorityLabel(
                            order.priority
                          )}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={getStatusStyle(
                            order.status
                          )}
                        >
                          {getStatusLabel(
                            order.status
                          )}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {order.assignedUser?.name ||
                        order.assigned_user?.name ? (
                          <div>
                            <div
                              style={{
                                fontWeight: 700,
                                color: "#334155",
                              }}
                            >
                              {order.assignedUser?.name ||
                                order.assigned_user?.name}
                            </div>

                            <div
                              style={{
                                fontSize: 12,
                                color: "#94a3b8",
                              }}
                            >
                              {order.assignedUser?.email ||
                                order.assigned_user?.email ||
                                ""}
                            </div>
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: 13,
                            }}
                          >
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td style={tdStyle}>
                        {formatDate(
                          order.created_at
                        )}
                      </td>

                      <td style={tdStyle}>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/crm/orders/${order.id}`
                            )
                          }
                          style={{
                            border:
                              "1px solid #cbd5e1",
                            background: "#ffffff",
                            color: "#0f172a",
                            borderRadius: 8,
                            padding:
                              "8px 12px",
                            cursor: "pointer",
                            fontWeight: 700,
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && orders.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
                borderTop:
                  "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                Page {page} of {lastPage} ·{" "}
                {total} total orders
              </span>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                  style={paginationButtonStyle(
                    page <= 1
                  )}
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(
                        lastPage,
                        value + 1
                      )
                    )
                  }
                  style={paginationButtonStyle(
                    page >= lastPage
                  )}
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

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#64748b",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Th({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "14px 16px",
        fontSize: 12,
        color: "#64748b",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

const tdStyle = {
  padding: "15px 16px",
  fontSize: 13,
  color: "#475569",
  verticalAlign: "middle" as const,
};

const inputStyle = {
  width: "100%",
  height: 42,
  boxSizing: "border-box" as const,
  border: "1px solid #cbd5e1",
  borderRadius: 9,
  padding: "0 12px",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
};

function paginationButtonStyle(
  disabled: boolean
) {
  return {
    border: "1px solid #cbd5e1",
    background: disabled
      ? "#f8fafc"
      : "#ffffff",
    color: disabled
      ? "#94a3b8"
      : "#334155",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: disabled
      ? "not-allowed"
      : "pointer",
    fontWeight: 700,
  };
}
