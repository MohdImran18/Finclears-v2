"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Lock,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

type UserData = {
  id?: number;
  uuid?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  status?: string;
  avatar?: string | null;
};

type Setting = {
  id: number;
  key: string;
  value: string | null;
  type: string;
  group: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
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
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [settings, setSettings] = useState<Setting[]>([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [savingSettingId, setSavingSettingId] =
    useState<number | null>(null);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProfile() {
    const response = await apiRequest("/auth/me");

    const currentUser =
      response?.data?.user ??
      response?.data ??
      null;

    setUser(currentUser);

    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
    setPhone(
      currentUser?.phone ||
        currentUser?.mobile ||
        ""
    );
  }

  async function loadSettings() {
    try {
      setSettingsLoading(true);

      const response = await apiRequest("/settings");

      setSettings(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error("Failed to load settings:", err);
      throw err;
    } finally {
      setSettingsLoading(false);
    }
  }

  async function loadAll() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await Promise.all([
        loadProfile(),
        loadSettings(),
      ]);
    } catch (err: any) {
      console.error("Failed to load settings page:", err);

      setError(
        err?.message ||
          "Unable to load account settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSettingSave(
    setting: Setting
  ) {
    try {
      setSavingSettingId(setting.id);
      setError("");
      setMessage("");

      const response = await apiRequest(
        `/settings/${setting.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            key: setting.key,
            value: setting.value ?? "",
            type: setting.type,
            group: setting.group,
            description:
              setting.description ?? "",
          }),
        }
      );

      const updated =
        response?.data ?? null;

      if (updated?.id) {
        setSettings((current) =>
          current.map((item) =>
            item.id === updated.id
              ? updated
              : item
          )
        );
      }

      setMessage(
        `${setting.key} updated successfully.`
      );
    } catch (err: any) {
      console.error(
        "Failed to update setting:",
        err
      );

      setError(
        err?.message ||
          "Unable to update setting."
      );
    } finally {
      setSavingSettingId(null);
    }
  }

  function updateSettingValue(
    id: number,
    value: string
  ) {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              value,
            }
          : setting
      )
    );
  }

  async function handleProfileSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    setError(
      "Profile update API is not available yet. Profile data is read-only for now."
    );
  }

  async function handlePasswordSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password confirmation does not match."
      );
      return;
    }

    setError(
      "Password change API is not available yet."
    );
  }

  if (loading) {
    return (
      <main style={pageStyle}>
        <div style={loadingStyle}>
          Loading settings...
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>
              <Settings size={15} />
              ACCOUNT SETTINGS
            </div>

            <h1 style={titleStyle}>
              Settings
            </h1>

            <p style={subtitleStyle}>
              Manage your account and application
              settings.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAll}
            disabled={loading || settingsLoading}
            style={refreshButtonStyle}
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {message && (
          <div style={successStyle}>
            {message}
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <div style={gridStyle}>
          <section style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <User size={18} />
              </div>

              <div>
                <h2 style={cardTitleStyle}>
                  Profile Information
                </h2>

                <p style={cardSubtitleStyle}>
                  Current authenticated account
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSave}>
              <div style={formGridStyle}>
                <Field
                  label="Full Name"
                  icon={<User size={15} />}
                  value={name}
                  onChange={setName}
                  disabled
                />

                <Field
                  label="Email"
                  icon={<Mail size={15} />}
                  value={email}
                  onChange={setEmail}
                  type="email"
                  disabled
                />

                <Field
                  label="Phone"
                  icon={<Phone size={15} />}
                  value={phone}
                  onChange={setPhone}
                  disabled
                />
              </div>

              <div style={accountInfoStyle}>
                <InfoRow
                  label="Role"
                  value={user?.role || "—"}
                />

                <InfoRow
                  label="Status"
                  value={user?.status || "—"}
                />

                <InfoRow
                  label="User ID"
                  value={
                    user?.id
                      ? String(user.id)
                      : "—"
                  }
                />
              </div>

              <button
                type="submit"
                style={disabledButtonStyle}
              >
                <Save size={15} />
                Profile Update Unavailable
              </button>
            </form>
          </section>

          <section style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <Lock size={18} />
              </div>

              <div>
                <h2 style={cardTitleStyle}>
                  Change Password
                </h2>

                <p style={cardSubtitleStyle}>
                  Password endpoint is not currently
                  exposed by the API.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSave}>
              <Field
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                type="password"
              />

              <div style={{ height: 16 }} />

              <Field
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                type="password"
              />

              <div style={{ height: 16 }} />

              <Field
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type="password"
              />

              <button
                type="submit"
                disabled={passwordSaving}
                style={disabledButtonStyle}
              >
                <Shield size={15} />
                Password Update Unavailable
              </button>
            </form>
          </section>
        </div>

        <section style={settingsCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={iconBoxStyle}>
              <Settings size={18} />
            </div>

            <div>
              <h2 style={cardTitleStyle}>
                Application Settings
              </h2>

              <p style={cardSubtitleStyle}>
                Live settings stored in the Laravel
                settings table.
              </p>
            </div>
          </div>

          {settingsLoading ? (
            <div style={loadingStyle}>
              Loading application settings...
            </div>
          ) : settings.length === 0 ? (
            <div style={emptyStyle}>
              No application settings found.
            </div>
          ) : (
            <div style={settingsListStyle}>
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  style={settingRowStyle}
                >
                  <div style={settingInfoStyle}>
                    <strong
                      style={settingKeyStyle}
                    >
                      {setting.key}
                    </strong>

                    <span
                      style={settingDescriptionStyle}
                    >
                      {setting.description ||
                        `${setting.group} setting`}
                    </span>
                  </div>

                  <div style={settingControlsStyle}>
                    {setting.type ===
                    "boolean" ? (
                      <select
                        value={
                          setting.value ===
                          "true"
                            ? "true"
                            : "false"
                        }
                        onChange={(event) =>
                          updateSettingValue(
                            setting.id,
                            event.target.value
                          )
                        }
                        style={settingInputStyle}
                      >
                        <option value="true">
                          True
                        </option>
                        <option value="false">
                          False
                        </option>
                      </select>
                    ) : (
                      <input
                        value={
                          setting.value ?? ""
                        }
                        onChange={(event) =>
                          updateSettingValue(
                            setting.id,
                            event.target.value
                          )
                        }
                        style={
                          settingInputStyle
                        }
                      />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleSettingSave(
                          setting
                        )
                      }
                      disabled={
                        savingSettingId ===
                        setting.id
                      }
                      style={
                        saveSettingButtonStyle
                      }
                    >
                      <Save size={14} />

                      {savingSettingId ===
                      setting.id
                        ? "Saving..."
                        : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label style={labelStyle}>
      {label}

      <div style={inputWrapperStyle}>
        {icon && (
          <span style={inputIconStyle}>
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          disabled={disabled}
          style={{
            ...inputStyle,
            ...(disabled
              ? disabledInputStyle
              : {}),
          }}
        />
      </div>
    </label>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span style={infoLabelStyle}>
        {label}
      </span>

      <strong style={infoValueStyle}>
        {value}
      </strong>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 15,
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
  padding: "0 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #dbe5f1",
  borderRadius: 8,
  background: "#fff",
  color: "#40536d",
  fontWeight: 700,
  cursor: "pointer",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(340px, 1fr))",
  gap: 20,
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 24,
};

const settingsCardStyle: React.CSSProperties = {
  ...cardStyle,
  marginTop: 20,
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 24,
};

const iconBoxStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  background: "#eff6ff",
  color: "#2563eb",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#102a50",
  fontSize: 17,
  fontWeight: 800,
};

const cardSubtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#94a3b8",
  fontSize: 12,
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 17,
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
  color: "#52657e",
  fontSize: 12,
  fontWeight: 700,
};

const inputWrapperStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const inputIconStyle: React.CSSProperties = {
  position: "absolute",
  left: 12,
  color: "#94a3b8",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "0 12px 0 36px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
};

const disabledInputStyle: React.CSSProperties = {
  background: "#f8fafc",
  color: "#64748b",
  cursor: "not-allowed",
};

const accountInfoStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: 12,
  margin: "22px 0",
  padding: 14,
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #edf2f7",
};

const infoLabelStyle: React.CSSProperties = {
  display: "block",
  color: "#94a3b8",
  fontSize: 9,
  fontWeight: 800,
  textTransform: "uppercase",
  marginBottom: 5,
};

const infoValueStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: 12,
};

const disabledButtonStyle: React.CSSProperties = {
  height: 40,
  marginTop: 22,
  padding: "0 15px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #dbe5f1",
  borderRadius: 8,
  background: "#f8fafc",
  color: "#94a3b8",
  fontWeight: 700,
  cursor: "not-allowed",
};

const settingsListStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const settingRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  padding: 16,
  border: "1px solid #edf2f7",
  borderRadius: 10,
};

const settingInfoStyle: React.CSSProperties = {
  minWidth: 220,
};

const settingKeyStyle: React.CSSProperties = {
  display: "block",
  color: "#102a50",
  fontSize: 13,
  fontWeight: 800,
};

const settingDescriptionStyle: React.CSSProperties = {
  display: "block",
  marginTop: 5,
  color: "#94a3b8",
  fontSize: 11,
};

const settingControlsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flex: 1,
  justifyContent: "flex-end",
};

const settingInputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  height: 40,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "0 11px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
};

const saveSettingButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 13px",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  border: 0,
  borderRadius: 8,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const successStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 13,
  border: "1px solid #bbf7d0",
  borderRadius: 9,
  background: "#f0fdf4",
  color: "#15803d",
  fontSize: 13,
};

const errorStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 13,
  border: "1px solid #fecaca",
  borderRadius: 9,
  background: "#fef2f2",
  color: "#b91c1c",
  fontSize: 13,
};

const emptyStyle: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
  color: "#71839b",
  fontSize: 13,
};

const loadingStyle: React.CSSProperties = {
  padding: 50,
  textAlign: "center",
  color: "#71839b",
};