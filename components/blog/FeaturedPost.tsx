"use client";

import Link from "next/link";

import { useFeaturedBlogs } from "@/hooks/useFeaturedBlogs";

export default function FeaturedPost() {
  const {
    data: blogs = [],
    isLoading,
  } = useFeaturedBlogs();

  if (isLoading) {
    return null;
  }

  if (!blogs.length) {
    return null;
  }

  const featured = blogs[0];

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Featured Article
          </span>

          <h2 className="mt-4 text-5xl font-bold">
            Editor's Pick
          </h2>
        </div>

        <div className="overflow-hidden rounded-[36px] bg-white shadow-2xl">
          <div className="grid lg:grid-cols-2">

            <div className="relative h-[420px] overflow-hidden">

              {featured.featured_image ? (
                <img
                  src={featured.featured_image}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-100 text-7xl">
                  📰
                </div>
              )}

              <div className="absolute left-6 top-6">
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  {featured.category.name}
                </span>
              </div>

            </div>

            <div className="flex flex-col justify-center p-12">

              <div className="flex gap-6 text-sm text-gray-500">

                <span>
                  👤 {featured.author_name}
                </span>

                <span>
                  📅 {featured.published_at}
                </span>

                <span>
                  ⏱ {featured.reading_time}
                </span>

              </div>

              <h3 className="mt-6 text-4xl font-bold">

                {featured.title}

              </h3>

              <p className="mt-6 text-lg text-gray-600">

                {featured.excerpt}

              </p>

              <div className="mt-10">

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white"
                >
                  Read Full Article →
                </Link>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
