"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  RefreshCw,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  type AdminUser,
} from "@/lib/api/users/userApi";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  async function loadUsers() {
    try {
      setLoading(true);

      const response = await getUsers({
        per_page: 50,
        search: search || undefined,
      });

      setUsers(response.data?.data ?? []);
      setTotal(response.meta?.total ?? response.data?.length ?? 0);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Unable to delete user.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "#2563eb",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              <Users size={16} />
              Admin Management
            </div>

            <h1
              style={{
                margin: "7px 0 4px",
                color: "#102a50",
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              Users & Roles
            </h1>

            <p
              style={{
                margin: 0,
                color: "#71839b",
                fontSize: 13,
              }}
            >
              Manage admin users and access.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            style={{
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
            }}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 18,
              borderBottom: "1px solid #edf2f7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 15,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                border: "1px solid #dbe5f1",
                borderRadius: 9,
                padding: "0 12px",
                height: 40,
                width: 330,
              }}
            >
              <Search size={16} color="#94a3b8" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loadUsers();
                  }
                }}
                placeholder="Search users..."
                style={{
                  border: 0,
                  outline: 0,
                  width: "100%",
                  fontSize: 13,
                }}
              />
            </div>

            <strong
              style={{
                color: "#102a50",
                fontSize: 13,
              }}
            >
              {total} Users
            </strong>
          </div>

          {loading ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#71839b",
              }}
            >
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: 50,
                textAlign: "center",
                color: "#71839b",
              }}
            >
              No users found.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={thStyle}>User</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={tdStyle}>
                        <strong style={{ color: "#102a50" }}>
                          {user.name || "—"}
                        </strong>
                      </td>

                      <td style={tdStyle}>
                        {user.email || "—"}
                      </td>

                      <td style={tdStyle}>
                        <span style={badgeStyle}>
                          {user.role || "—"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span style={badgeStyle}>
                          {user.status || "—"}
                        </span>
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
                            router.push(`/users/${user.id}/edit`)
                          }
                          style={{
                            border: "1px solid #bfdbfe",
                            background: "#eff6ff",
                            color: "#2563eb",
                            borderRadius: 7,
                            padding: "7px 10px",
                            cursor: "pointer",
                            marginRight: 7,
                          }}
                          title="Edit user"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          style={{
                            border: "1px solid #fecaca",
                            background: "#fef2f2",
                            color: "#dc2626",
                            borderRadius: 7,
                            padding: "7px 10px",
                            cursor: "pointer",
                          }}
                          title="Delete user"
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
    </main>
  );
}

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

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "5px 9px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 700,
};