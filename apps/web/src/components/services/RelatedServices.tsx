"use client";

import type { Service } from "@/types/service";

interface Props {
    services?: Service[];
    currentId?: number;
}

export default function RelatedServices({
    services = [],
    currentId,
}: Props) {
    const related = services
        .filter((service) => service.id !== currentId)
        .slice(0, 3);

    if (!related.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">
                Related Services
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((service) => (
                    <a
                        key={service.id}
                        href={`/services/${service.slug}`}
                        className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-lg"
                    >
                        <h3 className="font-semibold text-slate-900">
                            {service.title}
                        </h3>

                        {service.short_description && (
                            <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                                {service.short_description}
                            </p>
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
}
