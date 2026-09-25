"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteSalaryComponent,
  getSalaryComponents,
  toggleSalaryComponentStatus,
} from "@/lib/api/payroll/salaryComponentApi";

import type {
  SalaryComponent,
  SalaryComponentType,
} from "@/types/payroll/salaryComponent";

function money(value: string | number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function typeClass(type: SalaryComponentType) {
  return type === "earning"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
    : "bg-red-50 text-red-700 ring-1 ring-red-100";
}

export default function SalaryComponentsPage() {
  const router = useRouter();

  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [type, setType] = useState<
    "" | SalaryComponentType
  >("");
  const [activeOnly, setActiveOnly] = useState(false);

  const loadComponents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSalaryComponents({
        page: 1,
        per_page: 100,
        search: search.trim() || undefined,
        type: type || undefined,
        is_active: activeOnly ? true : undefined,
      });

      if (response.success) {
        setComponents(response.data?.data || []);
      } else {
        setError(
          response.message || "Unable to load salary components."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load salary components:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load salary components."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponents();
  }, [type, activeOnly]);

  const handleSearch = () => {
    loadComponents();
  };

  const handleDelete = async (
    component: SalaryComponent
  ) => {
    const confirmed = window.confirm(
      `Delete salary component "${component.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSalaryComponent(component.id);

      await loadComponents();
    } catch (err: any) {
      console.error(
        "Failed to delete salary component:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete salary component."
      );
    }
  };

  const handleToggleStatus = async (
    component: SalaryComponent
  ) => {
    try {
      setError("");

      await toggleSalaryComponentStatus(component.id);

      await loadComponents();
    } catch (err: any) {
      console.error(
        "Failed to update salary component status:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update salary component status."
      );
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
              Salary Components
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage earnings, deductions and payroll salary rules.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/salary-components/create"
              )
            }
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Add Component
          </button>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search name or code..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Type
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as
                      | ""
                      | SalaryComponentType
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Types</option>
                <option value="earning">Earning</option>
                <option value="deduction">Deduction</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                value={activeOnly ? "active" : ""}
                onChange={(event) =>
                  setActiveOnly(
                    event.target.value === "active"
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Status</option>
                <option value="active">Active Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Search
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

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Salary Components
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {loading
                ? "Loading components..."
                : `${components.length} component${
                    components.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-sm font-medium text-slate-400">
                Loading salary components...
              </div>
            </div>
          ) : components.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7f5] text-xl text-[#087f78]">
                ₹
              </div>

              <h3 className="font-bold text-slate-800">
                No salary components found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Create your first earning or deduction component.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/hrm/payroll/salary-components/create"
                  )
                }
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                + Add Component
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Component
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Type
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Calculation
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Default
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Flags
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {components.map((component) => (
                    <tr
                      key={component.id}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {component.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {component.code}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${typeClass(
                            component.type
                          )}`}
                        >
                          {component.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium capitalize text-slate-700">
                          {component.calculation_type.replace(
                            "_",
                            " "
                          )}
                        </p>

                        {component.calculation_basis && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {component.calculation_basis}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {component.default_percentage !==
                        null &&
                        component.default_percentage !==
                        undefined ? (
                          <span className="text-sm font-semibold text-slate-700">
                            {component.default_percentage}%
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">
                            {money(component.default_value)}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {component.is_taxable && (
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
                              Taxable
                            </span>
                          )}

                          {component.is_statutory && (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
                              Statutory
                            </span>
                          )}

                          {component.is_variable && (
                            <span className="rounded-full bg-purple-50 px-2 py-1 text-[10px] font-semibold text-purple-700">
                              Variable
                            </span>
                          )}

                          {component.is_reimbursement && (
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                              Reimbursement
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            component.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {component.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/hrm/payroll/salary-components/${component.id}/edit`
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(component)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                          >
                            {component.is_active
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(component)
                            }
                            className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
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
