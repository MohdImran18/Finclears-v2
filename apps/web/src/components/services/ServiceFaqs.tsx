"use client";

import type { ServiceFaq } from "@/types/service";

interface Props {
    faqs?: ServiceFaq[];
}

export default function ServiceFaqs({ faqs = [] }: Props) {
    if (!faqs.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900">
                Frequently Asked Questions
            </h2>

            <div className="mt-6 space-y-3">
                {faqs.map((faq) => (
                    <details key={faq.id} className="rounded-xl border border-slate-200 bg-white p-5">
                        <summary className="cursor-pointer font-semibold text-slate-900">
                            {faq.question}
                        </summary>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {faq.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}
