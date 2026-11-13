"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Clock3,
  FileText,
  Headset,
  LayoutGrid,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const serviceLinks = [
  { title: "Company Registration", href: "/services/company-registration", Icon: Building2 },
  { title: "LLP Registration", href: "/services/company-registration", Icon: Users },
  { title: "OPC Registration", href: "/services/company-registration", Icon: FileText },
  { title: "GST Registration", href: "/services/gst", Icon: Percent },
  { title: "Trademark Registration", href: "/services/trademark", Icon: BadgeCheck },
  { title: "Income Tax Filing", href: "/services/income-tax", Icon: FileText },
  { title: "ROC Compliance", href: "/services/roc", Icon: Building2 },
  { title: "Other Services", href: "/services", Icon: LayoutGrid },
];

const companyLinks = [
  { title: "About Us", href: "/about" },
  { title: "Our Team", href: "/about" },
  { title: "Careers", href: "/careers" },
  { title: "Contact Us", href: "/contact" },
];

const quickLinks = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Pricing", href: "/pricing" },
  { title: "Blog", href: "/blog" },
];

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
  { title: "Refund Policy", href: "/refund-policy" },
];

const trustItems = [
  {
    title: "Government Compliance",
    description: "Guidance aligned with applicable requirements",
    Icon: ShieldCheck,
    color: "text-blue-600 bg-blue-50 ring-blue-100",
  },
  {
    title: "Expert Support",
    description: "Help throughout your registration journey",
    Icon: Headset,
    color: "text-violet-600 bg-violet-50 ring-violet-100",
  },
  {
    title: "Transparent Pricing",
    description: "Clear information before you proceed",
    Icon: Wallet,
    color: "text-emerald-600 bg-emerald-50 ring-emerald-100",
  },
  {
    title: "End-to-End Assistance",
    description: "Support from registration to compliance",
    Icon: Clock3,
    color: "text-indigo-600 bg-indigo-50 ring-indigo-100",
  },
];

export default function Footer() {
  const pathname = usePathname();

  // Keep the public-site footer off internal dashboard and auth screens.
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/auth" ||
    pathname.startsWith("/auth/")
  ) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-b from-white via-slate-50 to-blue-50/50 text-slate-700">
      <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        {/* Conversion banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 px-6 py-9 text-white shadow-xl shadow-blue-900/15 sm:px-10 sm:py-11 lg:px-12">
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full border-[36px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-36 right-1/4 -z-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr_auto] lg:gap-8 xl:gap-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                <Zap className="h-4 w-4" />
                Get Started Today
              </span>
              <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[40px]">
                Ready to Register Your Business?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
                Get expert guidance for registration, taxation and compliance.
                A simpler way to take your next business step.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-white">Compliance Guidance</p>
                  <p className="mt-1 text-sm text-blue-100">Help understanding applicable requirements</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <Users className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-white">Expert Assistance</p>
                  <p className="mt-1 text-sm text-blue-100">Support through the process</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                  <Zap className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-bold text-white">A Simpler Process</p>
                  <p className="mt-1 text-sm text-blue-100">Clear steps and helpful information</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[205px]">
              <Link
                href="/contact"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/50 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </section>

        {/* Navigation columns */}
        <div className="grid gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.15fr_0.85fr_0.8fr_0.9fr] lg:gap-x-8 lg:py-10">
          <div className="border-b border-slate-200 pb-8 sm:col-span-2 lg:col-span-1 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-3xl font-extrabold text-white shadow-lg shadow-blue-600/20 transition group-hover:-translate-y-0.5">
                F
              </span>
              <span>
                <span className="block text-2xl font-extrabold tracking-tight text-slate-950">FinClears</span>
                <span className="block text-sm font-medium text-slate-500">Business Simplified</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              We simplify business registration, taxation and compliance so you
              can focus on what matters most — growing your business.
            </p>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Registered Office</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  D-288/10, Wadhwa Complex, Office No. 311, Laxmi Nagar,
                  East Delhi, Delhi – 110092, India.
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              FinClears is a brand of FINVERA TECHNOLOGY PRIVATE LIMITED.
            </p>
          </div>

          <nav aria-label="Our services">
            <h3 className="mb-5 text-base font-extrabold text-slate-950 sm:text-lg">Our Services</h3>
            <ul className="space-y-4">
              {serviceLinks.map(({ title, href, Icon }) => (
                <li key={title}>
                  <Link href={href} className="group flex items-center gap-3 text-sm text-slate-600 transition-colors duration-200 hover:text-blue-700 sm:text-[15px]">
                    <Icon className="h-5 w-5 shrink-0 text-blue-600 transition group-hover:scale-110" />
                    <span>{title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="mb-5 text-base font-extrabold text-slate-950 sm:text-lg">Company</h3>
            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="group inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors duration-200 hover:text-blue-700 sm:text-[15px]">
                    {item.title}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Quick links">
            <h3 className="mb-5 text-base font-extrabold text-slate-950 sm:text-lg">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-sm text-slate-600 transition-colors duration-200 hover:text-blue-700 sm:text-[15px]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="mb-5 text-base font-extrabold text-slate-950 sm:text-lg">Legal</h3>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-sm leading-6 text-slate-600 transition-colors duration-200 hover:text-blue-700 sm:text-[15px]">
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="text-sm text-slate-600 transition-colors duration-200 hover:text-blue-700 sm:text-[15px]">
                  Disclaimer & Help
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Trust highlights */}
        <div className="grid gap-5 border-y border-slate-200 py-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {trustItems.map(({ title, description, Icon, color }, index) => (
            <div
              key={title}
              className={`flex items-center gap-3 ${index > 0 ? "lg:border-l lg:border-slate-200 lg:pl-6" : ""} ${index < trustItems.length - 1 ? "lg:pr-5" : ""}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Copyright and legal bar */}
        <div className="flex flex-col gap-4 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-6 text-slate-500">
            © {new Date().getFullYear()} FinClears. All rights reserved. FinClears is a brand of FINVERA TECHNOLOGY PRIVATE LIMITED.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-500">
            {legalLinks.map((item) => (
              <Link key={item.title} href={item.href} className="transition hover:text-blue-700">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
