"use client";

interface RevenuePoint {
  label?: string;
  month?: string;
  revenue?: number;
  amount?: number;
}

interface RevenueChartProps {
  data?: RevenuePoint[];
}

export default function RevenueChart({
  data = [],
}: RevenueChartProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Revenue Chart
      </h2>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-500">
          No revenue data available.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>
                {item.label ?? item.month ?? `Item ${index + 1}`}
              </span>

              <span className="font-semibold">
                ₹
                {Number(
                  item.revenue ?? item.amount ?? 0
                ).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
