"use client";

import type { ServiceProcess as Process } from "@/types/service";

interface Props {
    processes?: Process[];
}

export default function ServiceProcess({ processes = [] }: Props) {
    if (!processes.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">Process</h2>

            <div className="mt-6 space-y-4">
                {[...processes]
                    .sort(
                        (a, b) =>
                            (a.sort_order ?? a.step_number ?? 0) -
                            (b.sort_order ?? b.step_number ?? 0)
                    )
                    .map((item, index) => (
                        <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                                {item.step_number ?? index + 1}
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                {item.description && (
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}
