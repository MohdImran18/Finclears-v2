"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deleteDesignation,
  getDepartments,
  getDesignations,
  type DepartmentOption,
  type DesignationOption,
} from "@/lib/api/hrm/hrmApi";

export default function DesignationsPage() {
  const router = useRouter();

  const [designations, setDesignations] = useState<DesignationOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [designationRes, departmentRes] = await Promise.all([
        getDesignations(),
        getDepartments(),
      ]);

      setDesignations(designationRes.data || []);
      setDepartments(departmentRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load designations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDesignations = useMemo(() => {
    return designations.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword);

      const matchesDepartment =
        !departmentId ||
        item.department_id === Number(departmentId);

      const matchesStatus =
        status === ""
          ? true
          : status === "active"
          ? item.status === true
          : item.status === false;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [designations, search, departmentId, status]);
  const totalDesignations = filteredDesignations.length;
  const lastPage = Math.max(1, Math.ceil(totalDesignations / perPage));

  const paginatedDesignations = filteredDesignations.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1);
  }, [search, departmentId, status]);

  const getDepartmentName = (id: number) => {
    return (
      departments.find((dept) => dept.id === id)?.name ||
      "Unknown"
    );
  };

  const handleDelete = async (designation: DesignationOption) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${designation.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(designation.id);
      setError("");

      await deleteDesignation(designation.id);

      setDesignations((prev) =>
        prev.filter((item) => item.id !== designation.id)
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete designation."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#087f78]">
              HRM
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              Designations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage employee job designations.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/hrm/designations/create")
            }
            className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#066b65]"
          >
            + Create Designation
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Search
              </label>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or code..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Department
              </label>

              <select
                value={departmentId}
                onChange={(e) =>
                  setDepartmentId(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Departments</option>

                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#087f78]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading designations...
            </div>
          ) : filteredDesignations.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                No designations found.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/hrm/designations/create")
                }
                className="mt-4 rounded-xl bg-[#087f78] px-4 py-2 text-sm font-bold text-white hover:bg-[#066b65]"
              >
                Create Designation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">

                  <tr>
                    <th className="px-5 py-4">
                      Designation
                    </th>

                    <th className="px-5 py-4">
                      Code
                    </th>

                    <th className="px-5 py-4">
                      Department
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedDesignations.map((designation) => (

                    <tr
                      key={designation.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="font-semibold text-slate-800">
                          {designation.name}
                        </div>

                        {designation.description && (
                          <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {designation.description}
                          </div>
                        )}

                      </td>

                      <td className="px-5 py-4 font-medium text-slate-600">
                        {designation.code}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {getDepartmentName(designation.department_id)}
                      </td>

                      <td className="px-5 py-4">

                        {designation.status ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                            Inactive
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/hrm/designations/${designation.id}`
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/hrm/designations/${designation.id}/edit`
                              )
                            }
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(designation)
                            }
                            disabled={deletingId === designation.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === designation.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

              <div className="designationPagination">
                <div className="paginationSummary">
                  Showing{" "}
                  {totalDesignations === 0
                    ? 0
                    : (page - 1) * perPage + 1}
                  –
                  {Math.min(page * perPage, totalDesignations)} of{" "}
                  {totalDesignations} designations
                </div>

                <div className="paginationControls">
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                    className="paginationSelect"
                    aria-label="Designations per page"
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
                          key={"designation-ellipsis-" + index}
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

      </div>
    </div>
  );
}