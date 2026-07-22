"use client";

import { useState } from "react";

import OrdersTable from "@/components/orders/OrdersTable";
import OrderFilters from "@/components/orders/OrderFilters";

import { useOrders } from "@/hooks/useOrders";

export default function OrdersPage() {
  const [search, setSearch] =
    useState("");

  const { data, isLoading } =
    useOrders({
      search,
    });

  if (isLoading) {
    return (
      <div className="p-8">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">

      <div>
        <h1 className="text-3xl font-bold">
          Orders
        </h1>

        <p className="text-slate-500">
          Manage all customer orders.
        </p>
      </div>

      <OrderFilters
        onSearch={setSearch}
      />

      <OrdersTable
        orders={data?.data ?? []}
      />

    </div>
  );
}
