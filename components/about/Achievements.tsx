"use client";

const achievements = [
  {
    value: "10,000+",
    label: "Businesses Registered",
    icon: "🏢",
    color: "text-blue-600",
  },
  {
    value: "50,000+",
    label: "Compliance Filings",
    icon: "📄",
    color: "text-green-600",
  },
  {
    value: "99%",
    label: "Client Satisfaction",
    icon: "⭐",
    color: "text-yellow-500",
  },
  {
    value: "24×7",
    label: "Expert Support",
    icon: "🎧",
    color: "text-purple-600",
  },
  {
    value: "100+",
    label: "Industry Experts",
    icon: "👨‍💼",
    color: "text-red-600",
  },
  {
    value: "PAN India",
    label: "Service Coverage",
    icon: "🇮🇳",
    color: "text-indigo-600",
  },
];

export default function Achievements() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Our Achievements

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Numbers That Reflect Our Success

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Every milestone represents the trust our clients have placed in
            FinClears over the years.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {achievements.map((item) => (

            <div
              key={item.label}
              className="rounded-[32px] bg-white p-10 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-5xl">

                {item.icon}

              </div>

              <h3 className={`mt-8 text-5xl font-bold ${item.color}`}>

                {item.value}

              </h3>

              <p className="mt-4 text-lg font-medium text-gray-600">

                {item.label}

              </p>

            </div>

          ))}

        </div>

        <div className="mt-20 rounded-[36px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-12 text-white shadow-2xl">

          <div className="grid gap-10 lg:grid-cols-3">

            <div>

              <h3 className="text-4xl font-bold">

                Trusted Nationwide

              </h3>

              <p className="mt-5 leading-8 text-blue-100">

                Entrepreneurs, startups, MSMEs and enterprises across India
                rely on FinClears for registrations, taxation and compliance.

              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold">

                Expert Team

              </h3>

              <p className="mt-5 leading-8 text-blue-100">

                Our experienced CA, CS and legal professionals ensure every
                filing is completed accurately and on time.

              </p>

            </div>

            <div>

              <h3 className="text-4xl font-bold">

                Future Ready

              </h3>

              <p className="mt-5 leading-8 text-blue-100">

                We continuously improve our platform with modern technology to
                make business compliance faster, simpler and more transparent.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
