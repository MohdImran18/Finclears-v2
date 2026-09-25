"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createSalaryComponent } from "@/lib/api/payroll/salaryComponentApi";
import type {
  SalaryCalculationType,
  SalaryComponentPayload,
  SalaryComponentType,
} from "@/types/payroll/salaryComponent";

export default function CreateSalaryComponentPage() {
  const router = useRouter();

  const [form, setForm] = useState<SalaryComponentPayload>({
    name: "",
    code: "",
    description: "",
    type: "earning",
    calculation_type: "fixed",
    calculation_basis: "",
    default_value: null,
    default_percentage: null,
    minimum_amount: null,
    maximum_amount: null,
    is_variable: false,
    is_taxable: true,
    is_statutory: false,
    is_reimbursement: false,
    is_active: true,
    display_order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof SalaryComponentPayload>(
    key: K,
    value: SalaryComponentPayload[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Component name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Component code is required.");
      return;
    }

    try {
      setSaving(true);

      const payload: SalaryComponentPayload = {
        ...form,
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description?.trim() || null,
        calculation_basis:
          form.calculation_basis?.trim() || null,
        default_value:
          form.default_value === null ||
          form.default_value == null
            ? null
            : Number(form.default_value),
        default_percentage:
          form.default_percentage === null ||
          form.default_percentage == null
            ? null
            : Number(form.default_percentage),
        minimum_amount:
          form.minimum_amount === null ||
          form.minimum_amount == null
            ? null
            : Number(form.minimum_amount),
        maximum_amount:
          form.maximum_amount === null ||
          form.maximum_amount == null
            ? null
            : Number(form.maximum_amount),
        display_order: Number(form.display_order || 0),
      };

      await createSalaryComponent(payload);

      setSuccess("Salary component created successfully.");

      setTimeout(() => {
        router.push("/hrm/payroll/salary-components");
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create salary component."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#087f78]">
              HR Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Create Salary Component
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add an earning or deduction component for payroll.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/hrm/payroll/salary-components")
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <Field label="Component Name" required>
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="e.g. Basic Salary"
                  className="input"
                  required
                />
              </Field>

              <Field label="Component Code" required>
                <input
                  value={form.code}
                  onChange={(event) =>
                    updateField("code", event.target.value)
                  }
                  placeholder="e.g. BASIC"
                  className="input uppercase"
                  required
                />
              </Field>

              <Field label="Type" required>
                <select
                  value={form.type}
                  onChange={(event) =>
                    updateField(
                      "type",
                      event.target.value as SalaryComponentType
                    )
                  }
                  className="input"
                >
                  <option value="earning">Earning</option>
                  <option value="deduction">Deduction</option>
                </select>
              </Field>

              <Field label="Calculation Type" required>
                <select
                  value={form.calculation_type}
                  onChange={(event) =>
                    updateField(
                      "calculation_type",
                      event.target.value as SalaryCalculationType
                    )
                  }
                  className="input"
                >
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                  <option value="formula">Formula</option>
                  <option value="rule_based">Rule Based</option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    value={form.description || ""}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe this salary component..."
                    rows={3}
                    className="input"
                  />
                </Field>
              </div>

            </div>
          </section>

          {/* Calculation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Calculation Settings
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <Field label="Calculation Basis">
                <input
                  value={form.calculation_basis || ""}
                  onChange={(event) =>
                    updateField(
                      "calculation_basis",
                      event.target.value
                    )
                  }
                  placeholder="e.g. basic_salary"
                  className="input"
                />
              </Field>

              <Field label="Default Value">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    form.default_value == null
                      ? ""
                      : String(form.default_value)
                  }
                  onChange={(event) =>
                    updateField(
                      "default_value",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

              <Field label="Default Percentage">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={
                    form.default_percentage == null
                      ? ""
                      : String(form.default_percentage)
                  }
                  onChange={(event) =>
                    updateField(
                      "default_percentage",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

              <Field label="Display Order">
                <input
                  type="number"
                  min="0"
                  value={form.display_order ?? 0}
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      Number(event.target.value)
                    )
                  }
                  className="input"
                />
              </Field>

              <Field label="Minimum Amount">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    form.minimum_amount == null
                      ? ""
                      : String(form.minimum_amount)
                  }
                  onChange={(event) =>
                    updateField(
                      "minimum_amount",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

              <Field label="Maximum Amount">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    form.maximum_amount == null
                      ? ""
                      : String(form.maximum_amount)
                  }
                  onChange={(event) =>
                    updateField(
                      "maximum_amount",
                      event.target.value === ""
                        ? null
                        : Number(event.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="input"
                />
              </Field>

            </div>
          </section>

          {/* Flags */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Component Options
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <Checkbox
                label="Variable Component"
                checked={Boolean(form.is_variable)}
                onChange={(checked) =>
                  updateField("is_variable", checked)
                }
              />

              <Checkbox
                label="Taxable"
                checked={Boolean(form.is_taxable)}
                onChange={(checked) =>
                  updateField("is_taxable", checked)
                }
              />

              <Checkbox
                label="Statutory"
                checked={Boolean(form.is_statutory)}
                onChange={(checked) =>
                  updateField("is_statutory", checked)
                }
              />

              <Checkbox
                label="Reimbursement"
                checked={Boolean(form.is_reimbursement)}
                onChange={(checked) =>
                  updateField("is_reimbursement", checked)
                }
              />

              <Checkbox
                label="Active"
                checked={Boolean(form.is_active)}
                onChange={(checked) =>
                  updateField("is_active", checked)
                }
              />

            </div>
          </section>

          {/* Messages */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push("/hrm/payroll/salary-components")
              }
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#087f78] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Component"}
            </button>
          </div>

        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.65rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }

        .input:focus {
          border-color: #087f78;
          box-shadow: 0 0 0 2px rgb(8 127 120 / 0.12);
        }
      `}</style>
    </div>
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
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>
    </label>
  );
}
