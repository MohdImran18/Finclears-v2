"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useServices } from "@/hooks/useServices";
import ServiceGrid from "@/components/services/ServiceGrid";
import ServiceCTA from "@/components/services/ServiceCTA";
import Newsletter from "@/components/services/Newsletter";

interface Props {
  categorySlug: string;
  title: string;
  description: string;
}

export default function ServiceCategoryPage({
  categorySlug,
  title,
  description,
}: Props) {
  const { data: services = [], isLoading, isError } = useServices();

  const categoryServices = useMemo(
    () =>
      services.filter(
        (service) =>
          service.category?.slug === categorySlug &&
          service.status !== false,
      ),
    [services, categorySlug],
  );

  return (
    <main className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <nav className="mb-6 text-sm text-blue-100">
            <Link href="/services" className="hover:text-white">
              All Services
            </Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </nav>

          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            {description}
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Unable to load services
            </h2>
            <p className="mt-2 text-slate-600">
              Please try again later or contact our team.
            </p>
          </div>
        ) : (
          <ServiceGrid
            title={`Explore ${title}`}
            description={`Browse our available ${title.toLowerCase()} services and select the one that fits your requirements.`}
            services={categoryServices}
            loading={isLoading}
          />
        )}
      </section>

      <ServiceCTA />
      <Newsletter />
    </main>
  );
}
