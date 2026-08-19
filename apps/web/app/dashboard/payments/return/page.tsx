"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useVerifyPayment } from "@/hooks/usePayments";

export default function PaymentReturnPage() {
        const router = useRouter();
        const searchParams = useSearchParams();

        const [message, setMessage] = useState(
                "Verifying your payment...",
        );

        const verifyPayment = useVerifyPayment();

        useEffect(() => {
                const paymentId = searchParams.get("payment_id");
                const orderId = searchParams.get("order_id");

                if (!paymentId) {
                        setMessage("Payment ID is missing.");
                        return;
                }

                let cancelled = false;

                async function verify() {
                        try {
                                await verifyPayment.mutateAsync(
                                        Number(paymentId),
                                );

                                if (cancelled) {
                                        return;
                                }

                                setMessage(
                                        "Payment verification completed successfully.",
                                );

                                setTimeout(() => {
                                        if (orderId) {
                                                router.replace(
                                                        `/dashboard/orders/${orderId}`,
                                                );
                                        } else {
                                                router.replace(
                                                        "/dashboard/orders",
                                                );
                                        }
                                }, 1200);
                        } catch (error) {
                                console.error(
                                        "Payment verification failed:",
                                        error,
                                );

                                if (!cancelled) {
                                        setMessage(
                                                "Payment verification failed. Please check the payment status.",
                                        );
                                }
                        }
                }

                verify();

                return () => {
                        cancelled = true;
                };
        }, [searchParams, router]);

        return (
                <main className="flex min-h-[60vh] items-center justify-center p-8">
                        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                                        ₹
                                </div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                        Payment Status
                                </h1>

                                <p className="mt-3 text-slate-500">
                                        {message}
                                </p>
                        </div>
                </main>
        );
}
