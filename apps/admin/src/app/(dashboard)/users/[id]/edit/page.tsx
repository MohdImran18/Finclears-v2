"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, UserCog } from "lucide-react";
import {
  getUser,
  updateUser,
  type UserPayload,
} from "@/lib/api/users/userApi";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState<UserPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "employee",
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadUser() {
      try {
        const response = await getUser(id);
        const user = response?.data;

        setForm({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || user?.mobile || "",
          password: "",
          password_confirmation: "",
          role: user?.role || "employee",
          status: user?.status || "active",
        });
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Unable to load user."
        );
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  function updateField(field: keyof UserPayload, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      form.password &&
      form.password !== form.password_confirmation
    ) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setSaving(true);

      const payload = { ...form };

      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      await updateUser(id, payload);

      router.push("/users");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Unable to update user."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={loadingStyle}>Loading user...</div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          onClick={() => router.push("/users")}
          style={backButtonStyle}
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        <div style={cardStyle}>
          <div style={headerStyle}>
            <UserCog size={22} />
            <div>
              <h1 style={titleStyle}>Edit User</h1>
              <p style={subtitleStyle}>
                Update user account and access settings.
              </p>
            </div>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={gridStyle}>
              <Field
                label="Name"
                value={form.name}
                required
                onChange={(v) => updateField("name", v)}
              />

              <Field
                label="Email"
                type="email"
                value={form.email}
                required
                onChange={(v) => updateField("email", v)}
              />

              <Field
                label="Phone"
                value={form.phone || ""}
                onChange={(v) => updateField("phone", v)}
              />

              <SelectField
                label="Role"
                value={form.role}
                options={[
                  ["admin", "Admin"],
                  ["employee", "Employee"],
                  ["client", "Client"],
                ]}
                onChange={(v) => updateField("role", v)}
              />

              <SelectField
                label="Status"
                value={form.status}
                options={[
                  ["active", "Active"],
                  ["inactive", "Inactive"],
                  ["blocked", "Blocked"],
                ]}
                onChange={(v) => updateField("status", v)}
              />

              <div />

              <Field
                label="New Password"
                type="password"
                value={form.password || ""}
                onChange={(v) => updateField("password", v)}
              />

              <Field
                label="Confirm New Password"
                type="password"
                value={form.password_confirmation || ""}
                onChange={(v) =>
                  updateField("password_confirmation", v)
                }
              />
            </div>

            <div style={actionsStyle}>
              <button
                type="button"
                onClick={() => router.push("/users")}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={primaryButtonStyle}
              >
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label style={labelStyle}>
      {label}
      {required && " *"}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[][];
  onChange: (value: string) => void;
}) {
  return (
    <label style={labelStyle}>
      {label} *
      <select
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 26,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 25,
  color: "#2563eb",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#102a50",
  fontSize: 25,
};

const subtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#71839b",
  fontSize: 13,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 18,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
  color: "#40536d",
  fontSize: 12,
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "0 11px",
  color: "#0f172a",
  background: "#fff",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 28,
};

const primaryButtonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "10px 17px",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
};

const secondaryButtonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "10px 17px",
  background: "#fff",
  color: "#40536d",
  fontWeight: 700,
  cursor: "pointer",
};

const backButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  border: 0,
  background: "transparent",
  color: "#2563eb",
  marginBottom: 15,
  cursor: "pointer",
  fontWeight: 700,
};

const loadingStyle: React.CSSProperties = {
  padding: 50,
  textAlign: "center",
  color: "#64748b",
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 12,
  borderRadius: 8,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  fontSize: 13,
};
