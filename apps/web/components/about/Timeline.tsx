"use client";

const timeline = [
  {
    year: "2021",
    title: "FinClears Founded",
    description:
      "Started with a mission to simplify business registration and compliance for entrepreneurs.",
  },
  {
    year: "2022",
    title: "1000+ Businesses Served",
    description:
      "Successfully registered and supported more than one thousand businesses across India.",
  },
  {
    year: "2023",
    title: "Expanded Services",
    description:
      "Added GST, Trademark, Accounting, Income Tax and ROC Compliance services.",
  },
  {
    year: "2024",
    title: "PAN India Presence",
    description:
      "Serving startups, MSMEs and enterprises across multiple Indian states.",
  },
  {
    year: "2025",
    title: "Digital Platform",
    description:
      "Introduced technology-driven workflows for faster registrations and document management.",
  },
  {
    year: "Future",
    title: "AI Powered Compliance",
    description:
      "Building India's most advanced AI-powered business compliance ecosystem.",
  },
];

export default function Timeline() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Our Journey

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            The FinClears Timeline

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Every milestone represents our commitment to helping businesses
            succeed through technology, expertise and trust.

          </p>

        </div>

        <div className="relative mx-auto max-w-5xl">

          <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 rounded bg-blue-100 lg:block" />

          <div className="space-y-16">

            {timeline.map((item, index) => (

              <div
                key={item.year}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 0
                    ? ""
                    : "lg:flex-row-reverse"
                }`}
              >

                <div className="flex-1">

                  <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

                    <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">

                      {item.year}

                    </span>

                    <h3 className="mt-3 text-3xl font-bold text-gray-900">

                      {item.title}

                    </h3>

                    <p className="mt-5 leading-8 text-gray-600">

                      {item.description}

                    </p>

                  </div>

                </div>

                <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-xl">

                  {index + 1}

                </div>

                <div className="hidden flex-1 lg:block" />

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
