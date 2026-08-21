"use client";

import type { Lead } from "@/types/lead/lead";

interface LeadListProps {
  leads: Lead[];
  loading?: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadList({
  leads,
  loading,
  onEdit,
  onDelete,
}: LeadListProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={loadingStyle}>Loading leads...</div>
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div style={cardStyle}>
        <div style={emptyStyle}>No leads found.</div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Lead</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Source</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Priority</th>
              <th style={thStyle}>Value</th>
              <th style={thStyle}>Follow-up</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td style={tdStyle}>
                  <div style={nameStyle}>{lead.name}</div>

                  {lead.company_name && (
                    <div style={mutedStyle}>{lead.company_name}</div>
                  )}

                  {lead.email && (
                    <div style={mutedStyle}>{lead.email}</div>
                  )}
                </td>

                <td style={tdStyle}>{lead.phone}</td>

                <td style={tdStyle}>
                  {lead.source?.name || "—"}
                </td>

                <td style={tdStyle}>
                  <span style={statusStyle(lead.status)}>
                    {lead.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <span style={priorityStyle(lead.priority)}>
                    {lead.priority}
                  </span>
                </td>

                <td style={tdStyle}>
                  {lead.estimated_value
                    ? `₹${Number(
                        lead.estimated_value
                      ).toLocaleString("en-IN")}`
                    : "—"}
                </td>

                <td style={tdStyle}>
                  {lead.next_follow_up_at
                    ? new Date(
                        lead.next_follow_up_at
                      ).toLocaleDateString("en-IN")
                    : "—"}
                </td>

                <td style={tdStyle}>
                  <div style={actionStyle}>
                    <button
                      type="button"
                      onClick={() => onEdit(lead)}
                      style={editButtonStyle}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(lead)}
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 13,
  overflow: "hidden",
};

const tableWrapStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1050,
};

const thStyle: React.CSSProperties = {
  padding: "13px 14px",
  textAlign: "left",
  background: "#f8fafc",
  borderBottom: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
};

const tdStyle: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: 13,
  verticalAlign: "middle",
};

const nameStyle: React.CSSProperties = {
  color: "#0f172a",
  fontWeight: 750,
  marginBottom: 3,
};

const mutedStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 11,
  marginTop: 2,
};

const loadingStyle: React.CSSProperties = {
  padding: 50,
  textAlign: "center",
  color: "#64748b",
};

const emptyStyle: React.CSSProperties = {
  padding: 50,
  textAlign: "center",
  color: "#64748b",
};

const statusStyle = (status: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background:
    status === "converted"
      ? "#dcfce7"
      : status === "lost"
        ? "#fee2e2"
        : status === "contacted"
          ? "#dbeafe"
          : "#f1f5f9",
  color:
    status === "converted"
      ? "#166534"
      : status === "lost"
        ? "#991b1b"
        : status === "contacted"
          ? "#1d4ed8"
          : "#475569",
  fontSize: 11,
  fontWeight: 750,
});

const priorityStyle = (priority: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background:
    priority === "high"
      ? "#fee2e2"
      : priority === "low"
        ? "#f1f5f9"
        : "#fef3c7",
  color:
    priority === "high"
      ? "#b91c1c"
      : priority === "low"
        ? "#64748b"
        : "#92400e",
  fontSize: 11,
  fontWeight: 750,
});

const actionStyle: React.CSSProperties = {
  display: "flex",
  gap: 7,
};

const editButtonStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#334155",
  borderRadius: 7,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const deleteButtonStyle: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fff",
  color: "#dc2626",
  borderRadius: 7,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};
