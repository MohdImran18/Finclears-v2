"use client";

import BlogCard from "./BlogCard";

import type { Blog } from "@/types/blog";

interface Props {
  posts: Blog[];
}

export default function RelatedPosts({
  posts,
}: Props) {
  if (!posts.length) {
    return null;
  }

  return (
    <section className="mt-24">
      <div className="border-t pt-20">
        <div className="mb-14 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Continue Reading
          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Related Articles
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Discover more expert guides on business registration,
            taxation and compliance.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              image={post.featured_image ?? ""}
              category={post.category.name}
              author={post.author_name}
              publishedAt={post.published_at}
              readingTime={post.reading_time}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
