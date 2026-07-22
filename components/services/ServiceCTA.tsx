"use client";

import Link from "next/link";

interface Props {
  title?: string;

  description?: string;

  buttonText?: string;

  buttonLink?: string;
}

export default function ServiceCTA({
  title = "Ready to Start Your Business?",
  description = "Get expert assistance from FinClears. Our professionals will handle the complete registration process while you focus on growing your business.",
  buttonText = "Talk to an Expert",
  buttonLink = "/contact",
}: Props) {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-10 py-16 text-white shadow-2xl">

          <div className="mx-auto max-w-4xl text-center">

            <h2 className="text-4xl font-bold">

              {title}

            </h2>

            <p className="mt-6 text-lg text-blue-100">

              {description}

            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">

              <Link
                href={buttonLink}
                className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
              >
                {buttonText}
              </Link>

              <Link
                href="https://wa.me/919873247695"
                target="_blank"
                className="rounded-xl border border-white px-8 py-4 font-semibold transition hover:bg-white hover:text-blue-700"
              >
                WhatsApp Now
              </Link>

            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <div>

                <h3 className="text-3xl font-bold">

                  10K+

                </h3>

                <p className="mt-2 text-blue-100">

                  Businesses Registered

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold">

                  99%

                </h3>

                <p className="mt-2 text-blue-100">

                  Client Satisfaction

                </p>

              </div>

              <div>

                <h3 className="text-3xl font-bold">

                  24×7

                </h3>

                <p className="mt-2 text-blue-100">

                  Expert Support

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
