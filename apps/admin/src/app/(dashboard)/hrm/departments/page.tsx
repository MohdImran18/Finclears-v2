"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
  type DepartmentOption,
} from "@/lib/api/hrm/hrmApi";

type DepartmentForm = {
  name: string;
  code: string;
  description: string;
  status: boolean;
};

const emptyForm: DepartmentForm = {
  name: "",
  code: "",
  description: "",
  status: true,
};

export default function DepartmentsPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DepartmentForm>(emptyForm);

  async function loadDepartments() {
    try {
      setLoading(true);
      setError("");

      const response = await getDepartments();

      setDepartments(response.data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
      setError("Unable to load departments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  function openEdit(department: DepartmentOption) {
    setEditingId(department.id);

    setForm({
      name: department.name || "",
      code: department.code || "",
      description: department.description || "",
      status: department.status,
    });

    setShowForm(true);
    setError("");
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      setError("Department name and code are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
        status: form.status,
      };

      if (editingId) {
        await updateDepartment(editingId, payload);
      } else {
        await createDepartment(payload);
      }

      await loadDepartments();
      closeForm();
    } catch (err: any) {
      console.error("Failed to save department:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to save department. Please check the details."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(department: DepartmentOption) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${department.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(department.id);
      setError("");

      await deleteDepartment(department.id);

      setDepartments((prev) =>
        prev.filter((item) => item.id !== department.id)
      );
    } catch (err: any) {
      console.error("Failed to delete department:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete department."
      );
    } finally {
      setDeletingId(null);
    }
  }

  const filteredDepartments = departments.filter((department) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      department.name.toLowerCase().includes(query) ||
      department.code.toLowerCase().includes(query)
    );
  });

  const totalDepartments = filteredDepartments.length;
  const lastPage = Math.max(1, Math.ceil(totalDepartments / perPage));

  const paginatedDepartments = filteredDepartments.slice(
    (page - 1) * perPage,
    page * perPage
  );
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#087f78]">
              HRM
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Departments
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your company departments and their status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Add Department
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search department name or code..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading departments...
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-slate-700">
                No departments found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Create your first department to get started.
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                + Add Department
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Department
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Code
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Designations
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedDepartments.map((department) => (
                    <tr
                      key={department.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {department.name}
                        </div>

                        {department.description && (
                          <div className="mt-1 max-w-md truncate text-xs text-slate-500">
                            {department.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                          {department.code}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {department.designations_count ?? 0}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            department.status
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {department.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(department)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(department)}
                            disabled={deletingId === department.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === department.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="departmentPagination">
                <div className="paginationSummary">
                  Showing{" "}
                  {totalDepartments === 0
                    ? 0
                    : (page - 1) * perPage + 1}
                  –
                  {Math.min(page * perPage, totalDepartments)} of{" "}
                  {totalDepartments} departments
                </div>

                <div className="paginationControls">
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="paginationSelect"
                    aria-label="Departments per page"
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>

                  <button
                    type="button"
                    className="paginationBtn"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) => current - 1)
                    }
                    aria-label="Previous page"
                  >
                    <span aria-hidden="true">&lsaquo;</span>
                  </button>

                  {(() => {
                    const pages: (number | "ellipsis")[] = [];

                    if (lastPage <= 7) {
                      for (let i = 1; i <= lastPage; i++) {
                        pages.push(i);
                      }
                    } else if (page <= 4) {
                      pages.push(
                        1,
                        2,
                        3,
                        4,
                        5,
                        "ellipsis",
                        lastPage
                      );
                    } else if (page >= lastPage - 3) {
                      pages.push(
                        1,
                        "ellipsis",
                        lastPage - 4,
                        lastPage - 3,
                        lastPage - 2,
                        lastPage - 1,
                        lastPage
                      );
                    } else {
                      pages.push(
                        1,
                        "ellipsis",
                        page - 1,
                        page,
                        page + 1,
                        "ellipsis",
                        lastPage
                      );
                    }

                    return pages.map((pageNumber, index) =>
                      pageNumber === "ellipsis" ? (
                        <span
                          key={"department-ellipsis-" + index}
                          className="paginationEllipsis"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={pageNumber}
                          type="button"
                          className={`paginationBtn ${
                            page === pageNumber ? "active" : ""
                          }`}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      )
                    );
                  })()}

                  <button
                    type="button"
                    className="paginationBtn"
                    disabled={page >= lastPage}
                    onClick={() =>
                      setPage((current) => current + 1)
                    }
                    aria-label="Next page"
                  >
                    <span aria-hidden="true">&rsaquo;</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingId ? "Edit Department" : "Add Department"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the department details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="text-xl text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Department Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Human Resources"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Department Code
                  </label>

                  <input
                    type="text"
                    value={form.code}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        code: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g. HR"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Optional department description"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
                  <input
                    type="checkbox"
                    checked={form.status}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        status: event.target.checked,
                      }))
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    Active Department
                  </span>
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#066b65] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Department"
                        : "Create Department"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}