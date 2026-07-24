"use client";

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

  const formattedPrice = Number(price || 0);

  return (
    <section className="py-16">

      <div className="mx-auto max-w-5xl">

        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white shadow-xl">

          <div className="grid gap-10 lg:grid-cols-2">

            {/* Left */}

            <div>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                Pricing
              </span>

              <h2 className="mt-6 text-4xl font-bold">
                ₹{formattedPrice.toLocaleString("en-IN")}
              </h2>

              <p className="mt-3 text-blue-100">
                {priceLabel ?? "Starting Price"}
              </p>

              <button className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-gray-100">
                Get Started
              </button>

            </div>

            {/* Right */}

            <div>

              <h3 className="mb-6 text-xl font-semibold">
                What's Included
              </h3>

              <div className="space-y-4">

                {features.map((feature, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <span className="text-green-300">
                      ✔
                    </span>

                    <span>
                      {feature}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}