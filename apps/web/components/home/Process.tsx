"use client";

const steps = [
  {
    number: "01",
    title: "Free Consultation",
    description:
      "Discuss your business requirements with our expert CA team.",
  },
  {
    number: "02",
    title: "Upload Documents",
    description:
      "Securely upload your KYC and business documents online.",
  },
  {
    number: "03",
    title: "Application Filing",
    description:
      "Our professionals prepare and submit your application to the government.",
  },
  {
    number: "04",
    title: "Verification",
    description:
      "Government authorities review and verify your application.",
  },
  {
    number: "05",
    title: "Certificate Delivered",
    description:
      "Receive your registration certificate and compliance documents.",
  },
];

export default function Process() {
  return (
    <section className="bg-gray-50 py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            How It Works
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Get Your Business Registered in 5 Easy Steps
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Our streamlined process ensures fast, transparent and hassle-free
            registration for every business.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">

          {steps.map((step) => (

            <div
              key={step.number}
              className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">

                {step.number}

              </div>

              <h3 className="text-xl font-bold text-gray-900">

                {step.title}

              </h3>

              <p className="mt-4 leading-7 text-gray-600">

                {step.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
