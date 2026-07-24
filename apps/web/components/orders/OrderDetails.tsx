"use client";

interface Order {
  id?: number | string;
  order_number?: string;
  customer_name?: string;
  service?: string;
  amount?: number;
  status?: string;
  created_at?: string;
}

interface OrderDetailsProps {
  order?: Order;
}

export default function OrderDetails({
  order,
}: OrderDetailsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Order Details
      </h2>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <p className="text-sm text-slate-500">
            Order ID
          </p>
          <p className="font-semibold">
            {order?.id ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Order Number
          </p>
          <p className="font-semibold">
            {order?.order_number ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Customer
          </p>
          <p className="font-semibold">
            {order?.customer_name ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Service
          </p>
          <p className="font-semibold">
            {order?.service ?? "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Amount
          </p>
          <p className="font-semibold">
            ₹{Number(order?.amount ?? 0).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Status
          </p>
          <p className="font-semibold">
            {order?.status ?? "-"}
          </p>
        </div>

      </div>

    </div>
  );
}
