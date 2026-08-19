"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import OrderActions from "@/components/orders/OrderActions";
import OrderDetails from "@/components/orders/OrderDetails";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderPayments from "@/components/orders/OrderPayments";
import OrderPaymentAction from "@/components/orders/OrderPaymentAction";

import { useOrder } from "@/hooks/useOrders";

interface OrderDetailPageProps {
        params: Promise<{
                id: string;
        }>;
}

export default function OrderDetailPage({
        params,
}: OrderDetailPageProps) {
        const router = useRouter();
        const searchParams = useSearchParams();
        const [paymentMessage, setPaymentMessage] = useState("");
        const { id } = use(params);

        const orderId = Number(id);
        const {
                data,
                isLoading,
                isError,
                refetch,
        } = useOrder(orderId);

        useEffect(() => {
                const paymentStatus = searchParams.get("payment_status");
                const paymentId = searchParams.get("payment_id");

                if (paymentStatus === "success") {
                        setPaymentMessage(
                                paymentId
                                        ? `Payment successful. Payment #${paymentId} has been verified.`
                                        : "Payment successful and verified.",
                        );

                        refetch();
                } else if (paymentStatus === "verification_failed") {
                        setPaymentMessage(
                                "Payment was completed, but verification could not be confirmed. Please check the payment record.",
                        );
                }
        }, [searchParams, refetch]);

        if (!Number.isFinite(orderId)) {
                return (
                        <div className="p-8">
                                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                                        <h1 className="text-xl font-semibold text-red-700">
                                                Invalid Order ID
                                        </h1>

                                        <button
                                                type="button"
                                                onClick={() => router.push("/dashboard/orders")}
                                                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                        >
                                                Back to Orders
                                        </button>
                                </div>
                        </div>
                );
        }

        if (isLoading) {
                return (
                        <div className="space-y-6 p-8">
                                <div>
                                        <h1 className="text-3xl font-bold">
                                                Order Details
                                        </h1>

                                        <p className="mt-1 text-slate-500">
                                                Loading order information...
                                        </p>
                                </div>

                                <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
                                        Loading order #{orderId}...
                                </div>
                        </div>
                );
        }

        if (isError || !data?.data) {
                return (
                        <div className="space-y-6 p-8">
                                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                                        <h1 className="text-xl font-semibold text-red-700">
                                                Unable to load order
                                        </h1>

                                        <p className="mt-2 text-sm text-red-600">
                                                Order #{orderId} could not be loaded.
                                        </p>

                                        <div className="mt-5 flex gap-3">
                                                <button
                                                        type="button"
                                                        onClick={() => refetch()}
                                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                                >
                                                        Retry
                                                </button>

                                                <button
                                                        type="button"
                                                        onClick={() =>
                                                                router.push(
                                                                        "/dashboard/orders",
                                                                )
                                                        }
                                                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                                                >
                                                        Back to Orders
                                                </button>
                                        </div>
                                </div>
                        </div>
                );
        }

        const order = data.data;

        return (
                <div className="space-y-6 p-8">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                        <button
                                                type="button"
                                                onClick={() =>
                                                        router.push("/dashboard/orders")
                                                }
                                                className="mb-3 text-sm font-medium text-slate-500 hover:text-slate-900"
                                        >
                                                Ã¢â€ Â Back to Orders
                                        </button>

                                        <h1 className="text-3xl font-bold">
                                                {order.order_no}
                                        </h1>

                                        <p className="mt-1 text-slate-500">
                                                Manage order details, payment and workflow.
                                        </p>
                                </div>
                        </div>

                        <OrderDetails order={order} />

                        {paymentMessage && (
                                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                                        {paymentMessage}
                                </div>
                        )}

                        <OrderActions
                                id={order.id}
                                onUpdated={() => refetch()}
                        />

                        <OrderPaymentAction
                                orderId={order.id}
                                companyId={order.company_id}
                                amount={Number(order.amount ?? 0)}
                                onCreated={() => refetch()}
                        />

                        <OrderPayments payments={order.payments} />

                        <OrderTimeline timeline={order.timeline} />
                </div>
        );
}
