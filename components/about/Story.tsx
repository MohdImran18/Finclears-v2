"use client";

export default function Story() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}

          <div>

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

              Our Story

            </span>

            <h2 className="mt-4 text-5xl font-bold leading-tight text-gray-900">

              Simplifying Business
              <br />
              Registration in India

            </h2>

            <p className="mt-8 text-lg leading-8 text-gray-600">

              FinClears was founded with a simple vision —
              making legal, tax and compliance services
              accessible, affordable and completely digital
              for every entrepreneur in India.

            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">

              Whether you're launching a startup,
              registering a Private Limited Company,
              filing GST returns or protecting your brand
              through trademark registration,
              our experts ensure every process is smooth,
              transparent and hassle-free.

            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">

              Today, FinClears serves startups,
              MSMEs, professionals and enterprises
              across India with technology-driven
              compliance solutions and dedicated
              business support.

            </p>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="overflow-hidden rounded-[32px] shadow-2xl">

              <img
                src="/images/about/story.jpg"
                alt="FinClears Story"
                className="h-full w-full object-cover"
              />

            </div>

            <div className="absolute -bottom-8 -left-8 rounded-3xl bg-white p-8 shadow-2xl">

              <h3 className="text-5xl font-bold text-blue-600">

                10K+

              </h3>

              <p className="mt-2 text-gray-600">

                Happy Businesses

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
