"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_45%)]" />

      <div className="container relative mx-auto grid min-h-[700px] items-center gap-16 px-6 py-20 lg:grid-cols-2">

        {/* Left */}

        <div>

          <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">

            🇮🇳 Trusted by 10,000+ Businesses

          </span>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

            Start & Grow Your Business

            <span className="block text-yellow-300">

              Without Legal Hassles

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-blue-100">

            FinClears provides complete business registration,
            GST, Trademark, ITR, Compliance and Accounting
            services for Startups, MSMEs and Enterprises.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/services"
              className="rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              Explore Services
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              Free Consultation
            </Link>

          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">

            <div>

              <h2 className="text-3xl font-bold text-white">

                10K+

              </h2>

              <p className="mt-2 text-blue-100">

                Businesses Served

              </p>

            </div>

            <div>

              <h2 className="text-3xl font-bold text-white">

                99%

              </h2>

              <p className="mt-2 text-blue-100">

                Success Rate

              </p>

            </div>

            <div>

              <h2 className="text-3xl font-bold text-white">

                24×7

              </h2>

              <p className="mt-2 text-blue-100">

                Expert Support

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

            <h3 className="text-2xl font-bold">

              Get Started Today

            </h3>

            <p className="mt-2 text-gray-500">

              Free Business Consultation

            </p>

            <form className="mt-8 space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              />

              <select
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              >
                <option>
                  Select Service
                </option>

                <option>
                  Private Limited Company
                </option>

                <option>
                  LLP Registration
                </option>

                <option>
                  GST Registration
                </option>

                <option>
                  Trademark Registration
                </option>

              </select>

              <button
                className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Free Consultation
              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}
