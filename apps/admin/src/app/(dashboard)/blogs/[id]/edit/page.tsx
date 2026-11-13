"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "@/components/blogs/BlogForm";
import { getBlog, updateBlog } from "@/lib/api/blogs/blogApi";
import type { Blog, BlogPayload } from "@/types/blog/blog";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getWorkspaceRoute } from "@/lib/auth/workspaceRoute";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const roles = user?.spatie_roles || [];
  const canManageBlogs =
    user?.role === "admin" ||
    roles.includes("admin") ||
    roles.includes("super-admin");
  const id = Number(params.id);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!canManageBlogs) {
      router.replace(user ? getWorkspaceRoute(user) : "/login");
      return;
    }

    if (!id) return;

    getBlog(id)
      .then((response) => setBlog(response.data.blog))
      .catch((error) => {
        console.error(error);
        alert("Unable to load blog.");
      })
      .finally(() => setLoading(false));
  }, [id, authLoading, canManageBlogs, router, user]);

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

  if (authLoading || !canManageBlogs || loading) {
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
