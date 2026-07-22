"use client";

import Link from "next/link";
import type { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({
  service,
}: Props) {

  const price = Number(service.starting_price || 0);

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}

      <div className="relative h-52 overflow-hidden bg-gray-100">

        {service.featured_image ? (

          <img
            src={service.featured_image}
            alt={service.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

        ) : (

          <div className="flex h-full items-center justify-center text-5xl">
            📄
          </div>

        )}

        {service.is_popular && (

          <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </span>

        )}

      </div>

      {/* Content */}

      <div className="space-y-4 p-6">

        <div>

          <h3 className="text-xl font-bold text-gray-900">
            {service.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {service.short_description}
          </p>

        </div>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs text-gray-500">
              Starting From
            </p>

            <h4 className="text-2xl font-bold text-blue-600">
              ₹{price.toLocaleString("en-IN")}
            </h4>

          </div>

          <Link
            href={`/services/${service.category.slug}/${service.slug}`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>

        </div>

      </div>

    </article>
  );
}


