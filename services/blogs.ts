import api from "@/lib/api";

import type { Blog } from "@/types/blog";

export async function getBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/blogs");

  return data.data.blogs ?? data.data;
}

export async function getFeaturedBlogs(): Promise<Blog[]> {
  const { data } = await api.get("/blogs/featured");

  return data.data.blogs ?? data.data;
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog> {
  const { data } = await api.get(`/blogs/${slug}`);

  return data.data.blog;
}

export async function getRelatedBlogs(
  slug: string
): Promise<Blog[]> {
  const { data } = await api.get(
    `/blogs/${slug}/related`
  );

  return data.data.blogs ?? data.data;
}

export async function getBlogCategories() {
  const { data } = await api.get(
    "/blog-categories"
  );

  return data.data.categories ?? data.data;
}

export async function searchBlogs(
  keyword: string
): Promise<Blog[]> {

  const { data } =
    await api.get(
      `/blogs/search?q=${keyword}`
    );

  return data.data.blogs ?? data.data;

}