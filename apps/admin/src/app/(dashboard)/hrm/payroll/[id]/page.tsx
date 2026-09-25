"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  approvePayroll,
  getPayrollRun,
  payPayroll,
  type PayrollRun,
  type PayrollRunItem,
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

function ItemRow({
  item,
  deduction = false,
}: {
  item: PayrollRunItem;
  deduction?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {item.component_name}
        </p>

        <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
          <span>{item.component_code}</span>
          <span>•</span>
          <span className="capitalize">
            {item.calculation_type}
          </span>

          {item.is_statutory && (
            <>
              <span>•</span>
              <span>Statutory</span>
            </>
          )}

          {item.is_variable && (
            <>
              <span>•</span>
              <span>Variable</span>
            </>
          )}
        </div>
      </div>

      <span
        className={`shrink-0 text-sm font-bold ${
          deduction ? "text-red-600" : "text-slate-800"
        }`}
      >
        {deduction ? "-" : ""}
        {money(item.calculated_amount)}
      </span>
    </div>
  );
}

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [payroll, setPayroll] = useState<PayrollRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const loadPayroll = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await getPayrollRun(id);

      if (response.success) {
        setPayroll(response.data);
        setPaymentReference(response.data.payment_reference || "");
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

  useEffect(() => {
    loadPayroll();
  }, [id]);

  const earnings = useMemo(
    () =>
      (payroll?.items || []).filter(
        (item) => item.type === "earning" && !item.is_reimbursement
      ),
    [payroll]
  );

  const deductions = useMemo(
    () =>
      (payroll?.items || []).filter(
        (item) => item.type === "deduction"
      ),
    [payroll]
  );

  const reimbursements = useMemo(
    () =>
      (payroll?.items || []).filter(
        (item) => item.is_reimbursement || item.type === "reimbursement"
      ),
    [payroll]
  );

  const handleApprove = async () => {
    if (!payroll) return;

    try {
      setActionLoading(true);
      setActionError("");

      const response = await approvePayroll(payroll.id);

      if (!response.success) {
        setActionError(
          response.message || "Unable to approve payroll."
        );
        return;
      }

      setPayroll(response.data);
    } catch (err: any) {
      console.error("Failed to approve payroll:", err);

      setActionError(
        err?.response?.data?.message ||
          "Unable to approve payroll."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handlePay = async () => {
    if (!payroll) return;

    if (!paymentReference.trim()) {
      setActionError("Payment reference is required.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      const response = await payPayroll(
        payroll.id,
        paymentReference.trim()
      );

      if (!response.success) {
        setActionError(
          response.message || "Unable to mark payroll as paid."
        );
        return;
      }

      setPayroll(response.data);
      setShowPaymentForm(false);
    } catch (err: any) {
      console.error("Failed to mark payroll as paid:", err);

      setActionError(
        err?.response?.data?.message ||
          "Unable to mark payroll as paid."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-sm font-medium text-slate-500 shadow-sm">
            Loading payroll...
          </div>
        </div>
      </div>
    );
  }

  if (error || !payroll) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/hrm/payroll")}
            className="mb-5 text-sm font-semibold text-[#087f78] hover:underline"
          >
            ← Back to Payroll
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error || "Payroll run not found."}
          </div>
        </div>
      </div>
    );
  }

  const employeeName =
    payroll.employeeProfile?.user?.name ||
    `Employee #${payroll.employee_profile_id}`;

  const employeeEmail =
    payroll.employeeProfile?.user?.email || "";

  const employeeCode =
    payroll.employeeProfile?.employee_code ||
    `ID ${payroll.employee_profile_id}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/hrm/payroll")}
            className="mb-4 text-sm font-semibold text-[#087f78] hover:underline"
          >
            ← Back to Payroll
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#087f78]">
                HR Management / Payroll
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  Payroll Details
                </h1>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                    payroll.status
                  )}`}
                >
                  {payroll.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {months[payroll.payroll_month - 1]}{" "}
                {payroll.payroll_year} • Payroll #{payroll.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {payroll.status === "calculated" && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoading ? "Approving..." : "Approve Payroll"}
                </button>
              )}

              {payroll.status === "approved" && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setActionError("");
                    setShowPaymentForm(true);
                  }}
                  className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {actionError}
          </div>
        )}

        {/* Payment form */}
        {showPaymentForm && payroll.status === "approved" && (
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-bold text-slate-900">
                Payment Confirmation
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the transaction or payment reference before marking this payroll as paid.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. NEFT-2026-00125"
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              />

              <button
                type="button"
                disabled={actionLoading}
                onClick={handlePay}
                className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? "Processing..." : "Confirm Payment"}
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setShowPaymentForm(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Employee + period */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Employee
            </p>

            <div className="mt-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f7f5] text-lg font-bold text-[#087f78]">
                {employeeName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900">
                  {employeeName}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {employeeCode}
                </p>

                {employeeEmail && (
                  <p className="mt-1 text-sm text-slate-500">
                    {employeeEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Payroll Period
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Period</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {months[payroll.payroll_month - 1]}{" "}
                  {payroll.payroll_year}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Payroll ID</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  #{payroll.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Start Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatDate(payroll.period_start)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">End Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {formatDate(payroll.period_end)}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Summary */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Gross Pay
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {money(payroll.gross_pay)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total earnings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Deductions
            </p>
            <p className="mt-2 text-2xl font-bold text-red-600">
              {money(payroll.total_deductions)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total deductions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Net Payable
            </p>
            <p className="mt-2 text-2xl font-bold text-[#087f78]">
              {money(payroll.net_payable)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Final payout
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Attendance
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {Number(payroll.present_days || 0).toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Present days
            </p>
          </div>

        </div>

        {/* Salary breakdown */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">

          {/* Earnings */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">
                Earnings
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Salary and other earning components
              </p>
            </div>

            {earnings.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No earning components.
              </div>
            ) : (
              earnings.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))
            )}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
              <span className="text-sm font-bold text-slate-700">
                Gross Pay
              </span>
              <span className="text-base font-bold text-slate-900">
                {money(payroll.gross_pay)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">
                Deductions
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Employee deductions and statutory deductions
              </p>
            </div>

            {deductions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No deduction components.
              </div>
            ) : (
              deductions.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  deduction
                />
              ))
            )}

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4">
              <span className="text-sm font-bold text-slate-700">
                Total Deductions
              </span>
              <span className="text-base font-bold text-red-600">
                {money(payroll.total_deductions)}
              </span>
            </div>
          </div>

        </div>

        {/* Reimbursements */}
        {reimbursements.length > 0 && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">
                Reimbursements
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Employee reimbursement components
              </p>
            </div>

            {reimbursements.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Payroll calculation details */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-900">
              Payroll Calculation
            </h2>
          </div>

          <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Basic Salary</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {money(payroll.basic_salary)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Fixed Earnings</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {money(payroll.fixed_earnings)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Variable Earnings</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {money(payroll.variable_earnings)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5">
              <p className="text-xs text-slate-400">Performance Incentive</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {money(payroll.performance_incentive)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Loss Deduction</p>
              <p className="mt-1 text-sm font-bold text-red-600">
                {money(payroll.loss_deduction)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Attendance Deduction</p>
              <p className="mt-1 text-sm font-bold text-red-600">
                {money(payroll.attendance_deduction)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5 lg:border-r">
              <p className="text-xs text-slate-400">Statutory Deduction</p>
              <p className="mt-1 text-sm font-bold text-red-600">
                {money(payroll.statutory_deduction)}
              </p>
            </div>

            <div className="border-b border-slate-100 p-5">
              <p className="text-xs text-slate-400">Other Deduction</p>
              <p className="mt-1 text-sm font-bold text-red-600">
                {money(payroll.other_deduction)}
              </p>
            </div>

            <div className="p-5 lg:border-r">
              <p className="text-xs text-slate-400">Working Days</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {Number(payroll.working_days || 0).toFixed(2)}
              </p>
            </div>

            <div className="p-5 lg:border-r">
              <p className="text-xs text-slate-400">Present Days</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {Number(payroll.present_days || 0).toFixed(2)}
              </p>
            </div>

            <div className="p-5 lg:border-r">
              <p className="text-xs text-slate-400">Leave Days</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {Number(payroll.leave_days || 0).toFixed(2)}
              </p>
            </div>

            <div className="p-5">
              <p className="text-xs text-slate-400">LOP Days</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {Number(payroll.lop_days || 0).toFixed(2)}
              </p>
            </div>

          </div>
        </div>

        {/* Payment / approval information */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Approval
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-400">
                  Approved At
                </span>
                <span className="font-semibold text-slate-700">
                  {formatDate(payroll.approved_at)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-400">
                  Approved By
                </span>
                <span className="font-semibold text-slate-700">
                  {payroll.approver?.name || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Payment
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-400">
                  Paid At
                </span>
                <span className="font-semibold text-slate-700">
                  {formatDate(payroll.paid_at)}
                </span>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-400">
                  Payment Reference
                </span>
                <span className="break-all text-right font-semibold text-slate-700">
                  {payroll.payment_reference || "—"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Final total */}
        <div className="mb-8 rounded-2xl bg-[#087f78] p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">
                Final Net Payable
              </p>
              <p className="mt-1 text-3xl font-bold">
                {money(payroll.net_payable)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-white/70">
                Gross Pay
              </p>
              <p className="text-sm font-bold">
                {money(payroll.gross_pay)}
              </p>

              <p className="mt-2 text-xs text-white/70">
                Total Deductions
              </p>
              <p className="text-sm font-bold">
                {money(payroll.total_deductions)}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}