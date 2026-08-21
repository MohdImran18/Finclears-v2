"use client";

import { useEffect, useMemo, useState } from "react";
import type { Blog, BlogPayload } from "@/types/blog/blog";
import {
  getBlogCategories,
  type BlogCategory,
} from "@/lib/api/blogs/blogApi";

interface Props {
  initial?: Blog | null;
  loading?: boolean;
  onSubmit: (payload: BlogPayload) => Promise<void>;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDateForInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export default function BlogForm({
  initial,
  loading = false,
  onSubmit,
}: Props) {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [slugTouched, setSlugTouched] = useState(!!initial);

  const [form, setForm] = useState<BlogPayload>({
    blog_category_id: initial?.blog_category_id ?? 1,
    user_id: initial?.user_id ?? null,
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    featured_image: initial?.featured_image ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    reading_time:
      initial?.reading_time != null
        ? Number(initial.reading_time)
        : null,
    author_name: initial?.author_name ?? "FinClears",
    published_at: initial?.published_at ?? "",
    meta_title: initial?.meta_title ?? "",
    meta_description: initial?.meta_description ?? "",
    meta_keywords: initial?.meta_keywords ?? "",
    is_featured: initial?.is_featured ?? false,
    status: initial?.status ?? false,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoriesLoading(true);
        setCategoryError("");

        const response = await getBlogCategories();

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error(error);
        setCategoryError("Unable to load categories.");
      } finally {
        setCategoriesLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!initial) return;

    setForm({
      blog_category_id: initial.blog_category_id,
      user_id: initial.user_id ?? null,
      title: initial.title ?? "",
      slug: initial.slug ?? "",
      featured_image: initial.featured_image ?? "",
      excerpt: initial.excerpt ?? "",
      content: initial.content ?? "",
      reading_time: initial.reading_time ?? null,
      author_name: initial.author_name ?? "FinClears",
      published_at: initial.published_at ?? "",
      meta_title: initial.meta_title ?? "",
      meta_description: initial.meta_description ?? "",
      meta_keywords: initial.meta_keywords ?? "",
      is_featured: initial.is_featured ?? false,
      status: initial.status ?? false,
    });

    setSlugTouched(true);
  }, [initial]);

