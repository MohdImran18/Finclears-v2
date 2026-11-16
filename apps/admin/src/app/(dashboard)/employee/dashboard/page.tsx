"use client";

import EmployeeMonitoringMedia from "@/components/monitoring/EmployeeMonitoringMedia";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  FileText,
  UserRound,
  WalletCards,
} from "lucide-react";

import RoleWorkspaceDashboard from "@/components/dashboard/RoleWorkspaceDashboard";
import {
  getPendingEmployeeMonitoringSessions,
  getActiveEmployeeMonitoringSession,
  endEmployeeMonitoringSession,
  respondToEmployeeMonitoringSession,
  type EmployeeMonitoringSession,
} from "@/lib/api/hrm/hrmApi";

export default function EmployeeDashboardPage() {
  const [requests, setRequests] = useState<EmployeeMonitoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSession, setActiveSession] = useState<EmployeeMonitoringSession | null>(null);
  const [stoppingSession, setStoppingSession] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const response = await getPendingEmployeeMonitoringSessions();
      setRequests(response.data || []);
      setError("");
    } catch {
      setError("Unable to check monitoring requests. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActiveSession = useCallback(async () => {
    try {
      const response = await getActiveEmployeeMonitoringSession();
      setActiveSession(response.data || null);
    } catch {
      // Temporary API/network errors must not end a monitoring session.
    }
  }, []);

  useEffect(() => {
    void loadRequests();
    void loadActiveSession();

    const interval = window.setInterval(() => {
      void loadRequests();
      void loadActiveSession();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [loadRequests, loadActiveSession]);

  const handleStopMonitoring = async () => {
    if (!activeSession) return;

    setStoppingSession(true);
    setError("");

    try {
      await endEmployeeMonitoringSession(activeSession.id);
      setActiveSession(null);
      setMessage("Monitoring session stopped.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Unable to stop monitoring. Please try again."
      );
      await loadActiveSession();
    } finally {
      setStoppingSession(false);
    }
  };

  const handleDecision = async (
    id: number,
    decision: "accept" | "reject"
  ) => {
    setBusyId(id);
    setMessage("");
    setError("");

    try {
      await respondToEmployeeMonitoringSession(id, decision);

      setRequests((current) => current.filter((item) => item.id !== id));

      setMessage(
        decision === "accept"
          ? "Monitoring request accepted. The session can now be started with your participation."
          : "Monitoring request rejected."
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Unable to respond to this request. It may have expired."
      );
      await loadRequests();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {activeSession && (
        <section
          role="status"
          aria-live="polite"
          className="mx-4 mt-4 rounded-xl border-2 border-red-300 bg-red-50 p-5 shadow-sm md:mx-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 animate-pulse rounded-full bg-red-600" />
                <h2 className="text-lg font-bold text-red-700">
                  LIVE MONITORING
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                An authorized management session is active.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Initiated by: {activeSession.requester?.name || "Authorized Management"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Started: {activeSession.started_at
                  ? new Date(activeSession.started_at).toLocaleString("en-IN")
                  : "Recently"}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleStopMonitoring()}
              disabled={stoppingSession}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {stoppingSession ? "Stopping..." : "Stop Monitoring"}
            </button>
          </div>
          <p className="mt-3 text-xs text-red-700">
            This indicator shows an active monitoring session. Camera and microphone
            streaming status is displayed below.
          </p>
          <EmployeeMonitoringMedia sessionId={activeSession.id} />
        </section>
      )}

      <section className="mx-4 mt-4 rounded-xl border border-blue-200 bg-white p-5 shadow-sm md:mx-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Monitoring Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and respond to requests from authorized management.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadRequests()}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-5 text-sm text-gray-500">
            Checking requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            No pending monitoring requests.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="font-semibold text-gray-900">
                  {request.requester?.name || "Management"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {request.requester?.email || ""}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Requested:{" "}
                  {new Date(request.requested_at).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-amber-700">
                  This request expires:{" "}
                  {new Date(request.expires_at).toLocaleTimeString("en-IN")}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleDecision(request.id, "accept")}
                    disabled={busyId === request.id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {busyId === request.id ? "Processing..." : "Accept"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDecision(request.id, "reject")}
                    disabled={busyId === request.id}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <RoleWorkspaceDashboard
        eyebrow="Employee workspace"
        title="My workspace"
        description="Access your employee profile, attendance, leave, payslip, and company documents in one place."
        actions={[
          {
            title: "My profile",
            description: "View your employment details, documents, and personal information.",
            href: "/hrm/employees",
            icon: UserRound,
            permission: "employees.view",
            useEmployeeProfile: true,
          },
          {
            title: "My attendance",
            description: "Review your attendance and record todayâ€™s work status.",
            href: "/hrm/attendance",
            icon: CalendarDays,
            permission: "attendance.view",
          },
          {
            title: "My leave",
            description: "Apply for leave and review your leave balance and history.",
            href: "/hrm/leave",
            icon: CalendarDays,
            permission: "leave.view",
          },
          {
            title: "My payroll",
            description: "Review available payroll records and salary information.",
            href: "/hrm/payroll",
            icon: WalletCards,
            permission: "payroll.view",
          },
          {
            title: "My letters",
            description: "View and download employee letters issued to you.",
            href: "/hrm/letters",
            icon: FileText,
            permission: "letters.view",
          },
        ]}
      />
    </div>
  );
}
