"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How long does company registration take?",
    answer:
      "Private Limited Company registration generally takes 7–10 working days depending on government approvals and document verification.",
  },
  {
    question: "Is the entire registration process online?",
    answer:
      "Yes. FinClears offers a completely online process. You can upload documents, complete verification and receive certificates digitally.",
  },
  {
    question: "Do you provide GST Registration?",
    answer:
      "Yes. We provide GST Registration, GST Return Filing, GST Amendment, GST Cancellation and complete GST Compliance services.",
  },
  {
    question: "Can you help with Trademark Registration?",
    answer:
      "Yes. We offer Trademark Search, Trademark Registration, Trademark Renewal and Trademark Objection services across India.",
  },
  {
    question: "Do you provide Annual Compliance?",
    answer:
      "Yes. We provide ROC Filing, Annual Returns, Accounting, TDS Filing, Income Tax Return and complete compliance services.",
  },
  {
    question: "Will I get a dedicated consultant?",
    answer:
      "Yes. Every client receives a dedicated business consultant to guide them throughout the registration and compliance process.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-gray-50 py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Frequently Asked Questions

          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">

            Got Questions? We've Got Answers.

          </h2>

          <p className="mt-5 text-lg text-gray-600">

            Find answers to the most common questions about company
            registration, GST, trademark and compliance services.

          </p>

        </div>

        <div className="mx-auto max-w-4xl space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >

              <button
                type="button"
                onClick={() =>
                  setOpen(open === index ? -1 : index)
                }
                className="flex w-full items-center justify-between px-8 py-6 text-left"
              >

                <h3 className="text-lg font-semibold text-gray-900">

                  {faq.question}

                </h3>

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
