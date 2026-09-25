"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getPayrollRuns,
  approvePayroll,
  payPayroll,
  type PayrollRun,
} from "@/lib/api/payroll/payrollApi";

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

function money(value: string | number | null | undefined) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function statusClass(status: PayrollRun["status"]) {
  switch (status) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "approved":
      return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
    case "calculated":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

export default function PayrollPage() {
  const router = useRouter();

  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [status, setStatus] = useState("");

  const [payrollToPay, setPayrollToPay] =
    useState<PayrollRun | null>(null);

  const [paymentReference, setPaymentReference] =
    useState("");

  const [paying, setPaying] = useState(false);

  const loadPayroll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPayrollRuns({
        year,
        month,
        status: status || undefined,
      });

      if (response.success) {
        setPayrollRuns(response.data?.data || []);
      } else {
        setError(response.message || "Unable to load payroll.");
      }
    } catch (err: any) {
      console.error("Failed to load payroll:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load payroll."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setError("");

      const response = await approvePayroll(id);

      if (!response.success) {
        setError(response.message || "Unable to approve payroll.");
        return;
      }

      await loadPayroll();
    } catch (err: any) {
      console.error("Payroll approval failed:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to approve payroll."
      );
    }
  };

  const handlePay = (payroll: PayrollRun) => {
    setError("");
    setPaymentReference("");
    setPayrollToPay(payroll);
  };

  const confirmPayment = async () => {
    if (!payrollToPay) {
      return;
    }

    const reference = paymentReference.trim();

    if (!reference) {
      setError("Please enter a payment reference.");
      return;
    }

    try {
      setPaying(true);
      setError("");

      const response = await payPayroll(
        payrollToPay.id,
        reference
      );

      if (!response.success) {
        setError(
          response.message ||
            "Unable to mark payroll as paid."
        );
        return;
      }

      setPayrollToPay(null);
      setPaymentReference("");

      await loadPayroll();
    } catch (err: any) {
      console.error("Payroll payment failed:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to mark payroll as paid."
      );
    } finally {
      setPaying(false);
    }
  };

  const closePaymentModal = () => {
    if (paying) {
      return;
    }

    setPayrollToPay(null);
    setPaymentReference("");
  };
  useEffect(() => {
    loadPayroll();
  }, [year, month, status]);

  const totalGross = payrollRuns.reduce(
    (sum, payroll) => sum + Number(payroll.gross_pay || 0),
    0
  );

  const totalDeductions = payrollRuns.reduce(
    (sum, payroll) => sum + Number(payroll.total_deductions || 0),
    0
  );

  const totalNet = payrollRuns.reduce(
    (sum, payroll) => sum + Number(payroll.net_payable || 0),
    0
  );

  const paidCount = payrollRuns.filter(
    (payroll) => payroll.status === "paid"
  ).length;

  const approvedCount = payrollRuns.filter(
    (payroll) => payroll.status === "approved"
  ).length;

  const calculatedCount = payrollRuns.filter(
    (payroll) => payroll.status === "calculated"
  ).length;

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
              Payroll
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employee payroll, approvals, deductions and payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/hrm/payroll/generate")
            }
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Generate Payroll
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Payroll Runs
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {payrollRuns.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {months[month - 1]} {year}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Gross Payroll
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {money(totalGross)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Before deductions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Deductions
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {money(totalDeductions)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Total deductions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Net Payable
            </p>

            <p className="mt-2 text-2xl font-bold text-[#087f78]">
              {money(totalNet)}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Final employee payout
            </p>
          </div>

        </div>

        {/* Status overview */}
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs text-slate-400">
              Calculated
            </span>
            <span className="ml-2 font-bold text-amber-600">
              {calculatedCount}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs text-slate-400">
              Approved
            </span>
            <span className="ml-2 font-bold text-blue-600">
              {approvedCount}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-xs text-slate-400">
              Paid
            </span>
            <span className="ml-2 font-bold text-emerald-600">
              {paidCount}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[180px_180px_180px_auto]">

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Year
              </label>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                {[2025, 2026, 2027].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Month
              </label>

              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                {months.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
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
                <option value="calculated">Calculated</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setYear(new Date().getFullYear());
                  setMonth(new Date().getMonth() + 1);
                  setStatus("");
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

          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Payroll Runs
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              {loading
                ? "Loading payroll..."
                : `${payrollRuns.length} payroll run${
                    payrollRuns.length === 1 ? "" : "s"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-sm font-medium text-slate-400">
                Loading payroll...
              </div>
            </div>
          ) : payrollRuns.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f7f5] text-xl text-[#087f78]">
                ₹
              </div>

              <h3 className="font-bold text-slate-800">
                No payroll found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-400">
                Generate payroll for an employee to get started.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/hrm/payroll/generate")
                }
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                + Generate Payroll
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Employee
                    </th>

                    <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Period
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Gross
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Deductions
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Net Payable
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
                  {payrollRuns.map((payroll) => (
                    <tr
                      key={payroll.id}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {payroll.employeeProfile?.user?.name ||
                              `Employee #${payroll.employee_profile_id}`}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {payroll.employeeProfile?.employee_code ||
                              `ID ${payroll.employee_profile_id}`}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {months[payroll.payroll_month - 1]}{" "}
                          {payroll.payroll_year}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {payroll.period_start?.slice(0, 10)}
                          {" → "}
                          {payroll.period_end?.slice(0, 10)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-700">
                          {money(payroll.gross_pay)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-semibold text-red-600">
                          {money(payroll.total_deductions)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="text-sm font-bold text-[#087f78]">
                          {money(payroll.net_payable)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusClass(
                            payroll.status
                          )}`}
                        >
                          {payroll.status === "calculated"
                            ? "Calculated"
                            : payroll.status === "approved"
                              ? "Approved"
                              : payroll.status === "paid"
                                ? "Paid"
                                : "Draft"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/hrm/payroll/${payroll.id}`
                              )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            View
                          </button>

                          {payroll.status === "calculated" && (
                            <button
                              type="button"
                              onClick={() => handleApprove(payroll.id)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                            >
                              Approve
                            </button>
                          )}

                          {payroll.status === "approved" && (
                            <button
                              type="button"
                              onClick={() => handlePay(payroll)}
                              className="rounded-lg bg-[#087f78] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#066b65]"
                            >
                              Pay
                            </button>
                          )}
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
