"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteEmployeeSalaryStructure,
  getEmployeeSalaryStructures,
  setCurrentEmployeeSalaryStructure,
  type EmployeeSalaryStructure,
} from "@/lib/api/payroll/employeeSalaryStructureApi";

import { getEmployees } from "@/lib/api/employees/employeeApi";
import type { Employee } from "@/types/employee/employee";

function money(value: string | number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(
  status: EmployeeSalaryStructure["status"]
) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";

    case "inactive":
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  }
}

export default function SalaryStructuresPage() {
  const router = useRouter();

  const [structures, setStructures] = useState<
    EmployeeSalaryStructure[]
  >([]);

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(
    null
  );

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [structureResponse, employeeResponse] =
        await Promise.all([
          getEmployeeSalaryStructures({
            employee_profile_id: employeeId
              ? Number(employeeId)
              : undefined,
            status: status || undefined,
            per_page: 100,
          }),

          getEmployees({
            per_page: 100,
            status: "active",
          }),
        ]);

      setStructures(structureResponse.data.data || []);
      setEmployees(employeeResponse.data.data || []);
    } catch (err) {
      console.error(
        "Failed to load salary structures:",
        err
      );

      setError(
        "Unable to load salary structures. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [employeeId, status]);

  async function handleSetCurrent(
    structure: EmployeeSalaryStructure
  ) {
    try {
      setActionLoading(structure.id);
      setError("");

      await setCurrentEmployeeSalaryStructure(structure.id);

      await loadData();
    } catch (err) {
      console.error(
        "Failed to set current salary structure:",
        err
      );

      setError(
        "Unable to make this salary structure current."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(
    structure: EmployeeSalaryStructure
  ) {
    const employeeName =
      structure.employeeProfile?.user?.name ||
      structure.employeeProfile?.employee_code ||
      "this employee";

    const confirmed = window.confirm(
      `Delete salary structure "${structure.structure_name}" for ${employeeName}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(structure.id);
      setError("");

      await deleteEmployeeSalaryStructure(structure.id);

      await loadData();
    } catch (err) {
      console.error(
        "Failed to delete salary structure:",
        err
      );

      setError(
        "Unable to delete this salary structure."
      );
    } finally {
      setActionLoading(null);
    }
  }

  const filteredStructures = structures.filter((structure) => {
    if (!search.trim()) return true;

    const term = search.toLowerCase();

    const employeeName =
      structure.employeeProfile?.user?.name || "";

    const employeeCode =
      structure.employeeProfile?.employee_code || "";

    return (
      structure.structure_name
        .toLowerCase()
        .includes(term) ||
      employeeName.toLowerCase().includes(term) ||
      employeeCode.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Salary Structures
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employee salary structures and payroll
              configurations.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/salary-structures/create"
              )
            }
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            + Create Salary Structure
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </label>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Employee, code or structure..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Employee
              </label>

              <select
                value={employeeId}
                onChange={(event) =>
                  setEmployeeId(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="">All Employees</option>

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
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Employee Salary Structures
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {filteredStructures.length} structure
                  {filteredStructures.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-slate-500">
              Loading salary structures...
            </div>
          ) : filteredStructures.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="font-medium text-slate-700">
                No salary structures found.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create a salary structure for an employee to
                enable payroll generation.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">
                      Employee
                    </th>

                    <th className="px-5 py-3">
                      Structure
                    </th>

                    <th className="px-5 py-3 text-right">
                      Basic
                    </th>

                    <th className="px-5 py-3 text-right">
                      Gross
                    </th>

                    <th className="px-5 py-3 text-right">
                      Monthly CTC
                    </th>

                    <th className="px-5 py-3">
                      Effective From
                    </th>

                    <th className="px-5 py-3">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStructures.map((structure) => {
                    const employeeName =
                      structure.employeeProfile?.user?.name ||
                      "Unknown Employee";

                    const employeeCode =
                      structure.employeeProfile
                        ?.employee_code || "—";

                    const busy =
                      actionLoading === structure.id;

                    return (
                      <tr
                        key={structure.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">
                            {employeeName}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            {employeeCode}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-800">
                            {structure.structure_name}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            {structure.pay_frequency} ·{" "}
                            {structure.currency}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-slate-700">
                          {money(
                            structure.basic_salary
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm text-slate-700">
                          {money(
                            structure.gross_salary
                          )}
                        </td>

                        <td className="px-5 py-4 text-right text-sm font-semibold text-slate-800">
                          {money(
                            structure.monthly_ctc
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                          {formatDate(
                            structure.effective_from
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                                structure.status
                              )}`}
                            >
                              {structure.status}
                            </span>

                            {structure.is_current && (
                              <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                                Current
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/hrm/payroll/salary-structures/${structure.id}`
                                )
                              }
                              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/hrm/payroll/salary-structures/${structure.id}/edit`
                                )
                              }
                              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>

                            {!structure.is_current && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  handleSetCurrent(
                                    structure
                                  )
                                }
                                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {busy
                                  ? "..."
                                  : "Set Current"}
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                handleDelete(
                                  structure
                                )
                              }
                              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
