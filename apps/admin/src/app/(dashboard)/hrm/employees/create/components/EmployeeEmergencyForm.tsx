"use client";

import type { EmployeePayload } from "@/types/employee/employee";

interface EmployeeEmergencyFormProps {
  form: Partial<EmployeePayload>;
  setForm: React.Dispatch<React.SetStateAction<Partial<EmployeePayload>>>;
}

export default function EmployeeEmergencyForm({
  form,
  setForm,
}: EmployeeEmergencyFormProps) {
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
          Emergency Contact
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add a trusted contact who can be reached during an emergency.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Contact Name
          </label>
          <input
            value={form.emergency_contact_name ?? ""}
            onChange={(e) =>
              update("emergency_contact_name", e.target.value)
            }
            placeholder="Emergency contact name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Contact Phone
          </label>
          <input
            value={form.emergency_contact_phone ?? ""}
            onChange={(e) =>
              update("emergency_contact_phone", e.target.value)
            }
            placeholder="Emergency contact phone"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Relationship
          </label>
          <input
            value={form.emergency_contact_relation ?? ""}
            onChange={(e) =>
              update("emergency_contact_relation", e.target.value)
            }
            placeholder="Father / Mother / Spouse / Brother"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#087f78]"
          />
        </div>
      </div>
    </div>
  );
}
