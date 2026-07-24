"use client";

import Image from "next/image";
import Link from "next/link";

import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  const image =
    service.featured_image ||
    "/images/services/service-placeholder.webp";

  const category =
    service.category?.name ?? "Business Service";

  const categorySlug =
    service.category?.slug ?? "general";

  const price = Number(service.starting_price ?? 0);

  const processingTime =
    service.processing_time ?? "2–5 Working Days";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* Image */}

      <div className="relative h-52 overflow-hidden bg-slate-100">

        <Image
          src={image}
          alt={service.title}
          fill
          priority={false}
          sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">

          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {category}
          </span>

          {service.is_popular && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              Popular
            </span>
          )}

        </div>

      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-6">

        <h3 className="line-clamp-2 min-h-[64px] text-2xl font-bold text-slate-900">
          {service.title}
        </h3>

        <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-600">
          {service.short_description}
        </p>

        {/* Price */}

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Starting From
              </p>

              <h4 className="mt-1 text-3xl font-bold text-blue-600">
                ₹{price.toLocaleString("en-IN")}
              </h4>

            </div>

            <div className="text-right">

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Processing
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {processingTime}
              </p>

            </div>

          </div>

        </div>

        {/* CTA */}

        <Link
          href={`/services/${categorySlug}/${service.slug}`}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white transition-all duration-300 hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>

    </article>
  );
}