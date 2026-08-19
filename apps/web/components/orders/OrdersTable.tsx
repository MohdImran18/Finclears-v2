"use client";

import { useRouter } from "next/navigation";

import type { Order } from "@/types/order";

interface OrdersTableProps {
        orders?: Order[];
        loading?: boolean;
}

export default function OrdersTable({
        orders = [],
        loading = false,
}: OrdersTableProps) {
        const router = useRouter();

        if (loading) {
                return <div>Loading orders...</div>;
        }

        if (orders.length === 0) {
                return (
                        <div className="rounded-lg border bg-white p-6 text-center">
                                No orders found.
                        </div>
                );
        }

        return (
                <div className="overflow-hidden rounded-lg border bg-white">
                        <table className="min-w-full">
                                <thead className="bg-gray-50">
                                        <tr>
                                                <th className="px-4 py-3 text-left">
                                                        Order
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                        Customer
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                        Service
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                        Amount
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                        Status
                                                </th>

                                                <th className="px-4 py-3 text-left">
                                                        Assigned To
                                                </th>
                                        </tr>
                                </thead>

                                <tbody>
                                        {orders.map((order) => (
                                                <tr
                                                        key={order.id}
                                                        onClick={() =>
                                                                router.push(
                                                                        `/dashboard/orders/${order.id}`,
                                                                )
                                                        }
                                                        className="cursor-pointer border-t hover:bg-slate-50"
                                                >
                                                        <td className="px-4 py-3">
                                                                <div className="font-semibold">
                                                                        {order.order_no}
                                                                </div>

                                                                <div className="text-xs text-slate-500">
                                                                        ID: {order.id}
                                                                </div>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                                {order.customer_name}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                                {order.service_name}
                                                        </td>

                                                        <td className="px-4 py-3 font-semibold">
                                                                ₹
                                                                {Number(
                                                                        order.amount ?? 0,
                                                                ).toLocaleString("en-IN")}
                                                        </td>

                                                        <td className="px-4 py-3">
                                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                                                                        {order.status}
                                                                </span>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                                {order.assigned_user?.name ??
                                                                        "Unassigned"}
                                                        </td>
                                                </tr>
                                        ))}
                                </tbody>
                        </table>
                </div>
        );
}
