"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types/auth";

interface AuthState {
  token: string |null;

  user: User | null;

  isAuthenticated: boolean;

  hydrated: boolean;

  setHydrated: () => void;

  setToken: (token: string | null) => void;

  setUser: (user: User | null) => void;

  login: (token: string, user: User) => void;

  logout: () => void;

  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({

      token: null,

      user: null,

      isAuthenticated: false,

      hydrated: false,

      setHydrated: () =>
        set({
          hydrated: true,
        }),

      setToken: (token) =>
        set({
          token,
          isAuthenticated: !!token,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      login: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          hydrated: true,
        }),

      clear: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          hydrated: true,
        }),

    }),
    {
      name: "finclears-auth",

      version: 1,

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

export default useAuthStore;