"use client";

import { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

import { useCreatePayment, useVerifyPayment } from "@/hooks/usePayments";

interface OrderPaymentActionProps {
        orderId: number;
        companyId: number;
        amount: number;
        onCreated?: () => void;
}

export default function OrderPaymentAction({
        orderId,
        companyId,
        amount,
        onCreated,
}: OrderPaymentActionProps) {
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");

        const createPayment = useCreatePayment();
        const verifyPayment = useVerifyPayment();

        async function handleCreatePayment() {
                setError("");
                setSuccess("");

                try {
                        /*
                         * 1. Create local payment + Cashfree order
                         */
                        const response = await createPayment.mutateAsync({
                                company_id: companyId,
                                order_id: orderId,
                                amount,
                        });

                        const paymentId = response?.data?.payment?.id;

                        const paymentSessionId =
                                response?.data?.cashfree?.payment_session_id;

                        if (!paymentId) {
                                throw new Error(
                                        "Payment ID was not returned by the server.",
                                );
                        }

                        if (!paymentSessionId) {
                                throw new Error(
                                        "Cashfree payment session was not returned.",
                                );
                        }

                        /*
                         * 2. Load Cashfree SDK
                         */
                        const cashfree = await load({
                                mode:
                                        process.env.NEXT_PUBLIC_CASHFREE_MODE ===
                                        "production"
                                                ? "production"
                                                : "sandbox",
                        });

                        if (!cashfree) {
                                throw new Error(
                                        "Unable to initialize Cashfree checkout.",
                                );
                        }

                        /*
                         * 3. Open Cashfree checkout
                         */
                        const result = await cashfree.checkout({
                                paymentSessionId,
                                redirectTarget: "_self",
                        });

                        console.log("Cashfree checkout result:", result);

                        /*
                         * Cashfree normally redirects when using _self.
                         * If checkout returns control to this page, verify
                         * the local payment record.
                         */
                        await verifyPayment.mutateAsync(paymentId);

                        setSuccess(
                                "Payment verification completed successfully.",
                        );

                        onCreated?.();
                } catch (err: any) {
                        console.error("Cashfree payment error:", err);

                        setError(
                                err?.response?.data?.message ??
                                        err?.message ??
                                        "Unable to process payment.",
                        );
                }
        }

        const isProcessing =
                createPayment.isPending || verifyPayment.isPending;

        return (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                                <h2 className="text-xl font-semibold">
                                        Create Payment
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                        Create and pay through Cashfree.
                                </p>
                        </div>

                        <div className="mb-5 rounded-lg bg-slate-50 p-4">
                                <div className="grid gap-4 md:grid-cols-3">
                                        <div>
                                                <p className="text-xs text-slate-500">
                                                        Order ID
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                        #{orderId}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-xs text-slate-500">
                                                        Company ID
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                        {companyId}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-xs text-slate-500">
                                                        Amount
                                                </p>

                                                <p className="mt-1 font-semibold">
                                                        ₹
                                                        {Number(
                                                                amount,
                                                        ).toLocaleString(
                                                                "en-IN",
                                                        )}
                                                </p>
                                        </div>
                                </div>
                        </div>

                        <button
                                type="button"
                                disabled={isProcessing || amount <= 0}
                                onClick={handleCreatePayment}
                                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                                {createPayment.isPending
                                        ? "Creating Payment..."
                                        : verifyPayment.isPending
                                          ? "Verifying Payment..."
                                          : "Pay with Cashfree"}
                        </button>

                        {success && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                        {success}
                                </div>
                        )}

                        {error && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                </div>
                        )}
                </div>
        );
}
