"use client";

import type { OrderTimeline as OrderTimelineItem } from "@/types/order";

interface OrderTimelineProps {
        timeline?: OrderTimelineItem[];
}

export default function OrderTimeline({
        timeline = [],
}: OrderTimelineProps) {
        return (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                                <h2 className="text-xl font-semibold">
                                        Order Timeline
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                        Complete activity history for this order.
                                </p>
                        </div>

                        {timeline.length === 0 ? (
                                <div className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-500">
                                        No activity recorded yet.
                                </div>
                        ) : (
                                <div className="space-y-6">
                                        {timeline.map((item, index) => (
                                                <div
                                                        key={item.id}
                                                        className="relative pl-8"
                                                >
                                                        {index <
                                                                timeline.length -
                                                                        1 && (
                                                                <div className="absolute left-[7px] top-5 h-full w-px bg-slate-200" />
                                                        )}

                                                        <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white bg-blue-600 ring-2 ring-blue-100" />

                                                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                                        <h3 className="font-semibold text-slate-900">
                                                                                {
                                                                                        item.title
                                                                                }
                                                                        </h3>

                                                                        <span className="text-xs text-slate-400">
                                                                                {new Date(
                                                                                        item.created_at,
                                                                                ).toLocaleString()}
                                                                        </span>
                                                                </div>

                                                                {item.description && (
                                                                        <p className="mt-2 text-sm text-slate-600">
                                                                                {
                                                                                        item.description
                                                                                }
                                                                        </p>
                                                                )}

                                                                {item.creator && (
                                                                        <div className="mt-3 text-xs text-slate-500">
                                                                                Performed by{" "}
                                                                                <span className="font-medium text-slate-700">
                                                                                        {
                                                                                                item
                                                                                                        .creator
                                                                                                        .name
                                                                                        }
                                                                                </span>

                                                                                {item
                                                                                        .creator
                                                                                        .email && (
                                                                                        <span>
                                                                                                {" "}
                                                                                                (
                                                                                                {
                                                                                                        item
                                                                                                                .creator
                                                                                                                .email
                                                                                                }
                                                                                                )
                                                                                        </span>
                                                                                )}
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        )}
                </div>
        );
}
