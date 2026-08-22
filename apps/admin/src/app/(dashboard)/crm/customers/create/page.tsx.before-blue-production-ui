"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/lib/api/customers/customerApi";

export default function CreateCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternate_phone: "",
    company_name: "",
    status: "active",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createCustomer({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        alternate_phone:
          form.alternate_phone.trim() || undefined,
        company_name:
          form.company_name.trim() || undefined,
        status: form.status,
        notes: form.notes.trim() || undefined,
      });

      router.push("/crm/customers");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to create customer."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "34px 24px 60px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => router.push("/crm/customers")}
            style={backButton}
          >
            ← Customers
          </button>

          <div style={eyebrow}>
            CRM MANAGEMENT
          </div>

          <h1 style={title}>
            Add New Customer
          </h1>

          <p style={subtitle}>
            Create a customer record for CRM management.
          </p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={cardStyle}
        >
          <div style={gridStyle}>
            <Field
              label="Customer Name *"
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="Enter customer name"
            />

            <Field
              label="Phone *"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="Enter phone number"
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="customer@example.com"
            />

            <Field
              label="Alternate Phone"
              value={form.alternate_phone}
              onChange={(v) =>
                update("alternate_phone", v)
              }
              placeholder="Alternate phone"
            />

            <Field
              label="Company Name"
              value={form.company_name}
              onChange={(v) =>
                update("company_name", v)
              }
              placeholder="Company name"
            />

            <div>
              <label style={labelStyle}>
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value)
                }
                style={inputStyle}
              >
                <option value="active">
                  Active
                </option>
                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label style={labelStyle}>
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                update("notes", e.target.value)
              }
              placeholder="Customer notes..."
              rows={5}
              style={{
                ...inputStyle,
                height: "auto",
                padding: 12,
                resize: "vertical",
              }}
            />
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={() =>
                router.push("/crm/customers")
              }
              style={cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryButton,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading
                ? "Creating..."
                : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const eyebrow: React.CSSProperties = {
  marginTop: 18,
  color: "#0f766e",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".06em",
};

const title: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#0f172a",
  fontSize: 30,
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#64748b",
  fontSize: 14,
};

const backButton: React.CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#475569",
  padding: 0,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 24,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 18,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  boxSizing: "border-box",
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  background: "#fff",
  padding: "0 12px",
  color: "#0f172a",
  fontSize: 13,
  outline: "none",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 24,
  paddingTop: 20,
  borderTop: "1px solid #e2e8f0",
};

const primaryButton: React.CSSProperties = {
  height: 42,
  padding: "0 18px",
  border: 0,
  borderRadius: 8,
  background: "#0f766e",
  color: "#fff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const cancelButton: React.CSSProperties = {
  height: 42,
  padding: "0 18px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
  color: "#475569",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: "12px 15px",
  border: "1px solid #fecaca",
  borderRadius: 9,
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 13,
};
