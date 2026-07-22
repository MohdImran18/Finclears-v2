"use client";

import BlogCard from "./BlogCard";

import { useBlogs } from "@/hooks/useBlogs";

export default function BlogGrid() {

  const {
    data: blogs = [],
    isLoading,
    error,
  } = useBlogs();

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <section className="bg-white py-20">

        <div className="container mx-auto px-6">

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {Array.from({ length: 6 }).map((_, index) => (

              <div
                key={index}
                className="h-[520px] animate-pulse rounded-3xl bg-gray-100"
              />

            ))}

          </div>

        </div>

      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <section className="bg-white py-20">

        <div className="container mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            Unable to load blogs
          </h2>

          <p className="mt-4 text-gray-500">
            Please try again later.
          </p>

        </div>

      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty
  |--------------------------------------------------------------------------
  */

  if (!blogs.length) {
    return (
      <section className="bg-white py-20">

        <div className="container mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold">
            No Blogs Found
          </h2>

          <p className="mt-4 text-gray-500">
            No articles are available yet.
          </p>

        </div>

      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Success
  |--------------------------------------------------------------------------
  */

  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {blogs.map((blog: any) => (

            <BlogCard
              key={blog.id}
              slug={blog.slug}
              title={blog.title}
              excerpt={blog.excerpt}
              short_description={blog.short_description}
              featured_image={blog.featured_image}
              category={blog.category}
              author={blog.author}
              created_at={blog.created_at}
              read_time={blog.read_time}
            />

          ))}

        </div>

      </div>

    </section>
  );
}
