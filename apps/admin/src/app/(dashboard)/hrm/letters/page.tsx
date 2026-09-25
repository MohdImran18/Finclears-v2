"use client";

import { useEffect, useState } from "react";
import {
  getLetters,
  getLetterTemplates,
  type EmployeeLetter,
  type LetterTemplate,
} from "@/lib/api/letters/letterApi";

export default function LettersPage() {
  const [letters, setLetters] = useState<EmployeeLetter[]>([]);
  const [templates, setTemplates] = useState<LetterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [lettersResponse, templatesResponse] = await Promise.all([
        getLetters(),
        getLetterTemplates(),
      ]);

      setLetters(
        Array.isArray(lettersResponse.data?.data)
          ? lettersResponse.data.data
          : []
      );

      setTemplates(
        Array.isArray(templatesResponse.data)
          ? templatesResponse.data
          : []
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Unable to load letters."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function formatDate(value?: string | null) {
    if (!value) return "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function statusClass(status?: string) {
    switch (status) {
      case "generated":
        return "bg-blue-50 text-blue-700";
      case "approved":
        return "bg-green-50 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const filteredLetters = letters.filter((letter) => {
    const query = search.trim().toLowerCase();

    const employeeName =
      letter.employeeProfile?.name ||
      letter.field_values?.employee_name ||
      "";

    const title = letter.title || "";
    const type = letter.letter_type || "";
    const letterNumber = letter.letter_number || "";

    const matchesSearch =
      !query ||
      String(employeeName).toLowerCase().includes(query) ||
      String(title).toLowerCase().includes(query) ||
      String(type).toLowerCase().includes(query) ||
      String(letterNumber).toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      letter.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-500">
            HRM
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Letters
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create, generate and manage employee letters.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.open(
              "/employee/hrm/letters/create",
              "_self"
            )
          }
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Create Letter
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">
            Total Letters
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {letters.length}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">
            Generated
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {
              letters.filter(
                (letter) => letter.status === "generated"
              ).length
            }
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="text-sm text-gray-500">
            Templates
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {templates.length}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="font-semibold text-gray-900">
              Employee Letters
            </h2>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or letter..."
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400 sm:w-64"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-gray-400"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="generated">Generated</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading letters...
          </div>
        ) : filteredLetters.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-sm font-medium text-gray-700">
              No letters found
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "Try changing your search or status filter."
                : "Create a letter to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-600">
                    Employee
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Letter
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Type
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Letter Date
                  </th>

                  <th className="px-5 py-3 font-medium text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredLetters.map((letter) => (
                  <tr
                    key={letter.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">
                        {letter.employeeProfile?.name ||
                          letter.field_values?.employee_name ||
                          `Employee #${letter.employee_profile_id}`}
                      </div>

                      {letter.field_values?.employee_code && (
                        <div className="mt-1 text-xs text-gray-500">
                          {letter.field_values.employee_code}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">
                        {letter.title || "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}
                      </div>

                      {letter.letter_number && (
                        <div className="mt-1 text-xs text-gray-500">
                          {letter.letter_number}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 capitalize text-gray-600">
                      {letter.letter_type || "ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(letter.letter_date)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          letter.status
                        )}`}
                      >
                        {letter.status || "unknown"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          onClick={() =>
                            window.open(
                              `/employee/hrm/letters/${letter.id}`,
                              "_self"
                            )
                          }
                        >
                          View
                        </button>

                        {letter.status !== "approved" && (
                          <button
                            type="button"
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            onClick={() =>
                              window.open(
                                `/employee/hrm/letters/${letter.id}/edit`,
                                "_self"
                              )
                            }
                          >
                            Edit
                          </button>
                        )}

                        {letter.pdf_path && (
                          <button
                            type="button"
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                            onClick={() =>
                              window.open(
                                `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"}/letters/${letter.id}/download`,
                                "_blank"
                              )
                            }
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
