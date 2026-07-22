"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

const services = [
  "Private Limited Company",
  "LLP Registration",
  "GST Registration",
  "Income Tax Return",
  "Trademark Registration",
  "FSSAI License",
  "Startup India",
];

const company = [
  "About",
  "Careers",
  "Contact",
  "Blog",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 20);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        sticky
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      <Container>
        <div className="h-20 flex items-center justify-between">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              F
            </div>

            <div>
              <div className="text-xl font-bold text-slate-900">
                FinClears
              </div>

              <div className="text-xs text-slate-500">
                Business Simplified
              </div>
            </div>
          </Link>

          {/* Desktop */}

          <nav className="hidden lg:flex items-center gap-10">

            <Link
              href="/"
              className="font-medium hover:text-blue-600 transition"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServiceOpen(true)}
              onMouseLeave={() => setServiceOpen(false)}
            >
              <button className="flex items-center gap-2 font-medium hover:text-blue-600">
                Services

                <ChevronDown size={18} />
              </button>

              {serviceOpen && (
                <div className="absolute top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4">

                  {services.map((item) => (
                    <Link
                      href="#"
                      key={item}
                      className="block px-4 py-3 rounded-xl hover:bg-slate-100"
                    >
                      {item}
                    </Link>
                  ))}

                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="font-medium hover:text-blue-600"
            >
              Pricing
            </Link>

            <Link
              href="/blog"
              className="font-medium hover:text-blue-600"
            >
              Blog
            </Link>

            <div className="relative group">

              <button className="flex items-center gap-2 font-medium">
                Company

                <ChevronDown size={18} />
              </button>

              <div className="absolute top-12 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-white rounded-2xl shadow-xl border p-3 w-52">

                {company.map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="block rounded-lg px-4 py-3 hover:bg-slate-100"
                  >
                    {item}
                  </Link>
                ))}

              </div>
            </div>

          </nav>

          {/* Right */}

          <div className="hidden lg:flex items-center gap-4">

            <Link href="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="gradient">
                Talk to Expert
              </Button>
            </Link>

          </div>

          {/* Mobile */}

          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={28} />
          </button>

        </div>
      </Container>

      {/* Mobile Drawer */}

      <div
        className={`fixed inset-0 bg-black/50 transition ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-white transition-transform duration-300 ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >

          <div className="flex justify-between items-center p-6 border-b">

            <div className="font-bold text-xl">
              FinClears
            </div>

            <button
              onClick={() => setMobileOpen(false)}
            >
              <X />
            </button>

          </div>

          <div className="p-6 space-y-2">

            <Link
              href="/"
              className="block py-3"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="block py-3"
            >
              Services
            </Link>

            <Link
              href="/pricing"
              className="block py-3"
            >
              Pricing
            </Link>

            <Link
              href="/blog"
              className="block py-3"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="block py-3"
            >
              Contact
            </Link>

            <div className="pt-8">

              <Button
                className="w-full"
                variant="gradient"
              >
                Talk to Expert
              </Button>

            </div>

          </div>

        </div>
      </div>

    </header>
  );
}
