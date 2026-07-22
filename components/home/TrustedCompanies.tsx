"use client";

const companies = [
  {
    name: "Startup India",
    logo: "/images/brands/startup-india.svg",
  },
  {
    name: "MSME",
    logo: "/images/brands/msme.svg",
  },
  {
    name: "MCA",
    logo: "/images/brands/mca.svg",
  },
  {
    name: "GST",
    logo: "/images/brands/gst.svg",
  },
  {
    name: "Income Tax",
    logo: "/images/brands/income-tax.svg",
  },
  {
    name: "IEC",
    logo: "/images/brands/iec.svg",
  },
];

export default function TrustedCompanies() {
  return (
    <section className="bg-gray-50 py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Trusted Platform
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Trusted by Businesses Across India
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            We help entrepreneurs, startups, MSMEs and enterprises
            with registrations, taxation and compliance.
          </p>

        </div>

        <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

          {companies.map((company) => (

            <div
              key={company.name}
              className="flex h-36 flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >

              {company.logo ? (

                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-14 object-contain"
                />

              ) : (

                <div className="h-14 w-14 rounded-full bg-blue-100" />

              )}

              <p className="mt-5 text-center text-sm font-semibold text-gray-700">

                {company.name}

              </p>

            </div>

          ))}

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

            <h3 className="text-5xl font-bold text-blue-600">

              10K+

            </h3>

            <p className="mt-3 text-gray-600">

              Businesses Registered

            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

            <h3 className="text-5xl font-bold text-green-600">

              99%

            </h3>

            <p className="mt-3 text-gray-600">

              Customer Satisfaction

            </p>

          </div>

          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">

            <h3 className="text-5xl font-bold text-purple-600">

              24×7

            </h3>

            <p className="mt-3 text-gray-600">

              Expert Support

            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
