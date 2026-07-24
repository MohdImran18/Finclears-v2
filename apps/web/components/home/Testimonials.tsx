"use client";

const testimonials = [
  {
    name: "Rahul Sharma",
    company: "TechNova Pvt. Ltd.",
    image: "/images/testimonials/user-1.jpg",
    rating: 5,
    review:
      "FinClears made our company registration incredibly smooth. Their team handled everything professionally and completed the process much faster than expected.",
  },
  {
    name: "Priya Verma",
    company: "Bloom Fashion",
    image: "/images/testimonials/user-2.jpg",
    rating: 5,
    review:
      "We use FinClears for GST, accounting and annual compliance. Their support team is always available and extremely knowledgeable.",
  },
  {
    name: "Amit Gupta",
    company: "AG Exports",
    image: "/images/testimonials/user-3.jpg",
    rating: 5,
    review:
      "Excellent service! Trademark registration and IEC were completed without any hassle. Highly recommended for startups and exporters.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Testimonials
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Thousands of entrepreneurs and businesses trust FinClears for
            registration, taxation and compliance services.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((item) => (

            <div
              key={item.name}
              className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="mb-6 flex">

                {Array.from({
                  length: item.rating,
                }).map((_, index) => (

                  <span
                    key={index}
                    className="text-2xl text-yellow-400"
                  >
                    ★
                  </span>

                ))}

              </div>

              <p className="leading-8 text-gray-600">

                "{item.review}"

              </p>

              <div className="mt-8 flex items-center gap-4">

                {item.image ? (

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">

                    {item.name.charAt(0)}

                  </div>

                )}

                <div>

                  <h3 className="font-bold text-gray-900">

                    {item.name}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.company}

                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