  const set = <K extends keyof BlogPayload>(
    key: K,
    value: BlogPayload[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const wordCount = useMemo(() => {
    return form.content
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [form.content]);

  const calculatedReadingTime = Math.max(
    1,
    Math.ceil(wordCount / 200)
  );

  const titleLength = form.title.length;
  const excerptLength = (form.excerpt || "").length;
  const metaTitleLength = (form.meta_title || "").length;
  const metaDescriptionLength = (form.meta_description || "").length;

  const imageUrl = form.featured_image || "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: BlogPayload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt?.trim() || "",
      content: form.content.trim(),
      author_name: form.author_name?.trim() || "FinClears",
      meta_title: form.meta_title?.trim() || "",
      meta_description: form.meta_description?.trim() || "",
      meta_keywords: form.meta_keywords?.trim() || "",
      reading_time:
        Number(form.reading_time || calculatedReadingTime),
      published_at:
        form.status && !form.published_at
          ? new Date().toISOString()
          : form.published_at || "",
    };

    await onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 330px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          {/* ARTICLE CONTENT */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <div style={iconBoxStyle}>✎</div>
              <div>
                <h2 style={sectionTitleStyle}>Article Content</h2>
                <p style={sectionDescriptionStyle}>
                  Create and optimize the main content of your article.
                </p>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Blog Title <span style={requiredStyle}>*</span>
              </label>

              <input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;

                  setForm((current) => ({
                    ...current,
                    title,
                    slug: slugTouched
                      ? current.slug
                      : slugify(title),
                  }));
                }}
                placeholder="Enter a clear and engaging blog title"
                maxLength={120}
                required
                disabled={loading}
                style={inputStyle}
              />

              <div style={helperRowStyle}>
                <span>Write a clear and engaging title for your article.</span>
                <span>{titleLength}/120</span>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                URL Slug <span style={requiredStyle}>*</span>
              </label>

              <div style={slugWrapperStyle}>
                <span style={slugPrefixStyle}>/blog/</span>

                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  placeholder="your-blog-url"
                  required
                  disabled={loading}
                  style={slugInputStyle}
                />
              </div>

              <div style={helperRowStyle}>
                <span>Use lowercase words separated by hyphens.</span>
                <span>{form.slug.length} characters</span>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Featured Image URL
              </label>

              <input
                value={form.featured_image || ""}
                onChange={(e) =>
                  set("featured_image", e.target.value)
                }
                placeholder="https://example.com/image.jpg"
                disabled={loading}
                style={inputStyle}
              />

              {imageUrl && (
                <div style={imagePreviewStyle}>
                  <img
                    src={imageUrl}
                    alt="Featured preview"
                    style={imagePreviewImageStyle}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <div style={imagePreviewOverlayStyle}>
                    Featured image preview
                  </div>
                </div>
              )}
            </div>

            <div style={fieldGroupStyle}>
              <div style={labelWithCounterStyle}>
                <label style={labelStyle}>Excerpt</label>
                <span style={counterStyle}>
                  {excerptLength}/300
                </span>
              </div>

              <textarea
                value={form.excerpt || ""}
                onChange={(e) =>
                  set("excerpt", e.target.value)
                }
                maxLength={300}
                rows={4}
                placeholder="Write a short summary that will appear on blog cards and listings..."
                disabled={loading}
                style={textareaStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <div style={labelWithCounterStyle}>
                <label style={labelStyle}>
                  Article Content <span style={requiredStyle}>*</span>
                </label>

                <span style={counterStyle}>
                  {wordCount} words
                </span>
              </div>

              <textarea
                value={form.content}
                onChange={(e) =>
                  set("content", e.target.value)
                }
                rows={18}
                required
                placeholder="Start writing your blog article..."
                disabled={loading}
                style={{
                  ...textareaStyle,
                  minHeight: 360,
                  lineHeight: 1.7,
                }}
              />

              <div style={helperRowStyle}>
                <span>
                  Recommended reading time: approximately{" "}
                  {calculatedReadingTime} min
                </span>

                <button
                  type="button"
                  onClick={() =>
                    set(
                      "reading_time",
                      calculatedReadingTime
                    )
                  }
                  disabled={loading}
                  style={smallButtonStyle}
                >
                  Use calculated time
                </button>
              </div>
            </div>
          </section>

          {/* SEO */}
          <section style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <div style={seoIconStyle}>⌕</div>
              <div>
                <h2 style={sectionTitleStyle}>SEO Settings</h2>
                <p style={sectionDescriptionStyle}>
                  Optimize how this article appears in search engines.
                </p>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <div style={labelWithCounterStyle}>
                <label style={labelStyle}>Meta Title</label>
                <span
                  style={{
                    ...counterStyle,
                    color:
                      metaTitleLength > 60
                        ? "#dc2626"
                        : "#64748b",
                  }}
                >
                  {metaTitleLength}/60
                </span>
              </div>

              <input
                value={form.meta_title || ""}
                onChange={(e) =>
                  set("meta_title", e.target.value)
                }
                maxLength={70}
                placeholder="SEO title for Google search results"
                disabled={loading}
                style={inputStyle}
              />

              <div style={helperTextStyle}>
                Keep the SEO title around 50–60 characters.
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <div style={labelWithCounterStyle}>
                <label style={labelStyle}>
                  Meta Description
                </label>
                <span
                  style={{
                    ...counterStyle,
                    color:
                      metaDescriptionLength > 160
                        ? "#dc2626"
                        : "#64748b",
                  }}
                >
                  {metaDescriptionLength}/160
                </span>
              </div>

              <textarea
                value={form.meta_description || ""}
                onChange={(e) =>
                  set("meta_description", e.target.value)
                }
                maxLength={170}
                rows={4}
                placeholder="Write a compelling description for search engines..."
                disabled={loading}
                style={textareaStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Meta Keywords
              </label>

              <textarea
                value={form.meta_keywords || ""}
                onChange={(e) =>
                  set("meta_keywords", e.target.value)
                }
                rows={3}
                placeholder="income tax, ITR filing, tax return, India"
                disabled={loading}
                style={textareaStyle}
              />
            </div>

            {/* GOOGLE PREVIEW */}
            <div style={googlePreviewStyle}>
              <div style={googleLabelStyle}>
                GOOGLE SEARCH PREVIEW
              </div>

              <div style={googleTitleStyle}>
                {form.meta_title ||
                  form.title ||
                  "Your blog title will appear here"}
              </div>

              <div style={googleUrlStyle}>
                finclears.com/blog/
                {form.slug || "your-blog-url"}
              </div>

              <div style={googleDescriptionStyle}>
                {form.meta_description ||
                  form.excerpt ||
                  "Your meta description will appear here in search results."}
              </div>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <aside
          style={{
            display: "grid",
            gap: 20,
            position: "sticky",
            top: 20,
          }}
        >
          {/* PUBLISHING */}
          <section style={sidebarCardStyle}>
            <div style={sidebarHeaderStyle}>
              <h2 style={sectionTitleStyle}>Publishing</h2>
              <p style={sectionDescriptionStyle}>
                Control how this article appears on the website.
              </p>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Category <span style={requiredStyle}>*</span>
              </label>

              <select
                value={form.blog_category_id}
                onChange={(e) =>
                  set(
                    "blog_category_id",
                    Number(e.target.value)
                  )
                }
                required
                disabled={categoriesLoading || loading}
                style={inputStyle}
              >
                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {categoryError && (
                <div style={errorTextStyle}>
                  {categoryError}
                </div>
              )}
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Reading Time
              </label>

              <div style={inputWithSuffixStyle}>
                <input
                  type="number"
                  min={1}
                  value={form.reading_time ?? ""}
                  onChange={(e) =>
                    set(
                      "reading_time",
                      e.target.value
                        ? Number(e.target.value)
                        : null
                    )
                  }
                  placeholder={String(calculatedReadingTime)}
                  disabled={loading}
                  style={suffixInputStyle}
                />

                <span style={suffixStyle}>min</span>
              </div>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Author Name
              </label>

              <input
                value={form.author_name || ""}
                onChange={(e) =>
                  set("author_name", e.target.value)
                }
                placeholder="FinClears"
                disabled={loading}
                style={inputStyle}
              />
            </div>

            <div style={dividerStyle} />

            <ToggleRow
              title="Publish Status"
              description={
                form.status
                  ? "This article will be published."
                  : "This article will remain unpublished."
              }
              checked={!!form.status}
              disabled={loading}
              onChange={(value) =>
                set("status", value)
              }
            />

            <div style={dividerStyle} />

            <ToggleRow
              title="Featured Article"
              description="Highlight this article on the website."
              checked={!!form.is_featured}
              disabled={loading}
              onChange={(value) =>
                set("is_featured", value)
              }
            />

            <div style={dividerStyle} />

            <div
              style={{
                padding: 14,
                borderRadius: 10,
                background: form.status
                  ? "#ecfdf5"
                  : "#f8fafc",
                border: `1px solid ${
                  form.status ? "#bbf7d0" : "#e2e8f0"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 700,
                  color: form.status
                    ? "#047857"
                    : "#475569",
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: form.status
                      ? "#10b981"
                      : "#f59e0b",
                  }}
                />

                {form.status ? "Published" : "Draft"}
              </div>

              <div
                style={{
                  marginTop: 5,
                  color: "#64748b",
                  fontSize: 12,
                }}
              >
                {form.status
                  ? "Visible on the public website."
                  : "Only available in the admin panel."}
              </div>
            </div>
          </section>

          {/* SUMMARY */}
          <section style={sidebarCardStyle}>
            <h2 style={sectionTitleStyle}>Article Summary</h2>

            <p style={sectionDescriptionStyle}>
              Quick overview of this article.
            </p>

            <SummaryRow
              label="Title"
              value={form.title || "Not added"}
            />

            <SummaryRow
              label="Category"
              value={
                categories.find(
                  (category) =>
                    category.id === form.blog_category_id
                )?.name || "Not selected"
              }
            />

            <SummaryRow
              label="Reading time"
              value={`${form.reading_time || calculatedReadingTime} min`}
            />

            <SummaryRow
              label="Words"
              value={String(wordCount)}
            />

            <SummaryRow
              label="Featured"
              value={form.is_featured ? "Yes" : "No"}
            />

            <SummaryRow
              label="Status"
              value={form.status ? "Published" : "Draft"}
              last
            />
          </section>
        </aside>
      </div>

      {/* ACTION BAR */}
      <div style={actionBarStyle}>
        <div>
          <strong style={{ fontSize: 14 }}>
            {form.status
              ? "Ready to publish"
              : "Save this article as a draft"}
          </strong>

          <div style={actionHintStyle}>
            Changes will be saved to the FinClears content system.
          </div>
        </div>

        <div style={actionButtonsStyle}>
          <button
            type="button"
            onClick={() => window.history.back()}
            disabled={loading}
            style={secondaryButtonStyle}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              loading ||
              categoriesLoading ||
              categories.length === 0
            }
            style={primaryButtonStyle}
          >
            {loading
              ? "Saving..."
              : initial
                ? "Update Blog"
                : "Create Blog"}
          </button>
        </div>
      </div>
    </form>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 13,
            color: "#0f172a",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#64748b",
            fontSize: 12,
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          flexShrink: 0,
          width: 42,
          height: 24,
          padding: 2,
          border: 0,
          borderRadius: 999,
          background: checked ? "#0f8b83" : "#cbd5e1",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all .2s ease",
        }}
      >
        <span
          style={{
            display: "block",
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            transform: checked
              ? "translateX(18px)"
              : "translateX(0)",
            transition: "transform .2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }}
        />
      </button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 0",
        borderBottom: last
          ? "none"
          : "1px solid #eef2f7",
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: 12,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#0f172a",
          fontSize: 12,
          fontWeight: 600,
          textAlign: "right",
          maxWidth: 180,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 1px 2px rgba(15,23,42,.03)",
};

const sidebarCardStyle: React.CSSProperties = {
  ...cardStyle,
  padding: 20,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "18px 20px",
  borderBottom: "1px solid #eef2f7",
};

const sidebarHeaderStyle: React.CSSProperties = {
  marginBottom: 20,
};

const iconBoxStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  background: "#0f172a",
  color: "#ffffff",
  fontSize: 18,
};

const seoIconStyle: React.CSSProperties = {
  ...iconBoxStyle,
  background: "#0f766e",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 16,
  fontWeight: 750,
};

const sectionDescriptionStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: 12,
  lineHeight: 1.5,
};

const fieldGroupStyle: React.CSSProperties = {
  margin: 20,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
};

const requiredStyle: React.CSSProperties = {
  color: "#dc2626",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  height: 42,
  padding: "0 13px",
  border: "1px solid #d8e0ea",
  borderRadius: 9,
  outline: "none",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: 13,
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  padding: "12px 13px",
  resize: "vertical",
  fontFamily: "inherit",
};

const helperRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginTop: 6,
  color: "#94a3b8",
  fontSize: 11,
};

const helperTextStyle: React.CSSProperties = {
  marginTop: 6,
  color: "#94a3b8",
  fontSize: 11,
};

const labelWithCounterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const counterStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 11,
};

const slugWrapperStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: 42,
  border: "1px solid #d8e0ea",
  borderRadius: 9,
  overflow: "hidden",
};

const slugPrefixStyle: React.CSSProperties = {
  padding: "0 12px",
  color: "#94a3b8",
  background: "#f8fafc",
  height: "100%",
  display: "flex",
  alignItems: "center",
  fontSize: 13,
};

const slugInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  padding: "0 12px",
  fontSize: 13,
  color: "#0f172a",
};

const imagePreviewStyle: React.CSSProperties = {
  position: "relative",
  marginTop: 12,
  height: 190,
  borderRadius: 10,
  overflow: "hidden",
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
};

const imagePreviewImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imagePreviewOverlayStyle: React.CSSProperties = {
  position: "absolute",
  left: 10,
  bottom: 10,
  padding: "5px 8px",
  borderRadius: 6,
  background: "rgba(15,23,42,.75)",
  color: "#fff",
  fontSize: 10,
};

const inputWithSuffixStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #d8e0ea",
  borderRadius: 9,
  height: 42,
  overflow: "hidden",
};

const suffixInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  height: "100%",
  border: 0,
  outline: "none",
  padding: "0 13px",
  fontSize: 13,
};

const suffixStyle: React.CSSProperties = {
  padding: "0 12px",
  color: "#64748b",
  fontSize: 12,
};

const dividerStyle: React.CSSProperties = {
  height: 1,
  background: "#eef2f7",
  margin: "18px 0",
};

const googlePreviewStyle: React.CSSProperties = {
  margin: 20,
  padding: 16,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
};

const googleLabelStyle: React.CSSProperties = {
  marginBottom: 10,
  color: "#94a3b8",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".08em",
};

const googleTitleStyle: React.CSSProperties = {
  color: "#1a0dab",
  fontSize: 18,
  lineHeight: 1.3,
  marginBottom: 4,
};

const googleUrlStyle: React.CSSProperties = {
  color: "#188038",
  fontSize: 12,
  marginBottom: 5,
};

const googleDescriptionStyle: React.CSSProperties = {
  color: "#4d5156",
  fontSize: 12,
  lineHeight: 1.5,
};

const errorTextStyle: React.CSSProperties = {
  marginTop: 7,
  color: "#dc2626",
  fontSize: 11,
};

const smallButtonStyle: React.CSSProperties = {
  border: "1px solid #d8e0ea",
  background: "#ffffff",
  color: "#334155",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 10,
  cursor: "pointer",
};

const actionBarStyle: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  zIndex: 20,
  marginTop: 24,
  padding: "14px 18px",
  background: "rgba(255,255,255,.96)",
  backdropFilter: "blur(10px)",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  boxShadow: "0 -4px 20px rgba(15,23,42,.06)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
};

const actionHintStyle: React.CSSProperties = {
  marginTop: 3,
  color: "#94a3b8",
  fontSize: 11,
};

const actionButtonsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const secondaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 16px",
  borderRadius: 8,
  border: "1px solid #d8e0ea",
  background: "#ffffff",
  color: "#334155",
  fontSize: 13,
  fontWeight: 650,
  cursor: "pointer",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 20px",
  borderRadius: 8,
  border: 0,
  background: "#0f8b83",
  color: "#ffffff",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};