"use client";

export default function ServiceStatusBadge({
  status,
}: {
  status: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: status ? "#dcfce7" : "#fee2e2",
        color: status ? "#166534" : "#991b1b",
      }}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
}