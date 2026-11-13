"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getLetterTemplates,
  getLetterTemplate,
  createLetterTemplate,
  updateLetterTemplate,
  type LetterTemplate,
} from "@/lib/api/letters/letterApi";

type FieldType = "text" | "textarea" | "date" | "number";
type FieldSource = "employee" | "system" | "company" | "manual";

interface TemplateFieldDraft {
  field_key: string;
  field_label: string;
  field_type: FieldType;
  source: FieldSource;
  default_value: string;
  is_required: boolean;
  is_active: boolean;
  display_order: number;
}

interface TemplateForm {
  name: string;
  code: string;
  letter_type: string;
  subject: string;
  content: string;
  language: string;
  notes: string;
  is_active: boolean;
  is_default: boolean;
  fields: TemplateFieldDraft[];
}

const emptyForm: TemplateForm = {
  name: "",
  code: "",
  letter_type: "",
  subject: "",
  content: "",
  language: "en",
  notes: "",
  is_active: true,
  is_default: false,
  fields: [],
};

const emptyField = (): TemplateFieldDraft => ({
  field_key: "",
  field_label: "",
  field_type: "text",
  source: "employee",
  default_value: "",
  is_required: false,
  is_active: true,
  display_order: 0,
});

export default function LetterTemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const roles = user?.spatie_roles || [];

  const canManageTemplates =
    user?.role === "admin" ||
    roles.includes("admin") ||
    roles.includes("super-admin") ||
    roles.includes("hr-manager");

  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [form, setForm] = useState<TemplateForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLetterTemplates();
      setTemplates(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load letter templates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && canManageTemplates) {
      loadTemplates();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, canManageTemplates, loadTemplates]);

  function updateForm<K extends keyof TemplateForm>(
    key: K,
    value: TemplateForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateField(
    index: number,
    key: keyof TemplateFieldDraft,
    value: string | boolean | number
  ) {
    setForm((current) => ({
      ...current,
      fields: current.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      ),
    }));
  }

  function addField() {
    setForm((current) => ({
      ...current,
      fields: [
        ...current.fields,
        { ...emptyField(), display_order: current.fields.length },
      ],
    }));
  }

  function removeField(index: number) {
    setForm((current) => ({
      ...current,
      fields: current.fields
        .filter((_, i) => i !== index)
        .map((field, i) => ({ ...field, display_order: i })),
    }));
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  async function startEdit(id: number) {
    try {
      setError("");
      setSuccess("");
      const response = await getLetterTemplate(id);
      const template = response.data;

      setEditingId(template.id);
      setForm({
        name: template.name || "",
        code: template.code || "",
        letter_type: template.letter_type || "",
        subject: template.subject || "",
        content: template.content || "",
        language: template.language || "en",
        notes: template.notes || "",
        is_active: template.is_active,
        is_default: template.is_default,
        fields: (template.fields || []).map((field, index) => ({
          field_key: field.field_key,
          field_label: field.field_label,
          field_type: field.field_type,
          source: field.source,
          default_value: field.default_value || "",
          is_required: field.is_required,
          is_active: field.is_active,
          display_order: field.display_order ?? index,
        })),
      });
      setShowForm(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load this template."
      );
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      fields: form.fields.map((field, index) => ({
        ...field,
        display_order: index,
        default_value: field.default_value || null,
      })),
    };

    try {
      if (editingId) {
        const response = await updateLetterTemplate(editingId, payload);
        setSuccess(response.message || "Template updated successfully.");
      } else {
        const response = await createLetterTemplate(payload);
        setSuccess(response.message || "Template created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadTemplates();
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(
        (typeof firstValidationError === "string"
          ? firstValidationError
          : err?.response?.data?.message) ||
          "Unable to save the template."
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading templates...
      </div>
    );
  }

  if (!canManageTemplates) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        You are not authorized to manage letter templates.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-gray-500">HRM</div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Letter Template Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage reusable employee letter templates.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.location.assign("/employee/hrm/letters")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Letters
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Create Template
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Template" : "Create New Template"}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Template Name *</span>
              <input
                required
                maxLength={255}
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Appointment Letter"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Template Code *</span>
              <input
                required
                maxLength={255}
                value={form.code}
                onChange={(e) => updateForm("code", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="APPOINTMENT_LETTER"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Letter Type *</span>
              <input
                required
                maxLength={100}
                value={form.letter_type}
                onChange={(e) => updateForm("letter_type", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="appointment"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Subject</span>
              <input
                maxLength={255}
                value={form.subject}
                onChange={(e) => updateForm("subject", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Subject of the letter"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Language</span>
              <select
                value={form.language}
                onChange={(e) => updateForm("language", e.target.value)}
                className="w-full rounded-lg border bg-white px-3 py-2"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </label>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Notes</span>
              <input
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Internal notes (optional)"
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="font-medium text-gray-700">Letter Content *</span>
            <textarea
              required
              rows={12}
              value={form.content}
              onChange={(e) => updateForm("content", e.target.value)}
              className="w-full rounded-lg border px-3 py-3 font-mono text-sm"
              placeholder={"Dear {{employee_name}},\n\nWe are pleased to..."}
            />
            <span className="text-xs text-gray-500">
              Use placeholders such as {"{{employee_name}}"}, {"{{designation}}"} and {"{{joining_date}}"}.
            </span>
          </label>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateForm("is_active", e.target.checked)}
                className="rounded"
              />
              Active Template
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => updateForm("is_default", e.target.checked)}
                className="rounded"
              />
              Default Template
            </label>
          </div>

          <div className="space-y-4 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">Dynamic Fields</h3>
                <p className="text-xs text-gray-500">
                  Define the fields that will be filled while generating a letter.
                </p>
              </div>
              <button
                type="button"
                onClick={addField}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                + Add Field
              </button>
            </div>

            {form.fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-5 text-center text-sm text-gray-500">
                No dynamic fields added yet.
              </div>
            )}

            {form.fields.map((field, index) => (
              <div
                key={index}
                className="space-y-3 rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Field {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <label className="space-y-1 text-xs">
                    <span className="font-medium text-gray-600">Field Key *</span>
                    <input
                      required
                      value={field.field_key}
                      onChange={(e) => updateField(index, "field_key", e.target.value)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                      placeholder="employee_name"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="font-medium text-gray-600">Field Label *</span>
                    <input
                      required
                      value={field.field_label}
                      onChange={(e) => updateField(index, "field_label", e.target.value)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                      placeholder="Employee Name"
                    />
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="font-medium text-gray-600">Field Type *</span>
                    <select
                      value={field.field_type}
                      onChange={(e) => updateField(index, "field_type", e.target.value)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="date">Date</option>
                      <option value="number">Number</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="font-medium text-gray-600">Source *</span>
                    <select
                      value={field.source}
                      onChange={(e) => updateField(index, "source", e.target.value)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                    >
                      <option value="employee">Employee</option>
                      <option value="system">System</option>
                      <option value="company">Company</option>
                      <option value="manual">Manual</option>
                    </select>
                  </label>

                  <label className="space-y-1 text-xs">
                    <span className="font-medium text-gray-600">Default Value</span>
                    <input
                      value={field.default_value}
                      onChange={(e) => updateField(index, "default_value", e.target.value)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                      placeholder="Optional"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-4 pt-5 text-xs">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={field.is_required}
                        onChange={(e) => updateField(index, "is_required", e.target.checked)}
                      />
                      Required
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={field.is_active}
                        onChange={(e) => updateField(index, "is_active", e.target.checked)}
                      />
                      Active
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Template"
                  : "Create Template"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Existing Templates</h2>
          <p className="mt-1 text-xs text-gray-500">
            {templates.length} template(s) found
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No templates found. Create your first letter template.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Template</th>
                  <th className="px-5 py-3">Code</th>
                  <th className="px-5 py-3">Letter Type</th>
                  <th className="px-5 py-3">Version</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Fields</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">
                        {template.name}
                      </div>
                      {template.is_default && (
                        <span className="mt-1 inline-block text-xs text-blue-600">
                          Default
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{template.code}</td>
                    <td className="px-5 py-4 text-gray-600">{template.letter_type}</td>
                    <td className="px-5 py-4 text-gray-600">v{template.version}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        template.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {template.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {template.fields?.length || 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(template.id)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
