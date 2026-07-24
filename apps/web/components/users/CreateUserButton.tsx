"use client";

import Link from "next/link";

interface Props {
  href?: string;
}

export default function CreateUserButton({
  href = "/dashboard/users/create",
}: Props) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
    >
      + Add User
    </Link>
  );
}
