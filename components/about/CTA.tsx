"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-24">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_45%)]" />

      <div className="container relative mx-auto px-6">

        <div className="mx-auto max-w-5xl rounded-[36px] bg-white/10 p-14 backdrop-blur-xl">

          <div className="text-center">

            <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white">

              Let's Build Together

            </span>

            <h2 className="mt-8 text-5xl font-bold text-white">

              Ready to Start Your Business Journey?

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-blue-100">

              Whether you're launching a startup,
              registering a Private Limited Company,
              obtaining GST registration,
              protecting your brand with a trademark,
              or managing annual compliance,
              FinClears is here to help every step of the way.

            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-5">

              <Link
                href="/contact"
                className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
              >
                Talk to an Expert
              </Link>

              <Link
                href="/services"
                className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
              >
                Explore Services
              </Link>

            </div>

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

                PAN

              </h3>

              <p className="mt-2 text-blue-100">

                India Service

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

          </div>

        </div>

      </div>

    </section>
  );
}
