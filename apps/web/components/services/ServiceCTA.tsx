"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function ServiceCTA({
  title = "Ready to Register Your Business?",
  description = "Start your business journey with FinClears. Our experienced CA, CS and legal experts will manage the complete registration process quickly and compliantly.",
  buttonText = "Talk to an Expert",
  buttonLink = "/contact",
}: Props) {
  return (
    <section className="py-24">

      <div className="container mx-auto px-6">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-8 py-16 text-white shadow-2xl md:px-16">

          <div className="mx-auto max-w-4xl text-center">

            <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Start Today
            </span>

            <h2 className="mt-6 text-4xl font-bold md:text-5xl">
              {title}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
              {description}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-5">

              <Link
                href={buttonLink}
                className="inline-flex items-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-700 transition-all duration-300 hover:scale-105 hover:bg-gray-100"
              >
                {buttonText}

                <ArrowRight
                  size={20}
                  className="ml-2"
                />
              </Link>

              <Link
                href="https://wa.me/919873247695"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-xl border border-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-blue-700"
              >
                <MessageCircle
                  size={20}
                  className="mr-2"
                />

                WhatsApp Now
              </Link>

            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">

              <div>

                <h3 className="text-4xl font-bold">
                  10K+
                </h3>

                <p className="mt-2 text-blue-100">
                  Businesses Registered
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

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}