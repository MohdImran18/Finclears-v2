"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import EmployeePresenceService from "@/services/employee-presence.service";

export default function EmployeePresenceProvider() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const sendHeartbeat = useCallback(async () => {
    if (
      !token ||
      !isAuthenticated ||
      user?.role !== "employee"
    ) {
      return;
    }

    const active = document.visibilityState === "visible";

    try {
      await EmployeePresenceService.heartbeat(active);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        router.replace("/employee-consent");
      }

      // Network failures must not log out the employee.
    }
  }, [token, isAuthenticated, user?.role, router]);

  useEffect(() => {
    if (
      !hydrated ||
      !isAuthenticated ||
      !token ||
      user?.role !== "employee"
    ) {
      return;
    }

    void sendHeartbeat();

    const interval = window.setInterval(() => {
      void sendHeartbeat();
    }, 30000);

    const handleVisibilityChange = () => {
      void sendHeartbeat();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    hydrated,
    isAuthenticated,
    token,
    user?.role,
    sendHeartbeat,
  ]);

  return null;
}
