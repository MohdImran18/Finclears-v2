"use client";

import type { Service } from "@/types/service";
import ServiceCard from "./ServiceCard";

interface ServiceGridProps {
    services: Service[];
}

export default function ServiceGrid({ services }: ServiceGridProps) {
    if (!services.length) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <h3 className="text-xl font-semibold text-slate-900">
                    No services available
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                    Please check back shortly.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
}
