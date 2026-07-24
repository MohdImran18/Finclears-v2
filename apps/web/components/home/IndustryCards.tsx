"use client";

import Container from "@/components/layout/Container";

const industries = [
  "Startups",
  "MSME",
  "Manufacturing",
  "Exporters",
  "Healthcare",
  "E-Commerce",
  "IT Companies",
  "Consultants",
  "Restaurants",
  "Real Estate",
  "Education",
  "NGOs",
];

export default function IndustryCards() {
  return (
    <section className="bg-slate-100 py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-5xl font-bold">Industries We Serve</h2>

          <p className="mt-5 text-lg text-slate-600">
            Customized legal & compliance services for every industry.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {industries.map((item) => (
            <div
              key={item}
              className="rounded-3xl bg-white p-8 text-center shadow-lg"
            >
              <h3 className="text-xl font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
