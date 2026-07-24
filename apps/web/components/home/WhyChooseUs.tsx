"use client";

const features = [
  {
    title: "Expert CA & CS Team",
    description:
      "Qualified Chartered Accountants and Company Secretaries to guide every step.",
    icon: "👨‍💼",
  },
  {
    title: "100% Online Process",
    description:
      "Complete your registration from anywhere in India without visiting an office.",
    icon: "💻",
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges. Know exactly what you're paying for before you begin.",
    icon: "💰",
  },
  {
    title: "Fast Turnaround",
    description:
      "Quick document verification and government filing to save your valuable time.",
    icon: "⚡",
  },
  {
    title: "Dedicated Relationship Manager",
    description:
      "One point of contact throughout your business registration journey.",
    icon: "🤝",
  },
  {
    title: "Lifetime Business Support",
    description:
      "Beyond registration, we help with GST, compliance, accounting and taxation.",
    icon: "🛡️",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why FinClears
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Why Thousands of Businesses Trust FinClears
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            We simplify business registration, taxation and legal compliance
            through expert guidance, transparent pricing and technology-driven
            processes.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">

                {feature.icon}

              </div>

              <h3 className="text-xl font-bold text-gray-900">

                {feature.title}

              </h3>

              <p className="mt-4 leading-7 text-gray-600">

                {feature.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
