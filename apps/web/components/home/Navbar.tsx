"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

const services = [
  {
    name: "Private Limited Company",
    href: "/services/business-registration/private-limited-company-registration",
  },
  {
    name: "LLP Registration",
    href: "/services/business-registration/llp-registration",
  },
  {
    name: "GST Registration",
    href: "/services/gst-services/gst-registration",
  },
  {
    name: "Trademark Registration",
    href: "/services/trademark/trademark-registration",
  },
  {
    name: "Income Tax Return",
    href: "/services/income-tax/income-tax-return-filing",
  },
];

const company = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Careers",
    href: "/careers",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClass = (href: string) =>
    pathname === href
      ? "text-blue-600 font-semibold"
      : "text-slate-700 font-medium hover:text-blue-600 transition";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        sticky
          ? "bg-white shadow-lg border-b border-slate-200"
          : "bg-white/80 backdrop-blur-xl"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              F
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                FinClears
              </h2>

              <p className="text-xs text-slate-500">
                Business Simplified
              </p>
            </div>
          </Link>

          {/* Desktop */}

          <nav className="hidden items-center gap-8 lg:flex">

            <Link
              href="/"
              className={navClass("/")}
            >
              Home
            </Link>

            {/* Services */}

            <div
              className="relative"
              onMouseEnter={() =>
                setServiceOpen(true)
              }
              onMouseLeave={() =>
                setServiceOpen(false)
              }
            >
              <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-blue-600">
                Services
                <ChevronDown size={18} />
              </button>

              <div
                className={`absolute left-0 top-12 w-80 rounded-2xl border bg-white p-3 shadow-2xl transition-all duration-200 ${
                  serviceOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-2 opacity-0"
                }`}
              >
                {services.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl p-3 transition hover:bg-slate-100"
                  >
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Learn more →
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/pricing"
              className={navClass("/pricing")}
            >
              Pricing
            </Link>

            <Link
              href="/blog"
              className={navClass("/blog")}
            >
              Blog
            </Link>

            {/* Company */}

            <div
              className="relative"
              onMouseEnter={() =>
                setCompanyOpen(true)
              }
              onMouseLeave={() =>
                setCompanyOpen(false)
              }
            >
              <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-blue-600">
                Company
                <ChevronDown size={18} />
              </button>

              <div
                className={`absolute left-0 top-12 w-56 rounded-2xl border bg-white p-3 shadow-2xl transition-all duration-200 ${
                  companyOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible translate-y-2 opacity-0"
                }`}
              >
                {company.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-4 py-3 transition hover:bg-slate-100"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right */}

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/auth/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>

            <Link href="/contact">
              <Button variant="gradient">
                Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile */}

          <button
            className="lg:hidden"
            onClick={() =>
              setMobileOpen(true)
            }
          >
            <Menu size={28} />
          </button>
        </div>
      </Container>

      {/* Overlay */}

      <div
        onClick={() =>
          setMobileOpen(false)
        }
        className={`fixed inset-0 bg-black/50 transition ${
          mobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      >
        <div
          onClick={(e) =>
            e.stopPropagation()
          }
          className={`absolute right-0 top-0 h-full w-80 bg-white transition-transform duration-300 ${
            mobileOpen
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-bold">
              FinClears
            </h2>

            <button
              onClick={() =>
                setMobileOpen(false)
              }
            >
              <X />
            </button>
          </div>

          <div className="space-y-2 p-6">

            <Link
              href="/"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Services
            </Link>

            <Link
              href="/pricing"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Pricing
            </Link>

            <Link
              href="/blog"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Blog
            </Link>

            <Link
              href="/about"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              About
            </Link>

            <Link
              href="/careers"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Careers
            </Link>

            <Link
              href="/contact"
              onClick={() =>
                setMobileOpen(false)
              }
              className="block py-3"
            >
              Contact
            </Link>

            <div className="pt-8">
              <Link
                href="/contact"
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <Button
                  className="w-full"
                  variant="gradient"
                >
                  Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}