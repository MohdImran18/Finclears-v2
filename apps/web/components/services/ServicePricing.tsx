"use client";

import Link from "next/link";

interface Props {
  price: number | string;
  priceLabel?: string;
  features: string[];
}

export default function ServicePricing({
  price,
  priceLabel,
  features,
}: Props) {
  const numericPrice = Number(price || 0);
  const displayPrice = Number.isFinite(numericPrice)
    ? `₹${numericPrice.toLocaleString("en-IN")}`
    : String(price);

  return (
    <section className="bg-slate-50 px-5 py-16 sm:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 text-white sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-100">
                Transparent Pricing
              </span>

              <h2 className="mt-7 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Simple, Clear Pricing
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-blue-100 sm:text-base">
                Understand the starting cost and get expert guidance on the
                process, documents and applicable charges.
              </p>

              <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-sm font-medium text-blue-100">
                  {priceLabel ?? "Starting Price"}
                </p>

                <p className="mt-2 break-words text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {displayPrice}
                </p>

                <p className="mt-3 text-xs leading-5 text-blue-100">
                  Final charges may depend on the service requirements and
                  applicable government fees.
                </p>
              </div>

              <Link
                href="/contact"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:w-auto"
              >
                Get Started
                <span className="ml-2" aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 text-xs text-blue-100">
                Have questions? Talk to our team before proceeding.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-10 lg:p-12">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-700">
              What You Get
            </span>

            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              What’s Included
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Get support through the key steps of your service journey, with
              clarity on requirements and the next actions.
            </p>

            {features.length > 0 ? (
              <ul className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <li
                    key={`${feature}-${index}`}
                    className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      ✓
                    </span>
                    <span className="pt-0.5 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-8 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">
                Contact our team to confirm the inclusions for this service.
              </p>
            )}

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <span className="mt-0.5 text-blue-700" aria-hidden="true">ℹ</span>
              <p className="text-sm leading-6 text-slate-600">
                Please confirm the final quotation, inclusions and any
                applicable statutory fees with our team before placing an order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
