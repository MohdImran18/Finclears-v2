"use client";

import { useState } from "react";

import { useDeleteUser } from "@/hooks/useUsers";

interface Props {
  id: number | string;

  name: string;
}

export default function DeleteUserDialog({
  id,
  name,
}: Props) {
  const mutation = useDeleteUser();

  const [open, setOpen] =
    useState(false);

  async function handleDelete() {
    try {
      await mutation.mutateAsync(id);

      setOpen(false);

      alert("User deleted successfully.");
    } catch (error) {
      console.error(error);

      alert("Unable to delete user.");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-md rounded-xl bg-white p-6">

        <h2 className="text-xl font-semibold">

          Delete User

        </h2>

        <p className="mt-4 text-gray-600">

          Are you sure you want to delete

          <span className="font-semibold">

            {" "}
            {name}

          </span>

          ?

        </p>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={() => setOpen(false)}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={mutation.isPending}
            onClick={handleDelete}
            className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}
