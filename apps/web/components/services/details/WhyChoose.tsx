"use client";

import {
  BadgeCheck,
  Clock3,
  Headset,
  IndianRupee,
  Lock,
  UserCheck,
} from "lucide-react";

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const features: Feature[] = [
  {
    id: 1,
    title: "Expert CA & CS Team",
    description:
      "Our experienced Chartered Accountants and Company Secretaries ensure every registration and compliance task is completed accurately.",
    icon: UserCheck,
  },
  {
    id: 2,
    title: "Affordable Pricing",
    description:
      "Transparent pricing with no hidden charges. Professional business services at competitive rates.",
    icon: IndianRupee,
  },
  {
    id: 3,
    title: "Fast Processing",
    description:
      "Quick document verification and application filing to help you start your business faster.",
    icon: Clock3,
  },
  {
    id: 4,
    title: "100% Secure Documents",
    description:
      "Your documents are securely stored and handled with complete confidentiality and privacy.",
    icon: Lock,
  },
  {
    id: 5,
    title: "Dedicated Relationship Manager",
    description:
      "A dedicated expert guides you throughout the registration process and answers your queries.",
    icon: BadgeCheck,
  },
  {
    id: 6,
    title: "Customer Support",
    description:
      "Reach our support team via phone, email, or WhatsApp whenever you need assistance.",
    icon: Headset,
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Choose FinClears
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Trusted Business Registration Partner
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            We simplify company registration, GST,
            trademark, ROC compliance, tax filing and
            business licensing with a transparent,
            technology-driven and customer-first approach.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">

                  <Icon size={32} />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}