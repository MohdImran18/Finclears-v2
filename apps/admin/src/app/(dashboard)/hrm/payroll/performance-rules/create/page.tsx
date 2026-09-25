"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getEmployees } from "@/lib/api/employees/employeeApi";
import {
  createPerformanceRule,
} from "@/lib/api/payroll/performanceRuleApi";

type Employee = {
  id: number;
  employee_code?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

const metricTypes = [
  "sales",
  "collection",
  "revenue",
  "leads",
  "custom",
];

const periodTypes = [
  "monthly",
  "quarterly",
  "yearly",
  "custom",
];

const incentiveTypes = [
  { value: "fixed", label: "Fixed" },
  { value: "percentage", label: "Percentage" },
  { value: "slab", label: "Slab" },
];

const deductionTypes = [
  { value: "fixed", label: "Fixed" },
  { value: "percentage", label: "Percentage" },
  { value: "slab", label: "Slab" },
];

const Field = ({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const selectClass = inputClass;

const checkboxClass =
  "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500";

export default function CreatePerformanceRulePage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const [employeeProfileId, setEmployeeProfileId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [metricType, setMetricType] = useState("sales");
  const [periodType, setPeriodType] = useState("monthly");

  const [targetValue, setTargetValue] = useState("");
  const [minimumTarget, setMinimumTarget] = useState("");
  const [maximumTarget, setMaximumTarget] = useState("");

  const [minimumAchievementPercentage, setMinimumAchievementPercentage] =
    useState("");
  const [maximumAchievementPercentage, setMaximumAchievementPercentage] =
    useState("");

  const [incentiveType, setIncentiveType] = useState<
    "fixed" | "percentage" | "slab"
  >("percentage");
  const [incentiveValue, setIncentiveValue] = useState("");
  const [incentiveSlabs, setIncentiveSlabs] = useState("");

  const [deductionType, setDeductionType] = useState<
    "fixed" | "percentage" | "slab"
  >("percentage");
  const [deductionValue, setDeductionValue] = useState("");
  const [deductionSlabs, setDeductionSlabs] = useState("");

  const [lossDeductionEnabled, setLossDeductionEnabled] = useState(false);
  const [lossDeductionType, setLossDeductionType] = useState("fixed");
  const [lossDeductionValue, setLossDeductionValue] = useState("");

  const [attendanceDeductionEnabled, setAttendanceDeductionEnabled] =
    useState(false);
  const [attendanceDeductionType, setAttendanceDeductionType] =
    useState("fixed");
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setError("");

        const response: any = await getEmployees({
          per_page: 100,
          status: "active",
        });

        const data =
          response?.data?.data ??
          response?.data ??
          [];

        setEmployees(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Failed to load employees:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load employees."
        );
      } finally {
        setLoadingEmployees(false);
      }
    };

    loadEmployees();
  }, []);

  const employeeLabel = (employee: Employee) => {
    const userName =
      employee.user?.name ||
      employee.name ||
      [employee.first_name, employee.last_name]
        .filter(Boolean)
        .join(" ");

    if (employee.employee_code && userName) {
      return `${employee.employee_code} — ${userName}`;
    }

    return (
      userName ||
      employee.employee_code ||
      employee.email ||
      employee.user?.email ||
      `Employee #${employee.id}`
    );
  };

  const parseNumber = (value: string) => {
    if (value.trim() === "") {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  };

  const parseSlabs = (value: string): unknown[] | null => {
    if (!value.trim()) {
      return null;
    }

    try {
      const parsed = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        throw new Error("Slabs must be a JSON array.");
      }

      return parsed;
    } catch {
      throw new Error(
        "Slab configuration must be valid JSON array."
      );
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!employeeProfileId) {
      setError("Please select an employee.");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a rule name.");
      return;
    }

    if (!code.trim()) {
      setError("Please enter a rule code.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        employee_profile_id: Number(employeeProfileId),

        name: name.trim(),
        code: code.trim(),

        metric_type: metricType,
        period_type: periodType,

        target_value: parseNumber(targetValue),
        minimum_target: parseNumber(minimumTarget),
        maximum_target: parseNumber(maximumTarget),

        minimum_achievement_percentage:
          parseNumber(minimumAchievementPercentage),
        maximum_achievement_percentage:
          parseNumber(maximumAchievementPercentage),

        incentive_type: incentiveType,
        incentive_value: parseNumber(incentiveValue),
        incentive_slabs:
          incentiveType === "slab"
            ? parseSlabs(incentiveSlabs)
            : null,

        deduction_type: deductionType,
        deduction_value: parseNumber(deductionValue),
        deduction_slabs:
          deductionType === "slab"
            ? parseSlabs(deductionSlabs)
            : null,

        loss_deduction_enabled: lossDeductionEnabled,
        loss_deduction_type: lossDeductionEnabled
          ? lossDeductionType
          : null,
        loss_deduction_value: lossDeductionEnabled
          ? parseNumber(lossDeductionValue)
          : null,

        attendance_deduction_enabled:
          attendanceDeductionEnabled,
        attendance_deduction_type:
          attendanceDeductionEnabled
            ? attendanceDeductionType
            : null,
        attendance_deduction_value:
          attendanceDeductionEnabled
            ? parseNumber(attendanceDeductionValue)
            : null,

        minimum_incentive: parseNumber(minimumIncentive),
        maximum_incentive: parseNumber(maximumIncentive),

        minimum_deduction: parseNumber(minimumDeduction),
        maximum_deduction: parseNumber(maximumDeduction),

        effective_from: effectiveFrom || null,
        effective_to: effectiveTo || null,

        is_active: isActive,
        notes: notes.trim() || null,
      };

      await createPerformanceRule(payload);

      setSuccess("Performance rule created successfully.");

      setTimeout(() => {
        router.push("/hrm/payroll/performance-rules");
      }, 700);
    } catch (err: any) {
      console.error("Failed to create performance rule:", err);

      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Unable to create performance rule."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Performance Rule
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure employee performance targets, incentives and deductions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/hrm/payroll/performance-rules")}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Rules
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Employee" required>
              <select
                value={employeeProfileId}
                onChange={(event) =>
                  setEmployeeProfileId(event.target.value)
                }
                className={selectClass}
                disabled={loadingEmployees}
              >
                <option value="">
                  {loadingEmployees
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employeeLabel(employee)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Rule Name" required>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Monthly Sales Target"
                className={inputClass}
              />
            </Field>

            <Field label="Rule Code" required>
              <input
                type="text"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.toUpperCase())
                }
                placeholder="SALES_TARGET_2026"
                className={inputClass}
              />
            </Field>

            <Field label="Metric Type" required>
              <select
                value={metricType}
                onChange={(event) =>
                  setMetricType(event.target.value)
                }
                className={selectClass}
              >
                {metricTypes.map((metric) => (
                  <option key={metric} value={metric}>
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Period Type" required>
              <select
                value={periodType}
                onChange={(event) =>
                  setPeriodType(event.target.value)
                }
                className={selectClass}
              >
                {periodTypes.map((period) => (
                  <option key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <label className="flex h-[42px] items-center gap-3 rounded-lg border border-gray-300 px-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                  className={checkboxClass}
                />
                <span className="text-sm text-gray-700">
                  Active
                </span>
              </label>
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Target Configuration
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Target Value">
              <input
                type="number"
                min="0"
                step="0.01"
                value={targetValue}
                onChange={(event) =>
                  setTargetValue(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Minimum Target">
              <input
                type="number"
                min="0"
                step="0.01"
                value={minimumTarget}
                onChange={(event) =>
                  setMinimumTarget(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Maximum Target">
              <input
                type="number"
                min="0"
                step="0.01"
                value={maximumTarget}
                onChange={(event) =>
                  setMaximumTarget(event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Achievement Configuration
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Minimum Achievement Percentage">
              <input
                type="number"
                min="0"
                max="1000"
                step="0.01"
                value={minimumAchievementPercentage}
                onChange={(event) =>
                  setMinimumAchievementPercentage(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>

            <Field label="Maximum Achievement Percentage">
              <input
                type="number"
                min="0"
                max="1000"
                step="0.01"
                value={maximumAchievementPercentage}
                onChange={(event) =>
                  setMaximumAchievementPercentage(
                    event.target.value
                  )
                }
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Incentive Configuration
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Incentive Type">
              <select
                value={incentiveType}
                onChange={(event) =>
                  setIncentiveType(
                    event.target.value as
                      | "fixed"
                      | "percentage"
                      | "slab"
                  )
                }
                className={selectClass}
              >
                {incentiveTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Incentive Value">
              <input
                type="number"
                min="0"
                step="0.01"
                value={incentiveValue}
                onChange={(event) =>
                  setIncentiveValue(event.target.value)
                }
                className={inputClass}
                disabled={incentiveType === "slab"}
              />
            </Field>

            {incentiveType === "slab" && (
              <div className="md:col-span-2">
                <Field label="Incentive Slabs JSON">
                  <textarea
                    value={incentiveSlabs}
                    onChange={(event) =>
                      setIncentiveSlabs(event.target.value)
                    }
                    rows={5}
                    placeholder='[{"min":80,"max":99.99,"value":2},{"min":100,"max":149.99,"value":5},{"min":150,"value":7.5}]'
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Deduction Configuration
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Deduction Type">
              <select
                value={deductionType}
                onChange={(event) =>
                  setDeductionType(
                    event.target.value as
                      | "fixed"
                      | "percentage"
                      | "slab"
                  )
                }
                className={selectClass}
              >
                {deductionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Deduction Value">
              <input
                type="number"
                min="0"
                step="0.01"
                value={deductionValue}
                onChange={(event) =>
                  setDeductionValue(event.target.value)
                }
                className={inputClass}
                disabled={deductionType === "slab"}
              />
            </Field>

            {deductionType === "slab" && (
              <div className="md:col-span-2">
                <Field label="Deduction Slabs JSON">
                  <textarea
                    value={deductionSlabs}
                    onChange={(event) =>
                      setDeductionSlabs(event.target.value)
                    }
                    rows={5}
                    placeholder='[{"min":0,"max":79.99,"value":2},{"min":80,"max":99.99,"value":1}]'
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Loss Deduction
          </h2>

          <div className="mt-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={lossDeductionEnabled}
                onChange={(event) =>
                  setLossDeductionEnabled(event.target.checked)
                }
                className={checkboxClass}
              />
              <span className="text-sm font-medium text-gray-700">
                Enable loss deduction
              </span>
            </label>
          </div>

          {lossDeductionEnabled && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Loss Deduction Type">
                <select
                  value={lossDeductionType}
                  onChange={(event) =>
                    setLossDeductionType(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                </select>
              </Field>

              <Field label="Loss Deduction Value">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={lossDeductionValue}
                  onChange={(event) =>
                    setLossDeductionValue(event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Attendance / LOP Deduction
          </h2>

          <div className="mt-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={attendanceDeductionEnabled}
                onChange={(event) =>
                  setAttendanceDeductionEnabled(
                    event.target.checked
                  )
                }
                className={checkboxClass}
              />
              <span className="text-sm font-medium text-gray-700">
                Enable attendance / LOP deduction
              </span>
            </label>
          </div>

          {attendanceDeductionEnabled && (
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Attendance Deduction Type">
                <select
                  value={attendanceDeductionType}
                  onChange={(event) =>
                    setAttendanceDeductionType(event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="fixed">Fixed</option>
                  <option value="percentage">Percentage</option>
                </select>
              </Field>

              <Field label="Attendance Deduction Value">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={attendanceDeductionValue}
                  onChange={(event) =>
                    setAttendanceDeductionValue(
                      event.target.value
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Incentive & Deduction Limits
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Field label="Minimum Incentive">
              <input
                type="number"
                min="0"
                step="0.01"
                value={minimumIncentive}
                onChange={(event) =>
                  setMinimumIncentive(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Maximum Incentive">
              <input
                type="number"
                min="0"
                step="0.01"
                value={maximumIncentive}
                onChange={(event) =>
                  setMaximumIncentive(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Minimum Deduction">
              <input
                type="number"
                min="0"
                step="0.01"
                value={minimumDeduction}
                onChange={(event) =>
                  setMinimumDeduction(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Maximum Deduction">
              <input
                type="number"
                min="0"
                step="0.01"
                value={maximumDeduction}
                onChange={(event) =>
                  setMaximumDeduction(event.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Effective Period & Notes
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Effective From">
              <input
                type="date"
                value={effectiveFrom}
                onChange={(event) =>
                  setEffectiveFrom(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Effective To">
              <input
                type="date"
                value={effectiveTo}
                onChange={(event) =>
                  setEffectiveTo(event.target.value)
                }
                className={inputClass}
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Notes">
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder="Add any additional notes..."
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              router.push("/hrm/payroll/performance-rules")
            }
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loadingEmployees}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Performance Rule"}
          </button>
        </div>
      </form>
    </div>
  );
}
