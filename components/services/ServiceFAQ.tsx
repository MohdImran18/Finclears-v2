"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  title?: string;

  faqs: FAQ[];
}

export default function ServiceFAQ({
  title = "Frequently Asked Questions",
  faqs,
}: Props) {
  const [openIndex, setOpenIndex] =
    useState<number | null>(0);

  return (
    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-4xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Find answers to the most common questions.
          </p>

        </div>

        <div className="space-y-4">

          {faqs.map((faq, index) => {

            const isOpen =
              openIndex === index;

            return (

              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >

                  <span className="text-lg font-semibold text-gray-900">

                    {faq.question}

                  </span>

                  <span className="text-2xl font-bold text-blue-600">

                    {isOpen ? "−" : "+"}

                  </span>

                </button>

                {isOpen && (

                  <div className="border-t bg-gray-50 px-6 py-5">

                    <p className="leading-7 text-gray-600">

                      {faq.answer}

                    </p>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
