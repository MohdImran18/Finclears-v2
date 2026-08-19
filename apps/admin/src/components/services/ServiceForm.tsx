"use client";

import { useEffect, useState } from "react";

import type {
  Service,
  ServicePayload,
  ServiceCategory,
} from "@/types/service/service";

interface Props {
  initial?: Service | null;
  loading?: boolean;
  categories?: ServiceCategory[];
  onSubmit: (payload: ServicePayload) => Promise<void>;
}

export default function ServiceForm({
  initial,
  loading,
  categories = [],
  onSubmit,
}: Props) {
  const [form, setForm] = useState<ServicePayload>({
    service_category_id: 1,
    title: "",
    slug: "",
    code: "",
    icon: "",
    featured_image: "",
    banner_image: "",
    short_description: "",
    description: "",
    starting_price: null,
    price_label: "",
    processing_days: null,
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_featured: false,
    is_popular: false,
    status: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (!initial) return;

    setForm({
      service_category_id: initial.service_category_id,
      title: initial.title,
      slug: initial.slug,
      code: initial.code ?? "",
      icon: initial.icon ?? "",
      featured_image: initial.featured_image ?? "",
      banner_image: initial.banner_image ?? "",
      short_description: initial.short_description,
      description: initial.description,
      starting_price: initial.starting_price ?? null,
      price_label: initial.price_label ?? "",
      processing_days: initial.processing_days ?? null,
      meta_title: initial.meta_title ?? "",
      meta_description: initial.meta_description ?? "",
      meta_keywords: initial.meta_keywords ?? "",
      is_featured: initial.is_featured,
      is_popular: initial.is_popular,
      status: initial.status,
      sort_order: initial.sort_order ?? 0,
    });
  }, [initial]);

  function set<K extends keyof ServicePayload>(
    key: K,
    value: ServicePayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit(form);
      }}
      style={{
        display: "grid",
        gap: 22,
        maxWidth: 1000,
      }}
    >
      {/* Basic Information */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Basic Information</h2>
          <p style={sectionDescriptionStyle}>
            Main information used to display the service.
          </p>
        </div>

        <div style={gridStyle}>
          <Field label="Category" required>
            <select
              value={form.service_category_id}
              onChange={(e) =>
                set(
                  "service_category_id",
                  Number(e.target.value)
                )
              }
              required
              disabled={!!loading}
              style={inputStyle}
            >
              {categories.length === 0 && (
                <option value={1}>Default Category</option>
              )}

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Service Title" required>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              disabled={!!loading}
              style={inputStyle}
              placeholder="Private Limited Company Registration"
            />
          </Field>

          <Field label="Slug" required>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              required
              disabled={!!loading}
              style={inputStyle}
              placeholder="private-limited-company-registration"
            />
          </Field>

          <Field label="Code">
            <input
              value={form.code ?? ""}
              onChange={(e) => set("code", e.target.value)}
              disabled={!!loading}
              style={inputStyle}
              placeholder="PVT-LTD"
            />
          </Field>

          <Field label="Icon">
            <input
              value={form.icon ?? ""}
              onChange={(e) => set("icon", e.target.value)}
              disabled={!!loading}
              style={inputStyle}
              placeholder="building"
            />
          </Field>

          <Field label="Sort Order">
            <input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) =>
                set("sort_order", Number(e.target.value))
              }
              disabled={!!loading}
              style={inputStyle}
            />
          </Field>
        </div>
      </section>

      {/* Description */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Description</h2>
          <p style={sectionDescriptionStyle}>
            Content shown on the service page.
          </p>
        </div>

        <Field label="Short Description" required>
          <textarea
            value={form.short_description}
            onChange={(e) =>
              set("short_description", e.target.value)
            }
            required
            disabled={!!loading}
            rows={3}
            style={textareaStyle}
            placeholder="Short summary of this service..."
          />
        </Field>

        <Field label="Full Description" required>
          <textarea
            value={form.description}
            onChange={(e) =>
              set("description", e.target.value)
            }
            required
            disabled={!!loading}
            rows={10}
            style={textareaStyle}
            placeholder="Detailed service description..."
          />
        </Field>
      </section>

      {/* Media */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Media</h2>
          <p style={sectionDescriptionStyle}>
            Image URLs used by the website.
          </p>
        </div>

        <div style={gridStyle}>
          <Field label="Featured Image URL">
            <input
              value={form.featured_image ?? ""}
              onChange={(e) =>
                set("featured_image", e.target.value)
              }
              disabled={!!loading}
              style={inputStyle}
              placeholder="https://..."
            />
          </Field>

          <Field label="Banner Image URL">
            <input
              value={form.banner_image ?? ""}
              onChange={(e) =>
                set("banner_image", e.target.value)
              }
              disabled={!!loading}
              style={inputStyle}
              placeholder="https://..."
            />
          </Field>
        </div>
      </section>

      {/* Pricing */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Service Pricing</h2>
        </div>

        <div style={gridStyle}>
          <Field label="Starting Price">
            <input
              type="number"
              min={0}
              value={form.starting_price ?? ""}
              onChange={(e) =>
                set(
                  "starting_price",
                  e.target.value
                    ? Number(e.target.value)
                    : null
                )
              }
              disabled={!!loading}
              style={inputStyle}
              placeholder="4999"
            />
          </Field>

          <Field label="Price Label">
            <input
              value={form.price_label ?? ""}
              onChange={(e) =>
                set("price_label", e.target.value)
              }
              disabled={!!loading}
              style={inputStyle}
              placeholder="Starting from ₹4,999"
            />
          </Field>

          <Field label="Processing Days">
            <input
              type="number"
              min={0}
              value={form.processing_days ?? ""}
              onChange={(e) =>
                set(
                  "processing_days",
                  e.target.value
                    ? Number(e.target.value)
                    : null
                )
              }
              disabled={!!loading}
              style={inputStyle}
              placeholder="7"
            />
          </Field>
        </div>
      </section>

      {/* SEO */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>SEO</h2>
        </div>

        <Field label="Meta Title">
          <input
            value={form.meta_title ?? ""}
            onChange={(e) =>
              set("meta_title", e.target.value)
            }
            disabled={!!loading}
            style={inputStyle}
          />
        </Field>

        <Field label="Meta Description">
          <textarea
            value={form.meta_description ?? ""}
            onChange={(e) =>
              set("meta_description", e.target.value)
            }
            disabled={!!loading}
            rows={4}
            style={textareaStyle}
          />
        </Field>

        <Field label="Meta Keywords">
          <textarea
            value={form.meta_keywords ?? ""}
            onChange={(e) =>
              set("meta_keywords", e.target.value)
            }
            disabled={!!loading}
            rows={3}
            style={textareaStyle}
            placeholder="gst, registration, business..."
          />
        </Field>
      </section>

      {/* Publishing */}

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Publishing</h2>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <Checkbox
            label="Active"
            checked={!!form.status}
            onChange={(value) => set("status", value)}
          />

          <Checkbox
            label="Featured"
            checked={!!form.is_featured}
            onChange={(value) =>
              set("is_featured", value)
            }
          />

          <Checkbox
            label="Popular"
            checked={!!form.is_popular}
            onChange={(value) =>
              set("is_popular", value)
            }
          />
        </div>
      </section>

      {/* Submit */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <button
          type="submit"
          disabled={!!loading}
          style={{
            padding: "13px 22px",
            border: 0,
            borderRadius: 9,
            background: "#111827",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading
            ? "Saving..."
            : initial
              ? "Update Service"
              : "Create Service"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
        }}
      >
        {label}
        {required ? " *" : ""}
      </span>

      {children}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontWeight: 600,
        color: "#334155",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 22,
};

const sectionHeaderStyle: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  color: "#0f172a",
};

const sectionDescriptionStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 13,
  color: "#64748b",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "11px 13px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
  fontSize: 14,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.5,
};