"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Zoho",
  "Razorpay",
  "Tally",
];

const stats = [
  {
    value: "15,000+",
    label: "Businesses Registered",
  },
  {
    value: "50,000+",
    label: "Tax Filings",
  },
  {
    value: "99.8%",
    label: "Success Rate",
  },
  {
    value: "4.9★",
    label: "Google Rating",
  },
];

export default function Trust() {
  return (
    <section className="bg-white py-20">

      <Container>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
        >

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-600">

              Trusted Across India

            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900">

              Thousands of Businesses Trust FinClears

            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-slate-600">

              From startups to growing enterprises,
              FinClears helps businesses register,
              stay compliant and grow faster.

            </p>

          </div>

          {/* Logos */}

          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

            {companies.map((company) => (

              <div
                key={company}
                className="flex h-24 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >

                <span className="text-lg font-bold text-slate-700">

                  {company}

                </span>

              </div>

            ))}

          </div>

          {/* Stats */}

          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {stats.map((item) => (

              <div
                key={item.label}
                className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">

                  {item.value}

                </div>

                <p className="mt-4 text-slate-500">

                  {item.label}

                </p>

              </div>

            ))}

          </div>

        </motion.div>

      </Container>

    </section>
  );
}
