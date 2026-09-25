"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  deleteDesignation,
  getDesignation,
  type DesignationOption,
} from "@/lib/api/hrm/hrmApi";

export default function DesignationViewPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [designation, setDesignation] =
    useState<DesignationOption | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadDesignation() {
      try {
        setLoading(true);
        setError("");

        const response = await getDesignation(id);

        setDesignation(response.data);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            "Unable to load designation."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDesignation();
  }, [id]);

  async function handleDelete() {
    if (!designation) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${designation.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteDesignation(designation.id);

      router.push("/hrm/designations");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete designation."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10 text-center text-sm text-slate-500">
          Loading designation...
        </div>
      </div>
    );
  }

  if (error && !designation) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-10">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/hrm/designations")
              }
              className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white"
            >
              Back to Designations
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (!designation) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6">
          <button
            type="button"
            onClick={() =>
              router.push("/hrm/designations")
            }
            className="mb-4 text-sm font-semibold text-slate-500 hover:text-[#087f78]"
          >
            ← Back to Designations
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <p className="text-sm font-medium text-[#087f78]">
                HRM / Designation
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {designation.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View designation details.
              </p>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/hrm/designations/${designation.id}/edit`
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-base font-bold text-slate-900">
              Designation Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information about this designation.
            </p>
          </div>

          <div className="grid gap-px bg-slate-100 md:grid-cols-2">

            <div className="bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Designation Name
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {designation.name}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Code
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {designation.code}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Department
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-800">
                {designation.department?.name ||
                  `Department #${designation.department_id}`}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>

              <div className="mt-2">
                {designation.status ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white p-6 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {designation.description ||
                  "No description provided."}
              </p>
            </div>

          </div>

          <div className="flex justify-end border-t border-slate-100 px-6 py-4">
            <button
              type="button"
              onClick={() =>
                router.push("/hrm/designations")
              }
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Back to List
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}