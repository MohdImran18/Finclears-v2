"use client";

import type { Blog } from "@/types/blog/blog";
import BlogStatusBadge from "./BlogStatusBadge";

interface Props {
  blogs: Blog[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (blog: Blog) => void;
  onPublish: (blog: Blog) => void;
  onFeature: (blog: Blog) => void;
  actionLoading?: number | null;
}

export default function BlogList({
  blogs,
  loading,
  onEdit,
  onDelete,
  onPublish,
  onFeature,
  actionLoading,
}: Props) {
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Loading blogs...
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 60,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>

        <h3 style={{ margin: "0 0 8px", color: "#0f172a" }}>
          No blogs found
        </h3>

        <p style={{ margin: 0, color: "#64748b" }}>
          Try changing your filters or create a new blog.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 950,
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "ARTICLE",
                "CATEGORY",
                "STATUS",
                "FEATURED",
                "VIEWS",
                "UPDATED",
                "ACTIONS",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: "14px 16px",
                    textAlign:
                      heading === "ACTIONS" ? "right" : "left",
                    fontSize: 11,
                    letterSpacing: ".06em",
                    color: "#64748b",
                    fontWeight: 700,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => {
              const busy = actionLoading === blog.id;

              return (
                <tr
                  key={blog.id}
                  style={{
                    borderBottom: "1px solid #eef2f7",
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background:
                            "linear-gradient(135deg,#d9f7f4,#eef9ff)",
                          display: "grid",
                          placeItems: "center",
                          color: "#0f766e",
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {blog.title?.charAt(0)?.toUpperCase() || "B"}
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "#0f172a",
                            marginBottom: 4,
                          }}
                        >
                          {blog.title}
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "#94a3b8",
                          }}
                        >
                          /{blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "16px" }}>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "#334155",
                        padding: "5px 9px",
                        borderRadius: 7,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {blog.category?.name ||
                        `Category #${blog.blog_category_id}`}
                    </span>
                  </td>

                  <td style={{ padding: "16px" }}>
                    <BlogStatusBadge status={blog.status} />
                  </td>

                  <td style={{ padding: "16px" }}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onFeature(blog)}
                      style={{
                        border: 0,
                        background: "transparent",
                        cursor: busy ? "wait" : "pointer",
                        color: blog.is_featured
                          ? "#b45309"
                          : "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      {blog.is_featured
                        ? "★ Featured"
                        : "☆ Feature"}
                    </button>
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      color: "#334155",
                      fontWeight: 600,
                    }}
                  >
                    {blog.views ?? 0}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      color: "#64748b",
                      fontSize: 12,
                    }}
                  >
                    {blog.updated_at
                      ? new Date(
                          blog.updated_at
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  <td
                    style={{
                      padding: "16px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 7,
                      }}
                    >
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onPublish(blog)}
                        style={{
                          padding: "7px 11px",
                          border: "1px solid #dbe3ec",
                          background: "#fff",
                          borderRadius: 7,
                          cursor: busy ? "wait" : "pointer",
                          color: "#334155",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        {busy
                          ? "..."
                          : blog.status
                            ? "Unpublish"
                            : "Publish"}
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onEdit(blog.id)}
                        style={{
                          padding: "7px 11px",
                          border: "1px solid #dbe3ec",
                          background: "#fff",
                          borderRadius: 7,
                          cursor: busy ? "wait" : "pointer",
                          color: "#334155",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onDelete(blog)}
                        style={{
                          padding: "7px 11px",
                          border: "1px solid #fecaca",
                          background: "#fff",
                          borderRadius: 7,
                          cursor: busy ? "wait" : "pointer",
                          color: "#dc2626",
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}