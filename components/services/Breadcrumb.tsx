"use client";

import Link from "next/link";

interface Props {
  category: string;
  title: string;
}

export default function Breadcrumb({
  category,
  title,
}: Props) {

  const categoryLabel = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (

    <nav
      className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500"
      aria-label="Breadcrumb"
    >

      <Link
        href="/"
        className="hover:text-blue-600"
      >
        Home
      </Link>

      <span>/</span>

      <Link
        href="/services"
        className="hover:text-blue-600"
      >
        Services
      </Link>

      <span>/</span>

      <Link
        href={`/services/${category}`}
        className="hover:text-blue-600"
      >
        {categoryLabel}
      </Link>

      <span>/</span>

      <span className="font-medium text-gray-900">
        {title}
      </span>

    </nav>

  );
}
