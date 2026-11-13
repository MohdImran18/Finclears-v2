import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Gavel,
  Handshake,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | FinClears",
  description:
    "Review the terms and conditions governing access to the FinClears website and use of its business registration, tax and compliance assistance services.",
  alternates: {
    canonical: "https://finclears.com/terms-and-conditions",
  },
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of These Terms",
    Icon: CheckCircle2,
    paragraphs: [
      "These Terms & Conditions govern your access to and use of the FinClears website and the services you request through it. By accessing the website, submitting an enquiry, or proceeding with a service, you agree to the terms applicable to your use.",
      "If you do not agree with these terms, please do not use the relevant website features or proceed with a service. Additional terms may apply to a particular service, quotation, engagement, or order and should be read together with these terms.",
    ],
  },
  {
    id: "about-finclears",
    title: "2. About FinClears",
    Icon: Building2,
    paragraphs: [
      "FinClears is a brand of FINVERA TECHNOLOGY PRIVATE LIMITED. The website provides information and facilitates enquiries for business registration, taxation, and compliance-related assistance.",
      "The exact scope of any service depends on the service description, quotation, written confirmation, and information communicated to you before you proceed. Please review those details carefully before making a payment or submitting documents.",
    ],
  },
  {
    id: "services",
    title: "3. Services and Scope of Work",
    Icon: Handshake,
    paragraphs: [
      "Services may include assistance relating to company or LLP registration, GST, income tax, trademark matters, ROC compliance, and other services displayed on the website.",
      "Where applicable, our role may involve helping you understand requirements, organising information or documents, preparing or coordinating application materials, and assisting with submission processes. The precise work included will depend on the service you select.",
      "Government departments, regulators, banks, and other independent authorities make decisions within their respective powers. FinClears does not guarantee approval, registration, a particular outcome, or a specific processing time unless an express written commitment lawfully provides otherwise.",
      "Any timelines displayed or communicated are estimates unless expressly confirmed as binding. Processing may depend on complete documents, accurate information, government systems, third-party actions, and other factors outside our reasonable control.",
    ],
  },
  {
    id: "user-responsibilities",
    title: "4. Your Responsibilities",
    Icon: ShieldCheck,
    paragraphs: [
      "You are responsible for providing accurate, complete, current, and lawful information and documents. Please review names, addresses, identification details, business particulars, declarations, and forms before approving them for submission.",
      "You should respond to reasonable requests for clarification or additional documents and notify us if information relevant to your service changes.",
      "You must not use the website for unlawful purposes, submit forged or misleading documents, impersonate another person, interfere with website security, or attempt to gain unauthorised access to any system.",
      "Delays or additional work caused by incomplete, inaccurate, inconsistent, or late information may affect delivery timelines and may require a revised scope or additional charges, where communicated and agreed as applicable.",
    ],
  },
  {
    id: "fees-payments",
    title: "5. Fees, Quotations and Payments",
    Icon: CreditCard,
    paragraphs: [
      "Service fees, inclusions, exclusions, taxes, and payment milestones should be reviewed in the quotation, service description, invoice, or written confirmation provided for your particular order.",
      "Government fees, statutory charges, stamp duty, professional charges, and third-party expenses may be separate from FinClears service fees where indicated in the applicable quotation.",
      "Please make payments only through payment methods or accounts officially communicated by FinClears. Keep payment confirmations and invoices for your records.",
      "Any change to the scope of work or additional service should be discussed and confirmed before the additional work is undertaken. No fee should be treated as agreed solely on the basis of an assumption not reflected in the applicable service communication.",
    ],
  },
  {
    id: "cancellations-refunds",
    title: "6. Cancellations and Refunds",
    Icon: FileText,
    paragraphs: [
      "Cancellation requests and refund eligibility are governed by the Refund Policy published on our website, together with the terms communicated for the specific service and applicable law.",
      "Before placing an order, please review the Refund Policy and clarify any questions about work already started, third-party charges, statutory fees, or other service-specific conditions.",
      "Nothing in these terms is intended to exclude or restrict a right or remedy that cannot lawfully be excluded or restricted under applicable law.",
    ],
    link: { href: "/refund-policy", label: "Read the Refund Policy" },
  },
  {
    id: "communications",
    title: "7. Communications and Service Updates",
    Icon: Mail,
    paragraphs: [
      "We may communicate with you using the contact details you provide in connection with enquiries, service progress, requests for documents, payments, or other matters relating to your service.",
      "You are responsible for ensuring that your contact details remain accurate and for checking relevant communications. Please avoid sending sensitive personal information through a channel unless it is appropriate for that information.",
      "If you receive a message requesting payment or sensitive information and are unsure whether it is genuine, contact FinClears through the official website before acting on it.",
    ],
  },
  {
    id: "intellectual-property",
    title: "8. Website Content and Intellectual Property",
    Icon: BookOpen,
    paragraphs: [
      "Unless otherwise stated, website text, branding, design, graphics, and other materials are owned by or used with permission by their respective rights holders.",
      "You may access and use website content for your personal or internal business reference in connection with evaluating our services. You must not reproduce, republish, commercially exploit, or distribute protected content without appropriate permission, except where permitted by law.",
      "Names, logos, and materials belonging to government departments or other third parties remain the property of their respective owners. Their appearance does not by itself imply endorsement or affiliation.",
    ],
  },
  {
    id: "third-party",
    title: "9. Third-Party Websites and Authorities",
    Icon: ArrowRight,
    paragraphs: [
      "The website may link to external websites or refer to government portals, payment providers, professional advisers, or other third parties. Those parties operate under their own terms, policies, procedures, and timelines.",
      "FinClears does not control independent third-party websites or government systems. You should review the relevant terms and verify important information directly with the appropriate authority where necessary.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Information Disclaimer",
    Icon: FileText,
    paragraphs: [
      "Website content is provided for general informational purposes and may not cover every fact, exception, or legal change relevant to your circumstances. It is not a substitute for advice tailored to your specific situation from a suitably qualified professional.",
      "We make reasonable efforts to keep information useful and current, but do not promise that every page is complete, uninterrupted, or free from errors at all times. Please seek clarification before relying on information where an incorrect interpretation could have significant consequences.",
    ],
  },
  {
    id: "liability",
    title: "11. Liability and Service Limitations",
    Icon: ShieldCheck,
    paragraphs: [
      "To the extent permitted by applicable law, FinClears is not responsible for delays or outcomes caused by government authorities, third-party providers, unavailable systems, or information supplied incorrectly or late by a customer.",
      "Nothing in these terms excludes liability where such exclusion is prohibited by law, or limits any statutory consumer right or remedy that cannot lawfully be limited.",
      "Where an issue arises with a service, please contact us promptly with the relevant order details so that we can review the matter and explain the available next steps.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to These Terms",
    Icon: FileText,
    paragraphs: [
      "We may update these Terms & Conditions when our website, services, or applicable requirements change. The updated version will be published on this page with a revised effective date.",
      "Changes will apply as permitted by law. Any service-specific agreement or mandatory legal provision will take precedence to the extent of an inconsistency.",
    ],
  },
  {
    id: "law",
    title: "13. Governing Law and Disputes",
    Icon: Gavel,
    paragraphs: [
      "These terms are subject to the laws of India, to the extent applicable. Any dispute will be addressed through the remedies and procedures available under applicable law before a court, tribunal, or other competent forum with jurisdiction.",
      "Nothing in this section is intended to deprive a consumer of a forum, protection, or remedy that is available as a matter of mandatory law.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-violet-800 text-white">
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border-[42px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex max-w-3xl items-start gap-4 sm:gap-6">
            <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:flex">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50 sm:text-sm">
                <ShieldCheck className="h-4 w-4" />
                CLEAR TERMS. BETTER CLARITY.
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Terms &amp; Conditions
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
                Please read these terms carefully to understand the conditions
                that apply when you access FinClears and request our services.
              </p>
              <p className="mt-5 text-sm text-blue-200">
                Effective date: 20 October 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 lg:px-10">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            On this page
          </h2>
          <nav className="mt-4 space-y-1.5">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2.5 text-sm leading-5 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {section.title}
              </a>
            ))}
            <a
              href="#contact"
              className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              14. Contact Information
            </a>
          </nav>
          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <Mail className="h-5 w-5 text-blue-700" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Need clarification?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Contact our team about a service or these terms.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Important information
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              These terms should be read alongside the service description,
              quotation, Privacy Policy, and Refund Policy relevant to your
              request. If you have questions about fees, deliverables, or
              exclusions, please ask for clarification before proceeding.
            </p>
          </div>

          <div className="space-y-10 sm:space-y-12">
            {sections.map(({ id, title, Icon, paragraphs, link }) => (
              <section key={id} id={id} className="scroll-mt-8">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                      {title}
                    </h2>
                    <div className="mt-3 space-y-4">
                      {paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {link && (
                      <Link
                        href={link.href}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                      >
                        {link.label} <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            ))}

            <section id="contact" className="scroll-mt-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <Mail className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                    14. Contact Information
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    If you have questions about these terms, a quotation, or a
                    service request, please contact us through the official
                    FinClears website.
                  </p>

                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                    <p className="font-bold text-slate-950">FinClears</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      A brand of FINVERA TECHNOLOGY PRIVATE LIMITED
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      D-288/10, Wadhwa Complex, Office No. 311, Laxmi Nagar,
                      East Delhi, Delhi – 110092, India.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800"
                    >
                      Contact FinClears <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-xs leading-6 text-slate-500">
              These terms are a general website draft and should be reviewed
              against FinClears&apos; actual service agreements, payment
              processes, cancellation practices, and applicable legal
              obligations before being treated as final legal terms.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/privacy-policy"
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-policy"
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Refund Policy
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to FinClears
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
