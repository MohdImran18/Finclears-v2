"use client";

import type { Service } from "@/types/service/service";
import ServiceStatusBadge from "./ServiceStatusBadge";

interface Props {
  services: Service[];
  loading: boolean;
  actionLoading?: number | null;
  onEdit: (id: number) => void;
  onDelete: (service: Service) => void;
}

export default function ServiceList({
  services,
  loading,
  actionLoading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Loading services...
      </div>
    );
  }

  if (!services.length) {
    return (
      <div
        style={{
          padding: 50,
          textAlign: "center",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          background: "#fff",
          color: "#64748b",
        }}
      >
        No services found.
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#fff",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: 900,
        }}
      >
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {[
              "Service",
              "Category",
              "Price",
              "Status",
              "Featured",
              "Popular",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                style={{
                  textAlign:
                    heading === "Actions" ? "right" : "left",
                  padding: "14px 16px",
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                  color: "#64748b",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {services.map((service) => (
            <tr
              key={service.id}
              style={{
                borderBottom: "1px solid #eef2f7",
              }}
            >
              <td style={{ padding: "16px" }}>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>
                  {service.title}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: "#64748b",
                  }}
                >
                  /{service.slug}
                </div>
              </td>

              <td style={{ padding: "16px", color: "#475569" }}>
                {service.category?.name ||
                  `Category #${service.service_category_id}`}
              </td>

              <td style={{ padding: "16px" }}>
                {service.starting_price != null
                  ? `₹${Number(service.starting_price).toLocaleString("en-IN")}`
                  : service.price_label || "—"}
              </td>

              <td style={{ padding: "16px" }}>
                <ServiceStatusBadge status={service.status} />
              </td>

              <td style={{ padding: "16px" }}>
                {service.is_featured ? "⭐ Yes" : "No"}
              </td>

              <td style={{ padding: "16px" }}>
                {service.is_popular ? "🔥 Yes" : "No"}
              </td>

              <td
                style={{
                  padding: "16px",
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(service.id)}
                    disabled={actionLoading === service.id}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #cbd5e1",
                      borderRadius: 7,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(service)}
                    disabled={actionLoading === service.id}
                    style={{
                      padding: "8px 12px",
                      border: 0,
                      borderRadius: 7,
                      background: "#fee2e2",
                      color: "#b91c1c",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}