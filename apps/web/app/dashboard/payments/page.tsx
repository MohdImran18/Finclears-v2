"use client";

import { useState } from "react";

import PaymentFilters from "@/components/payments/PaymentFilters";
import PaymentHistory from "@/components/payments/PaymentHistory";
import PaymentSummary from "@/components/payments/PaymentSummary";

import { usePayments } from "@/hooks/usePayments";

import type { Payment } from "@/types/payment";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePayments({
    search,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        Loading payments...
      </div>
    );
  }

  const payments: Payment[] = data?.data ?? [];

  const total = payments.reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  );

  const completed = payments
    .filter((payment) => payment.status === "paid")
    .reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0
    );

  const pending = payments
    .filter((payment) => payment.status === "pending")
    .reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0
    );

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          Payments
        </h1>

        <p className="text-slate-500">
          Manage invoices and payment history.
        </p>
      </div>

      <PaymentSummary
        total={total}
        completed={completed}
        pending={pending}
      />

      <PaymentFilters
        search={search}
        onSearch={setSearch}
      />

      <PaymentHistory
        payments={payments}
        loading={false}
      />
    </div>
  );
}