"use client";

import type { User } from "@/types/user";

interface Props {
  open: boolean;

  user: User | null;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export default function UserDeleteDialog({
  open,
  user,
  loading,
  onClose,
  onConfirm,
}: Props) {
  if (!open || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="text-xl font-bold">
          Delete User
        </h2>

        <p className="mt-3">
          Are you sure you want to delete
          <strong> {user.name}</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
