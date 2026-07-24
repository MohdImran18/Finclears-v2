"use client";

const services = [
  {
    icon: "👨‍💼",
    title: "Expert CA Consultation",
    description:
      "Professional guidance from experienced Chartered Accountants before and throughout your registration process.",
  },
  {
    icon: "📄",
    title: "Documentation Support",
    description:
      "Complete assistance in preparing, verifying and organizing all required documents.",
  },
  {
    icon: "🏛️",
    title: "Government Filing",
    description:
      "Accurate filing with MCA, GST, Income Tax, Trademark and other government departments.",
  },
  {
    icon: "📊",
    title: "Application Tracking",
    description:
      "Track the progress of your application with timely updates until completion.",
  },
  {
    icon: "🔒",
    title: "Secure Documents",
    description:
      "Your documents are securely stored and handled with complete confidentiality.",
  },
  {
    icon: "📞",
    title: "Dedicated Support",
    description:
      "Dedicated relationship manager available via Phone, Email and WhatsApp.",
  },
  {
    icon: "⚡",
    title: "Fast Processing",
    description:
      "Quick verification and faster submission to reduce turnaround time.",
  },
  {
    icon: "✅",
    title: "Compliance Guidance",
    description:
      "Expert guidance on post-registration compliance and legal obligations.",
  },
];

export default function IncludedServices() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Included With Every Plan

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Everything You Need To Start & Grow

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Every FinClears package includes professional assistance,
            transparent pricing and end-to-end support.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {services.map((service) => (

            <div
              key={service.title}
              className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
            >

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-5xl">

                {service.icon}

              </div>

              <h3 className="mt-8 text-2xl font-bold text-gray-900">

                {service.title}

              </h3>

              <p className="mt-5 leading-8 text-gray-600">

                {service.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
