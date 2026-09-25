"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deletePerformanceRule,
  getPerformanceRules,
  togglePerformanceRuleStatus,
} from "@/lib/api/payroll/performanceRuleApi";

import type {
  PerformanceRule,
} from "@/types/payroll/performanceRule";

function money(value: string | number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function percentage(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return `${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}%`;
}

function incentiveLabel(rule: PerformanceRule) {
  if (!rule.incentive_type) {
    return "—";
  }

  if (rule.incentive_type === "fixed") {
    return `${money(rule.incentive_value)}`;
  }

  if (rule.incentive_type === "percentage") {
    return `${rule.incentive_value ?? 0}%`;
  }

  return "Slab";
}

function deductionLabel(rule: PerformanceRule) {
  if (!rule.deduction_type) {
    return "—";
  }

  if (rule.deduction_type === "fixed") {
    return `${money(rule.deduction_value)}`;
  }

  if (rule.deduction_type === "percentage") {
    return `${rule.deduction_value ?? 0}%`;
  }

  return "Slab";
}

function metricClass(metric: string) {
  switch (metric.toLowerCase()) {
    case "sales":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";

    case "collection":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";

    case "revenue":
      return "bg-purple-50 text-purple-700 ring-1 ring-purple-100";

    case "leads":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";

    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

export default function PerformanceRulesPage() {
  const router = useRouter();

  const [rules, setRules] = useState<PerformanceRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [metricType, setMetricType] = useState("");
  const [periodType, setPeriodType] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPerformanceRules({
        page: 1,
        per_page: 100,
        search: search.trim() || undefined,
        metric_type: metricType || undefined,
        period_type: periodType || undefined,
        is_active: activeOnly ? true : undefined,
      });

      if (response.success) {
        setRules(response.data?.data || []);
      } else {
        setError(
          response.message || "Unable to load performance rules."
        );
      }
    } catch (err: any) {
      console.error(
        "Failed to load performance rules:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load performance rules."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, [metricType, periodType, activeOnly]);

  const handleSearch = () => {
    loadRules();
  };

  const handleDelete = async (rule: PerformanceRule) => {
    const confirmed = window.confirm(
      `Delete performance rule "${rule.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deletePerformanceRule(rule.id);

      await loadRules();
    } catch (err: any) {
      console.error(
        "Failed to delete performance rule:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete performance rule."
      );
    }
  };

  const handleToggleStatus = async (rule: PerformanceRule) => {
    try {
      setError("");

      await togglePerformanceRuleStatus(rule.id);

      await loadRules();
    } catch (err: any) {
      console.error(
        "Failed to update performance rule status:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update performance rule status."
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
              Performance Rules
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employee targets, incentives and performance deductions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/hrm/payroll/performance-rules/create"
              )
            }
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Add Rule
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
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search rule name or code..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Metric
              </label>

              <select
                value={metricType}
                onChange={(event) =>
                  setMetricType(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Metrics</option>
                <option value="sales">Sales</option>
                <option value="collection">Collection</option>
                <option value="revenue">Revenue</option>
                <option value="leads">Leads</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Period
              </label>

              <select
                value={periodType}
                onChange={(event) =>
                  setPeriodType(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Periods</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
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
              Performance Rules
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {loading
                ? "Loading rules..."
                : `${rules.length} rule${
                    rules.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-sm font-medium text-slate-400">
                Loading performance rules...
              </div>
            </div>
          ) : rules.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7f5] text-xl text-[#087f78]">
                %
              </div>

              <h3 className="font-bold text-slate-800">
                No performance rules found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Create your first employee performance rule.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/hrm/payroll/performance-rules/create"
                  )
                }
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                + Add Rule
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Rule
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Metric
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Target
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Achievement
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Incentive
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Deduction
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Period
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
                  {rules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {rule.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {rule.code}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {rule.employee_profile?.user?.name ||
                            `Employee #${rule.employee_profile_id}`}
                        </p>

                        {rule.employee_profile?.employee_code && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {rule.employee_profile.employee_code}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${metricClass(
                            rule.metric_type
                          )}`}
                        >
                          {rule.metric_type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <p className="text-sm font-semibold text-slate-700">
                          {money(rule.target_value)}
                        </p>

                        {(rule.minimum_target !== null ||
                          rule.maximum_target !== null) && (
                          <p className="mt-0.5 text-xs text-slate-400">
                            {money(rule.minimum_target)} –{" "}
                            {money(rule.maximum_target)}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {percentage(
                            rule.minimum_achievement_percentage
                          )}{" "}
                          –{" "}
                          {percentage(
                            rule.maximum_achievement_percentage
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-emerald-700">
                          {incentiveLabel(rule)}
                        </p>

                        <p className="mt-0.5 text-xs capitalize text-slate-400">
                          {rule.incentive_type || "Not configured"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-red-600">
                          {deductionLabel(rule)}
                        </p>

                        <p className="mt-0.5 text-xs capitalize text-slate-400">
                          {rule.deduction_type || "Not configured"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-medium capitalize text-slate-700">
                          {rule.period_type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            rule.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {rule.is_active
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
                                `/hrm/payroll/performance-rules/${rule.id}/edit`
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(rule)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            {rule.is_active
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(rule)
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
