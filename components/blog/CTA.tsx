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

              🚀 Ready To Grow?

            </span>

            <h2 className="mt-8 text-5xl font-bold text-white">

              Start Your Business
              <br />
              With FinClears Today

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-blue-100">

              From Company Registration to GST,
              Trademark, Accounting and Compliance,
              our experts are here to help your
              business succeed.

            </p>

          </div>

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
              💬 WhatsApp Now
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

            <div className="rounded-2xl bg-white/10 p-6 text-center">

              <div className="text-5xl">

                🏢

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                Company Registration

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6 text-center">

              <div className="text-5xl">

                📑

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                GST Services

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6 text-center">

              <div className="text-5xl">

                ™️

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                Trademark

              </h3>

            </div>

            <div className="rounded-2xl bg-white/10 p-6 text-center">

              <div className="text-5xl">

                ⚖️

              </div>

              <h3 className="mt-4 text-xl font-bold text-white">

                Compliance

              </h3>

            </div>

          </div>

          {/* Trust Stats */}

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

                500+

              </h3>

              <p className="mt-2 text-blue-100">

                Expert Articles

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
