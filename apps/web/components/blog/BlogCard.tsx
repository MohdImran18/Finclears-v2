"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogCategory {
  name: string;
}

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string | null;
  category?: BlogCategory | null;
  author: string;
  created_at: string;
  reading_time?: string | null;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  featured_image,
  category,
  author,
  created_at,
  reading_time,
}: BlogCardProps) {
  const imageUrl =
    featured_image ||
    "/images/blog-placeholder.webp";

  const publishedDate = new Date(
    created_at
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group overflow-hidden rounded-[32px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

      <Link
        href={`/blog/${slug}`}
        className="block overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={title}
          width={800}
          height={500}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          priority={false}
        />
      </Link>

      <div className="p-8">

        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          {category?.name ?? "Blog"}
        </span>

        <h3 className="mt-6 line-clamp-2 text-2xl font-bold leading-tight text-gray-900 transition group-hover:text-blue-600">
          <Link href={`/blog/${slug}`}>
            {title}
          </Link>
        </h3>

        <p className="mt-5 line-clamp-3 leading-8 text-gray-600">
          {excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>👤 {author}</span>

          <span>📅 {publishedDate}</span>

          <span>
            ⏱ {reading_time ?? "5 min read"}
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