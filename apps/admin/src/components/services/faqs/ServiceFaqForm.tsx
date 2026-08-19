"use client";

import { useEffect, useState } from "react";

import type {
  ServiceFaq,
  ServiceFaqPayload,
} from "@/types/service/serviceFaq";

interface Props {
  initial?: ServiceFaq | null;
  loading?: boolean;
  onSubmit: (payload: ServiceFaqPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceFaqForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ServiceFaqPayload>({
    question: "",
    answer: "",
    sort_order: 0,
    status: true,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        question: initial.question,
        answer: initial.answer,
        sort_order: initial.sort_order ?? 0,
        status: initial.status,
      });
    } else {
      setForm({
        question: "",
        answer: "",
        sort_order: 0,
        status: true,
      });
    }
  }, [initial]);

  function set<K extends keyof ServiceFaqPayload>(
    key: K,
    value: ServiceFaqPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.question.trim()) {
      alert("Please enter a question.");
      return;
    }

    if (!form.answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    await onSubmit({
      question: form.question.trim(),
      answer: form.answer.trim(),
      sort_order: Number(form.sort_order) || 0,
      status: !!form.status,
    });
  }

  return (
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: 16,
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          Question
        </label>

        <input
          value={form.question}
          onChange={(event) =>
            set("question", event.target.value)
          }
          placeholder="e.g. What documents are required?"
          disabled={loading}
          required
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </div>

      <div>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          Answer
        </label>

        <textarea
          value={form.answer}
          onChange={(event) =>
            set("answer", event.target.value)
          }
          placeholder="Enter the answer..."
          disabled={loading}
          required
          rows={5}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            fontSize: 14,
            resize: "vertical",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Sort Order
          </label>

          <input
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(event) =>
              set(
                "sort_order",
                Number(event.target.value) || 0
              )
            }
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            marginTop: 28,
            fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={!!form.status}
            onChange={(event) =>
              set("status", event.target.checked)
            }
            disabled={loading}
          />

          Active
        </label>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "10px 16px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 18px",
            border: 0,
            borderRadius: 8,
            background: "#111827",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Saving..."
            : initial
              ? "Update FAQ"
              : "Add FAQ"}
        </button>
      </div>
    </form>
  );
}