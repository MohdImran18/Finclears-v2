"use client";

import Link from "next/link";

interface Props {
  category: string;

  title: string;

  excerpt: string;

  image?: string | null;

  author: string;

  publishedAt: string;

  updatedAt?: string;

  readingTime: string;
}

export default function ArticleHero({
  category,
  title,
  excerpt,
  image,
  author,
  publishedAt,
  updatedAt,
  readingTime,
}: Props) {
  return (
    <section className="bg-slate-50 pb-20">
      {/* Breadcrumb */}

      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-blue-600"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/blog"
              className="hover:text-blue-600"
            >
              Blog
            </Link>

            <span>/</span>

            <span className="text-gray-900">
              {category}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-14">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            {category}
          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-gray-900 lg:text-6xl">
            {title}
          </h1>

          <p className="mt-8 text-xl leading-9 text-gray-600">
            {excerpt}
          </p>

          {/* Meta */}

          <div className="mt-10 flex flex-wrap items-center gap-8 rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                {author.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-semibold">
                  {author}
                </h3>

                <p className="text-sm text-gray-500">
                  FinClears Editorial Team
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              📅 Published

              <div className="font-medium text-gray-800">
                {publishedAt}
              </div>
            </div>

            {updatedAt && (
              <div className="text-sm text-gray-500">
                🔄 Updated

                <div className="font-medium text-gray-800">
                  {updatedAt}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              ⏱ Reading Time

              <div className="font-medium text-gray-800">
                {readingTime}
              </div>
            </div>
          </div>

          {/* Featured Image */}

          <div className="mt-12 overflow-hidden rounded-[36px] shadow-2xl">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-8xl text-white">
                📰
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
