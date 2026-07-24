"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_45%)]" />

      <div className="container relative mx-auto px-6 py-24">

        <div className="mx-auto max-w-5xl text-center">

          <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">

            FinClears Knowledge Center

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

            Business Insights

            <span className="block text-yellow-300">

              Tax, GST & Compliance Guides

            </span>

          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            Stay updated with the latest guides on
            Company Registration, GST, Income Tax,
            Trademark, ROC Compliance, Startup Funding
            and Business Growth.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">

            <Link
              href="/services"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Explore Services
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              Talk To Expert
            </Link>

          </div>

          {/* Popular Topics */}

          <div className="mt-16 flex flex-wrap justify-center gap-4">

            {[
              "Company Registration",
              "GST",
              "Trademark",
              "Income Tax",
              "ROC Compliance",
              "MSME",
              "Startup India",
              "Accounting",
            ].map((topic) => (

              <span
                key={topic}
                className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur"
              >
                {topic}
              </span>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
