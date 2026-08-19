"use client";

import { useEffect, useState } from "react";

import ServiceFaqForm from "./ServiceFaqForm";

import {
  createServiceFaq,
  deleteServiceFaq,
  getServiceFaqs,
  updateServiceFaq,
} from "@/lib/api/services/serviceApi";

import type {
  ServiceFaq,
  ServiceFaqPayload,
} from "@/types/service/serviceFaq";

interface Props {
  serviceId: number;
}

export default function ServiceFaqEditor({
  serviceId,
}: Props) {
  const [items, setItems] = useState<ServiceFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ServiceFaq | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const response = await getServiceFaqs(serviceId);

      setItems(response.data.faqs || []);
    } catch (error) {
      console.error(error);
      alert("Unable to load FAQs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (serviceId) {
      load();
    }
  }, [serviceId]);

  async function submit(payload: ServiceFaqPayload) {
    try {
      setSaving(true);

      if (editing) {
        await updateServiceFaq(
          serviceId,
          editing.id,
          payload
        );

        alert("FAQ updated successfully.");
      } else {
        await createServiceFaq(
          serviceId,
          payload
        );

        alert("FAQ created successfully.");
      }

      setEditing(null);
      setShowForm(false);

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to save FAQ."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: ServiceFaq) {
    const confirmed = window.confirm(
      `Delete this FAQ?\n\n${item.question}`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteServiceFaq(
        serviceId,
        item.id
      );

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete FAQ."
      );
    } finally {
      setSaving(false);
    }
  }

  function startCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(item: ServiceFaq) {
    setEditing(item);
    setShowForm(true);
  }

  function cancelForm() {
    setEditing(null);
    setShowForm(false);
  }

  return (
    <section
      style={{
        marginTop: 28,
        padding: 20,
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
            }}
          >
            FAQs
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#64748b",
              fontSize: 13,
            }}
          >
            Manage frequently asked questions for this service.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={startCreate}
            style={{
              padding: "10px 14px",
              border: 0,
              borderRadius: 8,
              background: "#111827",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add FAQ
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ marginBottom: 20 }}>
          <ServiceFaqForm
            initial={editing}
            loading={saving}
            onSubmit={submit}
            onCancel={cancelForm}
          />
        </div>
      )}

      {loading ? (
        <p style={{ color: "#64748b" }}>
          Loading FAQs...
        </p>
      ) : items.length === 0 ? (
        <div
          style={{
            padding: 22,
            textAlign: "center",
            border: "1px dashed #cbd5e1",
            borderRadius: 10,
            background: "#fff",
            color: "#64748b",
          }}
        >
          No FAQs added yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          {items.map((item, index) => (
            <article
              key={item.id}
              style={{
                padding: 16,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#64748b",
                      }}
                    >
                      #{index + 1}
                    </span>

                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: item.status
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: item.status
                          ? "#166534"
                          : "#991b1b",
                      }}
                    >
                      {item.status
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 7px",
                      fontSize: 15,
                      color: "#0f172a",
                    }}
                  >
                    {item.question}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      color: "#64748b",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={saving}
                    style={{
                      padding: "7px 11px",
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
                    onClick={() => remove(item)}
                    disabled={saving}
                    style={{
                      padding: "7px 11px",
                      border: "1px solid #fecaca",
                      borderRadius: 7,
                      background: "#fff",
                      color: "#b91c1c",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}