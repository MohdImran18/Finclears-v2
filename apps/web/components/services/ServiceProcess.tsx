"use client";

interface Props {
  title?: string;

  steps: string[];
}

export default function ServiceProcess({
  title = "Registration Process",
  steps,
}: Props) {
  return (
    <section className="py-14 bg-gray-50">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Complete your registration in a few simple steps.
          </p>

        </div>

        <div className="relative">

          <div className="absolute left-6 top-0 hidden h-full w-1 rounded bg-blue-200 md:block" />

          <div className="space-y-8">

            {steps.map((step, index) => (

              <div
                key={index}
                className="relative flex gap-6"
              >

                <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg">

                  {index + 1}

                </div>

                <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

                  <h3 className="text-lg font-semibold text-gray-900">

                    Step {index + 1}

                  </h3>

                  <p className="mt-2 text-gray-600">

                    {step}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
