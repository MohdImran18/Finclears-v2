"use client";

export default function BlogStatusBadge({
  status,
}: {
  status: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 750,
        background: status ? "#ecfdf3" : "#fff7ed",
        color: status ? "#15803d" : "#c2410c",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: status ? "#22c55e" : "#f97316",
        }}
      />

      {status ? "Published" : "Draft"}
    </span>
  );
}