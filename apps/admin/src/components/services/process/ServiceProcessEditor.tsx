"use client";

import { useEffect, useState } from "react";

import ServiceProcessForm from "./ServiceProcessForm";

import {
  createServiceProcess,
  deleteServiceProcess,
  getServiceProcesses,
  updateServiceProcess,
} from "@/lib/api/services/serviceApi";

import type {
  ServiceProcess,
  ServiceProcessPayload,
} from "@/types/service/serviceProcess";

interface Props {
  serviceId: number;
}

export default function ServiceProcessEditor({
  serviceId,
}: Props) {
  const [items, setItems] = useState<ServiceProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] =
    useState<ServiceProcess | null>(null);

  const [adding, setAdding] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const response =
        await getServiceProcesses(serviceId);

      setItems(response.data.processes || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load process steps.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [serviceId]);

  async function save(payload: ServiceProcessPayload) {
    try {
      setSaving(true);

      if (editing) {
        await updateServiceProcess(
          serviceId,
          editing.id,
          payload
        );
      } else {
        await createServiceProcess(
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
          "Unable to save process step."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this process step?")) {
      return;
    }

    try {
      await deleteServiceProcess(serviceId, id);
      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete process step."
      );
    }
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={titleStyle}>
            Process
          </h2>

          <p style={subtitleStyle}>
            Manage the steps customers follow for this service.
          </p>
        </div>

        {!adding && !editing && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            style={primaryButton}
          >
            + Add Step
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ marginBottom: 18 }}>
          <ServiceProcessForm
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
        <p style={muted}>Loading process...</p>
      ) : !items.length ? (
        <p style={muted}>
          No process steps added yet.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} style={rowStyle}>
              <div style={stepNumber}>
                {item.step_number}
              </div>

              <div style={contentStyle}>
                <div style={titleRow}>
                  <strong>{item.title}</strong>

                  <span
                    style={
                      item.status
                        ? activeBadge
                        : inactiveBadge
                    }
                  >
                    {item.status
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <p style={descriptionStyle}>
                  {item.description}
                </p>

                <small style={muted}>
                  {item.icon || "No icon"}
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
  display: "grid",
  gridTemplateColumns: "48px 1fr auto",
  alignItems: "center",
  gap: 14,
  padding: 15,
  border: "1px solid #e2e8f0",
  borderRadius: 10,
};

const stepNumber: React.CSSProperties = {
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "#111827",
  color: "#fff",
  fontWeight: 800,
};

const contentStyle: React.CSSProperties = {
  minWidth: 0,
};

const titleRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const descriptionStyle: React.CSSProperties = {
  margin: "5px 0",
  color: "#475569",
};

const rowActions: React.CSSProperties = {
  display: "flex",
  gap: 7,
};

const muted: React.CSSProperties = {
  color: "#64748b",
  fontSize: 13,
};

const activeBadge: React.CSSProperties = {
  padding: "3px 8px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 11,
  fontWeight: 700,
};

const inactiveBadge: React.CSSProperties = {
  padding: "3px 8px",
  borderRadius: 999,
  background: "#fee2e2",
  color: "#991b1b",
  fontSize: 11,
  fontWeight: 700,
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