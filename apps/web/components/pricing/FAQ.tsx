"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Are government fees included in the pricing?",
    answer:
      "Some services include government filing fees while others require them to be paid separately. The pricing page or your consultant will clearly explain the applicable charges before you proceed.",
  },
  {
    question: "Are there any hidden charges?",
    answer:
      "No. FinClears follows a transparent pricing policy. You will always know the complete cost before your application is submitted.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Yes. You can upgrade from Starter to Professional or Enterprise at any time based on your business requirements.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "We accept UPI, Credit/Debit Cards, Net Banking and Bank Transfers. Business invoices are also available for corporate clients.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Refunds are governed by our Refund Policy. If government filing has not started, eligible refund requests are processed according to the policy.",
  },
  {
    question: "Do I get a dedicated consultant?",
    answer:
      "Yes. Professional and Enterprise plans include a dedicated expert to guide you throughout the registration and compliance process.",
  },
  {
    question: "Can I customize an Enterprise plan?",
    answer:
      "Absolutely. Enterprise plans are fully customized based on your company's size, compliance requirements and service needs.",
  },
  {
    question: "Is support included after registration?",
    answer:
      "Yes. We continue to assist you with compliance, filings, taxation and other business-related services after registration.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Pricing FAQ

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            Frequently Asked Questions

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Everything you need to know about our pricing,
            plans and billing.

          </p>

        </div>

        <div className="mx-auto max-w-4xl space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={faq.question}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >

              <button
                type="button"
                onClick={() =>
                  setOpen(
                    open === index ? null : index
                  )
                }
                className="flex w-full items-center justify-between px-8 py-6 text-left"
              >

                <span className="text-lg font-semibold text-gray-900">

                  {faq.question}

                </span>

                <span className="text-3xl font-bold text-blue-600">

                  {open === index ? "−" : "+"}

                </span>

              </button>

              {open === index && (

                <div className="border-t bg-gray-50 px-8 py-6">

                  <p className="leading-8 text-gray-600">

                    {faq.answer}

                  </p>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
