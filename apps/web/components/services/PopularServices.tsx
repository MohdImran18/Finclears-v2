"use client";

import Link from "next/link";

import type { Service } from "@/types/service";

import ServiceGrid from "./ServiceGrid";

interface PopularServicesProps {
  services?: Service[];
  loading?: boolean;
}

export default function PopularServices({
  services = [],
  loading = false,
}: PopularServicesProps) {
  const popularServices = services
    .filter((service) => service.is_popular)
    .slice(0, 6);

  if (!loading && popularServices.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mb-14 flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>

            <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              Most Popular
            </span>

            <h2 className="mt-5 text-4xl font-bold text-slate-900">
              Popular Business Services
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Explore the most frequently selected
              business registration, GST, trademark,
              taxation and compliance services trusted
              by startups and enterprises across India.
            </p>

          </div>

          <Link
            href="/services"
            className="inline-flex items-center rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            Explore All Services
          </Link>

        </div>

        <ServiceGrid
          services={popularServices}
          loading={loading}
        />

      </div>

    </section>
  );
}