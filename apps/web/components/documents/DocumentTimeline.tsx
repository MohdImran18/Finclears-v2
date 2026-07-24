"use client";

import {
  Upload,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCcw,
  Trash2,
  Clock3,
} from "lucide-react";

export type TimelineAction =
  | "uploaded"
  | "under_review"
  | "verified"
  | "rejected"
  | "downloaded"
  | "replaced"
  | "deleted";

export interface TimelineItem {
  id: number;

  action: TimelineAction;

  user: string;

  remarks?: string;

  created_at: string;
}

interface Props {
  items?: TimelineItem[];
}

function getActionIcon(
  action: TimelineAction
) {
  switch (action) {
    case "uploaded":
      return (
        <Upload className="h-5 w-5 text-blue-600" />
      );

    case "under_review":
      return (
        <Search className="h-5 w-5 text-yellow-600" />
      );

    case "verified":
      return (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      );

    case "rejected":
      return (
        <XCircle className="h-5 w-5 text-red-600" />
      );

    case "downloaded":
      return (
        <Download className="h-5 w-5 text-indigo-600" />
      );

    case "replaced":
      return (
        <RefreshCcw className="h-5 w-5 text-purple-600" />
      );

    case "deleted":
      return (
        <Trash2 className="h-5 w-5 text-red-700" />
      );

    default:
      return (
        <Clock3 className="h-5 w-5 text-slate-600" />
      );
  }
}

function getActionTitle(
  action: TimelineAction
) {
  switch (action) {
    case "uploaded":
      return "Document Uploaded";

    case "under_review":
      return "Sent for Review";

    case "verified":
      return "Document Verified";

    case "rejected":
      return "Document Rejected";

    case "downloaded":
      return "Document Downloaded";

    case "replaced":
      return "Document Replaced";

    case "deleted":
      return "Document Deleted";

    default:
      return action;
  }
}

export default function DocumentTimeline({
  items = [],
}: Props) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="mb-6 text-xl font-semibold">

          Activity Timeline

        </h2>

        <div className="rounded-xl border border-dashed p-10 text-center">

          <Clock3 className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <p className="font-medium">

            No activity available.

          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-8 text-xl font-semibold">

        Activity Timeline

      </h2>

      <div className="relative">

        <div className="absolute left-5 top-0 h-full w-px bg-slate-200" />

        <div className="space-y-8">

          {items.map((item) => (

            <div
              key={item.id}
              className="relative flex gap-5"
            >

              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-white">

                {getActionIcon(item.action)}

              </div>

              <div className="flex-1 rounded-xl border bg-slate-50 p-5">

                <div className="flex flex-wrap items-center justify-between gap-3">

                  <h3 className="font-semibold">

                    {getActionTitle(
                      item.action
                    )}

                  </h3>

                  <span className="text-sm text-slate-500">

                    {new Date(
                      item.created_at
                    ).toLocaleString()}

                  </span>

                </div>

                <p className="mt-2 text-sm text-slate-600">

                  Performed by

                  <span className="ml-1 font-semibold">

                    {item.user}

                  </span>

                </p>

                {item.remarks && (

                  <div className="mt-4 rounded-lg bg-white p-4 text-sm text-slate-600">

                    {item.remarks}

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}