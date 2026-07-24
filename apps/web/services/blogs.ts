import api from "@/lib/api";

import type { Blog } from "@/types/blog";

export async function getBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/v1/blogs");

  return data.data.blogs ?? [];
}

export async function getFeaturedBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/v1/blogs/featured");

  return data.data.blogs ?? [];
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog> {
  const { data } = await api.get(
    `/v1/blogs/${slug}`
  );

  return data.data.blog;
}

export async function getRelatedBlogs(
  slug: string
): Promise<Blog[]> {
  // Laravel route not available yet.
  // Returning empty array avoids 404 errors.
  return [];
}

export async function getBlogCategories() {
  const { data } = await api.get(
    "/v1/blogs/categories"
  );

  return data.data.categories ?? [];
}

export async function searchBlogs(
  keyword: string
): Promise<Blog[]> {
  const { data } = await api.get(
    `/v1/blogs/search?q=${encodeURIComponent(
      keyword
    )}`
  );

  return data.data.blogs ?? [];
}