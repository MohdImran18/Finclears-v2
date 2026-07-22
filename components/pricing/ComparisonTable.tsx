"use client";

const features = [
  {
    name: "Business Consultation",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "GST Registration",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Private Limited / LLP Registration",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Trademark Registration",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Annual ROC Compliance",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Accounting Services",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Payroll Management",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Dedicated CA",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Dedicated Account Manager",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Priority Support",
    starter: false,
    professional: true,
    enterprise: true,
  },
];

function Cell({
  value,
}: {
  value: boolean;
}) {
  return (
    <td className="px-6 py-5 text-center">

      {value ? (
        <span className="text-2xl text-green-600">
          ✓
        </span>
      ) : (
        <span className="text-2xl text-gray-300">
          —
        </span>
      )}

    </td>
  );
}

export default function ComparisonTable() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Compare Plans

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Feature Comparison

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Compare our plans side-by-side and choose
            the one that best suits your business.

          </p>

        </div>

        <div className="overflow-x-auto rounded-[32px] bg-white shadow-xl">

          <table className="min-w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="px-6 py-5 text-left">

                  Features

                </th>

                <th className="px-6 py-5 text-center">

                  Starter

                </th>

                <th className="px-6 py-5 text-center">

                  Professional

                </th>

                <th className="px-6 py-5 text-center">

                  Enterprise

                </th>

              </tr>

            </thead>

            <tbody>

              {features.map((feature, index) => (

                <tr
                  key={feature.name}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  }
                >

                  <td className="px-6 py-5 font-medium text-gray-700">

                    {feature.name}

                  </td>

                  <Cell
                    value={feature.starter}
                  />

                  <Cell
                    value={feature.professional}
                  />

                  <Cell
                    value={feature.enterprise}
                  />

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}
