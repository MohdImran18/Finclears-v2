"use client";

import Image from "next/image";
import Link from "next/link";

import type { Blog } from "@/types/blog";

interface FeaturedPostProps {
  featured?: Blog | null;
}

export default function FeaturedPost({
  featured,
}: FeaturedPostProps) {
  if (!featured) {
    return null;
  }

  const image =
    featured.featured_image ??
    "/images/blog-placeholder.webp";

  const category =
    featured.category?.name ??
    "Blog";

  const author =
    featured.author_name ??
    "FinClears Editorial Team";

  const publishedDate = new Date(
    featured.created_at
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
      <Link
        href={`/blog/${featured.slug}`}
        className="block"
      >
        <div className="relative h-[520px]">

          <Image
            src={image}
            alt={featured.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute left-6 top-6">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">
              {category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">

            <h2 className="mb-4 text-4xl font-bold leading-tight">
              {featured.title}
            </h2>

            <p className="mb-6 line-clamp-3 max-w-3xl text-lg text-gray-200">
              {featured.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">

              <span>
                👤 {author}
              </span>

              <span>
                📅 {publishedDate}
              </span>

              <span>
                ⏱ {featured.reading_time ?? "5 min read"}
              </span>

            </div>

          </div>

        </div>
      </Link>
    </section>
  );
}