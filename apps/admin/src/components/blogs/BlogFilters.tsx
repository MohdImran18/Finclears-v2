"use client";

interface Props {
  search: string;
  status: string;
  featured: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onFeatured: (value: string) => void;
}

export default function BlogFilters({
  search,
  status,
  featured,
  onSearch,
  onStatus,
  onFeatured,
}: Props) {
  return (
    <div style={wrapperStyle}>

      <div style={searchWrapperStyle}>
        <span style={searchIconStyle}>⌕</span>

        <input
          value={search}
          onChange={(e) =>
            onSearch(e.target.value)
          }
          placeholder="Search blogs by title or keyword..."
          style={searchInputStyle}
        />

        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            style={clearButtonStyle}
          >
            ×
          </button>
        )}
      </div>

      <select
        value={status}
        onChange={(e) =>
          onStatus(e.target.value)
        }
        style={selectStyle}
      >
        <option value="">All Status</option>
        <option value="1">Published</option>
        <option value="0">Draft</option>
      </select>

      <select
        value={featured}
        onChange={(e) =>
          onFeatured(e.target.value)
        }
        style={selectStyle}
      >
        <option value="">All Articles</option>
        <option value="1">Featured</option>
        <option value="0">Not Featured</option>
      </select>

    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 2fr) 1fr 1fr",
  gap: 10,
  padding: 10,
  marginBottom: 18,
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
};

const searchWrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  color: "#94a3b8",
  fontSize: 16,
  pointerEvents: "none",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  boxSizing: "border-box",
  padding: "0 35px",
  border: "1px solid #d8e0ea",
  borderRadius: 8,
  outline: "none",
  color: "#0f172a",
  fontSize: 12,
  background: "#fff",
};

const clearButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: 8,
  width: 25,
  height: 25,
  border: 0,
  borderRadius: 6,
  background: "#f1f5f9",
  color: "#64748b",
  cursor: "pointer",
  fontSize: 16,
};

const selectStyle: React.CSSProperties = {
  height: 40,
  width: "100%",
  boxSizing: "border-box",
  padding: "0 11px",
  border: "1px solid #d8e0ea",
  borderRadius: 8,
  background: "#fff",
  color: "#334155",
  fontSize: 12,
  outline: "none",
};