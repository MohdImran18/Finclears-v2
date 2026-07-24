"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import DocumentTimeline from "@/components/documents/DocumentTimeline";

import {
  ArrowLeft,
  Calendar,
  Building2,
  FileText,
  BadgeCheck,
} from "lucide-react";

import DocumentViewer from "@/components/documents/DocumentViewer";
import DocumentActions from "@/components/documents/DocumentActions";

import {
  useDocument,
} from "@/hooks/useDocuments";

export default function DocumentDetailsPage() {

  const params = useParams();

  const id = Number(params.id);

  const {
    data,
    isLoading,
    isError,
  } = useDocument(id);

  if (isLoading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="text-slate-500">

            Loading document...

          </p>

        </div>

      </div>

    );

  }

  if (isError || !data?.data) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="text-center">

          <h2 className="text-2xl font-bold">

            Document Not Found

          </h2>

          <p className="mt-3 text-slate-500">

            The requested document does not exist.

          </p>

          <Link
            href="/dashboard/documents"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-medium text-white"
          >

            Back to Documents

          </Link>

        </div>

      </div>

    );

  }

  const document = data.data;

  return (

    <div className="space-y-8 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <Link
            href="/dashboard/documents"
            className="mb-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >

            <ArrowLeft className="h-4 w-4" />

            Back to Documents

          </Link>

          <h1 className="text-3xl font-bold">

            {document.title}

          </h1>

          <p className="mt-2 text-slate-500">

            View and manage your uploaded document.

          </p>

        </div>

        <DocumentActions
          document={document}
        />

      </div>

      {/* Status */}

      <div className="flex flex-wrap gap-3">

        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            document.status === "verified"
              ? "bg-green-100 text-green-700"
              : document.status === "rejected"
              ? "bg-red-100 text-red-700"
              : document.status === "under_review"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >

          {document.status.replaceAll(
            "_",
            " "
          )}

        </span>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">

          {document.type.replaceAll(
            "_",
            " "
          )}

        </span>

      </div>

      {/* Layout */}

      <div className="grid gap-8 lg:grid-cols-3">

        {/* Left */}

        <div className="space-y-6 lg:col-span-1">

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">

              Document Information

            </h2>
                        <div className="space-y-5">

              <div className="flex items-center gap-3">

                <FileText className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">

                    File Name

                  </p>

                  <p className="font-medium">

                    {document.file_name}

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Building2 className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">

                    Company ID

                  </p>

                  <p className="font-medium">

                    {document.company_id}

                  </p>

                </div>

              </div>

              {document.order_id && (

                <div className="flex items-center gap-3">

                  <BadgeCheck className="h-5 w-5 text-blue-600" />

                  <div>

                    <p className="text-sm text-slate-500">

                      Order ID

                    </p>

                    <p className="font-medium">

                      {document.order_id}

                    </p>

                  </div>

                </div>

              )}

              <div className="flex items-center gap-3">

                <Calendar className="h-5 w-5 text-blue-600" />

                <div>

                  <p className="text-sm text-slate-500">

                    Uploaded

                  </p>

                  <p className="font-medium">

                    {new Date(
                      document.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

              <div>

                <p className="mb-2 text-sm text-slate-500">

                  Status

                </p>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                    document.status === "verified"
                      ? "bg-green-100 text-green-700"
                      : document.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : document.status === "under_review"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >

                  {document.status.replaceAll(
                    "_",
                    " "
                  )}

                </span>

              </div>

              {document.remarks && (

                <div>

                  <p className="mb-2 text-sm text-slate-500">

                    Remarks

                  </p>

                  <div className="rounded-xl bg-slate-50 p-4 text-sm">

                    {document.remarks}

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="space-y-6 lg:col-span-2">

          <DocumentViewer
            document={document}
          />

          <DocumentTimeline
  items={[
    {
      id: 1,
      action: "uploaded",
      user: "Imran Malik",
      created_at: "2026-07-24T10:30:00",
      remarks: "Initial upload",
    },
    {
      id: 2,
      action: "under_review",
      user: "Admin",
      created_at: "2026-07-24T11:15:00",
    },
    {
      id: 3,
      action: "verified",
      user: "CA Team",
      created_at: "2026-07-24T12:00:00",
      remarks: "Verified successfully",
    },
  ]}
/>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">

              File Details

            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">

                  File Type

                </p>

                <p className="font-medium">

                  {document.mime_type}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Extension

                </p>

                <p className="font-medium uppercase">

                  {document.extension}

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Size

                </p>

                <p className="font-medium">

                  {(
                    document.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB

                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">

                  Verified At

                </p>

                <p className="font-medium">

                  {document.verified_at
                    ? new Date(
                        document.verified_at
                      ).toLocaleString()
                    : "Not Verified"}

                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-semibold">

              Activity Timeline

            </h2>

            <div className="space-y-6">

              <div className="flex gap-4">

                <div className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

                <div>

                  <h4 className="font-medium">

                    Document Uploaded

                  </h4>

                  <p className="text-sm text-slate-500">

                    {new Date(
                      document.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

              {document.verified_at && (

                <div className="flex gap-4">

                  <div className="mt-2 h-3 w-3 rounded-full bg-green-600" />

                  <div>

                    <h4 className="font-medium">

                      Document Verified

                    </h4>

                    <p className="text-sm text-slate-500">

                      {new Date(
                        document.verified_at
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}