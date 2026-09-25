"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  type AuthUser,
} from "@/lib/api/auth/authApi";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
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

      if (response.success) {
        setUser(response.data);

        localStorage.setItem(
          "admin_user",
          JSON.stringify(response.data)
        );
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
