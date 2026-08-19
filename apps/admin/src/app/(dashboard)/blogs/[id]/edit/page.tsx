"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/blogs/BlogForm";
import { getBlog, updateBlog } from "@/lib/api/blogs/blogApi";
import type { Blog, BlogPayload } from "@/types/blog/blog";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getBlog(id)
      .then((response) => setBlog(response.data.blog))
      .catch((error) => {
        console.error(error);
        alert("Unable to load blog.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function submit(payload: BlogPayload) {
    try {
      setSaving(true);
      await updateBlog(id, payload);
      router.push("/blogs");
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          "Unable to update blog. All required fields must be provided."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Loading...</main>;
  }

  if (!blog) {
    return <main style={{ padding: 30 }}>Blog not found.</main>;
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>Edit Blog</h1>
      <BlogForm initial={blog} loading={saving} onSubmit={submit} />
    </main>
  );
}
