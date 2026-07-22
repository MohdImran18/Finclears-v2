"use client";

interface DocumentActionsProps {
  id?: number | string;
}

export default function DocumentActions({
  id,
}: DocumentActionsProps) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="mb-4 text-lg font-semibold">
        Document Actions
      </h2>

      <div className="flex gap-3">

        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Download
        </button>

        <button className="rounded bg-green-600 px-4 py-2 text-white">
          Approve
        </button>

        <button className="rounded bg-red-600 px-4 py-2 text-white">
          Reject
        </button>

      </div>

      {id && (
        <p className="mt-4 text-sm text-slate-500">
          Document ID: {id}
        </p>
      )}

    </div>
  );
}
