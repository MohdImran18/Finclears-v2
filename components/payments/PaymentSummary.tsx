"use client";

interface PaymentSummaryProps {
  total?: number;
  completed?: number;
  pending?: number;
}

export default function PaymentSummary({
  total = 0,
  completed = 0,
  pending = 0,
}: PaymentSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">
          Total Payments
        </div>

        <div className="mt-2 text-2xl font-bold">
          {total}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">
          Completed
        </div>

        <div className="mt-2 text-2xl font-bold text-green-600">
          {completed}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="text-sm text-gray-500">
          Pending
        </div>

        <div className="mt-2 text-2xl font-bold text-orange-600">
          {pending}
        </div>
      </div>
    </div>
  );
}
