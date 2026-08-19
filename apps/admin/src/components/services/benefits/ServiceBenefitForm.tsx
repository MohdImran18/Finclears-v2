"use client";

import { useState } from "react";
import type {
  ServiceBenefit,
  ServiceBenefitPayload,
} from "@/types/service/serviceBenefit";

interface Props {
  initial?: ServiceBenefit | null;
  loading?: boolean;
  onSubmit: (payload: ServiceBenefitPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceBenefitForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ServiceBenefitPayload>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "",
    sort_order: initial?.sort_order ?? 0,
    status: initial?.status ?? true,
  });

  function set<K extends keyof ServiceBenefitPayload>(
    key: K,
    value: ServiceBenefitPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(form);
      }}
      style={{
        display: "grid",
        gap: 14,
        padding: 18,
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        background: "#f8fafc",
      }}
    >
      <label style={labelStyle}>
        Title *
        <input
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          disabled={loading}
          style={inputStyle}
          placeholder="Fast processing"
        />
      </label>

      <label style={labelStyle}>
        Description
        <textarea
          value={form.description ?? ""}
          onChange={(e) =>
            set("description", e.target.value)
          }
          disabled={loading}
          rows={3}
          style={inputStyle}
        />
      </label>

      <div style={twoColumn}>
        <label style={labelStyle}>
          Icon
          <input
            value={form.icon ?? ""}
            onChange={(e) => set("icon", e.target.value)}
            disabled={loading}
            style={inputStyle}
            placeholder="check-circle"
          />
        </label>

        <label style={labelStyle}>
          Sort Order
          <input
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) =>
              set("sort_order", Number(e.target.value))
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <label style={checkStyle}>
        <input
          type="checkbox"
          checked={!!form.status}
          onChange={(e) =>
            set("status", e.target.checked)
          }
        />
        Active
      </label>

      <div style={actionsStyle}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={secondaryButton}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          style={primaryButton}
        >
          {loading
            ? "Saving..."
            : initial
              ? "Update Benefit"
              : "Add Benefit"}
        </button>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
  fontSize: 13,
  fontWeight: 700,
  color: "#334155",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
};

const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const checkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: 600,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
};

const primaryButton: React.CSSProperties = {
  padding: "9px 14px",
  border: 0,
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
};

const secondaryButton: React.CSSProperties = {
  padding: "9px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
};