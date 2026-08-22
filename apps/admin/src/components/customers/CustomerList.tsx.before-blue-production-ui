"use client";

import type { Customer } from "@/types/customer/customer";

interface Props {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export default function CustomerList({
  customers,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div style={emptyStyle}>
        Loading customers...
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div style={emptyStyle}>
        No customers found.
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={tableWrapStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={th}>Customer</th>
              <th style={th}>Phone</th>
              <th style={th}>Company</th>
              <th style={th}>Value</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td style={td}>
                  <strong>{customer.name}</strong>
                  <div style={emailStyle}>
                    {customer.email || "—"}
                  </div>
                </td>

                <td style={td}>{customer.phone}</td>

                <td style={td}>
                  {customer.company_name || "—"}
                </td>

                <td style={td}>
                  ₹{Number(customer.total_value || 0).toLocaleString("en-IN")}
                </td>

                <td style={td}>
                  <span style={statusStyle}>
                    {customer.status}
                  </span>
                </td>

                <td style={td}>
                  <div style={actionsStyle}>
                    <button
                      type="button"
                      onClick={() => onEdit(customer)}
                      style={editButton}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(customer)}
                      style={deleteButton}
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
  borderRadius: 14,
  overflow: "hidden",
};

const tableWrapStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 850,
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "13px 15px",
  background: "#f8fafc",
  color: "#64748b",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: ".04em",
};

const td: React.CSSProperties = {
  padding: "15px",
  borderTop: "1px solid #eef2f7",
  color: "#334155",
  fontSize: 13,
};

const emailStyle: React.CSSProperties = {
  marginTop: 3,
  color: "#94a3b8",
  fontSize: 11,
};

const statusStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#ecfdf5",
  color: "#047857",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "capitalize",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 7,
};

const editButton: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#334155",
  borderRadius: 7,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const deleteButton: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fff",
  color: "#dc2626",
  borderRadius: 7,
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
};

const emptyStyle: React.CSSProperties = {
  padding: 50,
  textAlign: "center",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  color: "#64748b",
};
