"use client";

import Link from "next/link";

export interface BlogCardProps {
  slug: string;

  title: string;

  excerpt?: string | null;

  short_description?: string | null;

  image?: string | null;

  featured_image?: string | null;

  category?:
    | string
    | {
        id: number;
        name: string;
        slug: string;
      };

  author?: string | null;

  created_at?: string;

  publishedAt?: string;

  read_time?: string | null;

  readingTime?: string;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  short_description,
  image,
  featured_image,
  category,
  author,
  created_at,
  read_time,
  publishedAt,
  readingTime,
}: BlogCardProps) {
  const categoryName =
    typeof category === "string"
      ? category
      : category?.name ?? "Blog";

  const date =
    publishedAt ??
    (created_at
      ? new Date(created_at).toLocaleDateString()
      : "");

  const reading =
    readingTime ??
    read_time ??
    "5 min read";

  const description =
    excerpt ??
    short_description ??
    "";

  const imageUrl =
    image ??
    featured_image ??
    null;

  return (
    <article className="group overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <Link
        href={`/blog/${slug}`}
        className="block overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-gray-100 text-6xl">
            📰
          </div>
        )}
      </Link>

      <div className="p-8">

        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {categoryName}
        </span>

        <h3 className="mt-6 line-clamp-2 text-2xl font-bold leading-tight text-gray-900 transition group-hover:text-blue-600">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h3>

        <p className="mt-5 line-clamp-3 leading-8 text-gray-600">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">

          <span>
            👤 {author ?? "FinClears"}
          </span>

          <span>
            📅 {date}
          </span>

          <span>
            ⏱ {reading}
          </span>

        </div>

        <Link
          href={`/blog/${slug}`}
          className="mt-8 inline-flex items-center font-semibold text-blue-600 transition hover:text-blue-800"
        >
          Read Article

          <span className="ml-2 transition group-hover:translate-x-1">
            →
          </span>

        </Link>

      </div>

    </article>
  );
}
