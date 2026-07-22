"use client";

interface Activity {
  id?: number | string;
  title?: string;
  description?: string;
  action?: string;
  created_at?: string;
  time?: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
}

export default function RecentActivities({
  activities = [],
}: RecentActivitiesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No recent activities found.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id ?? index}
              className="rounded-lg border p-4"
            >
              <h3 className="font-semibold">
                {activity.title ??
                  activity.action ??
                  "Activity"}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {activity.description ?? ""}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {activity.created_at ??
                  activity.time ??
                  ""}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
