"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "Do I need an appointment before visiting?",
    answer:
      "Appointments are recommended to ensure our experts are available. Walk-ins are also welcome during business hours.",
  },
  {
    question: "Do you provide online consultations?",
    answer:
      "Yes. We offer phone calls, Google Meet and Zoom consultations for clients across India.",
  },
  {
    question: "How quickly will I receive a response?",
    answer:
      "We typically respond within 30 minutes during business hours. Email inquiries are answered within 24 hours.",
  },
  {
    question: "Is the consultation free?",
    answer:
      "Yes. Your initial consultation is completely free with no obligation.",
  },
  {
    question: "Can I share documents online?",
    answer:
      "Absolutely. Documents can be securely shared through our secure customer portal, email or WhatsApp.",
  },
  {
    question: "Do you provide WhatsApp support?",
    answer:
      "Yes. WhatsApp is one of the fastest ways to connect with our experts for quick assistance and document sharing.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<number>(0);

  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Support FAQ
          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to know before contacting the FinClears
            team.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-5">
          {FAQS.map((faq, index) => {
            const isOpen = active === index;

            return (
              <div
                key={`${index}-${faq.question}`}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${index}`}
                  onClick={() =>
                    setActive(isOpen ? -1 : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-6 w-6 text-blue-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "max-h-96 border-t bg-gray-50"
                      : "max-h-0"
                  }`}
                >
                  <div className="px-8 py-6">
                    <p className="leading-8 text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}