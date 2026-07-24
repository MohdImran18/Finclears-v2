"use client";

import Link from "next/link";

interface Props {
  title?: string;
  description?: string;
}

export default function EmptyUsers({
  title = "No Users Found",
  description = "There are no users matching your search criteria.",
}: Props) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-8 0v2m8 0H9m8-10a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

      </div>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-gray-500">
        {description}
      </p>

      <Link
        href="/dashboard/users/create"
        className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
      >
        + Create First User
      </Link>

    </div>
  );
}
