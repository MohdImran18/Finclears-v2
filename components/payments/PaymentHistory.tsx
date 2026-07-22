"use client";

interface PaymentHistoryProps {
  payments?: any[];
  loading?: boolean;
}

export default function PaymentHistory({
  payments = [],
  loading = false,
}: PaymentHistoryProps) {
  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment: any, index: number) => (
        <div
          key={payment.id ?? index}
          className="rounded-lg border p-4"
        >
          <div className="font-medium">
            {payment.reference ??
              payment.transaction_id ??
              `Payment ${index + 1}`}
          </div>

          <div className="text-sm text-gray-500">
            ₹{payment.amount ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}
