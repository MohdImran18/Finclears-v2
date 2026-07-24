"use client";

import Link from "next/link";

import type { Service } from "@/types/service";

import ServiceGrid from "./ServiceGrid";

interface FeaturedServicesProps {
  services?: Service[];
  loading?: boolean;
}

export default function FeaturedServices({
  services = [],
  loading = false,
}: FeaturedServicesProps) {
  const featuredServices = services
    .filter((service) => service.is_featured)
    .slice(0, 6);

  if (!loading && featuredServices.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-14">

      <div className="container mx-auto px-6">

        <div className="mb-14 flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>

            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Featured Services
            </span>

            <h2 className="mt-5 text-4xl font-bold text-slate-900">
              Most Popular Business Services
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Discover our most trusted registration,
              compliance and taxation services chosen by
              thousands of startups, MSMEs and growing
              businesses across India.
            </p>

          </div>

          <Link
            href="/services"
            className="inline-flex items-center rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View All Services
          </Link>

        </div>

        <ServiceGrid
          services={featuredServices}
          loading={loading}
        />

      </div>

    </section>
  );
}