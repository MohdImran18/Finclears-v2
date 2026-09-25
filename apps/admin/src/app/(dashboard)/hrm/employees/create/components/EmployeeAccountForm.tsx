"use client";

import type { EmployeePayload } from "@/types/employee/employee";

interface EmployeeAccountFormProps {
  form: Partial<EmployeePayload>;
  setForm: React.Dispatch<React.SetStateAction<Partial<EmployeePayload>>>;
}

export default function EmployeeAccountForm({
  form,
  setForm,
}: EmployeeAccountFormProps) {
  const update = (
    field: keyof EmployeePayload,
    value: string | number | null
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Account & Login
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Create the employee account and configure their login method.
        </p>
      </div>

      {/* Basic Account Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-slate-800">
            Basic Information
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Enter the employee's primary account details.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* Employee Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employee Name *
            </label>

            <input
              value={form.name ?? ""}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Enter employee name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
            />
          </div>

          {/* Employee Code */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Employee Code *
            </label>

            <input
              value={form.employee_code ?? ""}
              onChange={(e) => update("employee_code", e.target.value)}
              placeholder="EMP001"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email *
            </label>

            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
              placeholder="employee@finclears.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              WhatsApp Number *
            </label>

            <input
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
            />
          </div>

        </div>
      </div>

      {/* Login Method */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">

        <div className="mb-5">
          <h3 className="text-sm font-bold text-slate-800">
            Login Method
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Choose how this employee will sign in.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Password Login */}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="login_method"
              value="password"
              checked={form.login_method !== "whatsapp_otp"}
              onChange={() => update("login_method", "password")}
              className="peer sr-only"
            />

            <div className="rounded-xl border-2 border-slate-200 p-4 transition peer-checked:border-[#087f78] peer-checked:bg-[#f0fbfa]">

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f5] text-[#087f78]">
                  🔐
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Email & Password
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Employee signs in using email and password.
                  </p>
                </div>
              </div>

            </div>
          </label>

          {/* WhatsApp OTP */}
          <label className="cursor-pointer">
            <input
              type="radio"
              name="login_method"
              value="whatsapp_otp"
              checked={form.login_method === "whatsapp_otp"}
              onChange={() => update("login_method", "whatsapp_otp")}
              className="peer sr-only"
            />

            <div className="rounded-xl border-2 border-slate-200 p-4 transition peer-checked:border-[#087f78] peer-checked:bg-[#f0fbfa]">

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f7f5] text-[#087f78]">
                  💬
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    WhatsApp OTP
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Employee signs in using a WhatsApp verification code.
                  </p>
                </div>
              </div>

            </div>
          </label>

        </div>
      </div>

      {/* Password */}
      {form.login_method !== "whatsapp_otp" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">

          <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-800">
              Password
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Set the employee's initial password.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password *
              </label>

              <input
                type="password"
                value={form.password ?? ""}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Confirm Password *
              </label>

              <input
                type="password"
                value={form.password_confirmation ?? ""}
                onChange={(e) =>
                  update("password_confirmation", e.target.value)
                }
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
              />
            </div>

          </div>
        </div>
      )}

      {/* OTP Information */}
      {form.login_method === "whatsapp_otp" && (
        <div className="rounded-2xl border border-[#bde8e3] bg-[#f0fbfa] p-5">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#087f78]">
              ✓
            </div>

            <div>
              <p className="text-sm font-bold text-[#087f78]">
                WhatsApp OTP Login Enabled
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                The employee will use their registered WhatsApp number
                to receive a one-time verification code during login.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Security */}
      <div className="rounded-xl border border-[#bde8e3] bg-[#f0fbfa] p-4">

        <p className="text-sm font-semibold text-[#087f78]">
          Secure onboarding
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          Employee login information is protected and available only
          to authorized users.
        </p>

      </div>

    </div>
  );
}
