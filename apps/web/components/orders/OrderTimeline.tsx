"use client";

interface TimelineItem {
  id?: number | string;
  title?: string;
  description?: string;
  status?: string;
  created_at?: string;
  date?: string;
}

interface OrderTimelineProps {
  timeline?: TimelineItem[];
}

export default function OrderTimeline({
  timeline = [],
}: OrderTimelineProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Order Timeline
      </h2>

      {timeline.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-slate-500">
          No timeline available.
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div
              key={item.id ?? index}
              className="border-l-4 border-blue-600 pl-4"
            >
              <h3 className="font-semibold">
                {item.title ?? item.status ?? "Activity"}
              </h3>

              <p className="text-sm text-slate-600">
                {item.description}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {item.created_at ?? item.date ?? ""}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
