"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  getMe,
  logoutLocal,
  type AuthUser,
} from "@/lib/api/auth/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getApiErrorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return undefined;
  }

  const response = (error as {
    response?: { data?: { code?: unknown } };
  }).response;

  return typeof response?.data?.code === "string"
    ? response.data.code
    : undefined;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getMe(token);

      const apiUser = response?.data as AuthUser | undefined;

      // Accept only a complete user profile from the API.
      if (
        response.success &&
        apiUser &&
        typeof apiUser.name === "string" &&
        typeof apiUser.email === "string" &&
        typeof apiUser.role === "string" &&
        typeof apiUser.status === "string"
      ) {
        setUser(apiUser);
        localStorage.setItem("admin_user", JSON.stringify(apiUser));
      } else {
        // Do not overwrite a valid login profile with an incomplete API response.
        const cachedUser = localStorage.getItem("admin_user");
        const parsedUser = cachedUser
          ? JSON.parse(cachedUser) as AuthUser
          : null;

        if (
          parsedUser &&
          parsedUser.role !== "employee" &&
          parsedUser.status === "active" &&
          parsedUser.name &&
          parsedUser.email
        ) {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Failed to load current user:", error);

      const errorCode = getApiErrorCode(error);
      const consentErrors = [
        "EMPLOYEE_CONSENT_REQUIRED",
        "EMPLOYEE_FULL_ACCESS_TOKEN_REQUIRED",
        "EMPLOYEE_POLICY_NOT_AVAILABLE",
      ];

      if (consentErrors.includes(errorCode || "")) {
        try {
          const cachedUser = localStorage.getItem("admin_user");
          const parsedUser = cachedUser
            ? (JSON.parse(cachedUser) as AuthUser)
            : null;

          if (parsedUser?.role === "employee") {
            setUser(parsedUser);
            router.replace("/employee-consent");
            return;
          }
        } catch (storageError) {
          console.warn("Unable to read cached employee profile:", storageError);
        }
      }

      // Preserve the verified login profile for active Admin accounts
      // when the profile refresh endpoint is temporarily unavailable.
      try {
        const cachedUser = localStorage.getItem("admin_user");
        const parsedUser = cachedUser ? JSON.parse(cachedUser) as AuthUser : null;
        const isAdminAccount = parsedUser &&
          parsedUser.status === "active" &&
          parsedUser.role !== "employee";

        if (isAdminAccount) {
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    logoutLocal();
    setUser(null);
    setLoading(false);
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}