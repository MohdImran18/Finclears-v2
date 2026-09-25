"use client";

import type { EmployeePayload } from "@/types/employee/employee";

interface EmployeePersonalFormProps {
  form: Partial<EmployeePayload>;
  setForm: React.Dispatch<React.SetStateAction<Partial<EmployeePayload>>>;
}

export default function EmployeePersonalForm({
  form,
  setForm,
}: EmployeePersonalFormProps) {
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
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add personal contact information and residential address.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={form.date_of_birth ?? ""}
            onChange={(e) => update("date_of_birth", e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Gender
          </label>
          <select
            value={form.gender ?? ""}
            onChange={(e) => update("gender", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#087f78]"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Personal Email
          </label>
          <input
            type="email"
            value={form.personal_email ?? ""}
            onChange={(e) => update("personal_email", e.target.value)}
            placeholder="personal@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Personal Phone
          </label>
          <input
            value={form.personal_phone ?? ""}
            onChange={(e) => update("personal_phone", e.target.value)}
            placeholder="Personal phone"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Address
          </label>
          <textarea
            rows={3}
            value={form.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Complete residential address"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            City
          </label>
          <input
            value={form.city ?? ""}
            onChange={(e) => update("city", e.target.value)}
            placeholder="City"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            State
          </label>
          <input
            value={form.state ?? ""}
            onChange={(e) => update("state", e.target.value)}
            placeholder="State"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Pincode
          </label>
          <input
            value={form.pincode ?? ""}
            onChange={(e) => update("pincode", e.target.value)}
            placeholder="Pincode"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>
      </div>
    </div>
  );
}
