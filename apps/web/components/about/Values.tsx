"use client";

const values = [
  {
    icon: "🤝",
    title: "Integrity",
    description:
      "We conduct every engagement with honesty, ethics and complete professionalism.",
  },
  {
    icon: "🔍",
    title: "Transparency",
    description:
      "Clear pricing, honest advice and complete visibility throughout every process.",
  },
  {
    icon: "💡",
    title: "Innovation",
    description:
      "Using technology to simplify business registration and compliance services.",
  },
  {
    icon: "❤️",
    title: "Customer Success",
    description:
      "Your business growth is our priority from registration to long-term compliance.",
  },
  {
    icon: "🏆",
    title: "Excellence",
    description:
      "Delivering high-quality services with speed, accuracy and reliability.",
  },
  {
    icon: "🛡️",
    title: "Trust",
    description:
      "Building lasting relationships through dependable service and expert guidance.",
  },
];

export default function Values() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Our Core Values

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            The Principles That Drive FinClears

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Every decision we make is guided by these core values,
            ensuring exceptional service and long-term relationships
            with our clients.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {values.map((value) => (

            <div
              key={value.title}
              className="rounded-[32px] border border-gray-200 bg-white p-10 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
            >

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-5xl">

                {value.icon}

              </div>

              <h3 className="mt-8 text-2xl font-bold text-gray-900">

                {value.title}

              </h3>

              <p className="mt-5 leading-8 text-gray-600">

                {value.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
