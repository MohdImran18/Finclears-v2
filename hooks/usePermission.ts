"use client";

import { useAuthStore } from "@/store/auth";

export function usePermission(
  allowedRoles: readonly string[]
) {
  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) {
    return false;
  }

  return allowedRoles.includes(
    user.role ?? ""
  );
}
