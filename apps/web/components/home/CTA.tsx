"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-24">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.18),transparent_45%)]" />

      <div className="container relative mx-auto px-6">

        <div className="mx-auto max-w-5xl rounded-[32px] bg-white/10 p-12 backdrop-blur-lg">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white">

                🚀 Start Today

              </span>

              <h2 className="mt-6 text-5xl font-bold leading-tight text-white">

                Ready to Register

                <br />

                Your Business?

              </h2>

              <p className="mt-6 text-lg leading-8 text-blue-100">

                Whether you're starting a Private Limited Company,
                LLP, GST Registration, Trademark, or Annual Compliance,
                FinClears is here to simplify every step.

              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <Link
                  href="/contact"
                  className="rounded-xl bg-white px-7 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
                >
                  Get Free Consultation
                </Link>

                <Link
                  href="/services"
                  className="rounded-xl border border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
                >
                  Explore Services
                </Link>

              </div>

            </div>

            {/* Right */}

            <div className="rounded-3xl bg-white p-8 shadow-2xl">

              <h3 className="text-3xl font-bold text-gray-900">

                Why Choose FinClears?

              </h3>

              <div className="mt-8 space-y-5">

                <div className="flex items-center gap-4">

                  <span className="text-2xl">
                    ✅
                  </span>

                  <span className="text-gray-700">
                    100% Online Registration Process
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-2xl">
                    ✅
                  </span>

                  <span className="text-gray-700">
                    Expert CA & CS Team
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-2xl">
                    ✅
                  </span>

                  <span className="text-gray-700">
                    Transparent Pricing
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-2xl">
                    ✅
                  </span>

                  <span className="text-gray-700">
                    Fast Government Filing
                  </span>

                </div>

                <div className="flex items-center gap-4">

                  <span className="text-2xl">
                    ✅
                  </span>

                  <span className="text-gray-700">
                    Dedicated Relationship Manager
                  </span>

                </div>

              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t pt-8">

                <div className="text-center">

                  <h4 className="text-3xl font-bold text-blue-600">

                    10K+

                  </h4>

                  <p className="mt-2 text-sm text-gray-500">

                    Clients

                  </p>

                </div>

                <div className="text-center">

                  <h4 className="text-3xl font-bold text-green-600">

                    99%

                  </h4>

                  <p className="mt-2 text-sm text-gray-500">

                    Success

                  </p>

                </div>

                <div className="text-center">

                  <h4 className="text-3xl font-bold text-orange-600">

                    24×7

                  </h4>

                  <p className="mt-2 text-sm text-gray-500">

                    Support

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
