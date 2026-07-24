"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { useSearchBlogs } from "@/hooks/useSearchBlogs";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");

  const [debouncedKeyword, setDebouncedKeyword] =
    useState("");

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const {
    data: blogs = [],
    isLoading,
  } = useSearchBlogs(
    debouncedKeyword
  );

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setKeyword("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <section className="bg-white py-12">
      <div
        className="container mx-auto max-w-3xl px-6"
        ref={wrapperRef}
      >
        <div className="relative">

          <input
            type="search"
            placeholder="Search blogs..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          {debouncedKeyword.length > 1 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border bg-white shadow-xl">

              {isLoading && (
                <div className="p-6 text-center text-gray-500">
                  Searching...
                </div>
              )}

              {!isLoading &&
                blogs.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No blogs found.
                  </div>
                )}

              {!isLoading &&
                blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="flex items-center gap-4 border-b p-4 transition hover:bg-gray-50 last:border-b-0"
                  >
                    <div className="h-14 w-20 overflow-hidden rounded-lg bg-gray-100">

                      {blog.featured_image ? (
                        <img
                          src={
                            blog.featured_image
                          }
                          alt={blog.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          📰
                        </div>
                      )}

                    </div>

                    <div className="flex-1">

                      <h4 className="font-semibold text-gray-900">
                        {blog.title}
                      </h4>

                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {blog.excerpt}
                      </p>

                    </div>

                  </Link>
                ))}

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
