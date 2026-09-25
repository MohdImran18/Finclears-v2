"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Letter {
  id: number;
  employee_profile_id: number;
  letter_template_id: number;
  letter_type: string;
  letter_number?: string | null;
  title: string;
  letter_date?: string | null;
  effective_date?: string | null;
  status: string;
  rendered_content?: string | null;
  field_values?: Record<string, unknown> | null;
  pdf_path?: string | null;
  generated_at?: string | null;
  approved_at?: string | null;
  employee_profile?: {
    employee_code?: string;
    user?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    department?: {
      name?: string;
      code?: string;
    };
    designation?: {
      name?: string;
      code?: string;
    };
  };
  template?: {
    name?: string;
    code?: string;
    letter_type?: string;
    version?: number;
  };
  generated_by?: {
    name?: string;
    email?: string;
  } | null;
  approved_by?: {
    name?: string;
    email?: string;
  } | null;
}

interface Version {
  id: number;
  version: number;
  rendered_content?: string | null;
  pdf_path?: string | null;
  change_notes?: string | null;
  created_at?: string;
  createdBy?: {
    name?: string;
    email?: string;
  } | null;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token")
  );
}

async function apiRequest<T>(
  method: "get" | "post",
  url: string
): Promise<T> {
  const token = getToken();

  const response = await axios({
    method,
    url: `${API_URL}${url}`,
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  });

  return response.data;
}

