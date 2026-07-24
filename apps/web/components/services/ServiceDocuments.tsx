"use client";

interface Props {
  title?: string;

  documents: string[];
}

export default function ServiceDocuments({
  title = "Required Documents",
  documents,
}: Props) {
  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-gray-900">

            {title}

          </h2>

          <p className="mt-4 text-lg text-gray-600">

            Keep these documents ready before starting your application.

          </p>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {documents.map((document, index) => (

            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">

                📄

              </div>

              <h3 className="text-lg font-semibold text-gray-900">

                {document}

              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
