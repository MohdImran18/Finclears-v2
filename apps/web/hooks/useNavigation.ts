"use client";

import { useMemo } from "react";

import { NAVIGATION } from "@/constants/navigation";
import { useAuthStore } from "@/store/auth";

export function useNavigation() {
  const role = useAuthStore(
    (state) => state.user?.role
  );

  return useMemo(() => {
    if (!role) {
      return [];
    }

    return NAVIGATION.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }

      return item.roles.includes(role);
    });
  }, [role]);
}