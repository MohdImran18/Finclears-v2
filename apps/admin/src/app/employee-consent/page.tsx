"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  acceptEmployeeConsent,
  declineEmployeeConsent,
  getEmployeeConsentStatus,
  logoutLocal,
  withdrawEmployeeConsent,
  type EmployeeConsentData,
} from "@/lib/api/auth/authApi";

export default function EmployeeConsentPage() {
  const router = useRouter();

  const [consent, setConsent] = useState<EmployeeConsentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEmployeeConsentStatus();
      setConsent(response.data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load consent status.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }

    void loadStatus();
  }, [loadStatus, router]);

  async function requestCameraAndMicrophone() {
    if (!window.isSecureContext) {
      throw new Error("Camera and microphone access requires HTTPS or localhost.");
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Camera and microphone access is not supported by this browser.");
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    // This is only a permission check. Do not keep the test stream running.
    stream.getTracks().forEach((track) => track.stop());

    // Record the previously granted permissions for this employee.
    try {
      const storedUser = localStorage.getItem("admin_user");
      const employee = storedUser ? JSON.parse(storedUser) : null;

      if (employee?.role === "employee" && employee.id) {
        localStorage.setItem(
          `employee-media-permission-granted:${employee.id}:camera`,
          "true"
        );
        localStorage.setItem(
          `employee-media-permission-granted:${employee.id}:microphone`,
          "true"
        );
      }
    } catch (storageError) {
      console.warn("Unable to save permission history:", storageError);
    }
  }

  async function handleContinueToPortal() {
    if (processing) return;

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      await requestCameraAndMicrophone();
      router.replace("/employee/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Camera and microphone permission could not be verified. Please retry."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function handleAction(action: "accept" | "decline" | "withdraw") {
    if (!consent || processing) return;

    setProcessing(true);
    setError("");
    setMessage("");

    try {
      let response;

      if (action === "accept") {
        // Invoke the browser permission request directly from the employee click.
        await requestCameraAndMicrophone();
        response = await acceptEmployeeConsent(consent.policy_version);
      } else if (action === "decline") {
        response = await declineEmployeeConsent(consent.policy_version);
      } else {
        response = await withdrawEmployeeConsent(consent.policy_version);
      }

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setMessage(response.message || "Your consent status has been updated.");

      if (action === "accept") {
        router.replace("/employee/dashboard");
        return;
      }

      await loadStatus();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "The requested action could not be completed."
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleLogout() {
    logoutLocal();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <p className="text-sm text-slate-600">Loading consent information...</p>
      </main>
    );
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-50 px-4 py-4 sm:py-6 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-2xl min-h-0 max-h-full flex-col">
        <div className="flex max-h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Employee Portal
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Daily Monitoring Consent
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Please review the employee monitoring policy before accessing
              the employee portal.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              {message}
            </div>
          )}

          {consent && (
            <>
              <div className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Work date</p>
                  <p className="font-medium text-slate-900">{consent.work_date}</p>
                </div>
                <div>
                  <p className="text-slate-500">Policy version</p>
                  <p className="font-medium text-slate-900">
                    {consent.policy_version}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Consent status</p>
                  <p className="font-semibold capitalize text-slate-900">
                    {consent.status}
                  </p>
                </div>
              </div>

              {!consent.policy_available || !consent.policy_text ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <h2 className="font-semibold text-amber-900">
                    Policy approval pending
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    The employee monitoring policy has not yet been approved
                    and published by management. You cannot provide consent
                    until the complete policy is available.
                  </p>
                  <p className="mt-3 text-sm text-amber-800">
                    Please contact HR or your administrator for assistance.
                  </p>
                </div>
              ) : (
                <>
                  <section className="mb-4 min-h-0 max-h-[42dvh] overflow-y-auto overscroll-contain rounded-xl border border-slate-200 p-5">
                    <h2 className="mb-3 font-semibold text-slate-900">
                      Employee Monitoring Policy
                    </h2>
                    <div className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {consent.policy_text}
                    </div>

                    {consent.retention_period && (
                      <p className="mt-4 text-sm text-slate-600">
                        <strong>Data retention:</strong>{" "}
                        {consent.retention_period}
                      </p>
                    )}

                    {consent.support_contact && (
                      <p className="mt-2 text-sm text-slate-600">
                        <strong>Support contact:</strong>{" "}
                        {consent.support_contact}
                      </p>
                    )}
                  </section>

                  {consent.status === "accepted" ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        Your daily consent is active. Continue after verifying camera and microphone access.
                      </div>
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => void handleContinueToPortal()}
                        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processing ? "Checking permissions..." : "Continue to Portal"}
                      </button>
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => void handleAction("withdraw")}
                        className="w-full rounded-lg border border-red-300 px-4 py-3 font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Withdraw Consent
                      </button>
                    </div>
                  ) : (consent.status === "pending" || consent.status === "declined" || consent.status === "withdrawn") ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => void handleAction("accept")}
                        className="rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                      >
                        {processing ? "Processing..." : "Accept Policy"}
                      </button>
                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => void handleAction("decline")}
                        className="rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      Your consent is not active. Please contact HR if you
                      need assistance.
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {!consent && !error && (
            <p className="text-sm text-slate-600">
              Consent information is currently unavailable.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => void loadStatus()}
              disabled={loading || processing}
              className="text-sm font-medium text-blue-700 hover:underline disabled:opacity-50"
            >
              Refresh status
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
