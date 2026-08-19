"use client";

interface Props {
  open: boolean;
  title?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function BlogDeleteDialog({
  open,
  title,
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>

        <div style={warningIconStyle}>
          !
        </div>

        <h2 style={titleStyle}>
          Delete article?
        </h2>

        <p style={descriptionStyle}>
          You are about to permanently delete:
        </p>

        <div style={articleBoxStyle}>
          <strong>
            {title || "this blog"}
          </strong>
        </div>

        <p style={warningTextStyle}>
          This action cannot be undone.
        </p>

        <div style={actionsStyle}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={cancelButtonStyle}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={deleteButtonStyle}
          >
            {loading
              ? "Deleting..."
              : "Delete Article"}
          </button>
        </div>

      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "rgba(15,23,42,.48)",
  backdropFilter: "blur(4px)",
};

const dialogStyle: React.CSSProperties = {
  width: "min(430px, 100%)",
  boxSizing: "border-box",
  padding: 25,
  borderRadius: 16,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 25px 70px rgba(15,23,42,.22)",
};

const warningIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  marginBottom: 15,
  borderRadius: 11,
  background: "#fef2f2",
  color: "#dc2626",
  fontSize: 20,
  fontWeight: 900,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 20,
  fontWeight: 800,
};

const descriptionStyle: React.CSSProperties = {
  margin: "9px 0",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.5,
};

const articleBoxStyle: React.CSSProperties = {
  padding: "11px 13px",
  borderRadius: 9,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 13,
};

const warningTextStyle: React.CSSProperties = {
  margin: "12px 0 20px",
  color: "#dc2626",
  fontSize: 11,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 9,
};

const cancelButtonStyle: React.CSSProperties = {
  height: 39,
  padding: "0 15px",
  borderRadius: 8,
  border: "1px solid #d8e0ea",
  background: "#fff",
  color: "#334155",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const deleteButtonStyle: React.CSSProperties = {
  height: 39,
  padding: "0 15px",
  borderRadius: 8,
  border: 0,
  background: "#dc2626",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};