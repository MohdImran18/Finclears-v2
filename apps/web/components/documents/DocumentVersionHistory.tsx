"use client";

import {
  History,
  Download,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DocumentVersion {
  id: number;

  version: number;

  file_name: string;

  size: number;

  uploaded_by?: string;

  created_at: string;

  is_current?: boolean;

  download_url?: string;
}

interface Props {
  versions?: DocumentVersion[];

  onDownload?: (
    version: DocumentVersion
  ) => void;
}

export default function DocumentVersionHistory({
  versions = [],
  onDownload,
}: Props) {

  if (!versions.length) {

    return (

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-3">

          <History className="h-6 w-6 text-blue-600" />

          <h2 className="text-xl font-semibold">

            Version History

          </h2>

        </div>

        <div className="mt-8 rounded-xl border border-dashed p-10 text-center">

          <History className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium">

            No previous versions found.

          </p>

          <p className="mt-2 text-sm text-slate-500">

            This is the first uploaded version.

          </p>

        </div>

      </div>

    );

  }

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-8 flex items-center gap-3">

        <History className="h-6 w-6 text-blue-600" />

        <h2 className="text-xl font-semibold">

          Version History

        </h2>

      </div>

      <div className="space-y-5">

        {versions.map((version) => (

          <div
            key={version.id}
            className="flex flex-col gap-5 rounded-xl border p-5 transition hover:border-blue-200 hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
          >

            <div className="flex gap-4">

              <div className="rounded-xl bg-blue-100 p-3">

                <History className="h-5 w-5 text-blue-700" />

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-3">

                  <h3 className="font-semibold">

                    Version {version.version}

                  </h3>

                  {version.is_current && (

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">

                      Current Version

                    </span>

                  )}

                </div>

                <p className="mt-1 text-sm text-slate-500">

                  {version.file_name}

                </p>

                <div className="mt-3 flex flex-wrap gap-6 text-sm text-slate-500">

                  <div className="flex items-center gap-2">

                    <Clock className="h-4 w-4" />

                    {new Date(
                      version.created_at
                    ).toLocaleString()}

                  </div>

                  <div>

                    {(version.size / 1024 / 1024).toFixed(2)} MB

                  </div>

                  <div>

                    Uploaded By:

                    {" "}

                    {version.uploaded_by ??
                      "System"}

                  </div>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {version.is_current && (

                <CheckCircle2 className="h-6 w-6 text-green-600" />

              )}

              <button
                type="button"
                onClick={() =>
                  onDownload?.(
                    version
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
              >

                <Download className="h-4 w-4" />

                Download

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}