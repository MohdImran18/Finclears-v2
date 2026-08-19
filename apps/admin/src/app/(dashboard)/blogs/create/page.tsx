"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import BlogForm from "@/components/blogs/BlogForm";
import { createBlog } from "@/lib/api/blogs/blogApi";
import type { BlogPayload } from "@/types/blog/blog";

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(payload: BlogPayload) {
    try {
      setLoading(true);

      await createBlog(payload);

      router.push("/blogs");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to create blog. Please check the required fields."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        <div style={topBarStyle}>
          <div>
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              style={backButtonStyle}
            >
              ← Back to Blogs
            </button>

            <div style={breadcrumbStyle}>
              BLOGS / CREATE
            </div>

            <h1 style={titleStyle}>
              Create New Blog
            </h1>

            <p style={subtitleStyle}>
              Create, optimize and publish a professional
              article for the FinClears website.
            </p>
          </div>
        </div>

        <BlogForm
          loading={loading}
          onSubmit={submit}
        />

      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "30px 24px 70px",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1250,
  margin: "0 auto",
};

const topBarStyle: React.CSSProperties = {
  marginBottom: 25,
};

const backButtonStyle: React.CSSProperties = {
  border: 0,
  background: "transparent",
  padding: 0,
  marginBottom: 14,
  color: "#64748b",
  fontSize: 12,
  cursor: "pointer",
};

const breadcrumbStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".08em",
  marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 28,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "#64748b",
  fontSize: 13,
};