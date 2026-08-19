"use client";

import type { ServiceBenefit } from "@/types/service";

interface Props {
    benefits?: ServiceBenefit[];
}

export default function ServiceBenefits({ benefits = [] }: Props) {
    if (!benefits.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">Benefits</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {benefits.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                        {item.description && (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {item.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
