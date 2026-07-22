"use client";

import Link from "next/link";

export default function GoogleMap() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Find Us

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Visit Our Office

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            You're always welcome to visit our office for
            business consultation and professional guidance.

          </p>

        </div>

        <div className="overflow-hidden rounded-[32px] border bg-white shadow-2xl">

          <iframe
            src="https://www.google.com/maps?q=Noida+Sector+62&output=embed"
            width="100%"
            height="550"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />

        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">

          <div className="rounded-3xl bg-slate-50 p-8">

            <div className="text-5xl">

              📍

            </div>

            <h3 className="mt-5 text-2xl font-bold">

              Office Address

            </h3>

            <p className="mt-4 leading-8 text-gray-600">

              Sector 62,
              <br />
              Noida,
              <br />
              Uttar Pradesh,
              <br />
              India

            </p>

          </div>

          <div className="rounded-3xl bg-slate-50 p-8">

            <div className="text-5xl">

              🚗

            </div>

            <h3 className="mt-5 text-2xl font-bold">

              Parking Available

            </h3>

            <p className="mt-4 leading-8 text-gray-600">

              Visitor parking is available.
              Metro station and public transport
              are within walking distance.

            </p>

          </div>

          <div className="rounded-3xl bg-slate-50 p-8">

            <div className="text-5xl">

              🧭

            </div>

            <h3 className="mt-5 text-2xl font-bold">

              Get Directions

            </h3>

            <p className="mt-4 leading-8 text-gray-600">

              Open Google Maps for turn-by-turn
              navigation to our office.

            </p>

            <Link
              href="https://maps.google.com"
              target="_blank"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Open Google Maps
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}
