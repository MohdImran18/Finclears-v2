"use client";

import type { Order } from "@/types/order";

interface OrderDetailsProps {
        order?: Order;
}

function formatAmount(amount?: number) {
        return `₹${Number(amount ?? 0).toLocaleString("en-IN")}`;
}

function formatDate(value?: string) {
        if (!value) return "-";

        return new Date(value).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
        });
}

export default function OrderDetails({ order }: OrderDetailsProps) {
        if (!order) {
                return (
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-xl font-semibold">Order Details</h2>
                                <p className="mt-3 text-sm text-slate-500">
                                        No order selected.
                                </p>
                        </div>
                );
        }

        const successfulPayments =
                order.payments?.filter(
                        (payment) => payment.payment_status === "success",
                ) ?? [];

        const totalPaid = successfulPayments.reduce(
                (sum, payment) => sum + Number(payment.amount ?? 0),
                0,
        );

        return (
                <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                                        <div>
                                                <h2 className="text-xl font-semibold">
                                                        Order Details
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                        Complete order information
                                                </p>
                                        </div>

                                        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">
                                                {order.status.replaceAll("_", " ")}
                                        </span>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Order Number
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {order.order_no}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Order ID
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        #{order.id}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Service
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {order.service_name}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Customer
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {order.customer_name}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Email
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {order.customer_email ?? "-"}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Mobile
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {order.customer_mobile ?? "-"}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Order Amount
                                                </p>
                                                <p className="mt-1 text-lg font-bold">
                                                        {formatAmount(order.amount)}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Priority
                                                </p>
                                                <p className="mt-1 font-semibold capitalize">
                                                        {order.priority}
                                                </p>
                                        </div>

                                        <div>
                                                <p className="text-sm text-slate-500">
                                                        Created
                                                </p>
                                                <p className="mt-1 font-semibold">
                                                        {formatDate(order.created_at)}
                                                </p>
                                        </div>
                                </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="mb-5 text-xl font-semibold">
                                        Assignment
                                </h2>

                                {order.assigned_user ? (
                                        <div className="flex items-center gap-4">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold">
                                                        {order.assigned_user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                </div>

                                                <div>
                                                        <p className="font-semibold">
                                                                {order.assigned_user.name}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                                {order.assigned_user.email}
                                                        </p>
                                                </div>
                                        </div>
                                ) : (
                                        <p className="text-sm text-slate-500">
                                                No employee assigned.
                                        </p>
                                )}
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-5 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">
                                                Payments
                                        </h2>

                                        <span className="text-sm text-slate-500">
                                                {order.payments?.length ?? 0} payment(s)
                                        </span>
                                </div>

                                {order.payments?.length ? (
                                        <div className="space-y-4">
                                                {order.payments.map((payment) => (
                                                        <div
                                                                key={payment.id}
                                                                className="rounded-lg border border-slate-200 p-4"
                                                        >
                                                                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                                                                        <div>
                                                                                <p className="font-semibold">
                                                                                        Payment #{payment.id}
                                                                                </p>

                                                                                <p className="text-sm text-slate-500">
                                                                                        {payment.payment_gateway}{" "}
                                                                                        ·{" "}
                                                                                        {formatDate(
                                                                                                payment.created_at,
                                                                                        )}
                                                                                </p>
                                                                        </div>

                                                                        <div className="text-left md:text-right">
                                                                                <p className="font-bold">
                                                                                        {formatAmount(
                                                                                                Number(
                                                                                                        payment.amount,
                                                                                                ),
                                                                                        )}
                                                                                </p>

                                                                                <span className="text-sm capitalize text-slate-500">
                                                                                        {payment.payment_status}
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                {payment.gateway_transaction_id && (
                                                                        <p className="mt-3 break-all text-xs text-slate-500">
                                                                                Transaction ID:{" "}
                                                                                {payment.gateway_transaction_id}
                                                                        </p>
                                                                )}
                                                        </div>
                                                ))}

                                                <div className="flex justify-between border-t pt-4">
                                                        <span className="font-medium">
                                                                Total Paid
                                                        </span>

                                                        <span className="font-bold">
                                                                {formatAmount(totalPaid)}
                                                        </span>
                                                </div>
                                        </div>
                                ) : (
                                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">
                                                No payment records found.
                                        </div>
                                )}
                        </div>
                </div>
        );
}
