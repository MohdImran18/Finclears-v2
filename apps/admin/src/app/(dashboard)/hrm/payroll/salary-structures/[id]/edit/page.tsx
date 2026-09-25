"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getEmployeeSalaryStructure,
  updateEmployeeSalaryStructure,
  type EmployeeSalaryStructure,
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

function dateValue(value: string | null | undefined) {
  if (!value) return "";

  return value.length >= 10 ? value.slice(0, 10) : value;
}

export default function EditSalaryStructurePage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const structureId = id || "";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [structure, setStructure] =
    useState<EmployeeSalaryStructure | null>(null);

  const [employeeProfileId, setEmployeeProfileId] = useState("");
  const [structureName, setStructureName] = useState("");

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

  const [isCurrent, setIsCurrent] = useState(false);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<FormItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [
          structureResponse,
          employeeResponse,
          componentResponse,
        ] = await Promise.all([
          getEmployeeSalaryStructure(structureId),
          getEmployees({
            per_page: 100,
            status: "active",
          }),
          getSalaryComponents({
            per_page: 100,
            is_active: true,
          }),
        ]);

        if (!structureResponse.success) {
          throw new Error(
            structureResponse.message ||
              "Unable to load salary structure."
          );
        }

        const currentStructure =
          structureResponse.data.salary_structure;

        setStructure(currentStructure);

        setEmployees(employeeResponse.data.data || []);
        setComponents(componentResponse.data.data || []);

        setEmployeeProfileId(
          String(currentStructure.employee_profile_id)
        );

        setStructureName(currentStructure.structure_name);
        setSalaryType(currentStructure.salary_type);
        setPayFrequency(currentStructure.pay_frequency);
        setCurrency(currentStructure.currency);

        setEffectiveFrom(
          dateValue(currentStructure.effective_from)
        );

        setEffectiveTo(
          dateValue(currentStructure.effective_to)
        );

        setBasicSalary(
          String(currentStructure.basic_salary ?? "")
        );

        setGrossSalary(
          String(currentStructure.gross_salary ?? "")
        );

        setMonthlyCtc(
          String(currentStructure.monthly_ctc ?? "")
        );

        setAnnualCtc(
          String(currentStructure.annual_ctc ?? "")
        );

        setMonthlyVariableTarget(
          currentStructure.monthly_variable_target == null
            ? ""
            : String(currentStructure.monthly_variable_target)
        );

        setAnnualVariableTarget(
          currentStructure.annual_variable_target == null
            ? ""
            : String(currentStructure.annual_variable_target)
        );

        setStatus(currentStructure.status);
        setIsCurrent(Boolean(currentStructure.is_current));
        setNotes(currentStructure.notes || "");

        setItems(
          (currentStructure.items || []).map((item, index) => ({
            salary_component_id: item.salary_component_id,

            calculation_type:
              item.calculation_type || "fixed",

            calculation_basis:
              item.calculation_basis || "",

            amount:
              item.amount == null
                ? ""
                : String(item.amount),

            percentage:
              item.percentage == null
                ? ""
                : String(item.percentage),

            is_variable: Boolean(item.is_variable),
            is_taxable: Boolean(item.is_taxable),
            is_statutory: Boolean(item.is_statutory),
            is_reimbursement: Boolean(
              item.is_reimbursement
            ),
            is_enabled:
              item.is_enabled !== false,

            display_order:
              item.display_order ?? index + 1,
          }))
        );
      } catch (err: any) {
        console.error(
          "Failed to load salary structure:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load salary structure."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

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
        is_reimbursement:
          component.is_reimbursement,

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

    if (!structureId) {
      setError("Salary structure ID is missing.");
      return;
    }

    if (!structureName.trim()) {
      setError("Please enter a structure name.");
      return;
    }

    if (!effectiveFrom) {
      setError(
        "Please select an effective-from date."
      );
      return;
    }

    try {
      setSaving(true);

      const payload: Partial<EmployeeSalaryStructurePayload> = {
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
          is_reimbursement:
            item.is_reimbursement,
          is_enabled: item.is_enabled,

          display_order: item.display_order,
        })),
      };

      const response =
        await updateEmployeeSalaryStructure(
          structureId,
          payload
        );

      if (!response.success) {
        throw new Error(
          response.message ||
            "Unable to update salary structure."
        );
      }

      router.push(
        "/hrm/payroll/salary-structures"
      );
    } catch (err: any) {
      console.error(
        "Failed to update salary structure:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update salary structure."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
          Loading salary structure...
        </div>
      </div>
    );
  }

  if (!structure) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/salary-structures"
              )
            }
            className="mb-5 text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            ← Back to Salary Structures
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || "Salary structure not found."}
          </div>
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
            Edit Salary Structure
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the employee salary structure used
            for payroll.
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
                  Employee
                </label>

                <select
                  value={employeeProfileId}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
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
                    setSalaryType(
                      event.target.value
                    )
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
                  Currency
                </label>

                <input
                  value={currency}
                  onChange={(event) =>
                    setCurrency(
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                />
              </div>

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
                  <option value="draft">
                    Draft
                  </option>
                  <option value="active">
                    Active
                  </option>
                  <option value="inactive">
                    Inactive
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

            <label className="mt-5 flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(event) =>
                  setIsCurrent(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-300"
              />
              Mark this as the current salary structure
            </label>
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
                  Add or remove components belonging to
                  this salary structure.
                </p>
              </div>

              <select
                value=""
                onChange={(event) => {
                  const componentId =
                    Number(event.target.value);

                  const component =
                    components.find(
                      (item) =>
                        item.id === componentId
                    );

                  if (component) {
                    addComponent(component);
                  }
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="">
                  + Add Component
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
                      {component.name} —{" "}
                      {component.code}
                    </option>
                  ))}
              </select>

            </div>

            <div className="mt-5 space-y-4">

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center text-sm text-slate-400">
                  No salary components added.
                </div>
              ) : (
                items.map((item) => {
                  const component =
                    components.find(
                      (entry) =>
                        entry.id ===
                        item.salary_component_id
                    );

                  return (
                    <div
                      key={item.salary_component_id}
                      className="rounded-xl border border-slate-200 p-4"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div>
                          <p className="font-semibold text-slate-900">
                            {component?.name ||
                              `Component #${item.salary_component_id}`}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {component?.code || "—"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeComponent(
                              item.salary_component_id
                            )
                          }
                          className="text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>

                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Calculation Type
                          </label>

                          <select
                            value={item.calculation_type}
                            onChange={(event) =>
                              updateItem(
                                item.salary_component_id,
                                "calculation_type",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
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
                            <option value="rule_based">
                              Rule Based
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-600">
                            Calculation Basis
                          </label>

                          <input
                            value={
                              item.calculation_basis
                            }
                            onChange={(event) =>
                              updateItem(
                                item.salary_component_id,
                                "calculation_basis",
                                event.target.value
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
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

                      <div className="mt-4 flex flex-wrap gap-5">

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
                            className="flex items-center gap-2 text-xs font-medium text-slate-600"
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
                              className="h-4 w-4 rounded border-slate-300"
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

            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              placeholder="Additional notes..."
            />

          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/hrm/payroll/salary-structures"
                )
              }
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#087f78] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : "Update Salary Structure"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
