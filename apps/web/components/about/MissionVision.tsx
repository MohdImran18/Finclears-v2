"use client";

export default function MissionVision() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Mission & Vision

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Building India's Most Trusted
            Business Compliance Platform

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            We believe every entrepreneur deserves
            affordable, transparent and technology-driven
            legal and compliance services.

          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Mission */}

          <div className="rounded-[32px] bg-white p-10 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-5xl">

              🎯

            </div>

            <h3 className="mt-8 text-3xl font-bold text-gray-900">

              Our Mission

            </h3>

            <p className="mt-6 text-lg leading-8 text-gray-600">

              To simplify company registration,
              taxation, accounting and legal
              compliance through innovative
              technology and expert guidance,
              enabling businesses to focus on
              growth instead of paperwork.

            </p>

            <ul className="mt-8 space-y-4">

              <li className="flex items-center gap-3">

                <span className="text-green-600">✔</span>

                100% Digital Process

              </li>

              <li className="flex items-center gap-3">

                <span className="text-green-600">✔</span>

                Affordable Pricing

              </li>

              <li className="flex items-center gap-3">

                <span className="text-green-600">✔</span>

                Expert Professionals

              </li>

              <li className="flex items-center gap-3">

                <span className="text-green-600">✔</span>

                Lifetime Business Support

              </li>

            </ul>

          </div>

          {/* Vision */}

          <div className="rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-10 text-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-5xl">

              🚀

            </div>

            <h3 className="mt-8 text-3xl font-bold">

              Our Vision

            </h3>

            <p className="mt-6 text-lg leading-8 text-blue-100">

              To become India's leading
              digital business services platform,
              empowering millions of entrepreneurs
              with fast, transparent and reliable
              registration, taxation and compliance
              solutions.

            </p>

            <ul className="mt-8 space-y-4">

              <li className="flex items-center gap-3">

                <span>⭐</span>

                Trusted Across India

              </li>

              <li className="flex items-center gap-3">

                <span>⭐</span>

                Technology First

              </li>

              <li className="flex items-center gap-3">

                <span>⭐</span>

                Customer Success Focused

              </li>

              <li className="flex items-center gap-3">

                <span>⭐</span>

                Continuous Innovation

              </li>

            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}
