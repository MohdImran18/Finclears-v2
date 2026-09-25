"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createEmployeeSalaryStructure,
  type EmployeeSalaryStructurePayload,
} from "@/lib/api/payroll/employeeSalaryStructureApi";

import { getEmployees } from "@/lib/api/employees/employeeApi";
import { getSalaryComponents } from "@/lib/api/payroll/salaryComponentApi";

import type { Employee } from "@/types/employee/employee";
import type { SalaryComponent } from "@/types/payroll/salaryComponent";

type FormItem = {
  salary_component_id: number;
  calculation_type: string;
  calculation_basis: string;
  amount: string;
  percentage: string;
  is_variable: boolean;
  is_taxable: boolean;
  is_statutory: boolean;
  is_reimbursement: boolean;
  is_enabled: boolean;
  display_order: number;
};

function numberValue(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function CreateSalaryStructurePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [components, setComponents] = useState<SalaryComponent[]>([]);

  const [employeeProfileId, setEmployeeProfileId] = useState("");
  const [structureName, setStructureName] = useState(
    "Monthly Salary"
  );

  const [salaryType, setSalaryType] = useState("monthly");
  const [payFrequency, setPayFrequency] = useState("monthly");
  const [currency, setCurrency] = useState("INR");

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [basicSalary, setBasicSalary] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [monthlyCtc, setMonthlyCtc] = useState("");
  const [annualCtc, setAnnualCtc] = useState("");

  const [monthlyVariableTarget, setMonthlyVariableTarget] =
    useState("");

  const [annualVariableTarget, setAnnualVariableTarget] =
    useState("");

  const [status, setStatus] = useState<
    "draft" | "active" | "inactive"
  >("active");

  const [isCurrent, setIsCurrent] = useState(true);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<FormItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [employeeResponse, componentResponse] =
          await Promise.all([
            getEmployees({
              per_page: 100,
              status: "active",
            }),

            getSalaryComponents({
              per_page: 100,
              is_active: true,
            }),
          ]);

        setEmployees(employeeResponse.data.data || []);
        setComponents(componentResponse.data.data || []);
      } catch (err) {
        console.error(
          "Failed to load salary structure form data:",
          err
        );

        setError(
          "Unable to load employees or salary components."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const selectedEmployee = useMemo(
    () =>
      employees.find(
        (employee) =>
          employee.id === Number(employeeProfileId)
      ),
    [employees, employeeProfileId]
  );

  function addComponent(component: SalaryComponent) {
    if (
      items.some(
        (item) =>
          item.salary_component_id === component.id
      )
    ) {
      return;
    }

    setItems((current) => [
      ...current,
      {
        salary_component_id: component.id,
        calculation_type:
          component.calculation_type || "fixed",
        calculation_basis:
          component.calculation_basis || "",
        amount:
          component.default_value != null
            ? String(component.default_value)
            : "",
        percentage:
          component.default_percentage != null
            ? String(component.default_percentage)
            : "",
        is_variable: component.is_variable,
        is_taxable: component.is_taxable,
        is_statutory: component.is_statutory,
        is_reimbursement: component.is_reimbursement,
        is_enabled: true,
        display_order: current.length + 1,
      },
    ]);
  }

  function removeComponent(componentId: number) {
    setItems((current) =>
      current.filter(
        (item) =>
          item.salary_component_id !== componentId
      )
    );
  }

  function updateItem(
    componentId: number,
    field: keyof FormItem,
    value: string | boolean | number
  ) {
    setItems((current) =>
      current.map((item) =>
        item.salary_component_id === componentId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!employeeProfileId) {
      setError("Please select an employee.");
      return;
    }

    if (!effectiveFrom) {
      setError("Please select an effective-from date.");
      return;
    }

    if (!structureName.trim()) {
      setError("Please enter a structure name.");
      return;
    }

    try {
      setSaving(true);

      const payload: EmployeeSalaryStructurePayload = {
        employee_profile_id: Number(employeeProfileId),

        structure_name: structureName.trim(),
        salary_type: salaryType,
        pay_frequency: payFrequency,
        currency,

        effective_from: effectiveFrom,
        effective_to: effectiveTo || null,

        basic_salary: numberValue(basicSalary),
        gross_salary: numberValue(grossSalary),
        monthly_ctc: numberValue(monthlyCtc),
        annual_ctc: numberValue(annualCtc),

        monthly_variable_target:
          monthlyVariableTarget
            ? numberValue(monthlyVariableTarget)
            : null,

        annual_variable_target:
          annualVariableTarget
            ? numberValue(annualVariableTarget)
            : null,

        status,
        is_current: isCurrent,

        notes: notes.trim() || null,

        items: items.map((item) => ({
          salary_component_id:
            item.salary_component_id,

          calculation_type:
            item.calculation_type,

          calculation_basis:
            item.calculation_basis || null,

          amount: item.amount
            ? numberValue(item.amount)
            : null,

          percentage: item.percentage
            ? numberValue(item.percentage)
            : null,

          is_variable: item.is_variable,
          is_taxable: item.is_taxable,
          is_statutory: item.is_statutory,
          is_reimbursement: item.is_reimbursement,
          is_enabled: item.is_enabled,

          display_order: item.display_order,
        })),
      };

      const response =
        await createEmployeeSalaryStructure(payload);

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to create salary structure."
        );
      }

      router.push(
        "/hrm/payroll/salary-structures"
      );
    } catch (err: any) {
      console.error(
        "Failed to create salary structure:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create salary structure."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
          Loading salary structure form...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/salary-structures"
              )
            }
            className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            ← Back to Salary Structures
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            Create Salary Structure
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure an employee's salary structure for
            payroll.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Employee & Structure
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employee *
                </label>

                <select
                  value={employeeProfileId}
                  onChange={(event) =>
                    setEmployeeProfileId(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">
                    Select employee
                  </option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.user?.name ||
                        employee.employee_code}{" "}
                      — {employee.employee_code}
                    </option>
                  ))}
                </select>

                {selectedEmployee && (
                  <p className="mt-2 text-xs text-slate-400">
                    Employee code:{" "}
                    {selectedEmployee.employee_code}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Structure Name *
                </label>

                <input
                  value={structureName}
                  onChange={(event) =>
                    setStructureName(
                      event.target.value
                    )
                  }
                  required
                  placeholder="Monthly Salary - 2026"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Salary Type
                </label>

                <select
                  value={salaryType}
                  onChange={(event) =>
                    setSalaryType(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="monthly">
                    Monthly
                  </option>
                  <option value="annual">
                    Annual
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Pay Frequency
                </label>

                <select
                  value={payFrequency}
                  onChange={(event) =>
                    setPayFrequency(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="monthly">
                    Monthly
                  </option>
                  <option value="weekly">
                    Weekly
                  </option>
                  <option value="biweekly">
                    Biweekly
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Effective From *
                </label>

                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(event) =>
                    setEffectiveFrom(
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Effective To
                </label>

                <input
                  type="date"
                  value={effectiveTo}
                  onChange={(event) =>
                    setEffectiveTo(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Salary Summary
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Basic Salary",
                  basicSalary,
                  setBasicSalary,
                ],
                [
                  "Gross Salary",
                  grossSalary,
                  setGrossSalary,
                ],
                [
                  "Monthly CTC",
                  monthlyCtc,
                  setMonthlyCtc,
                ],
                [
                  "Annual CTC",
                  annualCtc,
                  setAnnualCtc,
                ],
              ].map(([label, value, setter]) => (
                <div key={label as string}>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label as string}
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={value as string}
                    onChange={(event) =>
                      (
                        setter as React.Dispatch<
                          React.SetStateAction<string>
                        >
                      )(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Monthly Variable Target
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={monthlyVariableTarget}
                  onChange={(event) =>
                    setMonthlyVariableTarget(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Annual Variable Target
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={annualVariableTarget}
                  onChange={(event) =>
                    setAnnualVariableTarget(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Salary Components
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add the components that belong to this
                  employee's salary structure.
                </p>
              </div>

              <select
                value=""
                onChange={(event) => {
                  const componentId = Number(
                    event.target.value
                  );

                  const component =
                    components.find(
                      (item) =>
                        item.id === componentId
                    );

                  if (component) {
                    addComponent(component);
                  }
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">
                  + Add component
                </option>

                {components
                  .filter(
                    (component) =>
                      !items.some(
                        (item) =>
                          item.salary_component_id ===
                          component.id
                      )
                  )
                  .map((component) => (
                    <option
                      key={component.id}
                      value={component.id}
                    >
                      {component.name} (
                      {component.code})
                    </option>
                  ))}
              </select>
            </div>

            <div className="mt-5 space-y-4">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500">
                  No salary components added yet.
                </div>
              ) : (
                items.map((item) => {
                  const component =
                    components.find(
                      (entry) =>
                        entry.id ===
                        item.salary_component_id
                    );

                  if (!component) return null;

                  return (
                    <div
                      key={item.salary_component_id}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {component.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {component.code} ·{" "}
                            {component.type}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeComponent(
                              item.salary_component_id
                            )
                          }
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Calculation Type
                          </label>

                          <select
                            value={
                              item.calculation_type
                            }
                            onChange={(event) =>
                              updateItem(
                                item.salary_component_id,
                                "calculation_type",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                          >
                            <option value="fixed">
                              Fixed
                            </option>
                            <option value="percentage">
                              Percentage
                            </option>
                            <option value="formula">
                              Formula
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Amount
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.amount}
                            onChange={(event) =>
                              updateItem(
                                item.salary_component_id,
                                "amount",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Percentage
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.percentage}
                            onChange={(event) =>
                              updateItem(
                                item.salary_component_id,
                                "percentage",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-600">
                        {[
                          [
                            "Variable",
                            "is_variable",
                          ],
                          [
                            "Taxable",
                            "is_taxable",
                          ],
                          [
                            "Statutory",
                            "is_statutory",
                          ],
                          [
                            "Reimbursement",
                            "is_reimbursement",
                          ],
                          [
                            "Enabled",
                            "is_enabled",
                          ],
                        ].map(([label, field]) => (
                          <label
                            key={field}
                            className="inline-flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                item[
                                  field as keyof FormItem
                                ] as boolean
                              }
                              onChange={(event) =>
                                updateItem(
                                  item.salary_component_id,
                                  field as keyof FormItem,
                                  event.target.checked
                                )
                              }
                            />

                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Status & Notes
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "draft"
                        | "active"
                        | "inactive"
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="active">
                    Active
                  </option>
                  <option value="draft">
                    Draft
                  </option>
                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="flex items-center pt-7">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(event) =>
                      setIsCurrent(
                        event.target.checked
                      )
                    }
                  />

                  Make this the current salary structure
                </label>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={4}
                placeholder="Optional notes..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </section>

          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/hrm/payroll/salary-structures"
                )
              }
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Creating..."
                : "Create Salary Structure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
