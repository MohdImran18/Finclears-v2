"use client";

import Link from "next/link";

const contactInfo = [
  {
    icon: "📍",
    title: "Office Address",
    value:
      "Noida, Uttar Pradesh, India",
  },
  {
    icon: "📞",
    title: "Call Us",
    value: "+91 98732 47695",
    href: "tel:+919873247695",
  },
  {
    icon: "✉️",
    title: "Email",
    value: "support@finclears.com",
    href: "mailto:support@finclears.com",
  },
  {
    icon: "💬",
    title: "WhatsApp",
    value: "+91 98732 47695",
    href: "https://wa.me/919873247695",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: "📘",
  },
  {
    name: "Instagram",
    href: "#",
    icon: "📷",
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: "💼",
  },
  {
    name: "YouTube",
    href: "#",
    icon: "▶️",
  },
];

export default function ContactInfo() {
  return (
    <section className="bg-slate-50 py-20">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-14 max-w-3xl text-center">

          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">

            Contact Information

          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">

            We're Always Ready To Help

          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Reach out through any of the following channels.
            Our team will get back to you as soon as possible.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {contactInfo.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
            >

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-5xl">

                {item.icon}

              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">

                {item.title}

              </h3>

              {item.href ? (

                <Link
                  href={item.href}
                  target="_blank"
                  className="mt-4 block break-words text-blue-600 hover:underline"
                >
                  {item.value}
                </Link>

              ) : (

                <p className="mt-4 text-gray-600">

                  {item.value}

                </p>

              )}

            </div>

          ))}

        </div>

        {/* Social */}

        <div className="mt-20 rounded-3xl bg-white p-10 shadow-lg">

          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">

            <div>

              <h3 className="text-3xl font-bold">

                Connect With FinClears

              </h3>

              <p className="mt-3 text-gray-600">

                Follow us on social media for updates,
                business tips and compliance news.

              </p>

            </div>

            <div className="flex flex-wrap gap-4">

              {socialLinks.map((social) => (

                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white transition hover:bg-blue-700"
                >
                  {social.icon}
                </Link>

              ))}

            </div>

          </div>

          <div className="mt-10 border-t pt-8 text-center">

            <Link
              href="#"
              className="inline-flex rounded-xl bg-green-600 px-8 py-4 font-semibold text-white transition hover:bg-green-700"
            >
              ⭐ Leave a Google Review
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}