function formatDate(value?: string | null) {
  if (!value) return "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "generated":
      return "bg-blue-100 text-blue-700";
    case "draft":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function LetterDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [letter, setLetter] = useState<Letter | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadLetter() {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Letter;
      }>("get", `/letters/${id}`);

      setLetter(response.data);

      const history = await apiRequest<{
        success: boolean;
        data: {
          letter_id: number;
          versions: Version[];
        };
      }>("get", `/letters/${id}/versions`);

      setVersions(history.data?.versions || []);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to load letter."
        );
      } else {
        setError("Unable to load letter.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLetter();
  }, [id]);

  async function approveLetter() {
    if (!letter) return;

    if (
      !window.confirm(
        "Are you sure you want to approve this letter?"
      )
    ) {
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: {
          letter: Letter;
        };
      }>("post", `/letters/${id}/approve`);

      setLetter(response.data.letter);
      setMessage(
        response.message || "Letter approved successfully."
      );
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to approve letter."
        );
      } else {
        setError("Unable to approve letter.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function generateLetter() {
    if (!letter) return;

    if (
      !window.confirm(
        "Are you sure you want to generate this letter?"
      )
    ) {
      return;
    }

    setActionLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await import(
        "@/lib/api/letters/letterApi"
      ).then((api) => api.generateLetter(id));

      if (response.data) {
        // The generate API response is followed by loadLetter(),
        // which returns the fully hydrated Letter object.
        // Do not assign the raw EmployeeLetter directly to Letter state.
      }

      setMessage(
        response.message || "Letter generated successfully."
      );

      await loadLetter();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to generate letter."
        );
      } else {
        setError("Unable to generate letter.");
      }
    } finally {
      setActionLoading(false);
    }
  }
  async function openPdfBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  }

  async function previewLetter() {
    try {
      setActionLoading(true);
      setError("");

      const response = await import(
        "@/lib/api/letters/letterApi"
      ).then((api) => api.previewLetter(id));

      await openPdfBlob(response.data);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to preview PDF."
        );
      } else {
        setError("Unable to preview PDF.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function downloadLetter() {
    try {
      setActionLoading(true);
      setError("");

      const response = await import(
        "@/lib/api/letters/letterApi"
      ).then((api) => api.downloadLetter(id));

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${letter?.letter_type || "letter"}-${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to download PDF."
        );
      } else {
        setError("Unable to download PDF.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function downloadVersion(version: Version) {
    try {
      setActionLoading(true);
      setError("");

      const response = await import(
        "@/lib/api/letters/letterApi"
      ).then((api) =>
        api.downloadLetterVersion(id, version.version)
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${letter?.letter_type || "letter"}-v${version.version}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to download version PDF."
        );
      } else {
        setError("Unable to download version PDF.");
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8 text-center">
          Loading letter...
        </div>
      </div>
    );
  }

  if (error && !letter) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-8">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => router.push("/hrm/letters")}
            className="mt-4 rounded-lg border px-4 py-2 text-sm"
          >
            Back to Letters
          </button>
        </div>
      </div>
    );
  }

  if (!letter) return null;

  const employee = letter.employee_profile;
  const user = employee?.user;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.push("/hrm/letters")}
              className="mb-3 text-sm text-gray-500 hover:text-gray-900"
            >
              ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â Back to Letters
            </button>

            <h1 className="text-2xl font-semibold text-gray-900">
              {letter.title}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Letter #{letter.id}
              {letter.letter_number
                ? ` ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${letter.letter_number}`
                : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {letter.status === "draft" && (
              <button
                onClick={generateLetter}
                disabled={actionLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Generate Letter"}
              </button>
            )}
            {letter.status !== "approved" && (
              <button
                onClick={approveLetter}
                disabled={
                  actionLoading ||
                  letter.status !== "generated"
                }
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Approve"}
              </button>
            )}

            {letter.pdf_path && (
              <>
                <button
                  onClick={previewLetter}
                  className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
                >
                  Preview PDF
                </button>

                <button
                  onClick={downloadLetter}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                >
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Letter Details
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                    letter.status
                  )}`}
                >
                  {letter.status}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500">
                    Letter Type
                  </p>
                  <p className="mt-1 font-medium">
                    {letter.letter_type || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Template
                  </p>
                  <p className="mt-1 font-medium">
                    {letter.template?.name || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Letter Date
                  </p>
                  <p className="mt-1 font-medium">
                    {formatDate(letter.letter_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Effective Date
                  </p>
                  <p className="mt-1 font-medium">
                    {formatDate(letter.effective_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Generated At
                  </p>
                  <p className="mt-1 font-medium">
                    {formatDate(letter.generated_at)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Approved At
                  </p>
                  <p className="mt-1 font-medium">
                    {formatDate(letter.approved_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold">
                Letter Preview
              </h2>

              {letter.rendered_content ? (
                <div
                  className="prose max-w-none rounded-lg border bg-white p-6"
                  dangerouslySetInnerHTML={{
                    __html: letter.rendered_content,
                  }}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                  Letter has not been generated yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold">
                Employee
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">
                    Name
                  </p>
                  <p className="mt-1 font-medium">
                    {user?.name || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Employee Code
                  </p>
                  <p className="mt-1 font-medium">
                    {employee?.employee_code || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 break-all font-medium">
                    {user?.email || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 font-medium">
                    {user?.phone || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Department
                  </p>
                  <p className="mt-1 font-medium">
                    {employee?.department?.name || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Designation
                  </p>
                  <p className="mt-1 font-medium">
                    {employee?.designation?.name || "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-5 text-lg font-semibold">
                Version History
              </h2>

              {versions.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No versions available.
                </p>
              ) : (
                <div className="space-y-3">
                  {versions
                    .slice()
                    .sort((a, b) => b.version - a.version)
                    .map((version) => (
                      <div
                        key={version.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            Version {version.version}
                          </span>

                          {version.pdf_path && (
                            <button
                              onClick={() =>
                                window.open(
                                  `${API_URL}/letters/${id}/download`,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className="text-xs text-blue-600 hover:underline"
                            >
                              PDF
                            </button>
                          )}
                        </div>

                        {version.change_notes && (
                          <p className="mt-2 text-xs text-gray-500">
                            {version.change_notes}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-400">
                          {formatDate(version.created_at)}
                          {version.createdBy?.name
                            ? ` ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ ${version.createdBy.name}`
                            : ""}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
