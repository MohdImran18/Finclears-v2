"use client";

interface Props {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CompanyDeleteDialog({
  open,
  loading,
  onClose,
  onConfirm,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white p-8">

        <h2 className="text-xl font-bold">

          Delete Company

        </h2>

        <p className="mt-3">

          Are you sure?

        </p>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  );
}
