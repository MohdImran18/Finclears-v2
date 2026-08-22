"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getOrder,
  changeOrderStatus,
  addOrderTimeline,
} from "@/lib/api/orders/orderApi";

import type {
  Order,
  OrderPayment,
  OrderTimeline,
} from "@/types/order/order";

const statusOptions = [
  ["draft", "Draft"],
  ["pending", "Pending"],
  ["assigned", "Assigned"],
  ["documents_pending", "Documents Pending"],
  ["processing", "Processing"],
  ["verification", "Verification"],
  ["completed", "Completed"],
  ["cancelled", "Cancelled"],
] as const;

function money(value: number | string | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusLabel(status?: string) {
  return (
    statusOptions.find(([value]) => value === status)?.[1] ||
    status ||
    "Unknown"
  );
}

function paymentStatus(payment: OrderPayment) {
  return payment.status || "unknown";
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [addingTimeline, setAddingTimeline] = useState(false);
  const [error, setError] = useState("");

  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");

  async function loadOrder() {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await getOrder(id);

      if (!response.success) {
        throw new Error(response.message || "Unable to load order.");
      }

      setOrder(response.data);
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load order."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (!order) return;

    const status = event.target.value;

    try {
      setSavingStatus(true);
      setError("");

      await changeOrderStatus(order.id, status);

      await loadOrder();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update order status."
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAddTimeline(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!order || !timelineTitle.trim()) return;

    try {
      setAddingTimeline(true);
      setError("");

      await addOrderTimeline(
        order.id,
        timelineTitle.trim(),
        timelineDescription.trim() || undefined
      );

      setTimelineTitle("");
      setTimelineDescription("");

      await loadOrder();
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to add timeline entry."
      );
    } finally {
      setAddingTimeline(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>Loading order...</div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Order not found</h2>

            {error && (
              <p style={{ color: "#b91c1c" }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push("/crm/orders")}
              style={secondaryButtonStyle}
            >
              Back to Orders
            </button>
          </div>
        </div>
      </main>
    );
  }

  const payments = order.payments || [];
  const items = order.items || [];
  const timeline = [...(order.timeline || [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        {/* HEADER */}
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              CRM MANAGEMENT / ORDERS
            </div>

            <h1 style={titleStyle}>
              {order.order_no}
            </h1>

            <p style={subtitleStyle}>
              Order details, payment and activity history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/crm/orders")}
            style={secondaryButtonStyle}
          >
            ← Back to Orders
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* TOP SUMMARY */}
        <div style={gridThreeStyle}>
          <InfoCard
            label="Order Amount"
            value={money(order.amount)}
          />

          <InfoCard
            label="Current Status"
            value={statusLabel(order.status)}
          />

          <InfoCard
            label="Priority"
            value={
              order.priority
                ? order.priority.toUpperCase()
                : "—"
            }
          />
        </div>

        {/* ORDER + CUSTOMER */}
        <div style={gridTwoStyle}>

          <section style={cardStyle}>
            <SectionTitle title="Order Information" />

            <InfoRow
              label="Order Number"
              value={order.order_no}
            />

            <InfoRow
              label="Service"
              value={order.service_name}
            />

            <InfoRow
              label="Amount"
              value={money(order.amount)}
            />

            <InfoRow
              label="Created"
              value={formatDate(order.created_at)}
            />

            <InfoRow
              label="Last Updated"
              value={formatDate(order.updated_at)}
            />

            <div style={fieldWrapperStyle}>
              <label style={labelStyle}>
                Change Status
              </label>

              <select
                value={order.status}
                disabled={savingStatus}
                onChange={handleStatusChange}
                style={inputStyle}
              >
                {statusOptions.map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section style={cardStyle}>
            <SectionTitle title="Customer / Company" />

            <InfoRow
              label="Customer"
              value={
                order.customer_name ||
                order.company?.company_name ||
                "—"
              }
            />

            <InfoRow
              label="Email"
              value={order.customer_email || "—"}
            />

            <InfoRow
              label="Mobile"
              value={order.customer_mobile || "—"}
            />

            <InfoRow
              label="Company"
              value={
                order.company?.company_name || "—"
              }
            />

            <InfoRow
              label="Company ID"
              value={
                order.company_id
                  ? String(order.company_id)
                  : "—"
              }
            />
          </section>

        </div>

        {/* ASSIGNMENT */}
        <section style={cardStyle}>
          <SectionTitle title="Assignment" />

          <div style={assignmentBoxStyle}>
            <div>
              <div style={smallLabelStyle}>
                Assigned Employee
              </div>

              <div style={assignmentNameStyle}>
                {order.assignedUser?.name ||
                  order.assigned_user?.name ||
                  "Not assigned"}
              </div>

              {(order.assignedUser?.email ||
                order.assigned_user?.email) && (
                <div style={mutedStyle}>
                  {order.assignedUser?.email ||
                    order.assigned_user?.email}
                </div>
              )}
            </div>

            <div style={badgeStyle}>
              {order.assigned_to
                ? `User #${order.assigned_to}`
                : "Unassigned"}
            </div>
          </div>
        </section>

        {/* PAYMENT */}
        <section style={cardStyle}>
          <SectionTitle
            title={`Payments (${payments.length})`}
          />

          {payments.length === 0 ? (
            <EmptyState text="No payment record found for this order." />
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Payment ID</th>
                    <th style={thStyle}>Transaction ID</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td style={tdStyle}>
                        {payment.payment_id || "—"}
                      </td>

                      <td style={tdStyle}>
                        {payment.transaction_id || "—"}
                      </td>

                      <td style={tdStyle}>
                        {money(payment.amount)}
                      </td>

                      <td style={tdStyle}>
                        <span style={paymentBadgeStyle}>
                          {paymentStatus(payment)}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {formatDate(payment.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ORDER ITEMS */}
        <section style={cardStyle}>
          <SectionTitle
            title={`Order Items (${items.length})`}
          />

          {items.length === 0 ? (
            <EmptyState text="No order items found." />
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Service</th>
                    <th style={thStyle}>Description</th>
                    <th style={thStyle}>Qty</th>
                    <th style={thStyle}>Unit Price</th>
                    <th style={thStyle}>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td style={tdStyle}>
                        {item.service_name}
                      </td>

                      <td style={tdStyle}>
                        {item.description || "—"}
                      </td>

                      <td style={tdStyle}>
                        {item.quantity}
                      </td>

                      <td style={tdStyle}>
                        {money(item.unit_price)}
                      </td>

                      <td style={tdStyle}>
                        {money(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* TIMELINE */}
        <div style={gridTwoStyle}>

          <section style={cardStyle}>
            <SectionTitle
              title={`Order Timeline (${timeline.length})`}
            />

            {timeline.length === 0 ? (
              <EmptyState text="No timeline activity yet." />
            ) : (
              <div>
                {timeline.map(
                  (
                    entry: OrderTimeline,
                    index
                  ) => (
                    <div
                      key={entry.id}
                      style={{
                        display: "flex",
                        gap: 14,
                        paddingBottom: 22,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#111827",
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {entry.title}
                        </div>

                        {entry.description && (
                          <div
                            style={{
                              marginTop: 5,
                              color: "#4b5563",
                              lineHeight: 1.5,
                            }}
                          >
                            {entry.description}
                          </div>
                        )}

                        <div
                          style={{
                            marginTop: 7,
                            fontSize: 12,
                            color: "#6b7280",
                          }}
                        >
                          {entry.creator?.name
                            ? `By ${entry.creator.name} • `
                            : ""}
                          {formatDate(entry.created_at)}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          {/* ADD TIMELINE */}
          <section style={cardStyle}>
            <SectionTitle title="Add Timeline Entry" />

            <form onSubmit={handleAddTimeline}>
              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Title
                </label>

                <input
                  value={timelineTitle}
                  onChange={(event) =>
                    setTimelineTitle(event.target.value)
                  }
                  placeholder="e.g. Documents received"
                  style={inputStyle}
                  required
                />
              </div>

              <div style={fieldWrapperStyle}>
                <label style={labelStyle}>
                  Description
                </label>

                <textarea
                  value={timelineDescription}
                  onChange={(event) =>
                    setTimelineDescription(
                      event.target.value
                    )
                  }
                  placeholder="Add details..."
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={addingTimeline}
                style={primaryButtonStyle}
              >
                {addingTimeline
                  ? "Adding..."
                  : "Add Timeline"}
              </button>
            </form>
          </section>

        </div>

      </div>
    </main>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <h2
      style={{
        margin: "0 0 20px",
        fontSize: 18,
        fontWeight: 700,
        color: "#111827",
      }}
    >
      {title}
    </h2>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={cardStyle}>
      <div style={smallLabelStyle}>
        {label}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 22,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        padding: "12px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={smallLabelStyle}>
        {label}
      </span>

      <span
        style={{
          color: "#111827",
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div
      style={{
        padding: 25,
        textAlign: "center",
        border: "1px dashed #d1d5db",
        borderRadius: 10,
        color: "#6b7280",
      }}
    >
      {text}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f5f7fa",
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
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  color: "#6b7280",
};

const titleStyle: React.CSSProperties = {
  margin: "6px 0 4px",
  fontSize: 30,
  fontWeight: 800,
  color: "#111827",
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#6b7280",
};

const gridThreeStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, minmax(0, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const gridTwoStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 22,
  boxSizing: "border-box",
};

const smallLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 600,
};

const mutedStyle: React.CSSProperties = {
  marginTop: 5,
  color: "#6b7280",
  fontSize: 13,
};

const assignmentBoxStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
};

const assignmentNameStyle: React.CSSProperties = {
  marginTop: 5,
  fontSize: 17,
  fontWeight: 700,
  color: "#111827",
};

const badgeStyle: React.CSSProperties = {
  padding: "7px 12px",
  borderRadius: 999,
  background: "#f3f4f6",
  color: "#374151",
  fontSize: 12,
  fontWeight: 700,
};

const paymentBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#f3f4f6",
  fontSize: 12,
  fontWeight: 700,
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: 12,
  color: "#6b7280",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "13px 10px",
  borderBottom: "1px solid #f3f4f6",
  fontSize: 13,
  color: "#374151",
};

const fieldWrapperStyle: React.CSSProperties = {
  marginTop: 18,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: 9,
  padding: "10px 12px",
  fontSize: 14,
  outline: "none",
  background: "#ffffff",
};

const primaryButtonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 9,
  padding: "11px 18px",
  background: "#111827",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: 9,
  padding: "10px 15px",
  background: "#ffffff",
  color: "#374151",
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 16,
  padding: 12,
  borderRadius: 9,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
};
