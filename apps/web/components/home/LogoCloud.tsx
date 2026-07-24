"use client";

import Container from "@/components/layout/Container";

const logos = [
  "Startup India",
  "MSME",
  "GSTN",
  "MCA",
  "Income Tax",
  "DPIIT",
];

export default function LogoCloud() {
  return (
    <section className="py-16 bg-white border-y">
      <Container>
        <p className="text-center text-slate-500 font-medium mb-10">
          Trusted by startups, founders and growing businesses across India
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {logos.map((logo) => (
            <div
              key={logo}
              className="h-20 rounded-xl border bg-slate-50 flex items-center justify-center font-semibold text-slate-700 hover:shadow-lg transition"
            >
              {logo}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
