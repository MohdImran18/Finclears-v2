"use client";

import Link from "next/link";

export default function ArticleCTA() {
  return (
    <section className="mt-24">

      <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-14 text-white shadow-2xl">

        <div className="mx-auto max-w-5xl text-center">

          <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold">

            🚀 Need Professional Assistance?

          </span>

          <h2 className="mt-8 text-5xl font-bold leading-tight">

            Let FinClears Handle
            <br />
            Your Business Compliance

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

            Whether you're starting a new company,
            registering GST, filing Income Tax,
            protecting your trademark or managing
            annual compliance, our experts are
            ready to assist you.

          </p>

          {/* CTA Buttons */}

          <div className="mt-14 flex flex-wrap justify-center gap-5">

            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
            >
              📞 Free Consultation
            </Link>

            <Link
              href="https://wa.me/919873247695"
              target="_blank"
              className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white transition hover:bg-green-600"
            >
              💬 WhatsApp Expert
            </Link>

            <Link
              href="/services"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
            >
              Browse Services
            </Link>

          </div>

          {/* Features */}

          <div className="mt-16 grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl bg-white/10 p-6">

              <div className="text-5xl">

                🏢

              </div>

              <h3 className="mt-4 text-lg font-bold">

                Company Registration

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6">

              <div className="text-5xl">

                📄

              </div>

              <h3 className="mt-4 text-lg font-bold">

                GST & Tax Filing

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6">

              <div className="text-5xl">

                ™️

              </div>

              <h3 className="mt-4 text-lg font-bold">

                Trademark Services

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6">

              <div className="text-5xl">

                ⚖️

              </div>

              <h3 className="mt-4 text-lg font-bold">

                Annual Compliance

              </h3>

            </div>

          </div>

          {/* Trust Stats */}

          <div className="mt-16 grid gap-8 border-t border-white/20 pt-10 md:grid-cols-4">

            <div>

              <h3 className="text-4xl font-bold">

                10K+

              </h3>

              <p className="mt-2 text-blue-100">

                Happy Businesses

              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold">

                99%

              </h3>

              <p className="mt-2 text-blue-100">

                Client Satisfaction

              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold">

                24×7

              </h3>

              <p className="mt-2 text-blue-100">

                Expert Support

              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold">

                PAN India

              </h3>

              <p className="mt-2 text-blue-100">

                Business Services

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
