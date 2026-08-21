"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createLead } from "@/lib/api/leads/leadApi";

export default function CreateLeadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    alternate_phone: "",
    company_name: "",
    service_id: "",
    source_id: "",
    status: "new",
    priority: "medium",
    estimated_value: "",
    next_follow_up_at: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createLead({
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim(),
        alternate_phone:
          form.alternate_phone.trim() || undefined,
        company_name:
          form.company_name.trim() || undefined,
        service_id: form.service_id
          ? Number(form.service_id)
          : null,
        source_id: form.source_id
          ? Number(form.source_id)
          : null,
        status: form.status,
        priority: form.priority,
        estimated_value: form.estimated_value
          ? Number(form.estimated_value)
          : null,
        next_follow_up_at:
          form.next_follow_up_at || undefined,
        notes: form.notes.trim() || undefined,
      });

      router.push("/crm/leads");
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          "Unable to create lead."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              CRM MANAGEMENT
            </div>

            <h1 style={titleStyle}>
              Add New Lead
            </h1>

            <p style={subtitleStyle}>
              Create a new sales lead in the CRM.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/crm/leads")}
            style={secondaryButtonStyle}
          >
            ← Back to Leads
          </button>
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
              label="Name"
              required
              value={form.name}
              onChange={(value) =>
                setField("name", value)
              }
              placeholder="Enter lead name"
            />

            <Field
              label="Phone"
              required
              value={form.phone}
              onChange={(value) =>
                setField("phone", value)
              }
              placeholder="Enter phone number"
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                setField("email", value)
              }
              placeholder="Enter email address"
            />

            <Field
              label="Alternate Phone"
              value={form.alternate_phone}
              onChange={(value) =>
                setField("alternate_phone", value)
              }
              placeholder="Alternate phone"
            />

            <Field
              label="Company Name"
              value={form.company_name}
              onChange={(value) =>
                setField("company_name", value)
              }
              placeholder="Company name"
            />

            <Field
              label="Estimated Value"
              type="number"
              value={form.estimated_value}
              onChange={(value) =>
                setField("estimated_value", value)
              }
              placeholder="₹ Estimated value"
            />

            <SelectField
              label="Lead Source"
              value={form.source_id}
              onChange={(value) =>
                setField("source_id", value)
              }
              options={[
                ["", "Select Source"],
                ["1", "Website"],
                ["2", "Google Ads"],
                ["3", "Meta Ads"],
                ["4", "Instagram"],
                ["5", "Referral"],
              ]}
            />

            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) =>
                setField("status", value)
              }
              options={[
                ["new", "New"],
                ["contacted", "Contacted"],
                ["qualified", "Qualified"],
                ["converted", "Converted"],
                ["lost", "Lost"],
              ]}
            />

            <SelectField
              label="Priority"
              value={form.priority}
              onChange={(value) =>
                setField("priority", value)
              }
              options={[
                ["high", "High"],
                ["medium", "Medium"],
                ["low", "Low"],
              ]}
            />

            <Field
              label="Next Follow-up"
              type="datetime-local"
              value={form.next_follow_up_at}
              onChange={(value) =>
                setField(
                  "next_follow_up_at",
                  value
                )
              }
            />

          </div>

          <div style={fullWidthStyle}>
            <label style={labelStyle}>
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(event) =>
                setField(
                  "notes",
                  event.target.value
                )
              }
              placeholder="Add lead notes..."
              rows={5}
              style={textareaStyle}
            />
          </div>

          <div style={footerStyle}>
            <button
              type="button"
              onClick={() =>
                router.push("/crm/leads")
              }
              style={secondaryButtonStyle}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={primaryButtonStyle}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Lead"}
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && (
          <span style={requiredStyle}> *</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        style={inputStyle}
      >
        {options.map(([value, label]) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "34px 24px 60px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  width: "100%",
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 25,
  gap: 20,
};

const eyebrowStyle: React.CSSProperties = {
  color: "#0f766e",
  fontSize: 12,
  fontWeight: 800,
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 800,
  color: "#0f172a",
};

const subtitleStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#64748b",
  fontSize: 14,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 24,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 18,
};

const fullWidthStyle: React.CSSProperties = {
  marginTop: 20,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
  color: "#334155",
  fontSize: 12,
  fontWeight: 750,
};

const requiredStyle: React.CSSProperties = {
  color: "#dc2626",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 12px",
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  background: "#fff",
  color: "#0f172a",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #dbe3ec",
  borderRadius: 8,
  background: "#fff",
  color: "#0f172a",
  fontSize: 13,
  resize: "vertical",
  boxSizing: "border-box",
  outline: "none",
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 25,
  paddingTop: 20,
  borderTop: "1px solid #e2e8f0",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 18px",
  border: 0,
  borderRadius: 8,
  background: "#0f766e",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 750,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  background: "#fff",
  color: "#334155",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: "12px 15px",
  borderRadius: 9,
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 13,
};

