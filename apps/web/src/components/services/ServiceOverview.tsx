"use client";

import type { Service } from "@/types/service";

interface Props {
    service: Service;
}

export default function ServiceOverview({ service }: Props) {
    const description = service.description || service.short_description;

    if (!description) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="max-w-4xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Overview
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    About {service.title}
                </h2>

                <div
                    className="mt-5 leading-7 text-slate-600"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </section>
    );
}
