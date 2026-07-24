"use client";

import Link from "next/link";

const offices = [
  {
    city: "Noida (Head Office)",
    address:
      "Sector 62, Noida, Uttar Pradesh 201309",
    phone: "+91 98732 47695",
    email: "support@finclears.com",
    maps: "https://maps.google.com",
  },
  {
    city: "Delhi",
    address:
      "Connaught Place, New Delhi 110001",
    phone: "+91 98732 47695",
    email: "delhi@finclears.com",
    maps: "https://maps.google.com",
  },
  {
    city: "Mumbai",
    address:
      "Andheri East, Mumbai, Maharashtra",
    phone: "+91 98732 47695",
    email: "mumbai@finclears.com",
    maps: "https://maps.google.com",
  },
];

export default function OfficeLocations() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Our Offices

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Visit Our Offices

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Meet our experts in person or connect with the
            nearest FinClears office.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {offices.map((office) => (

            <div
              key={office.city}
              className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-4xl">

                🏢

              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">

                {office.city}

              </h3>

              <div className="mt-6 space-y-4">

                <div>

                  <p className="font-semibold text-gray-900">

                    Address

                  </p>

                  <p className="text-gray-600">

                    {office.address}

                  </p>

                </div>

                <div>

                  <p className="font-semibold text-gray-900">

                    Phone

                  </p>

                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="text-blue-600 hover:underline"
                  >
                    {office.phone}
                  </a>

                </div>

                <div>

                  <p className="font-semibold text-gray-900">

                    Email

                  </p>

                  <a
                    href={`mailto:${office.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {office.email}
                  </a>

                </div>

              </div>

              <Link
                href={office.maps}
                target="_blank"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Get Directions
              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
