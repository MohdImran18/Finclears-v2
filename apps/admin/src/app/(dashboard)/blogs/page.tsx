"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import BlogList from "@/components/blogs/BlogList";
import BlogFilters from "@/components/blogs/BlogFilters";
import BlogDeleteDialog from "@/components/blogs/BlogDeleteDialog";

import {
  deleteBlog,
  featureBlog,
  getBlogs,
  publishBlog,
  unfeatureBlog,
  unpublishBlog,
} from "@/lib/api/blogs/blogApi";

import type { Blog } from "@/types/blog/blog";

export default function BlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featured, setFeatured] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Blog | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const response = await getBlogs({
        per_page: 50,
        search: search || undefined,
        status:
          status === ""
            ? undefined
            : status === "1",
        featured:
          featured === ""
            ? undefined
            : featured === "1",
      });

      setBlogs(response.data?.blogs || []);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load blogs. Please check your login session."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [search, status, featured]);

  async function handlePublish(blog: Blog) {
    try {
      setActionLoading(blog.id);

      if (blog.status) {
        await unpublishBlog(blog.id);
      } else {
        await publishBlog(blog.id);
      }

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to update publish status."
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleFeature(blog: Blog) {
    try {
      setActionLoading(blog.id);

      if (blog.is_featured) {
        await unfeatureBlog(blog.id);
      } else {
        await featureBlog(blog.id);
      }

      await load();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Unable to update featured status."
      );
    } finally {
      setActionLoading(null);
    }
  }
  async function remove() {
    if (!selected) return;

    try {
      setDeleting(true);

      await deleteBlog(selected.id);

      setSelected(null);

      await load();
    } catch (error) {
      console.error(error);
      alert("Unable to delete blog.");
    } finally {
      setDeleting(false);
    }
  }

  const stats = useMemo(() => {
    const published = blogs.filter(
      (blog) => blog.status
    ).length;

    const drafts = blogs.filter(
      (blog) => !blog.status
    ).length;

    const featuredCount = blogs.filter(
      (blog) => blog.is_featured
    ).length;

    return {
      total: blogs.length,
      published,
      drafts,
      featured: featuredCount,
    };
  }, [blogs]);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        {/* HEADER */}
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              <span style={brandMarkStyle}>B</span>
              CONTENT MANAGEMENT
            </div>

            <h1 style={titleStyle}>
              Blog Management
            </h1>

            <p style={subtitleStyle}>
              Create, manage and publish content for the
              FinClears website.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/blogs/create")
            }
            style={primaryButtonStyle}
          >
            + Create New Blog
          </button>
        </header>

        {/* STATS */}
        <div style={statsGridStyle}>

          <StatCard
            label="Total Blogs"
            value={stats.total}
            icon="▥"
            iconBackground="#ecfeff"
            iconColor="#0f766e"
          />

          <StatCard
            label="Published"
            value={stats.published}
            icon="✓"
            iconBackground="#ecfdf5"
            iconColor="#059669"
          />

          <StatCard
            label="Drafts"
            value={stats.drafts}
            icon="◷"
            iconBackground="#fff7ed"
            iconColor="#ea580c"
          />

          <StatCard
            label="Featured"
            value={stats.featured}
            icon="★"
            iconBackground="#f5f3ff"
            iconColor="#7c3aed"
          />

        </div>

        {/* ERROR */}
        {error && (
          <div style={errorBoxStyle}>
            <div>
              <strong>Unable to load blogs</strong>
              <div style={errorTextStyle}>
                {error}
              </div>
            </div>

            <button
              type="button"
              onClick={load}
              style={retryButtonStyle}
            >
              Retry
            </button>
          </div>
        )}

        {/* FILTERS */}
        <BlogFilters
          search={search}
          status={status}
          featured={featured}
          onSearch={setSearch}
          onStatus={setStatus}
          onFeatured={setFeatured}
        />

        {/* TABLE */}
        <section style={tableCardStyle}>
          <div style={tableHeaderStyle}>
            <div>
              <h2 style={tableTitleStyle}>
                Articles
              </h2>

              <p style={tableSubtitleStyle}>
                Manage your website content.
              </p>
            </div>

            <div style={countBadgeStyle}>
              {blogs.length} article
              {blogs.length === 1 ? "" : "s"}
            </div>
          </div>

          <BlogList
            blogs={blogs}
            loading={loading}
            onEdit={(id) =>
              router.push(`/blogs/${id}/edit`)
            }
            onDelete={setSelected}
            onPublish={handlePublish}
            onFeature={handleFeature}
            actionLoading={actionLoading}
          />
        </section>

      </div>

      <BlogDeleteDialog
        open={!!selected}
        title={selected?.title}
        loading={deleting}
        onCancel={() => setSelected(null)}
        onConfirm={remove}
      />
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBackground,
  iconColor,
}: {
  label: string;
  value: number;
  icon: string;
  iconBackground: string;
  iconColor: string;
}) {
  return (
    <div style={statCardStyle}>
      <div
        style={{
          ...statIconStyle,
          background: iconBackground,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <div>
        <div style={statLabelStyle}>
          {label}
        </div>

        <div style={statValueStyle}>
          {value}
        </div>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f6f8fb",
  padding: "34px 24px 60px",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1250,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 24,
  marginBottom: 26,
};

const eyebrowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#0f766e",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: ".04em",
  marginBottom: 10,
};

const brandMarkStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 9,
  display: "grid",
  placeItems: "center",
  background: "#0f766e",
  color: "#fff",
  fontSize: 17,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 29,
  lineHeight: 1.15,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  color: "#64748b",
  fontSize: 14,
};

const primaryButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 18px",
  border: 0,
  borderRadius: 9,
  background: "#0f766e",
  color: "#fff",
  fontSize: 13,
  fontWeight: 750,
  cursor: "pointer",
  boxShadow: "0 5px 15px rgba(15,118,110,.18)",
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(4, minmax(0, 1fr))",
  gap: 14,
  marginBottom: 20,
};

const statCardStyle: React.CSSProperties = {
  minHeight: 92,
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: 17,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 13,
};

const statIconStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  fontSize: 17,
  fontWeight: 800,
};

const statLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  marginBottom: 3,
};

const statValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 22,
  fontWeight: 800,
};

const errorBoxStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: "13px 16px",
  marginBottom: 18,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: 10,
  color: "#9a3412",
  fontSize: 13,
};

const errorTextStyle: React.CSSProperties = {
  marginTop: 3,
  fontSize: 12,
  color: "#c2410c",
};

const retryButtonStyle: React.CSSProperties = {
  border: "1px solid #fdba74",
  background: "#fff",
  color: "#c2410c",
  borderRadius: 7,
  padding: "7px 12px",
  cursor: "pointer",
  fontWeight: 700,
};

const tableCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  overflow: "hidden",
};

const tableHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: "17px 18px",
  borderBottom: "1px solid #eef2f7",
};

const tableTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 800,
};

const tableSubtitleStyle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#94a3b8",
  fontSize: 11,
};

const countBadgeStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  color: "#475569",
  fontSize: 11,
  fontWeight: 700,
};