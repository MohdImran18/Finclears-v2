"use client";

import { useEffect, useState } from "react";

import ServiceBenefitForm from "./ServiceBenefitForm";

import {
  createServiceBenefit,
  deleteServiceBenefit,
  getServiceBenefits,
  updateServiceBenefit,
} from "@/lib/api/services/serviceApi";

import type {
  ServiceBenefit,
  ServiceBenefitPayload,
} from "@/types/service/serviceBenefit";

interface Props {
  serviceId: number;
}

export default function ServiceBenefitsEditor({
  serviceId,
}: Props) {
  const [items, setItems] = useState<ServiceBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] =
    useState<ServiceBenefit | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const response =
        await getServiceBenefits(serviceId);

      setItems(response.data.benefits || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load benefits.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [serviceId]);

  async function save(payload: ServiceBenefitPayload) {
    try {
      setSaving(true);

      if (editing) {
        await updateServiceBenefit(
          serviceId,
          editing.id,
          payload
        );
      } else {
        await createServiceBenefit(
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
          "Unable to save benefit."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this benefit?")) return;

    try {
      await deleteServiceBenefit(serviceId, id);
      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete benefit."
      );
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>Benefits</h2>
          <p style={subtitleStyle}>
            Manage the key benefits shown for this service.
          </p>
        </div>

        {!adding && !editing && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            style={primaryButton}
          >
            + Add Benefit
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ marginBottom: 18 }}>
          <ServiceBenefitForm
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
        <p style={muted}>Loading benefits...</p>
      ) : !items.length ? (
        <p style={muted}>No benefits added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} style={rowStyle}>
              <div>
                <strong>{item.title}</strong>

                {item.description && (
                  <p style={descriptionStyle}>
                    {item.description}
                  </p>
                )}

                <small style={muted}>
                  {item.status ? "Active" : "Inactive"}
                  {" · "}
                  Order {item.sort_order}
                </small>
              </div>

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

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  padding: 15,
  border: "1px solid #e2e8f0",
  borderRadius: 10,
};

const rowActions: React.CSSProperties = {
  display: "flex",
  gap: 8,
};

const descriptionStyle: React.CSSProperties = {
  margin: "5px 0",
  color: "#475569",
};

const muted: React.CSSProperties = {
  color: "#64748b",
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