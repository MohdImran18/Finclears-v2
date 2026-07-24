"use client";

import Link from "next/link";

import ServiceGrid from "@/components/services/ServiceGrid";
import { useFeaturedServices } from "@/hooks/useServices";

export default function HomeServices() {

  const {
    data: services = [],
    isLoading,
    isError,
  } = useFeaturedServices();

  return (
    <section className="bg-gray-50 py-20">

      <div className="container mx-auto px-6">

        <div className="mb-14 flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Services
            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">
              Popular Business Services
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Register your business, manage tax compliance,
              protect your brand and grow confidently with
              FinClears.
            </p>

          </div>

          <Link
            href="/services"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Services
          </Link>

        </div>

        {isLoading && (
          <div className="py-20 text-center">
            Loading services...
          </div>
        )}

        {isError && (
          <div className="py-20 text-center text-red-600">
            Unable to load services.
          </div>
        )}

        {!isLoading && !isError && (
          <ServiceGrid
            services={services}
          />
        )}

      </div>

    </section>
  );
}