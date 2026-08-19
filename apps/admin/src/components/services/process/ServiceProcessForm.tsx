"use client";

import { useState } from "react";

import type {
  ServiceProcess,
  ServiceProcessPayload,
} from "@/types/service/serviceProcess";

interface Props {
  initial?: ServiceProcess | null;
  loading?: boolean;
  onSubmit: (payload: ServiceProcessPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceProcessForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ServiceProcessPayload>({
    step_number: initial?.step_number ?? 1,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "",
    sort_order: initial?.sort_order ?? 0,
    status: initial?.status ?? true,
  });

  function update<K extends keyof ServiceProcessPayload>(
    key: K,
    value: ServiceProcessPayload[K]
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
      style={formStyle}
    >
      <div style={twoColumn}>
        <label style={labelStyle}>
          Step Number *
          <input
            required
            type="number"
            min={1}
            value={form.step_number}
            onChange={(e) =>
              update(
                "step_number",
                Number(e.target.value)
              )
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Sort Order
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) =>
              update(
                "sort_order",
                Number(e.target.value)
              )
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <label style={labelStyle}>
        Title *
        <input
          required
          value={form.title}
          onChange={(e) =>
            update("title", e.target.value)
          }
          disabled={loading}
          style={inputStyle}
          placeholder="Submit your documents"
        />
      </label>

      <label style={labelStyle}>
        Description *
        <textarea
          required
          value={form.description}
          onChange={(e) =>
            update(
              "description",
              e.target.value
            )
          }
          disabled={loading}
          rows={4}
          style={inputStyle}
        />
      </label>

      <div style={twoColumn}>
        <label style={labelStyle}>
          Icon
          <input
            value={form.icon ?? ""}
            onChange={(e) =>
              update("icon", e.target.value)
            }
            disabled={loading}
            style={inputStyle}
            placeholder="file-text"
          />
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={form.status}
            onChange={(e) =>
              update(
                "status",
                e.target.checked
              )
            }
          />
          Active
        </label>
      </div>

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
              ? "Update Step"
              : "Add Step"}
        </button>
      </div>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 15,
  padding: 18,
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  background: "#f8fafc",
};

const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

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

const checkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  alignSelf: "end",
  paddingBottom: 10,
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