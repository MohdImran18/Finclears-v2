
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthService from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/routes";
import type { EmployeeConsentStatusResponse } from "@/types/auth";

type ConsentData = EmployeeConsentStatusResponse["data"];

export default function EmployeeConsentPage() {
    const router = useRouter();

    const hydrated = useAuthStore((state) => state.hydrated);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const setToken = useAuthStore((state) => state.setToken);
    const logoutStore = useAuthStore((state) => state.logout);

    const [consent, setConsent] = useState<ConsentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    async function loadConsent() {
        setLoading(true);

        try {
            const response = await AuthService.employeeConsentStatus();

            setConsent(response.data);

            if (
                response.data.status === "accepted" &&
                response.data.policy_available
            ) {
                router.replace(ROUTES.DASHBOARD);
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Unable to load employee consent status."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!hydrated) return;

        if (!isAuthenticated) {
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (user?.role !== "employee") {
            router.replace(ROUTES.DASHBOARD);
            return;
        }

        loadConsent();
    }, [hydrated, isAuthenticated, user?.role]);

    async function handleConsent(action: "accept" | "decline") {
        if (!consent || !consent.policy_available) return;

        setProcessing(true);

        try {
            const payload = {
                policy_version: consent.policy_version,
            };

            const response =
                action === "accept"
                    ? await AuthService.acceptEmployeeConsent(payload)
                    : await AuthService.declineEmployeeConsent(payload);

            // Backend replaces the old token after consent action.
            setToken(response.data.token);

            toast.success(response.message);

            if (action === "accept") {
                router.replace(ROUTES.DASHBOARD);
            } else {
                setConsent((current) =>
                    current
                        ? { ...current, status: "declined" }
                        : current
                );
            }
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Unable to update consent."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function handleWithdraw() {
        if (!consent || consent.status !== "accepted") return;

        const confirmed = window.confirm(
            "Are you sure you want to withdraw today's employee monitoring consent? Your dashboard access will be restricted immediately."
        );

        if (!confirmed) return;

        setProcessing(true);

        try {
            const response = await AuthService.withdrawEmployeeConsent({
                policy_version: consent.policy_version,
            });

            // Backend issues a restricted consent-only token.
            setToken(response.data.token);

            // Stay on the consent page with restricted access.
            setConsent((current) =>
                current
                    ? { ...current, status: "withdrawn" }
                    : current
            );

            toast.success(
                response.message ?? "Consent withdrawn successfully."
            );
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Unable to withdraw consent."
            );
        } finally {
            setProcessing(false);
        }
    }

    async function handleLogout() {
        setProcessing(true);

        try {
            await AuthService.logout();
        } catch {
            toast.error("Server logout failed. Local session will be cleared.");
        } finally {
            logoutStore();
            router.replace(ROUTES.LOGIN);
        }
    }

    if (!hydrated || !isAuthenticated || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading employee consent...
            </div>
        );
    }

    if (user?.role !== "employee") return null;

    return (
        <main className="flex h-dvh items-center justify-center overflow-hidden bg-slate-50 p-4">
            <section className="flex max-h-full min-h-0 w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        FinClears Employee Portal
                    </p>

                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                        Daily Employee Consent
                    </h1>

                    <p className="mt-2 text-sm text-slate-600">
                        Please review the employee monitoring policy before
                        accessing the employee portal.
                    </p>
                </div>

                {consent && (
                    <>
                        <div className="mb-5 rounded-xl bg-slate-50 p-4 text-sm">
                            <p>
                                <strong>Work date:</strong>{" "}
                                {consent.work_date}
                            </p>
                            <p className="mt-1">
                                <strong>Policy version:</strong>{" "}
                                {consent.policy_version}
                            </p>
                            <p className="mt-1">
                                <strong>Status:</strong>{" "}
                                {consent.status}
                            </p>
                        </div>

                        {consent.policy_available && consent.policy_text ? (
                            <div className="mb-4 max-h-[42dvh] overflow-y-auto overscroll-contain whitespace-pre-wrap rounded-xl border border-slate-200 p-5 text-sm leading-7 text-slate-700">
                                {consent.policy_text}
                            </div>
                        ) : (
                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
                                <h2 className="font-semibold text-amber-900">
                                    Policy Awaiting Management Approval
                                </h2>

                                <p className="mt-2 text-sm text-amber-800">
                                    The employee monitoring policy has not
                                    yet been approved and published.
                                    You cannot accept or decline it until
                                    the complete policy is available.
                                </p>
                            </div>
                        )}

                        {consent.retention_period && (
                            <p className="mb-3 text-sm text-slate-600">
                                <strong>Data retention:</strong>{" "}
                                {consent.retention_period}
                            </p>
                        )}

                        {consent.support_contact && (
                            <p className="mb-5 text-sm text-slate-600">
                                <strong>Support:</strong>{" "}
                                {consent.support_contact}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                disabled={
                                    processing ||
                                    !consent.policy_available ||
                                    !consent.policy_text
                                }
                                onClick={() => handleConsent("accept")}
                                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Accept Policy
                            </button>

                            <button
                                type="button"
                                disabled={
                                    processing ||
                                    !consent.policy_available ||
                                    !consent.policy_text
                                }
                                onClick={() => handleConsent("decline")}
                                className="flex-1 rounded-xl border border-red-300 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>
                    </>
                )}

                {consent?.status === "accepted" && consent.policy_available && (
                    <div className="mt-4">
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleWithdraw}
                            className="w-full rounded-xl border border-red-400 px-5 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Withdraw Consent
                        </button>
                        <p className="mt-2 text-xs text-slate-500">
                            Withdrawing consent immediately restricts employee dashboard access.
                        </p>
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={loadConsent}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                    >
                        Refresh Status
                    </button>

                    <button
                        type="button"
                        disabled={processing}
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
                    >
                        Logout
                    </button>
                </div>
            </section>
        </main>
    );
}
