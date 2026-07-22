"use client";

interface OrdersTableProps {
  orders?: any[];
  loading?: boolean;
}

export default function OrdersTable({
  orders = [],
  loading = false,
}: OrdersTableProps) {
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
            <th className="px-4 py-3 text-left">Order</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any, index: number) => (
            <tr key={order.id ?? index} className="border-t">
              <td className="px-4 py-3">
                {order.order_number ??
                  order.name ??
                  `Order ${index + 1}`}
              </td>

              <td className="px-4 py-3">
                {order.status ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
