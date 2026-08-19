"use client";

interface Props {
  open: boolean;
  title?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ServiceDeleteDialog({
  open,
  title,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.55)",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(440px, 100%)",
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,.18)",
        }}
      >
        <h2 style={{ margin: "0 0 10px", fontSize: 20 }}>
          Delete Service
        </h2>

        <p style={{ margin: "0 0 24px", color: "#64748b" }}>
          Are you sure you want to delete{" "}
          <strong>{title || "this service"}</strong>?
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: 0,
              background: "#dc2626",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}