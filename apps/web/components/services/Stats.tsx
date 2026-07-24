"use client";

import {
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  Star,
} from "lucide-react";

interface Stat {
  id: number;
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}

const stats: Stat[] = [
  {
    id: 1,
    value: "20,000+",
    title: "Businesses Registered",
    description:
      "Helping startups, MSMEs and enterprises across India.",
    icon: Building2,
  },
  {
    id: 2,
    value: "500+",
    title: "Expert CAs & CS",
    description:
      "Dedicated professionals for every business requirement.",
    icon: BriefcaseBusiness,
  },
  {
    id: 3,
    value: "4.9 ★",
    title: "Customer Rating",
    description:
      "Trusted by thousands of happy business owners.",
    icon: Star,
  },
  {
    id: 4,
    value: "100%",
    title: "Secure & Online",
    description:
      "Completely digital, secure and transparent process.",
    icon: ShieldCheck,
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-50 py-14">

      <div className="container mx-auto px-6">

        <div className="mb-14 text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Businesses Trust FinClears
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Trusted by Thousands Across India
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            We simplify company registration, GST,
            trademark, tax and compliance services with
            expert guidance and transparent pricing.
          </p>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="group rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

                  <Icon size={32} />

                </div>

                <h3 className="mt-6 text-4xl font-bold text-blue-600">
                  {item.value}
                </h3>

                <h4 className="mt-3 text-xl font-semibold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}