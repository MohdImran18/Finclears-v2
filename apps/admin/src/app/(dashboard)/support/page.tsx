"use client";

import { useEffect, useState } from "react";
import {
  Headphones,
  RefreshCw,
  Search,
  Eye,
  Trash2,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

type Contact = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  source?: string | null;
  status?: string | null;
  replied_at?: string | null;
  created_at?: string | null;
};

function getToken() {
  if (typeof window === "undefined") return "";

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body
        ? {
            "Content-Type": "application/json",
          }
        : {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SupportPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest(
        "/contacts?per_page=100"
      );

      setContacts(
        response?.data?.contacts?.data ??
          response?.data?.contacts ??
          []
      );
    } catch (err) {
      console.error("Failed to load contact messages:", err);
      setContacts([]);
      setError(
        "Unable to load support messages. Please check your API connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this support message?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/contacts/${id}`, {
        method: "DELETE",
      });

      setSelected(null);
      await loadContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);
      alert("Unable to delete support message.");
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      contact.name,
      contact.email,
      contact.phone,
      contact.subject,
      contact.message,
      contact.status,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(query)
      );
  });

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              <Headphones size={15} />
              CUSTOMER SUPPORT
            </div>

            <h1 style={titleStyle}>
              Support Messages
            </h1>

            <p style={subtitleStyle}>
              Manage contact and support messages received
              from customers.
            </p>
          </div>

          <button
            type="button"
            onClick={loadContacts}
            disabled={loading}
            style={refreshButtonStyle}
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={statsCardStyle}>
          <div>
            <span style={statLabelStyle}>
              Total Messages
            </span>

            <strong style={statValueStyle}>
              {loading ? "—" : contacts.length}
            </strong>
          </div>

          <div>
            <span style={statLabelStyle}>
              Showing
            </span>

            <strong style={statValueStyle}>
              {loading
                ? "—"
                : filteredContacts.length}
            </strong>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={toolbarStyle}>
            <div style={searchBoxStyle}>
              <Search size={16} color="#94a3b8" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search name, email, subject..."
                style={searchInputStyle}
              />
            </div>
          </div>

          {loading ? (
            <div style={emptyStyle}>
              Loading support messages...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div style={emptyStyle}>
              {contacts.length === 0
                ? "No support messages found."
                : "No messages match your search."}
            </div>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr style={headRowStyle}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Contact</th>
                    <th style={thStyle}>Subject</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Received</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id}>
                      <td style={tdStyle}>
                        <strong
                          style={{
                            color: "#102a50",
                          }}
                        >
                          {contact.name || "—"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        <div>
                          {contact.email || "—"}
                        </div>

                        {contact.phone && (
                          <small
                            style={{
                              color: "#94a3b8",
                            }}
                          >
                            {contact.phone}
                          </small>
                        )}
                      </td>

                      <td style={tdStyle}>
                        {contact.subject || "—"}
                      </td>

                      <td style={tdStyle}>
                        <span style={statusBadgeStyle}>
                          {contact.status || "New"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        {formatDate(
                          contact.created_at
                        )}
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setSelected(contact)
                          }
                          style={viewButtonStyle}
                          title="View message"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(contact.id)
                          }
                          style={deleteButtonStyle}
                          title="Delete message"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <div>
                <div style={modalEyebrowStyle}>
                  SUPPORT MESSAGE
                </div>

                <h2 style={modalTitleStyle}>
                  {selected.subject || "Contact Message"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                style={closeButtonStyle}
              >
                <X size={18} />
              </button>
            </div>

            <div style={detailsGridStyle}>
              <Detail
                label="Name"
                value={selected.name}
              />

              <Detail
                label="Email"
                value={selected.email}
              />

              <Detail
                label="Phone"
                value={selected.phone}
              />

              <Detail
                label="Source"
                value={selected.source}
              />

              <Detail
                label="Status"
                value={selected.status}
              />

              <Detail
                label="Received"
                value={formatDate(
                  selected.created_at
                )}
              />
            </div>

            <div style={messageBoxStyle}>
              <div style={messageLabelStyle}>
                Message
              </div>

              <div style={messageTextStyle}>
                {selected.message || "No message provided."}
              </div>
            </div>

            <div style={modalActionsStyle}>
              <button
                type="button"
                onClick={() =>
                  handleDelete(selected.id)
                }
                style={modalDeleteButtonStyle}
              >
                <Trash2 size={15} />
                Delete Message
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                style={modalCloseButtonStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <div style={detailLabelStyle}>
        {label}
      </div>

      <div style={detailValueStyle}>
        {value || "—"}
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1400,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  marginBottom: 22,
};

const eyebrowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  color: "#2563eb",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".14em",
};

const titleStyle: React.CSSProperties = {
  margin: "7px 0 4px",
  color: "#102a50",
  fontSize: 30,
  fontWeight: 800,
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#71839b",
  fontSize: 13,
};

const refreshButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 15px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #dbe5f1",
  borderRadius: 9,
  background: "#fff",
  color: "#40536d",
  fontWeight: 700,
  cursor: "pointer",
};

const statsCardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 18,
};

const statLabelStyle: React.CSSProperties = {
  display: "block",
  color: "#71839b",
  fontSize: 11,
  fontWeight: 700,
  marginBottom: 5,
};

const statValueStyle: React.CSSProperties = {
  color: "#102a50",
  fontSize: 25,
  fontWeight: 800,
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 14,
  border: "1px solid #fecaca",
  borderRadius: 10,
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 13,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  overflow: "hidden",
};

const toolbarStyle: React.CSSProperties = {
  padding: 18,
  borderBottom: "1px solid #edf2f7",
};

const searchBoxStyle: React.CSSProperties = {
  width: 380,
  maxWidth: "100%",
  height: 40,
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #dbe5f1",
  borderRadius: 9,
  padding: "0 12px",
  boxSizing: "border-box",
};

const searchInputStyle: React.CSSProperties = {
  border: 0,
  outline: 0,
  width: "100%",
  fontSize: 13,
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const headRowStyle: React.CSSProperties = {
  background: "#f8fafc",
};

const thStyle: React.CSSProperties = {
  padding: "13px 18px",
  textAlign: "left",
  fontSize: 10,
  fontWeight: 800,
  color: "#71839b",
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const tdStyle: React.CSSProperties = {
  padding: "15px 18px",
  borderTop: "1px solid #edf2f7",
  fontSize: 13,
  color: "#52657e",
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 700,
};

const viewButtonStyle: React.CSSProperties = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#2563eb",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
  marginRight: 7,
};

const deleteButtonStyle: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#dc2626",
  borderRadius: 7,
  padding: "7px 9px",
  cursor: "pointer",
};

const emptyStyle: React.CSSProperties = {
  padding: 55,
  textAlign: "center",
  color: "#71839b",
  fontSize: 13,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, .45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  boxShadow: "0 20px 60px rgba(15,23,42,.18)",
  padding: 24,
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 15,
  marginBottom: 22,
};

const modalEyebrowStyle: React.CSSProperties = {
  color: "#2563eb",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".12em",
};

const modalTitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#102a50",
  fontSize: 21,
  fontWeight: 800,
};

const closeButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #dbe5f1",
  borderRadius: 8,
  background: "#fff",
  color: "#64748b",
  cursor: "pointer",
};

const detailsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 18,
};

const detailLabelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".07em",
  marginBottom: 5,
};

const detailValueStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: 13,
  wordBreak: "break-word",
};

const messageBoxStyle: React.CSSProperties = {
  marginTop: 22,
  padding: 16,
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #edf2f7",
};

const messageLabelStyle: React.CSSProperties = {
  color: "#52657e",
  fontSize: 11,
  fontWeight: 800,
  marginBottom: 8,
};

const messageTextStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: 13,
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
};

const modalActionsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 9,
  marginTop: 22,
};

const modalDeleteButtonStyle: React.CSSProperties = {
  height: 38,
  padding: "0 13px",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  border: "1px solid #fecaca",
  borderRadius: 8,
  background: "#fef2f2",
  color: "#dc2626",
  fontWeight: 700,
  cursor: "pointer",
};

const modalCloseButtonStyle: React.CSSProperties = {
  height: 38,
  padding: "0 14px",
  border: "1px solid #dbe5f1",
  borderRadius: 8,
  background: "#fff",
  color: "#40536d",
  fontWeight: 700,
  cursor: "pointer",
};