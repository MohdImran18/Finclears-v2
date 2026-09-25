"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createDesignation,
  getDepartments,
  type DepartmentOption,
} from "@/lib/api/hrm/hrmApi";

export default function CreateDesignationPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDepartments() {
      try {
        setLoadingDepartments(true);

        const response = await getDepartments();

        setDepartments(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load departments.");
      } finally {
        setLoadingDepartments(false);
      }
    }

    loadDepartments();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!departmentId) {
      setError("Please select a department.");
      return;
    }

    if (!name.trim()) {
      setError("Designation name is required.");
      return;
    }

    if (!code.trim()) {
      setError("Designation code is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createDesignation({
        department_id: Number(departmentId),
        name: name.trim(),
        code: code.trim(),
        description: description.trim() || null,
        status,
      });

      router.push("/hrm/designations");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.name?.[0] ||
          err?.response?.data?.errors?.code?.[0] ||
          "Unable to create designation."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/hrm/designations")}
            className="mb-4 text-sm font-semibold text-slate-500 hover:text-[#087f78]"
          >
            ← Back to Designations
          </button>

          <p className="text-sm font-medium text-[#087f78]">
            HRM
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Create Designation
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new employee designation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Department <span className="text-red-500">*</span>
              </label>

              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={loadingDepartments || saving}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-50"
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..."
                    : "Select department"}
                </option>

                {departments.map((department) => (
                  <option
                    key={department.id}
                    value={department.id}
                  >
                    {department.name} ({department.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Designation Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Senior Developer"
                disabled={saving}
                maxLength={120}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Designation Code <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SRDEV"
                disabled={saving}
                maxLength={50}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a short description..."
                rows={4}
                disabled={saving}
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-50"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Status
                  </p>

                  <p className="text-xs text-slate-500">
                    Inactive designations won't be available for new assignments.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={status}
                  onClick={() => setStatus((value) => !value)}
                  disabled={saving}
                  className={`relative h-6 w-11 rounded-full transition ${
                    status
                      ? "bg-[#087f78]"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                      status
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>
            </div>

          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => router.push("/hrm/designations")}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingDepartments}
              className="rounded-xl bg-[#087f78] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Designation"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}