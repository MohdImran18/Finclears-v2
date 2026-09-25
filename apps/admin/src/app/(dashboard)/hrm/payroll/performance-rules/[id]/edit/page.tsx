"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getPerformanceRule,
  updatePerformanceRule,
} from "@/lib/api/payroll/performanceRuleApi";

import type {
  PerformanceRule,
  PerformanceRuleDeductionType,
  PerformanceRuleIncentiveType,
} from "@/types/payroll/performanceRule";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700";

function numberOrNull(value: string): number | null {
  if (value.trim() === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export default function EditPerformanceRulePage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [rule, setRule] = useState<PerformanceRule | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [employeeProfileId, setEmployeeProfileId] =
    useState("");

  const [metricType, setMetricType] = useState("");
  const [periodType, setPeriodType] = useState("");

  const [targetValue, setTargetValue] = useState("");
  const [minimumTarget, setMinimumTarget] = useState("");
  const [maximumTarget, setMaximumTarget] = useState("");

  const [minimumAchievementPercentage, setMinimumAchievementPercentage] =
    useState("");
  const [maximumAchievementPercentage, setMaximumAchievementPercentage] =
    useState("");

  const [incentiveType, setIncentiveType] =
    useState<PerformanceRuleIncentiveType | "">("");

  const [incentiveValue, setIncentiveValue] = useState("");

  const [deductionType, setDeductionType] =
    useState<PerformanceRuleDeductionType | "">("");

  const [deductionValue, setDeductionValue] = useState("");

  const [lossDeductionEnabled, setLossDeductionEnabled] =
    useState(false);
  const [lossDeductionType, setLossDeductionType] =
    useState("");
  const [lossDeductionValue, setLossDeductionValue] =
    useState("");

  const [attendanceDeductionEnabled, setAttendanceDeductionEnabled] =
    useState(false);
  const [attendanceDeductionType, setAttendanceDeductionType] =
    useState("");
  const [attendanceDeductionValue, setAttendanceDeductionValue] =
    useState("");

  const [minimumIncentive, setMinimumIncentive] = useState("");
  const [maximumIncentive, setMaximumIncentive] = useState("");

  const [minimumDeduction, setMinimumDeduction] = useState("");
  const [maximumDeduction, setMaximumDeduction] = useState("");

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRule() {
      try {
        setLoading(true);
        setError("");

        const response = await getPerformanceRule(id);

        if (cancelled) return;

        const data = response.data.performance_rule;

        setRule(data);

        setEmployeeProfileId(String(data.employee_profile_id ?? ""));

        setName(data.name ?? "");
        setCode(data.code ?? "");

        setMetricType(data.metric_type ?? "");
        setPeriodType(data.period_type ?? "");

        setTargetValue(String(data.target_value ?? ""));
        setMinimumTarget(String(data.minimum_target ?? ""));
        setMaximumTarget(String(data.maximum_target ?? ""));

        setMinimumAchievementPercentage(
          String(data.minimum_achievement_percentage ?? "")
        );

        setMaximumAchievementPercentage(
          String(data.maximum_achievement_percentage ?? "")
        );

        setIncentiveType(data.incentive_type ?? "");
        setIncentiveValue(String(data.incentive_value ?? ""));

        setDeductionType(data.deduction_type ?? "");
        setDeductionValue(String(data.deduction_value ?? ""));

        setLossDeductionEnabled(
          Boolean(data.loss_deduction_enabled)
        );

        setLossDeductionType(
          data.loss_deduction_type ?? ""
        );

        setLossDeductionValue(
          String(data.loss_deduction_value ?? "")
        );

        setAttendanceDeductionEnabled(
          Boolean(data.attendance_deduction_enabled)
        );

        setAttendanceDeductionType(
          data.attendance_deduction_type ?? ""
        );

        setAttendanceDeductionValue(
          String(data.attendance_deduction_value ?? "")
        );

        setMinimumIncentive(
          String(data.minimum_incentive ?? "")
        );

        setMaximumIncentive(
          String(data.maximum_incentive ?? "")
        );

        setMinimumDeduction(
          String(data.minimum_deduction ?? "")
        );

        setMaximumDeduction(
          String(data.maximum_deduction ?? "")
        );

        setEffectiveFrom(
          data.effective_from
            ? data.effective_from.substring(0, 10)
            : ""
        );

        setEffectiveTo(
          data.effective_to
            ? data.effective_to.substring(0, 10)
            : ""
        );

        setIsActive(Boolean(data.is_active));
        setNotes(data.notes ?? "");
      } catch (err: unknown) {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Unable to load performance rule.";

        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRule();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Rule name is required.");
      return;
    }

    if (!code.trim()) {
      setError("Rule code is required.");
      return;
    }

    if (!employeeProfileId) {
      setError("Employee profile is required.");
      return;
    }

    if (!metricType.trim()) {
      setError("Metric type is required.");
      return;
    }

    if (!periodType.trim()) {
      setError("Period type is required.");
      return;
    }

    try {
      setSaving(true);

      await updatePerformanceRule(id, {
        employee_profile_id: Number(employeeProfileId),

        name: name.trim(),
        code: code.trim(),

        metric_type: metricType.trim(),
        period_type: periodType.trim(),

        target_value: numberOrNull(targetValue),
        minimum_target: numberOrNull(minimumTarget),
        maximum_target: numberOrNull(maximumTarget),

        minimum_achievement_percentage:
          numberOrNull(minimumAchievementPercentage),

        maximum_achievement_percentage:
          numberOrNull(maximumAchievementPercentage),

        incentive_type:
          incentiveType === "" ? null : incentiveType,

        incentive_value:
          numberOrNull(incentiveValue),

        deduction_type:
          deductionType === "" ? null : deductionType,

        deduction_value:
          numberOrNull(deductionValue),

        loss_deduction_enabled: lossDeductionEnabled,

        loss_deduction_type:
          lossDeductionType.trim() || null,

        loss_deduction_value:
          numberOrNull(lossDeductionValue),

        attendance_deduction_enabled:
          attendanceDeductionEnabled,

        attendance_deduction_type:
          attendanceDeductionType.trim() || null,

        attendance_deduction_value:
          numberOrNull(attendanceDeductionValue),

        minimum_incentive:
          numberOrNull(minimumIncentive),

        maximum_incentive:
          numberOrNull(maximumIncentive),

        minimum_deduction:
          numberOrNull(minimumDeduction),

        maximum_deduction:
          numberOrNull(maximumDeduction),

        effective_from:
          effectiveFrom || null,

        effective_to:
          effectiveTo || null,

        is_active: isActive,

        notes: notes.trim() || null,
      });

      setSuccess("Performance rule updated successfully.");

      setTimeout(() => {
        router.push("/hrm/payroll/performance-rules");
      }, 700);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update performance rule.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading performance rule...
        </div>
      </div>
    );
  }

  if (!rule) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Performance rule not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Edit Performance Rule
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update incentive, deduction and performance settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/hrm/payroll/performance-rules")
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Employee Profile ID
                </label>

                <input
                  type="number"
                  value={employeeProfileId}
                  onChange={(e) =>
                    setEmployeeProfileId(e.target.value)
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Rule Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Rule Code
                </label>

                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Metric Type
                </label>

                <input
                  value={metricType}
                  onChange={(e) =>
                    setMetricType(e.target.value)
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Period Type
                </label>

                <input
                  value={periodType}
                  onChange={(e) =>
                    setPeriodType(e.target.value)
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) =>
                      setIsActive(e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Active Rule
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Targets & Achievement
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className={labelClass}>
                  Target Value
                </label>

                <input
                  type="number"
                  step="any"
                  value={targetValue}
                  onChange={(e) =>
                    setTargetValue(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Minimum Target
                </label>

                <input
                  type="number"
                  step="any"
                  value={minimumTarget}
                  onChange={(e) =>
                    setMinimumTarget(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Target
                </label>

                <input
                  type="number"
                  step="any"
                  value={maximumTarget}
                  onChange={(e) =>
                    setMaximumTarget(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Minimum Achievement %
                </label>

                <input
                  type="number"
                  step="any"
                  value={minimumAchievementPercentage}
                  onChange={(e) =>
                    setMinimumAchievementPercentage(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Achievement %
                </label>

                <input
                  type="number"
                  step="any"
                  value={maximumAchievementPercentage}
                  onChange={(e) =>
                    setMaximumAchievementPercentage(
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Incentive
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Incentive Type
                </label>

                <select
                  value={incentiveType}
                  onChange={(e) =>
                    setIncentiveType(
                      e.target.value as
                        | PerformanceRuleIncentiveType
                        | ""
                    )
                  }
                  className={inputClass}
                >
                  <option value="">None</option>
                  <option value="fixed">Fixed</option>
                  <option value="percentage">
                    Percentage
                  </option>
                  <option value="slab">Slab</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Incentive Value
                </label>

                <input
                  type="number"
                  step="any"
                  value={incentiveValue}
                  onChange={(e) =>
                    setIncentiveValue(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Minimum Incentive
                </label>

                <input
                  type="number"
                  step="any"
                  value={minimumIncentive}
                  onChange={(e) =>
                    setMinimumIncentive(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Incentive
                </label>

                <input
                  type="number"
                  step="any"
                  value={maximumIncentive}
                  onChange={(e) =>
                    setMaximumIncentive(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Performance Deduction
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Deduction Type
                </label>

                <select
                  value={deductionType}
                  onChange={(e) =>
                    setDeductionType(
                      e.target.value as
                        | PerformanceRuleDeductionType
                        | ""
                    )
                  }
                  className={inputClass}
                >
                  <option value="">None</option>
                  <option value="fixed">Fixed</option>
                  <option value="percentage">
                    Percentage
                  </option>
                  <option value="slab">Slab</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Deduction Value
                </label>

                <input
                  type="number"
                  step="any"
                  value={deductionValue}
                  onChange={(e) =>
                    setDeductionValue(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Minimum Deduction
                </label>

                <input
                  type="number"
                  step="any"
                  value={minimumDeduction}
                  onChange={(e) =>
                    setMinimumDeduction(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Maximum Deduction
                </label>

                <input
                  type="number"
                  step="any"
                  value={maximumDeduction}
                  onChange={(e) =>
                    setMaximumDeduction(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Loss Deduction
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={lossDeductionEnabled}
                    onChange={(e) =>
                      setLossDeductionEnabled(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Enable Loss Deduction
                  </span>
                </label>
              </div>

              <div>
                <label className={labelClass}>
                  Deduction Type
                </label>

                <input
                  value={lossDeductionType}
                  onChange={(e) =>
                    setLossDeductionType(e.target.value)
                  }
                  className={inputClass}
                  disabled={!lossDeductionEnabled}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Deduction Value
                </label>

                <input
                  type="number"
                  step="any"
                  value={lossDeductionValue}
                  onChange={(e) =>
                    setLossDeductionValue(e.target.value)
                  }
                  className={inputClass}
                  disabled={!lossDeductionEnabled}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Attendance Deduction
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={attendanceDeductionEnabled}
                    onChange={(e) =>
                      setAttendanceDeductionEnabled(
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Enable Attendance Deduction
                  </span>
                </label>
              </div>

              <div>
                <label className={labelClass}>
                  Deduction Type
                </label>

                <input
                  value={attendanceDeductionType}
                  onChange={(e) =>
                    setAttendanceDeductionType(
                      e.target.value
                    )
                  }
                  className={inputClass}
                  disabled={!attendanceDeductionEnabled}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Deduction Value
                </label>

                <input
                  type="number"
                  step="any"
                  value={attendanceDeductionValue}
                  onChange={(e) =>
                    setAttendanceDeductionValue(
                      e.target.value
                    )
                  }
                  className={inputClass}
                  disabled={!attendanceDeductionEnabled}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Effective Period
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Effective From
                </label>

                <input
                  type="date"
                  value={effectiveFrom}
                  onChange={(e) =>
                    setEffectiveFrom(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Effective To
                </label>

                <input
                  type="date"
                  value={effectiveTo}
                  onChange={(e) =>
                    setEffectiveTo(e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className={labelClass}>
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Add any notes about this performance rule..."
            />
          </section>

          <div className="flex justify-end gap-3 pb-8">
            <button
              type="button"
              onClick={() =>
                router.push("/hrm/payroll/performance-rules")
              }
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
