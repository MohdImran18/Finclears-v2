"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_45%)]" />

      <div className="container relative mx-auto px-6 py-24">

        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">

            Transparent Pricing

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

            Simple Pricing

            <span className="block text-yellow-300">

              For Every Business

            </span>

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            No hidden charges.
            Professional CA support.
            Government filing included.
            Choose the plan that fits your business.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">

            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Get Free Consultation
            </Link>

            <Link
              href="/services"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              View Services
            </Link>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

              <div className="text-5xl">

                💰

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                No Hidden Charges

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

              <div className="text-5xl">

                ⚡

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                Fast Processing

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

              <div className="text-5xl">

                👨‍💼

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                Expert CA Support

              </h3>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
