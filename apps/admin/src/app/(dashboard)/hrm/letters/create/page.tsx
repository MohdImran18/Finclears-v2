"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getEmployees } from "@/lib/api/employees/employeeApi";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

type Employee = {
  id: number;
  employee_code?: string | null;
  user?: {
    id?: number;
    name?: string | null;
    email?: string | null;
  } | null;
  department?: {
    id?: number;
    name?: string | null;
    code?: string | null;
  } | null;
  designation?: {
    id?: number;
    name?: string | null;
    code?: string | null;
  } | null;
  department_id?: number | null;
  designation_id?: number | null;
  work_location?: string | null;
  employment_type?: string | null;
};

type LetterTemplate = {
  id: number;
  name: string;
  code: string;
  letter_type: string;
  subject?: string | null;
  content?: string | null;
  version?: number;
};

type Field = {
  id: number;
  field_key: string;
  label?: string | null;
  field_type?: string | null;
  is_required?: boolean;
  default_value?: string | null;
};

export default function CreateLetterPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [fields, setFields] = useState<Field[]>([]);

  const [employeeId, setEmployeeId] = useState("");
  const [templateId, setTemplateId] = useState("");

  const [letterType, setLetterType] = useState("");
  const [title, setTitle] = useState("");
  const [letterDate, setLetterDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [effectiveDate, setEffectiveDate] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>(
    {}
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedEmployee = useMemo(
    () => employees.find((employee) => String(employee.id) === employeeId),
    [employees, employeeId]
  );

  const selectedTemplate = useMemo(
    () => templates.find((template) => String(template.id) === templateId),
    [templates, templateId]
  );

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [employeeResponse, templateResponse] = await Promise.all([
          getEmployees({
            page: 1,
            per_page: 100,
            status: "active",
          }),
          client.get<{
            success: boolean;
            message: string;
            data: LetterTemplate[];
          }>("/letters/templates"),
        ]);

        const employeeData =
          employeeResponse?.data?.data ??
          [];

        const templateData =
          templateResponse.data?.data ??
          [];

        setEmployees(employeeData);
        setTemplates(templateData);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load employees and letter templates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedTemplate) {
      setFields([]);
      return;
    }

    async function loadTemplate() {
      if (!selectedTemplate) {
        return;
      }

      const templateId = selectedTemplate.id;

      try {
        const response = await client.get<{
          success: boolean;
          message: string;
          data: LetterTemplate & {
            fields?: Field[];
          };
        }>(`/letters/templates/${templateId}`);

        const template = response.data?.data;

        setFields(template?.fields ?? []);

        setLetterType(template?.letter_type ?? "");
        setTitle(
          template?.subject ||
            template?.name ||
            ""
        );

        const defaults: Record<string, string> = {};

        for (const field of template?.fields ?? []) {
          if (field.default_value !== null && field.default_value !== undefined) {
            defaults[field.field_key] = String(field.default_value);
          }
        }

        setCustomValues(defaults);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Unable to load template fields."
        );
      }
    }

    loadTemplate();
  }, [selectedTemplate]);

  function updateCustomValue(key: string, value: string) {
    setCustomValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }

    if (!templateId) {
      setError("Please select a letter template.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await client.post<{
        success: boolean;
        message: string;
        data: {
          letter: {
            id: number;
          };
        };
      }>("/letters", {
        employee_profile_id: Number(employeeId),
        letter_template_id: Number(templateId),
        letter_type: letterType || selectedTemplate?.letter_type,
        title,
        letter_date: letterDate,
        effective_date: effectiveDate || null,
        status: "draft",
        field_values: customValues,
      });

      const id = response.data?.data?.letter?.id;

      if (!id) {
        throw new Error("Letter was created but no letter ID was returned.");
      }

      router.push(`/hrm/letters/${id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create letter."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>Loading letter form...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>HRM / LETTERS</div>
          <h1 style={styles.heading}>Create Employee Letter</h1>
          <p style={styles.subheading}>
            Create a draft using employee master data and a letter template.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/hrm/letters")}
          style={styles.secondaryButton}
        >
          Back to Letters
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Letter Details</h2>

            <label style={styles.label}>
              Employee *
              <select
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select employee</option>

                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.user?.name || "Employee"}{" "}
                    {employee.employee_code
                      ? `(${employee.employee_code})`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Letter Template *
              <select
                value={templateId}
                onChange={(event) => setTemplateId(event.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select template</option>

                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                    {template.version
                      ? ` â€” v${template.version}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Letter Type
              <input
                value={letterType}
                onChange={(event) => setLetterType(event.target.value)}
                style={styles.input}
                placeholder="e.g. offer"
              />
            </label>

            <label style={styles.label}>
              Letter Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                style={styles.input}
                placeholder="Offer of Employment"
              />
            </label>

            <div style={styles.twoColumns}>
              <label style={styles.label}>
                Letter Date *
                <input
                  type="date"
                  value={letterDate}
                  onChange={(event) => setLetterDate(event.target.value)}
                  style={styles.input}
                  required
                />
              </label>

              <label style={styles.label}>
                Effective Date
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(event) =>
                    setEffectiveDate(event.target.value)
                  }
                  style={styles.input}
                />
              </label>
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Employee Information</h2>

            {!selectedEmployee ? (
              <div style={styles.empty}>
                Select an employee to see employee information.
              </div>
            ) : (
              <div style={styles.infoGrid}>
                <Info
                  label="Employee"
                  value={selectedEmployee.user?.name}
                />

                <Info
                  label="Employee Code"
                  value={selectedEmployee.employee_code}
                />

                <Info
                  label="Department"
                  value={selectedEmployee.department?.name}
                />

                <Info
                  label="Designation"
                  value={selectedEmployee.designation?.name}
                />

                <Info
                  label="Work Location"
                  value={selectedEmployee.work_location}
                />

                <Info
                  label="Employment Type"
                  value={selectedEmployee.employment_type}
                />

                <Info
                  label="Email"
                  value={selectedEmployee.user?.email}
                />
              </div>
            )}

            <div style={styles.notice}>
              Department and designation are taken from the employee master
              record when the letter is generated.
            </div>
          </section>
        </div>

        {fields.length > 0 && (
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Template Fields</h2>

            <div style={styles.fieldsGrid}>
              {fields.map((field) => (
                <label key={field.id} style={styles.label}>
                  {field.label || field.field_key}
                  {field.is_required ? " *" : ""}

                  <input
                    value={customValues[field.field_key] ?? ""}
                    onChange={(event) =>
                      updateCustomValue(
                        field.field_key,
                        event.target.value
                      )
                    }
                    style={styles.input}
                    required={Boolean(field.is_required)}
                    placeholder={field.field_key}
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Create Draft</h2>

          <p style={styles.help}>
            The letter will first be saved as a draft. You can then review
            it, generate the PDF, preview it, and approve it.
          </p>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => router.push("/hrm/letters")}
              style={styles.secondaryButton}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={styles.primaryButton}
              disabled={saving}
            >
              {saving ? "Creating..." : "Create Letter Draft"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div style={styles.infoItem}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>
        {value || "â€”"}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "32px",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    marginBottom: "24px",
  },

  eyebrow: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#6b7280",
    marginBottom: "6px",
  },

  heading: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 750,
  },

  subheading: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },

  sectionTitle: {
    margin: "0 0 20px",
    fontSize: "18px",
    fontWeight: 700,
  },

  label: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "16px",
  },

  input: {
    width: "100%",
    minHeight: "42px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    padding: "9px 12px",
    fontSize: "14px",
    background: "#fff",
    color: "#111827",
    boxSizing: "border-box",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0 18px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },

  infoItem: {
    border: "1px solid #eef0f3",
    borderRadius: "10px",
    padding: "13px",
    background: "#fafafa",
  },

  infoLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#6b7280",
    marginBottom: "5px",
  },

  infoValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },

  notice: {
    marginTop: "18px",
    padding: "12px 14px",
    borderRadius: "9px",
    background: "#f5f7fa",
    color: "#4b5563",
    fontSize: "12px",
    lineHeight: 1.5,
  },

  empty: {
    padding: "30px 10px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  help: {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.6,
    margin: "0 0 20px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },

  primaryButton: {
    border: 0,
    borderRadius: "9px",
    padding: "11px 18px",
    background: "#111827",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    padding: "10px 16px",
    background: "#fff",
    color: "#374151",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};
