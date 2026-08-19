"use client";

import { useState } from "react";

import type {
  ServiceDocument,
  ServiceDocumentPayload,
} from "@/types/service/serviceDocument";

interface Props {
  initial?: ServiceDocument | null;
  loading?: boolean;
  onSubmit: (payload: ServiceDocumentPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServiceDocumentForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<ServiceDocumentPayload>({
    document_name: initial?.document_name ?? "",
    description: initial?.description ?? "",
    is_required: initial?.is_required ?? true,
    sort_order: initial?.sort_order ?? 0,
    status: initial?.status ?? true,
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(form);
      }}
      style={formStyle}
    >
      <label style={labelStyle}>
        Document Name *
        <input
          required
          value={form.document_name}
          onChange={(e) =>
            setForm({
              ...form,
              document_name: e.target.value,
            })
          }
          disabled={loading}
          style={inputStyle}
          placeholder="PAN Card"
        />
      </label>

      <label style={labelStyle}>
        Description
        <textarea
          value={form.description ?? ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          disabled={loading}
          rows={3}
          style={inputStyle}
        />
      </label>

      <div style={twoColumn}>
        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={!!form.is_required}
            onChange={(e) =>
              setForm({
                ...form,
                is_required: e.target.checked,
              })
            }
          />
          Required
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={!!form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.checked,
              })
            }
          />
          Active
        </label>
      </div>

      <label style={labelStyle}>
        Sort Order
        <input
          type="number"
          value={form.sort_order ?? 0}
          onChange={(e) =>
            setForm({
              ...form,
              sort_order: Number(e.target.value),
            })
          }
          disabled={loading}
          style={inputStyle}
        />
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
              ? "Update Document"
              : "Add Document"}
        </button>
      </div>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  padding: 18,
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  background: "#f8fafc",
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

const twoColumn: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 15,
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