"use client";

interface DashboardStats {
  users?: number;
  companies?: number;
  orders?: number;
  revenue?: number;
}

interface SystemOverviewProps {
  stats?: DashboardStats;
}

export default function SystemOverview({
  stats,
}: SystemOverviewProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        System Overview
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-slate-500">
            Users
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats?.users ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-slate-500">
            Companies
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats?.companies ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          <p className="text-sm text-slate-500">
            Orders
          </p>

          <p className="mt-2 text-2xl font-bold">
            {stats?.orders ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-slate-500">
            Revenue
          </p>

          <p className="mt-2 text-2xl font-bold">
            ₹{Number(
              stats?.revenue ?? 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

      </div>

    </div>
  );
}
