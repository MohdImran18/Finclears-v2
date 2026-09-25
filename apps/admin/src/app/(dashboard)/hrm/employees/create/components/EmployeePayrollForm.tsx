"use client";

import type { EmployeePayload } from "@/types/employee/employee";

interface EmployeePayrollFormProps {
  form: Partial<EmployeePayload>;
  setForm: React.Dispatch<React.SetStateAction<Partial<EmployeePayload>>>;
}

export default function EmployeePayrollForm({
  form,
  setForm,
}: EmployeePayrollFormProps) {
  const update = (field: keyof EmployeePayload, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Identity & Banking
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sensitive employee information required for HR and payroll.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            PAN Number
          </label>
          <input
            value={form.pan_number ?? ""}
            onChange={(e) => update("pan_number", e.target.value)}
            placeholder="ABCDE1234F"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Aadhaar Number
          </label>
          <input
            value={form.aadhaar_number ?? ""}
            onChange={(e) => update("aadhaar_number", e.target.value)}
            placeholder="12 digit Aadhaar number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Account Holder Name
          </label>
          <input
            value={form.account_holder_name ?? ""}
            onChange={(e) =>
              update("account_holder_name", e.target.value)
            }
            placeholder="Name as per bank account"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Bank Name
          </label>
          <input
            value={form.bank_name ?? ""}
            onChange={(e) => update("bank_name", e.target.value)}
            placeholder="Bank name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Bank Account Number
          </label>
          <input
            value={form.bank_account_number ?? ""}
            onChange={(e) =>
              update("bank_account_number", e.target.value)
            }
            placeholder="Account number"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            IFSC Code
          </label>
          <input
            value={form.ifsc_code ?? ""}
            onChange={(e) => update("ifsc_code", e.target.value)}
            placeholder="IFSC0001234"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-[#087f78]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">
          Sensitive information
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Identity and banking information should only be accessible to
          authorized HR and payroll users.
        </p>
      </div>
    </div>
  );
}
