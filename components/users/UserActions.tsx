"use client";

import Link from "next/link";

import DeleteUserDialog from "@/components/users/DeleteUserDialog";

interface Props {
  id: number;
  name: string;
}

export default function UserActions({
  id,
  name,
}: Props) {
  return (
    <div className="flex justify-center gap-2">

      <Link
        href={`/dashboard/users/${id}/edit`}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Edit
      </Link>

      <DeleteUserDialog
        id={id}
        name={name}
      />

    </div>
  );
}
