"use client";

import { useEffect, useState } from "react";

import ServicePricingForm from "./ServicePricingForm";

import {
  createServicePricing,
  deleteServicePricing,
  getServicePricing,
  updateServicePricing,
} from "@/lib/api/services/serviceApi";

import type {
  ServicePricing,
  ServicePricingPayload,
} from "@/types/service/servicePricing";

interface Props {
  serviceId: number;
}

export default function ServicePricingEditor({
  serviceId,
}: Props) {
  const [items, setItems] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] =
    useState<ServicePricing | null>(null);

  const [adding, setAdding] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const response =
        await getServicePricing(serviceId);

      setItems(response.data.pricing || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load pricing.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [serviceId]);

  async function save(payload: ServicePricingPayload) {
    try {
      setSaving(true);

      if (editing) {
        await updateServicePricing(
          serviceId,
          editing.id,
          payload
        );
      } else {
        await createServicePricing(
          serviceId,
          payload
        );
      }

      setEditing(null);
      setAdding(false);

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to save pricing."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this pricing plan?")) {
      return;
    }

    try {
      await deleteServicePricing(serviceId, id);
      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete pricing."
      );
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Pricing</h2>

          <p style={subtitleStyle}>
            Manage pricing plans for this service.
          </p>
        </div>

        {!adding && !editing && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            style={primaryButton}
          >
            + Add Pricing
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ marginBottom: 18 }}>
          <ServicePricingForm
            initial={editing}
            loading={saving}
            onSubmit={save}
            onCancel={() => {
              setAdding(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p style={muted}>Loading pricing...</p>
      ) : !items.length ? (
        <p style={muted}>
          No pricing plans added yet.
        </p>
      ) : (
        <div style={gridStyle}>
          {items.map((item) => (
            <div key={item.id} style={cardStyle}>
              <div style={cardTop}>
                <div>
                  <h3 style={planTitle}>
                    {item.plan_name}
                  </h3>

                  <div style={priceStyle}>
                    {item.currency}{" "}
                    {Number(item.price).toLocaleString(
                      "en-IN"
                    )}
                  </div>

                  {item.original_price != null && (
                    <div style={originalPrice}>
                      {item.currency}{" "}
                      {Number(
                        item.original_price
                      ).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>

                <div style={badges}>
                  {item.is_popular && (
                    <span style={popularBadge}>
                      Popular
                    </span>
                  )}

                  {item.is_recommended && (
                    <span style={recommendedBadge}>
                      Recommended
                    </span>
                  )}
                </div>
              </div>

              {item.features?.length ? (
                <ul style={featureList}>
                  {item.features.map(
                    (feature, index) => (
                      <li key={index}>{feature}</li>
                    )
                  )}
                </ul>
              ) : (
                <p style={muted}>
                  No features added.
                </p>
              )}

              <div style={cardFooter}>
                <span style={muted}>
                  {item.status
                    ? "Active"
                    : "Inactive"}
                  {" · "}
                  Order {item.sort_order}
                </span>

                <div style={rowActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(false);
                      setEditing(item);
                    }}
                    style={secondaryButton}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    style={dangerButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 22,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  marginBottom: 18,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
};

const subtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: 13,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 14,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 18,
};

const cardTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const planTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 17,
};

const priceStyle: React.CSSProperties = {
  marginTop: 8,
  fontSize: 24,
  fontWeight: 800,
};

const originalPrice: React.CSSProperties = {
  marginTop: 2,
  color: "#94a3b8",
  textDecoration: "line-through",
};

const badges: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  alignItems: "flex-end",
};

const popularBadge: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  background: "#fef3c7",
  color: "#92400e",
  fontSize: 11,
  fontWeight: 700,
};

const recommendedBadge: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  background: "#dbeafe",
  color: "#1d4ed8",
  fontSize: 11,
  fontWeight: 700,
};

const featureList: React.CSSProperties = {
  margin: "16px 0",
  paddingLeft: 20,
  color: "#475569",
  lineHeight: 1.8,
};

const cardFooter: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  paddingTop: 12,
  borderTop: "1px solid #f1f5f9",
};

const rowActions: React.CSSProperties = {
  display: "flex",
  gap: 7,
};

const muted: React.CSSProperties = {
  color: "#64748b",
  fontSize: 13,
};

const primaryButton: React.CSSProperties = {
  padding: "9px 13px",
  border: 0,
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
};

const secondaryButton: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 7,
  background: "#fff",
};

const dangerButton: React.CSSProperties = {
  padding: "8px 12px",
  border: 0,
  borderRadius: 7,
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: 600,
};