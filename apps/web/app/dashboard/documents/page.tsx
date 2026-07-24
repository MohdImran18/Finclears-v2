"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, FileText } from "lucide-react";

import DocumentFilters from "@/components/documents/DocumentFilters";
import DocumentList from "@/components/documents/DocumentList";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDocuments({
    search,
  });

  const documents = data?.data ?? [];

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            My Documents
          </h1>

          <p className="mt-2 text-slate-500">
            Upload, manage and track all documents submitted
            for your services.
          </p>

        </div>

        <Link
          href="/dashboard/documents/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Upload className="h-5 w-5" />
          Upload Document
        </Link>

      </div>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Total Documents
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {documents.length}
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Verified
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {
              documents.filter(
                (d: any) => d.status === "verified"
              ).length
            }
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Pending
          </p>

          <h2 className="mt-3 text-3xl font-bold text-amber-500">
            {
              documents.filter(
                (d: any) => d.status === "pending"
              ).length
            }
          </h2>

        </div>

        <div className="rounded-2xl border bg-white p-6">

          <p className="text-sm text-slate-500">
            Rejected
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-500">
            {
              documents.filter(
                (d: any) => d.status === "rejected"
              ).length
            }
          </h2>

        </div>

      </div>

      {/* Filters */}

      <DocumentFilters
        search={search}
        onSearch={setSearch}
      />

      {/* Loading */}

      {isLoading && (
        <div className="rounded-2xl border bg-white p-12 text-center">
          Loading documents...
        </div>
      )}

      {/* Error */}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

          <p className="font-medium text-red-600">
            Unable to load documents.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white"
          >
            Retry
          </button>

        </div>
      )}

      {/* Empty */}

      {!isLoading &&
        !isError &&
        documents.length === 0 && (

          <div className="rounded-2xl border border-dashed bg-white py-20 text-center">

            <FileText className="mx-auto h-14 w-14 text-slate-400" />

            <h2 className="mt-6 text-2xl font-bold">
              No Documents Uploaded
            </h2>

            <p className="mt-3 text-slate-500">
              Upload your first document to begin your
              registration or compliance process.
            </p>

            <Link
              href="/dashboard/documents/upload"
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Upload First Document
            </Link>

          </div>

        )}

      {/* List */}

      {!isLoading &&
        !isError &&
        documents.length > 0 && (
          <DocumentList
            documents={documents}
          />
        )}

    </div>
  );
}