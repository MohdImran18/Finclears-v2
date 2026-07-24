"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-24">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_45%)]" />

      <div className="container relative mx-auto px-6">

        <div className="mx-auto max-w-6xl rounded-[36px] bg-white/10 p-14 backdrop-blur-xl">

          <div className="text-center">

            <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">

              🚀 Let's Get Started

            </span>

            <h2 className="mt-8 text-5xl font-bold text-white">

              Ready to Start Your Business?

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-blue-100">

              Whether you need Company Registration,
              GST Registration, Trademark, Income Tax,
              ROC Compliance or Accounting,
              our experts are ready to help.

            </p>

          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <Link
              href="/contact"
              className="rounded-2xl bg-white p-8 text-center shadow-xl transition hover:-translate-y-1"
            >
              <div className="text-5xl">

                📞

              </div>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">

                Free Consultation

              </h3>

              <p className="mt-3 text-gray-600">

                Talk to our experts today.

              </p>

            </Link>

            <Link
              href="https://wa.me/919873247695"
              target="_blank"
              className="rounded-2xl bg-green-500 p-8 text-center text-white shadow-xl transition hover:-translate-y-1"
            >
              <div className="text-5xl">

                💬

              </div>

              <h3 className="mt-5 text-2xl font-bold">

                WhatsApp Us

              </h3>

              <p className="mt-3">

                Get an instant response.

              </p>

            </Link>

            <Link
              href="mailto:support@finclears.com"
              className="rounded-2xl bg-white p-8 text-center shadow-xl transition hover:-translate-y-1"
            >
              <div className="text-5xl">

                ✉️

              </div>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">

                Email Us

              </h3>

              <p className="mt-3 text-gray-600">

                support@finclears.com

              </p>

            </Link>

          </div>

          <div className="mt-16 grid gap-8 border-t border-white/20 pt-10 md:grid-cols-4">

            <div className="text-center">

              <h3 className="text-4xl font-bold text-white">

                10K+

              </h3>

              <p className="mt-2 text-blue-100">

                Happy Clients

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-4xl font-bold text-white">

                99%

              </h3>

              <p className="mt-2 text-blue-100">

                Success Rate

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-4xl font-bold text-white">

                24×7

              </h3>

              <p className="mt-2 text-blue-100">

                Expert Support

              </p>

            </div>

            <div className="text-center">

              <h3 className="text-4xl font-bold text-white">

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
