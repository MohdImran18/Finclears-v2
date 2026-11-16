"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { sendEmployeePresenceHeartbeat } from "@/lib/api/hrm/hrmApi";
import {
  logoutLocal,
  reportEmployeePermissionRevoked,
  type EmployeeBrowserPermission,
} from "@/lib/api/auth/authApi";

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

export default function EmployeePresenceProvider() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user || user.role !== "employee") return;

    let stopped = false;
    let busy = false;
    let revocationReported = false;
    let consentRedirected = false;
    let midnightTimer: number | undefined;

    const employeeId = user.id;

    const consentErrors = [
      "EMPLOYEE_CONSENT_REQUIRED",
      "EMPLOYEE_FULL_ACCESS_TOKEN_REQUIRED",
      "EMPLOYEE_POLICY_NOT_AVAILABLE",
    ];

    const sendHeartbeat = async () => {
      if (stopped || busy) return;

      busy = true;

      try {
        await sendEmployeePresenceHeartbeat(
          document.visibilityState === "visible"
        );
      } catch (error) {
        const errorCode = getApiErrorCode(error);

        if (consentErrors.includes(errorCode || "")) {
          if (!stopped && !consentRedirected) {
            consentRedirected = true;
            stopped = true;
            router.replace("/employee-consent");
          }
          return;
        }

        // Network/server errors must not cause logout.
        console.error("Employee presence heartbeat failed:", error);
      } finally {
        busy = false;
      }
    };

    const scheduleNextIstMidnight = (): number => {
      const now = new Date();

      // Convert current time to IST (UTC + 05:30).
      const istNow = new Date(now.getTime() + 330 * 60 * 1000);

      // Calculate next midnight in IST, converted back to UTC timestamp.
      const nextMidnightUtc =
        Date.UTC(
          istNow.getUTCFullYear(),
          istNow.getUTCMonth(),
          istNow.getUTCDate() + 1,
          0,
          0,
          0
        ) - 330 * 60 * 1000;

      const delay = Math.max(0, nextMidnightUtc - now.getTime());

      return window.setTimeout(async () => {
        await sendHeartbeat();

        if (!stopped) {
          midnightTimer = scheduleNextIstMidnight();
        }
      }, delay);
    };

    void sendHeartbeat();

    const interval = window.setInterval(() => {
      void sendHeartbeat();
    }, 30000);

    midnightTimer = scheduleNextIstMidnight();

    const handleVisibilityChange = () => {
      void sendHeartbeat();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const permissionNames: EmployeeBrowserPermission[] = [
      "camera",
      "microphone",
    ];

    const permissionStatuses: PermissionStatus[] = [];

    const reportRevocation = async (
      permission: EmployeeBrowserPermission
    ) => {
      if (stopped || revocationReported) return;

      revocationReported = true;

      try {
        const response = await reportEmployeePermissionRevoked(permission);

        if (
          response?.success === true &&
          response?.code === "EMPLOYEE_PERMISSION_REVOKED"
        ) {
          localStorage.removeItem(
            `employee-media-permission-granted:${employeeId}:camera`
          );
          localStorage.removeItem(
            `employee-media-permission-granted:${employeeId}:microphone`
          );

          logoutLocal();
          router.replace("/login");
          return;
        }

        revocationReported = false;
        console.error("Permission revocation was not confirmed by the server.");
      } catch (error) {
        revocationReported = false;
        console.error("Unable to report employee permission revocation:", error);
      }
    };

    const observePermission = async (
      permission: EmployeeBrowserPermission
    ) => {
      const marker = `employee-media-permission-granted:${employeeId}:${permission}`;

      if (localStorage.getItem(marker) !== "true") return;
      if (!navigator.permissions?.query) return;

      try {
        const status = await navigator.permissions.query({
          name: permission as PermissionName,
        });

        if (stopped) return;

        permissionStatuses.push(status);

        if (status.state === "denied") {
          await reportRevocation(permission);
          return;
        }

        status.onchange = () => {
          if (!stopped && status.state === "denied") {
            void reportRevocation(permission);
          }
        };
      } catch (error) {
        // Unsupported browser permission descriptors must not cause logout.
        console.warn(
          `Browser permission observation unavailable for ${permission}:`,
          error
        );
      }
    };

    void Promise.all(
      permissionNames.map((permission) => observePermission(permission))
    );

    return () => {
      stopped = true;
      window.clearInterval(interval);

      if (midnightTimer !== undefined) {
        window.clearTimeout(midnightTimer);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      permissionStatuses.forEach((status) => {
        status.onchange = null;
      });
    };
  }, [user, loading, router]);

  return null;
}