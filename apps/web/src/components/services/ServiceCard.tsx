"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    IndianRupee,
    Star,
} from "lucide-react";

import type { Service } from "@/types/service";

interface ServiceCardProps {
    service: Service;
}

function formatPrice(value?: string | number | null) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return String(value);
    }

    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
    }).format(numericValue);
}

export default function ServiceCard({ service }: ServiceCardProps) {
    const price = formatPrice(service.starting_price);

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-48 overflow-hidden bg-slate-100">
                {service.featured_image ? (
                    <img
                        src={service.featured_image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <div className="text-center">
                            <CheckCircle2 className="mx-auto h-10 w-10 text-slate-400" />
                            <p className="mt-2 text-sm font-medium text-slate-500">
                                Professional Service
                            </p>
                        </div>
                    </div>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {service.is_popular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Popular
                        </span>
                    )}

                    {service.is_featured && (
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow">
                            Featured
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
                {service.category?.name && (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {service.category.name}
                    </p>
                )}

                <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-slate-700">
                    {service.title}
                </h2>

                {service.short_description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {service.short_description}
                    </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    {price && (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                            <IndianRupee className="h-4 w-4" />
                            {price}
                            {service.price_label && (
                                <span className="ml-1 font-normal text-slate-500">
                                    {service.price_label.toLowerCase()}
                                </span>
                            )}
                        </span>
                    )}

                    {service.processing_days && (
                        <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4" />
                            {service.processing_days} days
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-6">
                    <Link
                        href={`/services/${service.category?.slug ?? "business-registration"}/${service.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        View Service
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
