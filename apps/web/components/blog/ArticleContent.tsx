"use client";

interface Props {
  content: string;
}

export default function ArticleContent({
  content,
}: Props) {
  return (
    <article className="prose prose-lg prose-slate max-w-none">

      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />

      {/* Callout */}

      <div className="my-12 rounded-[24px] border border-blue-200 bg-blue-50 p-8 not-prose">

        <div className="flex items-start gap-5">

          <div className="text-5xl">

            💡

          </div>

          <div>

            <h3 className="text-2xl font-bold text-blue-700">

              Expert Advice

            </h3>

            <p className="mt-4 leading-8 text-gray-700">

              Government regulations and compliance
              requirements can change over time.
              Always consult a qualified professional
              before making important business decisions.

            </p>

          </div>

        </div>

      </div>

      {/* CTA */}

      <div className="my-16 rounded-[32px] bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-12 text-center text-white not-prose">

        <h2 className="text-4xl font-bold">

          Need Professional Assistance?

        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">

          Our CA, CS and legal experts are ready
          to help you with Company Registration,
          GST, Trademark, Tax Filing and
          Business Compliance.

        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <a
            href="/contact"
            className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 transition hover:bg-gray-100"
          >
            Talk To Expert
          </a>

          <a
            href="/services"
            className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
          >
            Explore Services
          </a>

        </div>

      </div>

      {/* Disclaimer */}

      <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 not-prose">

        <h4 className="font-bold text-yellow-800">

          Disclaimer

        </h4>

        <p className="mt-3 leading-7 text-gray-700">

          This article is intended for educational
          purposes only and should not be considered
          legal, tax or financial advice.
          Please consult a qualified professional
          before taking any business or compliance
          decisions.

        </p>

      </div>

    </article>
  );
}
