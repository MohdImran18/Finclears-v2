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
  const [faqs, setFaqs] = useState<ServiceFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ServiceFaq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function loadFaqs() {
    try {
      setLoading(true);
      setError("");

      const response = await getServiceFaqs(serviceId);

      setFaqs(response.data?.faqs || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load FAQs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFaqs();
  }, [serviceId]);

  async function handleSubmit(
    payload: ServiceFaqPayload
  ) {
    try {
      setSaving(true);
      setError("");

      if (editing) {
        await updateServiceFaq(
          serviceId,
          editing.id,
          payload
        );
      } else {
        await createServiceFaq(
          serviceId,
          payload
        );
      }

      setEditing(null);
      setShowForm(false);

      await loadFaqs();
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save FAQ."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(faq: ServiceFaq) {
    if (
      !window.confirm(
        `Delete this FAQ?\n\n${faq.question}`
      )
    ) {
      return;
    }

    try {
      setError("");

      await deleteServiceFaq(
        serviceId,
        faq.id
      );

      await loadFaqs();
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to delete FAQ."
      );
    }
  }

  function startCreate() {
    setEditing(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(faq: ServiceFaq) {
    setEditing(faq);
    setShowForm(true);
    setError("");
  }

  function cancelForm() {
    setEditing(null);
    setShowForm(false);
  }

  return (
    <section
      style={{
        marginTop: 24,
        padding: 18,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 17,
              color: "#0f172a",
            }}
          >
            Frequently Asked Questions
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            Manage questions and answers for this service.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={startCreate}
            style={{
              height: 38,
              padding: "0 14px",
              border: 0,
              borderRadius: 8,
              background: "#0f766e",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            + Add FAQ
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            borderRadius: 8,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <div style={{ marginBottom: 18 }}>
          <ServiceFaqForm
            initial={editing || undefined}
            loading={saving}
            onSubmit={handleSubmit}
            onCancel={cancelForm}
          />
        </div>
      )}

      {loading ? (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Loading FAQs...
        </div>
      ) : faqs.length === 0 ? (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "#64748b",
            border: "1px dashed #cbd5e1",
            borderRadius: 10,
            fontSize: 13,
          }}
        >
          No FAQs added yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {faqs
            .slice()
            .sort(
              (a, b) =>
                a.sort_order - b.sort_order
            )
            .map((faq) => (
              <div
                key={faq.id}
                style={{
                  padding: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {faq.question}
                    </div>

                    <div
                      style={{
                        marginTop: 7,
                        fontSize: 13,
                        lineHeight: 1.55,
                        color: "#64748b",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {faq.answer}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 10,
                        fontSize: 11,
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 7px",
                          borderRadius: 999,
                          background: faq.status
                            ? "#dcfce7"
                            : "#f1f5f9",
                          color: faq.status
                            ? "#166534"
                            : "#64748b",
                          fontWeight: 700,
                        }}
                      >
                        {faq.status
                          ? "Active"
                          : "Inactive"}
                      </span>

                      <span
                        style={{
                          padding: "3px 7px",
                          borderRadius: 999,
                          background: "#e2e8f0",
                          color: "#475569",
                          fontWeight: 600,
                        }}
                      >
                        Order {faq.sort_order}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      alignItems: "flex-start",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(faq)
                      }
                      style={smallButtonStyle}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(faq)
                      }
                      style={{
                        ...smallButtonStyle,
                        color: "#b91c1c",
                      }}
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

const smallButtonStyle: React.CSSProperties = {
  height: 32,
  padding: "0 10px",
  border: "1px solid #cbd5e1",
  borderRadius: 7,
  background: "#fff",
  color: "#334155",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};
