"use client";

import Link from "next/link";

import type { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceHero({
  service,
}: Props) {
  const categoryLabel = service.category.name;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">

      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-8 py-20 lg:flex-row">

        {/* Left */}

        <div className="flex-1">

          <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-medium">

            {categoryLabel.toUpperCase()}

          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            {service.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-blue-100">
            {service.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/contact"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Talk to Expert
            </Link>

            <Link
              href="https://wa.me/919873247695"
              target="_blank"
              className="rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-blue-700"
            >
              WhatsApp
            </Link>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-1 justify-center">

          {service.featured_image ? (

            <img
              src={service.featured_image}
              alt={service.title}
              className="w-full max-w-md rounded-3xl shadow-2xl"
            />

          ) : (

            <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-white/10 text-8xl">

              📄

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

