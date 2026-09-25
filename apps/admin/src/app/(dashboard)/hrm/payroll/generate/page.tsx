"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  generatePayroll,
  getPayrollRuns,
  type PayrollRun,
} from "@/lib/api/payroll/payrollApi";

import { getEmployees } from "@/lib/api/employees/employeeApi";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Employee = {
  id: number;
  employee_code?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
};

export default function GeneratePayrollPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [existingPayroll, setExistingPayroll] =
    useState<PayrollRun | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setError("");

        const response: any = await getEmployees();

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

  useEffect(() => {
    const checkExistingPayroll = async () => {
      if (!employeeId) {
        setExistingPayroll(null);
        return;
      }

      try {
        const response: any = await getPayrollRuns({
          employee_profile_id: Number(employeeId),
          year,
          month,
        });

        console.log("PAYROLL EXISTING CHECK:", {
          employeeId,
          year,
          month,
          response,
          responseData: response?.data,
          paginatedData: response?.data?.data,
        });

        const runs =
          response?.data?.data ??
          response?.data ??
          [];

        console.log("PAYROLL EXISTING RUNS:", runs);

        if (Array.isArray(runs) && runs.length > 0) {
          setExistingPayroll(runs[0]);
        } else {
          setExistingPayroll(null);
        }
      } catch {
        setExistingPayroll(null);
      }
    };

    checkExistingPayroll();
  }, [employeeId, year, month]);

  const employeeLabel = (employee: Employee) => {
    const fullName =
      employee.name ||
      [employee.first_name, employee.last_name]
        .filter(Boolean)
        .join(" ");

    if (employee.employee_code && fullName) {
      return `${employee.employee_code} — ${fullName}`;
    }

    return (
      fullName ||
      employee.employee_code ||
      employee.email ||
      `Employee #${employee.id}`
    );
  };

  const existingPayrollIsLocked = Boolean(existingPayroll);

  const existingPayrollStatusLabel =
    existingPayroll?.status === "paid"
      ? "Payroll already paid"
      : existingPayroll?.status === "approved"
        ? "Payroll already approved"
        : existingPayroll?.status === "calculated"
          ? "Payroll already calculated"
          : existingPayroll?.status === "draft"
            ? "Draft payroll already exists"
            : "Payroll already exists";
  const handleGenerate = async () => {
    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }

    if (existingPayrollIsLocked) {
      setError(
        existingPayroll?.status === "paid"
          ? "Payroll for this employee and period has already been paid."
          : existingPayroll?.status === "approved"
            ? "Payroll for this employee and period has already been approved."
            : "Payroll for this employee and period already exists."
      );
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setSuccess("");

      const response = await generatePayroll({
        employee_profile_id: Number(employeeId),
        year,
        month,
      });

      if (!response.success) {
        setError(
          response.message ||
            "Unable to generate payroll."
        );
        return;
      }

      setSuccess("Payroll generated successfully.");

      setTimeout(() => {
        router.push(`/hrm/payroll/${response.data.id}`);
      }, 700);
    } catch (err: any) {
      console.error("Payroll generation failed:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to generate payroll."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/hrm/payroll")}
            className="mb-4 text-sm font-semibold text-slate-500 hover:text-[#087f78]"
          >
            ← Back to Payroll
          </button>

          <p className="text-sm font-medium text-[#087f78]">
            HR Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Generate Payroll
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Generate monthly payroll for an employee using their configured salary structure.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Employee
              </label>

              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={loadingEmployees || generating}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-50"
              >
                <option value="">
                  {loadingEmployees
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employeeLabel(employee)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payroll Year
              </label>

              <select
                value={year}
                onChange={(e) =>
                  setYear(Number(e.target.value))
                }
                disabled={generating}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              >
                {[2025, 2026, 2027].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Payroll Month
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(Number(e.target.value))
                }
                disabled={generating}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              >
                {months.map((name, index) => (
                  <option
                    key={name}
                    value={index + 1}
                  >
                    {name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {existingPayroll && (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Payroll already exists
                  </p>

                  <p className="mt-1 text-xs text-amber-700">
                    {months[existingPayroll.payroll_month - 1]}{" "}
                    {existingPayroll.payroll_year} · Status:{" "}
                    {existingPayroll.status}
                  </p>

                  <p className="mt-1 text-xs text-amber-700">
                    Net Payable: ₹
                    {Number(
                      existingPayroll.net_payable || 0
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/hrm/payroll/${existingPayroll.id}`
                    )
                  }
                  className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100"
                >
                  View Existing
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push("/hrm/payroll")
              }
              disabled={generating}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                generating ||
                loadingEmployees ||
                !employeeId ||
                existingPayrollIsLocked
              }
              className="rounded-xl bg-[#087f78] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? "Generating..."
                : "Generate Payroll"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}