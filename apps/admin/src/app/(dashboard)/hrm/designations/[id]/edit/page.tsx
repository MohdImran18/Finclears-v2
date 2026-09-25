"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getDesignation,
  getDepartments,
  updateDesignation,
} from "@/lib/api/hrm/hrmApi";

export default function EditDesignationPage() {
  const router = useRouter();
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const designationId = id ?? "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState<
    {
      id: number;
      name: string;
      code: string;
    }[]
  >([]);

  const [form, setForm] = useState({
    department_id: "",
    name: "",
    code: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [designationResponse, departmentsResponse] =
          await Promise.all([
            getDesignation(designationId),
            getDepartments(),
          ]);

        const designation = designationResponse.data;

        setDepartments(
          departmentsResponse.data.map((department) => ({
            id: department.id,
            name: department.name,
            code: department.code,
          }))
        );

        setForm({
          department_id: String(designation.department_id),
          name: designation.name || "",
          code: designation.code || "",
          description: designation.description || "",
          status: Boolean(designation.status),
        });
      } catch (err: any) {
        console.error("Failed to load designation:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load designation. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleChange(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("Invalid designation ID.");
      return;
    }

    if (!form.department_id) {
      setError("Please select a department.");
      return;
    }

    if (!form.name.trim()) {
      setError("Designation name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("Designation code is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateDesignation(id, {
        department_id: Number(form.department_id),
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
        status: form.status,
      });

      router.push(`/hrm/designations/${id}`);
    } catch (err: any) {
      console.error("Failed to update designation:", err);

      const validationErrors =
        err?.response?.data?.errors;

      if (validationErrors) {
        const firstError = Object.values(validationErrors)
          .flat()
          .find((message) => typeof message === "string");

        setError(
          (firstError as string) ||
            err?.response?.data?.message ||
            "Unable to update designation."
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Unable to update designation. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="h-7 w-56 rounded bg-slate-200" />
              <div className="h-4 w-80 rounded bg-slate-200" />
              <div className="h-11 rounded bg-slate-100" />
              <div className="h-11 rounded bg-slate-100" />
              <div className="h-11 rounded bg-slate-100" />
              <div className="h-28 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push(`/hrm/designations/${id}`)}
            className="mb-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            ← Back to Designation
          </button>

          <div>
            <p className="text-sm font-semibold text-[#087f78]">
              HRM / Designations
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Edit Designation
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update designation information and department assignment.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-base font-bold text-slate-900">
              Designation Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Make the required changes and save the designation.
            </p>
          </div>

          <div className="space-y-6 px-6 py-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="department_id"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Department <span className="text-red-500">*</span>
              </label>

              <select
                id="department_id"
                value={form.department_id}
                onChange={(event) =>
                  handleChange(
                    "department_id",
                    event.target.value
                  )
                }
                disabled={saving}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-100"
              >
                <option value="">Select department</option>

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

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Designation Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    handleChange("name", event.target.value)
                  }
                  placeholder="e.g. Senior Accountant"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Designation Code{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="code"
                  type="text"
                  value={form.code}
                  onChange={(event) =>
                    handleChange(
                      "code",
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. SR-ACC"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={5}
                value={form.description}
                onChange={(event) =>
                  handleChange(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Enter a short description..."
                disabled={saving}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10 disabled:bg-slate-100"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Status
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Inactive designations will not be available for
                  new selections.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={form.status}
                onClick={() =>
                  handleChange("status", !form.status)
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                  form.status
                    ? "bg-[#087f78]"
                    : "bg-slate-300"
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <span
                  className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                    form.status
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(`/hrm/designations/${id}`)
              }
              disabled={saving}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#087f78] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}