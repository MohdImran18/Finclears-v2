"use client";

import Link from "next/link";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/layout/Container";

const services = [
  {
    title: "Private Limited",
    href: "/private-limited-company-registration",
  },
  {
    title: "LLP Registration",
    href: "/llp-registration",
  },
  {
    title: "GST Registration",
    href: "/gst-registration",
  },
  {
    title: "Trademark",
    href: "/trademark-registration",
  },
  {
    title: "Income Tax",
    href: "/income-tax-return",
  },
  {
    title: "IEC Registration",
    href: "/iec-registration",
  },
];

const company = [
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
  {
    title: "Careers",
    href: "/careers",
  },
  {
    title: "Blog",
    href: "/blog",
  },
];

const legal = [
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
  {
    title: "Refund Policy",
    href: "/refund-policy",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">

      <Container>

        <div className="grid gap-16 py-24 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold">

                F

              </div>

              <div>

                <div className="text-2xl font-bold">

                  FinClears

                </div>

                <div className="text-sm text-slate-400">

                  Business Simplified

                </div>

              </div>

            </div>

            <p className="mt-8 leading-8 text-slate-400">

              India's trusted online platform for
              Company Registration, GST, Trademark,
              Income Tax, ROC Compliance and Legal
              Services.

            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">

                <Phone
                  size={18}
                  className="text-blue-400"
                />

                <a href="tel:+919873247695">

                  +91 9873247695

                </a>

              </div>

              <div className="flex items-center gap-3">

                <Mail
                  size={18}
                  className="text-blue-400"
                />

                <a href="mailto:info@finclears.com">

                  info@finclears.com

                </a>

              </div>

              <div className="flex items-start gap-3">

                <MapPin
                  size={18}
                  className="mt-1 text-blue-400"
                />

                <span>

                  Noida,
                  Uttar Pradesh,
                  India

                </span>

              </div>

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="text-xl font-bold">

              Services

            </h3>

            <div className="mt-8 space-y-4">

              {services.map((item) => (

                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center text-slate-400 transition hover:text-white"
                >

                  <ArrowRight
                    size={16}
                    className="mr-2"
                  />

                  {item.title}

                </Link>

              ))}

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-xl font-bold">

              Company

            </h3>

            <div className="mt-8 space-y-4">

              {company.map((item) => (

                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center text-slate-400 transition hover:text-white"
                >

                  <ArrowRight
                    size={16}
                    className="mr-2"
                  />

                  {item.title}

                </Link>

              ))}

            </div>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="text-xl font-bold">

              Stay Updated

            </h3>

            <p className="mt-6 leading-7 text-slate-400">

              Subscribe for business tips,
              tax updates and startup news.

            </p>

            <div className="mt-8">

              <input
                type="email"
                placeholder="Enter your email"
                className="h-14 w-full rounded-xl border border-slate-700 bg-slate-900 px-5 outline-none focus:border-blue-500"
              />

              <button className="mt-4 h-14 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold transition hover:opacity-90">

                Subscribe

              </button>

            </div>

            <div className="mt-10 flex gap-4">

  <a
    href="#"
    className="rounded-xl bg-slate-800 p-3 transition hover:bg-blue-600"
  >
    <Globe size={20} />
  </a>

  <a
    href="#"
    className="rounded-xl bg-slate-800 p-3 transition hover:bg-pink-600"
  >
    <Globe size={20} />
  </a>

  <a
    href="#"
    className="rounded-xl bg-slate-800 p-3 transition hover:bg-sky-600"
  >
    <Globe size={20} />
  </a>

  <a
    href="#"
    className="rounded-xl bg-slate-800 p-3 transition hover:bg-red-600"
  >
    <Globe size={20} />
  </a>

</div>

          </div>

        </div>

        <div className="border-t border-slate-800 py-8">

          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

            <div className="text-slate-400">

              © {new Date().getFullYear()} FinClears.
              All Rights Reserved.

            </div>

            <div className="flex flex-wrap gap-8">

              {legal.map((item) => (

                <Link
                  key={item.title}
                  href={item.href}
                  className="text-slate-400 transition hover:text-white"
                >

                  {item.title}

                </Link>

              ))}

            </div>

          </div>

        </div>

      </Container>

    </footer>
  );
}
