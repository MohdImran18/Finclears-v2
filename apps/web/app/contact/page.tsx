import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileCheck,
  FileText,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

import BusinessHours from "@/components/contact/BusinessHours";
import ContactInfo from "@/components/contact/ContactInfo";
import CTA from "@/components/contact/CTA";
import FAQ from "@/components/contact/FAQ";
import GoogleMap from "@/components/contact/GoogleMap";
import Hero from "@/components/contact/Hero";
import OfficeLocations from "@/components/contact/OfficeLocations";
import EnquiryForm from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact & Help | FinClears",
  description:
    "Contact FinClears for service enquiries and support. Read our service disclaimer, understand important limitations, and access our privacy, terms, and refund policies.",
  alternates: {
    canonical: "https://finclears.com/contact",
  },
  openGraph: {
    title: "Contact & Help | FinClears",
    description:
      "Get help with business registration, taxation, and compliance services from FinClears.",
    images: ["/images/og/contact.jpg"],
  },
};

const helpCards = [
  {
    title: "Privacy Policy",
    description:
      "Understand how personal information may be collected, used, and handled when you interact with FinClears.",
    href: "/privacy-policy",
    label: "Read Privacy Policy",
    Icon: ShieldCheck,
  },
  {
    title: "Terms & Conditions",
    description:
      "Review the general conditions that apply to our website and the services you request.",
    href: "/terms-and-conditions",
    label: "Read Terms",
    Icon: FileText,
  },
  {
    title: "Refund Policy",
    description:
      "Learn how cancellation and refund requests are submitted and assessed under applicable service terms.",
    href: "/refund-policy",
    label: "Read Refund Policy",
    Icon: FileCheck,
  },
];

const disclaimers = [
  {
    title: "General information, not personalised advice",
    text: "Information on this website is provided for general guidance. It may not address every fact or requirement relevant to your circumstances. Please seek advice from an appropriately qualified professional when your situation requires individual legal, tax, or financial guidance.",
  },
  {
    title: "Government approvals and processing times",
    text: "Applications, registrations, certificates, and other official decisions are subject to the relevant government department, regulator, or authority. Processing times may vary depending on document completeness, verification, official procedures, and factors outside our control. We do not guarantee an approval or a particular outcome.",
  },
  {
    title: "Service scope and charges",
    text: "The work included, fees, statutory charges, third-party costs, deliverables, and estimated timelines depend on the service description, quotation, invoice, and written confirmation applicable to your order. Please review these details and ask questions before proceeding.",
  },
  {
    title: "Accurate information and documents",
    text: "Customers are responsible for providing accurate, complete, and current information and authentic documents. Incorrect or incomplete information may result in additional requests, delays, rejection, or other consequences determined by the relevant authority.",
  },
  {
    title: "External websites and third parties",
    text: "Government portals, payment providers, and other external services may operate under their own terms, procedures, and privacy practices. Please verify important requirements directly with the relevant authority where necessary.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Hero />

      <EnquiryForm
        source="Contact Page"
        title="Tell Us About Your Requirement"
        description="Fill out the form and one of our business experts will contact you shortly."
      />

      <section
        id="disclaimer-help"
        className="scroll-mt-20 bg-slate-50 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
              <HelpCircle className="h-4 w-4" />
              HELP & IMPORTANT INFORMATION
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Disclaimer &amp; Help
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Find important information about our services, understand their
              limitations, and access the policies that explain how we work.
              If you need clarification about a service, please contact our
              team before proceeding.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {helpCards.map(({ title, description, href, label, Icon }) => (
              <article
                key={href}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Icon className="h-6 w-6" />
                </span>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {description}
                </p>

                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-900"
                >
                  {label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                    Service Disclaimer
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Please read the following information before relying on
                    website content or requesting a service.
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-7">
                {disclaimers.map((item, index) => (
                  <section
                    key={item.title}
                    className="border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                  >
                    <h4 className="text-base font-bold text-slate-900 sm:text-lg">
                      {index + 1}. {item.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                      {item.text}
                    </p>
                  </section>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h4 className="font-bold text-amber-950">
                  Please note
                </h4>
                <p className="mt-2 text-sm leading-7 text-amber-900">
                  This information is general guidance and is not a substitute
                  for advice tailored to your circumstances. Applicable law
                  and any mandatory customer rights take precedence over
                  inconsistent website wording.
                </p>
              </div>
            </div>

            <aside className="h-fit rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-violet-900 p-6 text-white shadow-lg sm:p-8 lg:sticky lg:top-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <HelpCircle className="h-6 w-6" />
              </span>

              <h3 className="mt-5 text-2xl font-bold">
                Need help with a service?
              </h3>

              <p className="mt-3 text-sm leading-7 text-blue-100">
                Tell us about your requirement using the enquiry form on this
                page. Include your service or order reference, if available,
                so our team can better understand your query.
              </p>

              <a
                href="#enquiry-form"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-50"
              >
                Contact Our Team
                <ArrowRight className="h-4 w-4" />
              </a>

              <div className="mt-7 border-t border-white/15 pt-6">
                <p className="text-sm font-semibold text-white">
                  FinClears
                </p>
                <p className="mt-1 text-xs leading-6 text-blue-200">
                  A brand of FINVERA TECHNOLOGY PRIVATE LIMITED
                </p>
                <p className="mt-3 text-xs leading-6 text-blue-100">
                  D-288/10, Wadhwa Complex, Office No. 311, Laxmi Nagar, East
                  Delhi, Delhi – 110092, India.
                </p>
              </div>
            </aside>
          </div>

          <p className="mt-8 text-center text-xs leading-6 text-slate-500">
            Please review the applicable service terms and policies carefully.
            The final scope of a service depends on the relevant written
            confirmation and applicable law.
          </p>
        </div>
      </section>

      <ContactInfo />
      <OfficeLocations />
      <BusinessHours />
      <GoogleMap />
      <FAQ />
      <CTA />
    </main>
  );
}
