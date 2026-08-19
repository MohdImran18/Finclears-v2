"use client";

interface Props {
  search: string;
  status: string;
  featured: string;
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onFeatured: (value: string) => void;
}

export default function ServiceFilters({
  search,
  status,
  featured,
  onSearch,
  onStatus,
  onFeatured,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search services..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "11px 13px",
          border: "1px solid #dbe2ea",
          borderRadius: 9,
          outline: "none",
        }}
      />

      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        style={{
          padding: "11px 13px",
          border: "1px solid #dbe2ea",
          borderRadius: 9,
          background: "#fff",
        }}
      >
        <option value="">All Status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>

      <select
        value={featured}
        onChange={(e) => onFeatured(e.target.value)}
        style={{
          padding: "11px 13px",
          border: "1px solid #dbe2ea",
          borderRadius: 9,
          background: "#fff",
        }}
      >
        <option value="">All Services</option>
        <option value="1">Featured</option>
        <option value="0">Not Featured</option>
      </select>
    </div>
  );
}