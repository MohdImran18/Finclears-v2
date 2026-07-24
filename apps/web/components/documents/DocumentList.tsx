"use client";

import Link from "next/link";
import DocumentActions from "@/components/documents/DocumentActions";
import {
  FileText,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

import type { Document } from "@/types/document";

interface Props {
  documents?: Document[];
  loading?: boolean;
}

function formatBytes(bytes: number) {
  if (!bytes) return "-";

  const sizes = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const i = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, i)
  ).toFixed(2)} ${sizes[i]}`;
}

function badge(status: string) {
  switch (status) {
    case "verified":
      return "bg-green-100 text-green-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "under_review":
      return "bg-blue-100 text-blue-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function DocumentList({
  documents = [],
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        Loading documents...
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-white py-20 text-center">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />

        <h2 className="mt-4 text-xl font-semibold">
          No Documents Found
        </h2>

        <p className="mt-2 text-slate-500">
          Upload your first document.
        </p>

        <Link
          href="/dashboard/documents/upload"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Upload Document
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-4 text-left">
              Document
            </th>

            <th className="px-5 py-4 text-left">
              Type
            </th>

            <th className="px-5 py-4 text-left">
              Size
            </th>

            <th className="px-5 py-4 text-left">
              Status
            </th>

            <th className="px-5 py-4 text-left">
              Uploaded
            </th>

            <th className="px-5 py-4 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => (
            <tr
              key={document.id}
              className="border-t"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />

                  <div>
                    <p className="font-medium">
                      {document.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {document.file_name}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 capitalize">
                {document.type.replaceAll(
                  "_",
                  " "
                )}
              </td>

              <td className="px-5 py-4">
                {formatBytes(document.size)}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${badge(
                    document.status
                  )}`}
                >
                  {document.status.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </td>

              <td className="px-5 py-4 text-sm text-slate-500">
                {new Date(
                  document.created_at
                ).toLocaleDateString()}
              </td>

              <td className="px-5 py-4">
  <DocumentActions
  document={document}
/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}