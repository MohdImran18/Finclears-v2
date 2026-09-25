"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getSalaryComponent,
  updateSalaryComponent,
} from "@/lib/api/payroll/salaryComponentApi";

import type {
  SalaryComponent,
  SalaryComponentType,
  SalaryCalculationType,
} from "@/types/payroll/salaryComponent";

export default function EditSalaryComponentPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [component, setComponent] = useState<SalaryComponent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] =
    useState<SalaryComponentType>("earning");

  const [calculationType, setCalculationType] =
    useState<SalaryCalculationType>("fixed");
  const [calculationBasis, setCalculationBasis] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultPercentage, setDefaultPercentage] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [maximumAmount, setMaximumAmount] = useState("");

  const [isVariable, setIsVariable] = useState(false);
  const [isTaxable, setIsTaxable] = useState(false);
  const [isStatutory, setIsStatutory] = useState(false);
  const [isReimbursement, setIsReimbursement] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSalaryComponent(id);

        if (!response.success) {
          setError(
            response.message || "Unable to load salary component."
          );
          return;
        }

        const data = response.data.salary_component;

        setComponent(data);

        setName(data.name || "");
        setCode(data.code || "");
        setDescription(data.description || "");
        setType(data.type);

        setCalculationType(data.calculation_type || "");
        setCalculationBasis(data.calculation_basis || "");

        setDefaultValue(
          data.default_value !== null &&
            data.default_value !== undefined
            ? String(data.default_value)
            : ""
        );

        setDefaultPercentage(
          data.default_percentage !== null &&
            data.default_percentage !== undefined
            ? String(data.default_percentage)
            : ""
        );

        setMinimumAmount(
          data.minimum_amount !== null &&
            data.minimum_amount !== undefined
            ? String(data.minimum_amount)
            : ""
        );

        setMaximumAmount(
          data.maximum_amount !== null &&
            data.maximum_amount !== undefined
            ? String(data.maximum_amount)
            : ""
        );

        setIsVariable(Boolean(data.is_variable));
        setIsTaxable(Boolean(data.is_taxable));
        setIsStatutory(Boolean(data.is_statutory));
        setIsReimbursement(Boolean(data.is_reimbursement));
        setIsActive(Boolean(data.is_active));
      } catch (err: any) {
        console.error(
          "Failed to load salary component:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load salary component."
        );
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [id]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!name.trim()) {
        setError("Component name is required.");
        return;
      }

      if (!code.trim()) {
        setError("Component code is required.");
        return;
      }

      if (!calculationType.trim()) {
        setError("Calculation type is required.");
        return;
      }

      await updateSalaryComponent(id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim() || null,
        type,
        calculation_type: calculationType,
        calculation_basis:
          calculationBasis.trim() || null,
        default_value:
          defaultValue.trim() === ""
            ? null
            : Number(defaultValue),
        default_percentage:
          defaultPercentage.trim() === ""
            ? null
            : Number(defaultPercentage),
        minimum_amount:
          minimumAmount.trim() === ""
            ? null
            : Number(minimumAmount),
        maximum_amount:
          maximumAmount.trim() === ""
            ? null
            : Number(maximumAmount),
        is_variable: isVariable,
        is_taxable: isTaxable,
        is_statutory: isStatutory,
        is_reimbursement: isReimbursement,
        is_active: isActive,
      });

      router.push("/hrm/payroll/salary-components");
      router.refresh();
    } catch (err: any) {
      console.error(
        "Failed to update salary component:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update salary component."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Loading salary component...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              {error || "Salary component not found."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/hrm/payroll/salary-components"
                )
              }
              className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white"
            >
              Back to Salary Components
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/salary-components"
              )
            }
            className="mb-4 text-sm font-semibold text-[#087f78] hover:underline"
          >
            ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Ãƒâ€šÃ‚Â Back to Salary Components
          </button>

          <p className="text-sm font-medium text-[#087f78]">
            HR Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Edit Salary Component
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the payroll calculation rule and component settings.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Component Name *
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                  placeholder="e.g. Basic Salary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Code *
                </label>

                <input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.toUpperCase())
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-[#087f78]"
                  placeholder="e.g. BASIC"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Type *
                </label>

                <select
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value as SalaryComponentType
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                >
                  <option value="earning">
                    Earning
                  </option>
                  <option value="deduction">
                    Deduction
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Calculation Type *
                </label>

                <input
                  value={calculationType}
                  onChange={(e) =>
                    setCalculationType(
                      e.target.value as SalaryCalculationType
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                  placeholder="e.g. fixed / percentage"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={3}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                  placeholder="Describe this salary component..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Calculation Settings
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Calculation Basis
                </label>

                <input
                  value={calculationBasis}
                  onChange={(e) =>
                    setCalculationBasis(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                  placeholder="e.g. basic_salary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Default Value
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={defaultValue}
                  onChange={(e) =>
                    setDefaultValue(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Default Percentage
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={defaultPercentage}
                  onChange={(e) =>
                    setDefaultPercentage(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Minimum Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minimumAmount}
                  onChange={(e) =>
                    setMinimumAmount(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Maximum Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maximumAmount}
                  onChange={(e) =>
                    setMaximumAmount(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
                />
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Component Rules
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              {[
                ["is_variable", "Variable Component", isVariable, setIsVariable],
                ["is_taxable", "Taxable", isTaxable, setIsTaxable],
                ["is_statutory", "Statutory", isStatutory, setIsStatutory],
                ["is_reimbursement", "Reimbursement", isReimbursement, setIsReimbursement],
                ["is_active", "Active", isActive, setIsActive],
              ].map(([key, label, checked, setter]) => (
                <label
                  key={String(key)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(checked)}
                    onChange={(e) =>
                      (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#087f78]"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {String(label)}
                  </span>
                </label>
              ))}

            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/hrm/payroll/salary-components"
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
