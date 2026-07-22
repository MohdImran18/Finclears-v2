"use client";

const stats = [
  {
    value: "10,000+",
    label: "Businesses Registered",
    color: "text-blue-600",
  },
  {
    value: "25,000+",
    label: "GST & Tax Filings",
    color: "text-green-600",
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    color: "text-purple-600",
  },
  {
    value: "24×7",
    label: "Expert Support",
    color: "text-orange-600",
  },
];

export default function Stats() {
  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            Trusted by Thousands of Businesses
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            From startup registration to annual compliance,
            FinClears has helped businesses across India grow
            confidently.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => (

            <div
              key={item.label}
              className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <h3
                className={`text-5xl font-extrabold ${item.color}`}
              >
                {item.value}
              </h3>

              <p className="mt-4 text-lg font-medium text-gray-600">
                {item.label}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
