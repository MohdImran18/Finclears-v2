"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getEmployees,
  deleteEmployee,
} from "@/lib/api/employees/employeeApi";

import type { Employee } from "@/types/employee/employee";
import {
  getDepartments,
  getDesignations,
  type DepartmentOption,
  type DesignationOption,
} from "@/lib/api/hrm/hrmApi";

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [designationId, setDesignationId] = useState("");

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [designations, setDesignations] = useState<DesignationOption[]>([]);

  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEmployees({
        search: search || undefined,
        status: status || undefined,
        department_id: departmentId
          ? Number(departmentId)
          : undefined,
        designation_id: designationId
          ? Number(designationId)
          : undefined,
        per_page: 100,
      });

      if (response.success) {
        setEmployees(response.data.data || []);
      } else {
        setError(response.message || "Unable to load employees.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadDepartments() {
      try {
        setLoadingDepartments(true);

        const response = await getDepartments();

        if (mounted) {
          setDepartments(response.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load departments:", err);
      } finally {
        if (mounted) {
          setLoadingDepartments(false);
        }
      }
    }

    loadDepartments();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadDesignations() {
      if (!departmentId) {
        setDesignations([]);
        setDesignationId("");
        return;
      }

      try {
        setLoadingDesignations(true);

        const response = await getDesignations(
          Number(departmentId)
        );

        if (mounted) {
          setDesignations(response.data ?? []);
        }
      } catch (err) {
        console.error("Failed to load designations:", err);

        if (mounted) {
          setDesignations([]);
        }
      } finally {
        if (mounted) {
          setLoadingDesignations(false);
        }
      }
    }

    loadDesignations();

    return () => {
      mounted = false;
    };
  }, [departmentId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, status, departmentId, designationId]);

  const handleDelete = async (employee: Employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.user?.name || "this employee"}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(employee.id);
      setError("");

      await deleteEmployee(employee.id);
      await loadEmployees();
    } catch (err: any) {
      console.error("Failed to delete employee:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete employee."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#087f78]">
              HR Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Employees
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employee profiles, employment details and HR information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/crm/employees/create")}
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Create Employee
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px_auto]">

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or employee code..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Department
              </label>

              <select
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setDesignationId("");
                }}
                disabled={loadingDepartments}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78] disabled:bg-slate-50"
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..."
                    : "All departments"}
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name}
                    {department.code
                      ? ` (${department.code})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Designation
              </label>

              <select
                value={designationId}
                onChange={(e) =>
                  setDesignationId(e.target.value)
                }
                disabled={
                  !departmentId ||
                  loadingDesignations
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78] disabled:bg-slate-50"
              >
                <option value="">
                  {!departmentId
                    ? "Select department first"
                    : loadingDesignations
                      ? "Loading designations..."
                      : "All designations"}
                </option>

                {designations.map((designation) => (
                  <option
                    key={designation.id}
                    value={designation.id}
                  >
                    {designation.name}
                    {designation.code
                      ? ` (${designation.code})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setDepartmentId("");
                  setDesignationId("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-slate-900">
                Employee Directory
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {loading
                  ? "Loading employees..."
                  : `${employees.length} employee${employees.length === 1 ? "" : "s"} found`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-sm font-medium text-slate-400">
                Loading employees...
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7f5] text-xl text-[#087f78]">
                👤
              </div>

              <h3 className="font-bold text-slate-800">
                No employees found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Create your first employee or change the search filters.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/crm/employees/create")
                }
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                + Create Employee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Employee
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Employee Code
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Department
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Designation
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8f7f5] text-sm font-bold text-[#087f78]">
                            {(employee.user?.name || "E")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {employee.user?.name || "—"}
                            </p>

                            <p className="text-xs text-slate-400">
                              {employee.user?.email || "—"}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          {employee.employee_code}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {employee.department?.name || "—"}
                        </p>

                        {employee.department?.code && (
                          <p className="text-xs text-slate-400">
                            {employee.department.code}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {employee.designation?.name || "—"}
                        </p>

                        {employee.designation?.code && (
                          <p className="text-xs text-slate-400">
                            {employee.designation.code}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                            employee.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {employee.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/crm/employees/${employee.id}`
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/crm/employees/${employee.id}/edit`
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(employee)
                            }
                            disabled={deletingId === employee.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === employee.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
