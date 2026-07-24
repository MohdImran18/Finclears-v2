"use client";

import Link from "next/link";
import {
  FileText,
  Download,
  ExternalLink,
  Image as ImageIcon,
  FileQuestion,
} from "lucide-react";

interface DocumentData {
  id?: number | string;

  title?: string;

  name?: string;

  file_name?: string;

  file_url?: string;

  url?: string;

  mime_type?: string;

  extension?: string;

  size?: number;

  status?: string;

  created_at?: string;
}

interface Props {
  document?: DocumentData;
}

function formatBytes(bytes?: number) {
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

export default function DocumentViewer({
  document,
}: Props) {
  const fileUrl =
    document?.file_url ??
    document?.url;

  const extension =
    (
      document?.extension ??
      ""
    ).toLowerCase();

  const isImage = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
  ].includes(extension);

  const isPdf =
    extension === "pdf";

  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-6">

        <div>

          <h2 className="text-2xl font-bold">

            {document?.title ??
              document?.name ??
              document?.file_name ??
              "Document"}

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            Uploaded on{" "}

            {document?.created_at
              ? new Date(
                  document.created_at
                ).toLocaleDateString()
              : "-"}

          </p>

        </div>

        {fileUrl && (

          <div className="flex gap-3">

            <Link
              href={fileUrl}
              target="_blank"
              className="rounded-lg border p-3 hover:bg-slate-100"
            >
              <ExternalLink className="h-5 w-5" />
            </Link>

            <Link
              href={fileUrl}
              download
              className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
            >
              <Download className="h-5 w-5" />
            </Link>

          </div>

        )}

      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-4">

        {/* Sidebar */}

        <div className="space-y-5 rounded-xl border bg-slate-50 p-5">

          <div>

            <p className="text-xs uppercase text-slate-500">

              Status

            </p>

            <p className="font-semibold capitalize">

              {document?.status ??
                "Pending"}

            </p>

          </div>

          <div>

            <p className="text-xs uppercase text-slate-500">

              File

            </p>

            <p className="break-all font-medium">

              {document?.file_name ??
                "-"}

            </p>

          </div>

          <div>

            <p className="text-xs uppercase text-slate-500">

              Type

            </p>

            <p>

              {document?.extension ??
                "-"}

            </p>

          </div>

          <div>

            <p className="text-xs uppercase text-slate-500">

              Size

            </p>

            <p>

              {formatBytes(
                document?.size
              )}

            </p>

          </div>

        </div>

        {/* Preview */}

        <div className="lg:col-span-3">

          {!fileUrl ? (

            <div className="flex h-[650px] flex-col items-center justify-center rounded-xl border border-dashed">

              <FileQuestion className="h-16 w-16 text-slate-400" />

              <h3 className="mt-4 text-xl font-semibold">

                No Preview Available

              </h3>

              <p className="mt-2 text-slate-500">

                Document preview is unavailable.

              </p>

            </div>

          ) : isPdf ? (

            <iframe
              title="PDF Preview"
              src={fileUrl}
              className="h-[700px] w-full rounded-xl border"
            />

          ) : isImage ? (

            <div className="rounded-xl border p-4">

              <img
                src={fileUrl}
                alt={
                  document?.title ??
                  "Document"
                }
                className="mx-auto max-h-[700px] rounded-xl object-contain"
              />

            </div>

          ) : (

            <div className="flex h-[650px] flex-col items-center justify-center rounded-xl border">

              <FileText className="h-16 w-16 text-blue-600" />

              <h3 className="mt-4 text-xl font-semibold">

                Preview Not Supported

              </h3>

              <p className="mt-2 text-slate-500">

                Please download the document to view it.

              </p>

              <Link
                href={fileUrl}
                download
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
              >
                Download File
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}