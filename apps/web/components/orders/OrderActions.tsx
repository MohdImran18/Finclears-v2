"use client";

import { useState } from "react";

import { useChangeOrderStatus } from "@/hooks/useOrders";

import type { OrderStatus } from "@/types/order";

interface OrderActionsProps {
        id?: number | string;
        currentStatus?: OrderStatus;
        onUpdated?: () => void;
}

export default function OrderActions({
        id,
        currentStatus,
        onUpdated,
}: OrderActionsProps) {
        const [error, setError] = useState("");

        const changeStatus = useChangeOrderStatus();

        if (!id) {
                return (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold">
                                        Order Actions
                                </h2>

                                <p className="mt-3 text-sm text-slate-500">
                                        No order selected.
                                </p>
                        </div>
                );
        }

        async function handleStatusChange(status: "completed" | "cancelled") {
                setError("");

                try {
                        await changeStatus.mutateAsync({
                                orderId: Number(id),
                                status,
                        });

                        onUpdated?.();
                } catch (err: any) {
                        setError(
                                err?.response?.data?.message ??
                                        "Unable to update order status.",
                        );
                }
        }

        const isCompleted = currentStatus === "completed";
        const isCancelled = currentStatus === "cancelled";

        return (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                                <h2 className="text-xl font-semibold">
                                        Order Actions
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                        Manage order status and workflow.
                                </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                                <button
                                        type="button"
                                        disabled={
                                                changeStatus.isPending ||
                                                isCompleted ||
                                                isCancelled
                                        }
                                        onClick={() =>
                                                handleStatusChange("completed")
                                        }
                                        className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                        {changeStatus.isPending
                                                ? "Updating..."
                                                : isCompleted
                                                  ? "Completed"
                                                  : "Mark Completed"}
                                </button>

                                <button
                                        type="button"
                                        disabled={
                                                changeStatus.isPending ||
                                                isCompleted ||
                                                isCancelled
                                        }
                                        onClick={() =>
                                                handleStatusChange("cancelled")
                                        }
                                        className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                        Cancel Order
                                </button>
                        </div>

                        {isCancelled && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        This order has been cancelled.
                                </div>
                        )}

                        {error && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {error}
                                </div>
                        )}

                        <p className="mt-4 text-xs text-slate-400">
                                Order ID: {id}
                        </p>
                </div>
        );
}
