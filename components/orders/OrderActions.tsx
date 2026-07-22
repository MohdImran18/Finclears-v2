"use client";

interface OrderActionsProps {
  id?: number | string;
}

export default function OrderActions({
  id,
}: OrderActionsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Order Actions
      </h2>

      <div className="flex gap-3">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          View
        </button>

        <button
          type="button"
          className="rounded-lg bg-green-600 px-4 py-2 text-white"
        >
          Complete
        </button>

        <button
          type="button"
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Cancel
        </button>
      </div>

      {id && (
        <p className="mt-4 text-sm text-slate-500">
          Order ID: {id}
        </p>
      )}
    </div>
  );
}
