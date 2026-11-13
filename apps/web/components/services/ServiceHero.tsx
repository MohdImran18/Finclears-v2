"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceHero({ service }: Props) {
  const categoryLabel = service.category?.name ?? "Business Services";
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-0 -z-10 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10 lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {categoryLabel}
          </div>

          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
            {service.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {service.short_description || 'Get expert guidance for your business registration with FinClears.'}
          </p>

          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-slate-700">
            {[
              "Expert assistance",
              "Clear process guidance",
              "Personalised support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
            >
              Talk to an Expert
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>

            <Link
              href="https://wa.me/919873247695"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-semibold text-slate-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
            >
              <span className="mr-2 text-emerald-600" aria-hidden="true">◉</span>
              Chat on WhatsApp
            </Link>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Get guidance on the process, documents and applicable charges.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-200/60 to-indigo-100/40 blur-xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-2xl shadow-slate-900/10 sm:p-4">
            {service.featured_image && !imageFailed ? (
              <img
                src={service.featured_image}
                alt={service.title}
                onError={() => setImageFailed(true)}
                className="aspect-[5/4] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex aspect-[5/4] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-8 text-center text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-4xl shadow-inner">
                  ✓
                </div>
                <h2 className="mt-6 text-2xl font-bold">
                  Professional Business Support
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-6 text-blue-100">
                  Guidance for your service journey, documentation and next steps.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4">
              <div className="rounded-xl bg-slate-50 p-3 sm:p-4">
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Service pricing
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                  Transparent details
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 sm:p-4">
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  Customer support
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                  Expert guidance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
