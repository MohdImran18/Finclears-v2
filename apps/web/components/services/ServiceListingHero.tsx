"use client";

import Link from "next/link";
import {
  Building2,
  BadgeCheck,
  ShieldCheck,
  FileText,
  ArrowRight,
} from "lucide-react";

export default function ServiceListingHero() {
  const services = [
    "Company Registration",
    "GST",
    "Trademark",
    "ROC",
    "Income Tax",
    "Compliance",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-14 px-6 py-24 lg:flex-row">

        {/* Left */}

        <div className="flex-1">

          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">

            <BadgeCheck className="h-4 w-4" />

            Trusted by 20,000+ Businesses

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight lg:text-6xl">

            Our Business
            <br />
            Registration Services

          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">

            Register your company, GST, Trademark,
            ROC, Income Tax and Compliance services
            with India's trusted legal experts.

          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            {services.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm backdrop-blur"
              >
                {item}
              </span>
            ))}

          </div>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Get Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border border-white px-7 py-4 font-semibold transition hover:bg-white hover:text-blue-700"
            >
              View Pricing
            </Link>

          </div>

        </div>

        {/* Right */}

        <div className="flex-1">

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

              <Building2 className="mb-5 h-10 w-10" />

              <h3 className="text-4xl font-bold">

                20,000+

              </h3>

              <p className="mt-2 text-blue-100">

                Businesses Registered

              </p>

            </div>

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

              <ShieldCheck className="mb-5 h-10 w-10" />

              <h3 className="text-4xl font-bold">

                100%

              </h3>

              <p className="mt-2 text-blue-100">

                Secure Online Process

              </p>

            </div>

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

              <FileText className="mb-5 h-10 w-10" />

              <h3 className="text-4xl font-bold">

                500+

              </h3>

              <p className="mt-2 text-blue-100">

                Expert CAs & CS

              </p>

            </div>

            <div className="rounded-3xl bg-white/10 p-8 backdrop-blur">

              <BadgeCheck className="mb-5 h-10 w-10" />

              <h3 className="text-4xl font-bold">

                4.9★

              </h3>

              <p className="mt-2 text-blue-100">

                Customer Rating

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}