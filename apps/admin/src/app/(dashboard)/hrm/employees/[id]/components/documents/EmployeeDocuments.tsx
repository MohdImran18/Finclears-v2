"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteEmployeeDocument,
  downloadEmployeeDocument,
  getEmployeeDocuments,
  rejectEmployeeDocument,
  uploadEmployeeDocument,
  verifyEmployeeDocument,
} from "@/lib/api/hrm/employeeDocumentApi";
import type { EmployeeDocument } from "@/lib/api/hrm/employeeDocumentApi";

interface EmployeeDocumentsProps {
  employeeProfileId: number | string;
}

const documentTypes = [
  "PAN Card",
  "Aadhaar Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "Bank Document",
  "Education Certificate",
  "Experience Certificate",
  "Employment Contract",
  "Other",
];

function formatDate(value: string | null) {
  if (!value) return "—";

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

function formatFileSize(bytes: number | null) {
  if (!bytes) return "—";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClasses(status: EmployeeDocument["verification_status"]) {
  if (status === "verified") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function EmployeeDocuments({
  employeeProfileId,
}: EmployeeDocumentsProps) {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [documentType, setDocumentType] = useState("PAN Card");
  const [documentName, setDocumentName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEmployeeDocuments(employeeProfileId);

      setDocuments(response?.data ?? []);
    } catch (err) {
      console.error("Failed to load employee documents:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load employee documents."
      );
    } finally {
      setLoading(false);
    }
  }, [employeeProfileId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDocuments();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDocuments]);

  function resetUploadForm() {
    setDocumentType("PAN Card");
    setDocumentName("");
    setDocumentNumber("");
    setIssueDate("");
    setExpiryDate("");
    setNotes("");
    setFile(null);
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      alert("Please select a document file.");
      return;
    }

    if (!documentName.trim()) {
      alert("Please enter the document name.");
      return;
    }

    try {
      setUploading(true);

      await uploadEmployeeDocument(employeeProfileId, {
        document_type: documentType,
        document_name: documentName.trim(),
        document_number: documentNumber.trim() || undefined,
        issue_date: issueDate || undefined,
        expiry_date: expiryDate || undefined,
        notes: notes.trim() || undefined,
        file,
      });

      resetUploadForm();
      setShowUpload(false);

      await loadDocuments();
    } catch (err) {
      console.error("Failed to upload employee document:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to upload employee document."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleVerify(document: EmployeeDocument) {
    if (!window.confirm(`Verify "${document.document_name}"?`)) {
      return;
    }

    try {
      await verifyEmployeeDocument(
        employeeProfileId,
        document.id
      );

      await loadDocuments();
    } catch (err) {
      console.error("Failed to verify document:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to verify document."
      );
    }
  }

  async function handleReject(document: EmployeeDocument) {
    const reason = window.prompt(
      `Reason for rejecting "${document.document_name}":`
    );

    if (reason === null) {
      return;
    }

    try {
      await rejectEmployeeDocument(
        employeeProfileId,
        document.id,
        reason
      );

      await loadDocuments();
    } catch (err) {
      console.error("Failed to reject document:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to reject document."
      );
    }
  }

  async function handleDelete(document: EmployeeDocument) {
    if (
      !window.confirm(
        `Delete "${document.document_name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteEmployeeDocument(
        employeeProfileId,
        document.id
      );

      await loadDocuments();
    } catch (err) {
      console.error("Failed to delete document:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to delete document."
      );
    }
  }

  async function handleDownload(document: EmployeeDocument) {
    try {
      const response = await downloadEmployeeDocument(
        employeeProfileId,
        document.id
      );

      const contentType = response.headers["content-type"];

      const blob = new Blob([response.data], {
        type:
          (typeof contentType === "string" ? contentType : undefined) ||
          document.mime_type ||
          "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");

      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      if (document.file_name) {
        link.download = document.file_name;
      }

      link.click();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      console.error("Failed to download employee document:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to download employee document."
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Employee Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage employee identity, employment and supporting documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <span className="text-sm font-semibold text-slate-500">
              {documents.length} document
              {documents.length === 1 ? "" : "s"}
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowUpload((value) => !value)}
            className="rounded-xl bg-[#087f78] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#066b65]"
          >
            {showUpload ? "Close" : "Upload Document"}
          </button>
        </div>
      </div>

      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(event) =>
                  setDocumentType(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Document Name
              </label>

              <input
                value={documentName}
                onChange={(event) =>
                  setDocumentName(event.target.value)
                }
                placeholder="e.g. Employee PAN Card"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Document Number
              </label>

              <input
                value={documentNumber}
                onChange={(event) =>
                  setDocumentNumber(event.target.value)
                }
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                File
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(event) =>
                  setFile(event.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />

              {file && (
                <p className="mt-1 text-xs text-slate-500">
                  {file.name} · {formatFileSize(file.size)}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Issue Date
              </label>

              <input
                type="date"
                value={issueDate}
                onChange={(event) =>
                  setIssueDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Expiry Date
              </label>

              <input
                type="date"
                value={expiryDate}
                onChange={(event) =>
                  setExpiryDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                rows={3}
                placeholder="Optional notes"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#087f78]"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetUploadForm();
                setShowUpload(false);
              }}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="rounded-xl bg-[#087f78] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="mt-5 rounded-xl border border-slate-200 p-6 text-center text-sm text-slate-500">
          Loading documents...
        </div>
      )}

      {error && !loading && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center">
          <p className="font-semibold text-slate-700">
            No documents found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Upload the employee&apos;s documents to get started.
          </p>
        </div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3 font-semibold">
                  Document
                </th>
                <th className="px-3 py-3 font-semibold">
                  Number
                </th>
                <th className="px-3 py-3 font-semibold">
                  Issue Date
                </th>
                <th className="px-3 py-3 font-semibold">
                  Expiry
                </th>
                <th className="px-3 py-3 font-semibold">
                  Status
                </th>
                <th className="px-3 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map((document) => (
                <tr
                  key={document.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-3 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {document.document_name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {document.document_type}
                        {document.file_name
                          ? ` · ${document.file_name}`
                          : ""}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {document.document_number || "—"}
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {formatDate(document.issue_date)}
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {formatDate(document.expiry_date)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClasses(
                        document.verification_status
                      )}`}
                    >
                      {document.verification_status}
                    </span>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownload(document)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>

                      {document.verification_status !== "verified" && (
                        <button
                          type="button"
                          onClick={() => handleVerify(document)}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          Verify
                        </button>
                      )}

                      {document.verification_status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => handleReject(document)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Reject
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(document)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}



