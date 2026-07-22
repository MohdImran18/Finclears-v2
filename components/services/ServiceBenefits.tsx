"use client";

interface Props {
  title?: string;

  benefits: string[];
}

export default function ServiceBenefits({
  title = "Why Choose This Service?",
  benefits,
}: Props) {
  return (
    <section className="py-16">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-4 text-gray-600">
            Everything you need to complete your registration quickly and
            compliantly.
          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {benefits.map((benefit, index) => (

            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">

                ✅

              </div>

              <h3 className="text-lg font-semibold text-gray-900">

                {benefit}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
