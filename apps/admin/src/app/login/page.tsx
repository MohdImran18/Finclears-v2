"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getMe,
  login,
} from "@/lib/api/auth/authApi";
import { getWorkspaceRoute } from "@/lib/auth/workspaceRoute";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      if (!response.success || !response.data?.token) {
        throw new Error(
          response.message || "Login failed."
        );
      }

      const user = response.data.user;

      if (!user) {
        throw new Error("User information was not returned.");
      }

      if (user.status !== "active") {
        throw new Error(
          "This account is not active."
        );
      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      let workspaceUser = user;

      try {
        const currentUser = await getMe(response.data.token);

        if (currentUser.success) {
          workspaceUser = currentUser.data;
        }
      } catch (currentUserError) {
        console.warn(
          "Unable to load the full user profile after login:",
          currentUserError
        );
      }

      localStorage.setItem(
        "admin_user",
        JSON.stringify(workspaceUser)
      );

      router.replace(getWorkspaceRoute(workspaceUser));
    } catch (error: any) {
      console.error(error);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 32,
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            margin: 0,
            marginBottom: 8,
            fontSize: 30,
          }}
        >
          Finclears Admin
        </h1>

        <p
          style={{
            marginTop: 0,
            marginBottom: 28,
            color: "#6b7280",
          }}
        >
          Sign in to continue
        </p>

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: 12,
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <label>
            <span
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@finclears.test"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 16,
              }}
            />
          </label>

          <label>
            <span
              style={{
                display: "block",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 16,
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "13px 16px",
              border: 0,
              borderRadius: 8,
              background: "#111827",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
