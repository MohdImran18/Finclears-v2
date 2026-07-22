"use client";

import Link from "next/link";

const blogs = [
  {
    id: 1,
    title: "Private Limited Company Registration Guide 2026",
    slug: "private-limited-company-registration-guide",

    image: "/images/blogs/private-limited-company.webp",

    category: "Business Registration",

    date: "15 July 2026",

    description:
      "Everything you need to know about registering a Private Limited Company in India.",
  },

  {
    id: 2,
    title: "GST Registration Process Explained",

    slug: "gst-registration-process",

    image: "/images/blogs/gst-registration.webp",

    category: "GST",

    date: "10 July 2026",

    description:
      "Step-by-step GST registration guide for startups and MSMEs.",
  },

  {
    id: 3,
    title: "Trademark Registration Benefits",

    slug: "trademark-registration-benefits",

    image: "/images/blogs/trademark.webp",

    category: "Trademark",

    date: "05 July 2026",

    description:
      "Learn why trademark registration is essential for protecting your brand.",
  },
];

export default function LatestBlogs() {
  return (
    <section className="bg-white py-20">

      <div className="container mx-auto px-6">

        <div className="mb-14 flex flex-col items-center justify-between gap-6 lg:flex-row">

          <div>

            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

              Latest Blogs

            </span>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">

              Business Insights & Resources

            </h2>

            <p className="mt-4 max-w-2xl text-lg text-gray-600">

              Stay updated with business registration,
              taxation, GST and compliance news.

            </p>

          </div>

          <Link
            href="/blog"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Blogs
          </Link>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {blogs.map((blog) => (

            <article
              key={blog.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="h-56 overflow-hidden bg-gray-100">

                {blog.image ? (

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                ) : (

                  <div className="flex h-full items-center justify-center text-6xl">

                    📰

                  </div>

                )}

              </div>

              <div className="space-y-4 p-6">

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                    {blog.category}

                  </span>

                  <span className="text-sm text-gray-500">

                    {blog.date}

                  </span>

                </div>

                <h3 className="text-2xl font-bold text-gray-900">

                  {blog.title}

                </h3>

                <p className="text-gray-600">

                  {blog.description}

                </p>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700"
                >
                  Read More →

                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}
