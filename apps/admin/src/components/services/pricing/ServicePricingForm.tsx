"use client";

import { useState } from "react";

import type {
  ServicePricing,
  ServicePricingPayload,
} from "@/types/service/servicePricing";

interface Props {
  initial?: ServicePricing | null;
  loading?: boolean;
  onSubmit: (payload: ServicePricingPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function ServicePricingForm({
  initial,
  loading,
  onSubmit,
  onCancel,
}: Props) {
  const [featuresText, setFeaturesText] = useState(
    initial?.features?.join("\n") ?? ""
  );

  const [form, setForm] = useState<ServicePricingPayload>({
    plan_name: initial?.plan_name ?? "",
    price: initial?.price ?? 0,
    original_price: initial?.original_price ?? null,
    currency: initial?.currency ?? "INR",
    features: initial?.features ?? [],
    is_popular: initial?.is_popular ?? false,
    is_recommended: initial?.is_recommended ?? false,
    status: initial?.status ?? true,
    sort_order: initial?.sort_order ?? 0,
  });

  function update<K extends keyof ServicePricingPayload>(
    key: K,
    value: ServicePricingPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submit() {
    const features = featuresText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    await onSubmit({
      ...form,
      features,
    });
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await submit();
      }}
      style={formStyle}
    >
      <div style={twoColumn}>
        <label style={labelStyle}>
          Plan Name *
          <input
            required
            value={form.plan_name}
            onChange={(e) =>
              update("plan_name", e.target.value)
            }
            disabled={loading}
            placeholder="Basic"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Currency
          <input
            value={form.currency}
            onChange={(e) =>
              update(
                "currency",
                e.target.value.toUpperCase()
              )
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <div style={twoColumn}>
        <label style={labelStyle}>
          Price *
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) =>
              update("price", Number(e.target.value))
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Original Price
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.original_price ?? ""}
            onChange={(e) =>
              update(
                "original_price",
                e.target.value
                  ? Number(e.target.value)
                  : null
              )
            }
            disabled={loading}
            style={inputStyle}
          />
        </label>
      </div>

      <label style={labelStyle}>
        Features
        <textarea
          value={featuresText}
          onChange={(e) =>
            setFeaturesText(e.target.value)
          }
          disabled={loading}
          rows={6}
          placeholder={"GST Registration\nExpert CA Support\nFast Processing"}
          style={inputStyle}
        />
        <small style={hintStyle}>
          Enter one feature per line.
        </small>
      </label>

      <div style={checks}>
        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={form.is_popular}
            onChange={(e) =>
              update(
                "is_popular",
                e.target.checked
              )
            }
          />
          Popular
        </label>

        <label style={checkStyle}>
          <input
            type="checkbox"
            checked={form.is_recommended}
            onChange={(e) =>
              update(
                "is_recommended",
                e.target.checked
              )
            }
          />
          Recommended
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
              ? "Update Pricing"
              : "Add Pricing"}
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

const hintStyle: React.CSSProperties = {
  color: "#64748b",
  fontWeight: 400,
};

const checks: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 18,
};

const checkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
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