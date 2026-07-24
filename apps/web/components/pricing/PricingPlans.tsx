"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/starting",

    description:
      "Perfect for individuals and small businesses.",

    features: [
      "Business Consultation",
      "GST Registration",
      "Basic Documentation",
      "Email Support",
      "Government Filing",
    ],

    button: "Choose Starter",

    popular: false,
  },

  {
    name: "Professional",

    price: "₹4,999",

    period: "/starting",

    description:
      "Best for startups and growing businesses.",

    features: [
      "Private Limited / LLP",
      "GST Registration",
      "Trademark Filing",
      "ROC Compliance",
      "Dedicated CA",
      "Priority Support",
      "Document Assistance",
    ],

    button: "Get Started",

    popular: true,
  },

  {
    name: "Enterprise",

    price: "Custom",

    period: "",

    description:
      "Tailored solutions for large organizations.",

    features: [
      "Everything in Professional",
      "Accounting Services",
      "Payroll",
      "Annual Compliance",
      "Dedicated Account Manager",
      "Priority Processing",
      "Premium Support",
    ],

    button: "Contact Sales",

    popular: false,
  },
];

export default function PricingPlans() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Pricing Plans

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Choose The Perfect Plan

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Transparent pricing with no hidden charges.
            Upgrade anytime as your business grows.

          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`relative rounded-[36px] border p-10 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white"
              }`}
            >

              {plan.popular && (

                <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-gray-900">

                  ⭐ Most Popular

                </div>

              )}

              <h3 className="text-3xl font-bold">

                {plan.name}

              </h3>

              <p
                className={`mt-4 ${
                  plan.popular
                    ? "text-blue-100"
                    : "text-gray-600"
                }`}
              >

                {plan.description}

              </p>

              <div className="mt-8">

                <span className="text-5xl font-bold">

                  {plan.price}

                </span>

                <span
                  className={`ml-2 ${
                    plan.popular
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >

                  {plan.period}

                </span>

              </div>

              <ul className="mt-10 space-y-4">

                {plan.features.map((feature) => (

                  <li
                    key={feature}
                    className="flex items-center gap-3"
                  >

                    <span>

                      ✅

                    </span>

                    <span>

                      {feature}

                    </span>

                  </li>

                ))}

              </ul>

              <Link
                href="/contact"
                className={`mt-10 inline-flex w-full items-center justify-center rounded-xl px-6 py-4 font-semibold transition ${
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >

                {plan.button}

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
