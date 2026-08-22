"use client";

import { useState } from "react";

import type {
  ServiceFaq,
  ServiceFaqPayload,
} from "@/types/service/serviceFaq";

interface Props {
  initial?: ServiceFaq;
  loading?: boolean;
  onSubmit: (payload: ServiceFaqPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceFaqForm({
  initial,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const [question, setQuestion] = useState(
    initial?.question || ""
  );

  const [answer, setAnswer] = useState(
    initial?.answer || ""
  );

  const [sortOrder, setSortOrder] = useState(
    String(initial?.sort_order ?? 0)
  );

  const [status, setStatus] = useState(
    initial?.status ?? true
  );

  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!question.trim()) {
      setError("Question is required.");
      return;
    }

    if (!answer.trim()) {
      setError("Answer is required.");
      return;
    }

    try {
      await onSubmit({
        question: question.trim(),
        answer: answer.trim(),
        sort_order: Number(sortOrder) || 0,
        status,
      });
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save FAQ."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 14,
        padding: 16,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      {error && (
        <div
          style={{
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

      <label>
        <div style={labelStyle}>Question *</div>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter frequently asked question"
          style={inputStyle}
          disabled={loading}
        />
      </label>

      <label>
        <div style={labelStyle}>Answer *</div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          rows={5}
          style={textareaStyle}
          disabled={loading}
        />
      </label>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: 14,
        }}
      >
        <label>
          <div style={labelStyle}>Sort Order</div>

          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingTop: 27,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
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
          marginTop: 4,
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          style={primaryButtonStyle}
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

const labelStyle: React.CSSProperties = {
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  height: 40,
  padding: "0 11px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 11px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  fontSize: 13,
  resize: "vertical",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  border: 0,
  borderRadius: 8,
  background: "#0f766e",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
  color: "#334155",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};
