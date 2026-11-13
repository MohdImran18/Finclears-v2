import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Headset,
  IndianRupee,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | FinClears",
  description:
    "Review the FinClears refund and cancellation policy, including how to submit a request, how eligibility is assessed, and how approved refunds are processed.",
  alternates: {
    canonical: "https://finclears.com/refund-policy",
  },
};

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    Icon: FileText,
    paragraphs: [
      "This Refund Policy explains how cancellation and refund requests relating to services offered through FinClears may be submitted and reviewed.",
      "FinClears is a brand of FINVERA TECHNOLOGY PRIVATE LIMITED. Refund eligibility depends on the service purchased, the agreed scope of work, the stage of service delivery, the payment made, the circumstances of the request, and applicable law.",
      "Nothing in this policy is intended to remove or restrict any consumer right or remedy that cannot lawfully be excluded or restricted.",
    ],
  },
  {
    id: "request",
    title: "2. How to Request a Cancellation or Refund",
    Icon: Mail,
    paragraphs: [
      "Please submit your request through our Contact Us page and include your name, order or reference number if available, the service purchased, payment details sufficient to identify the transaction, and the reason for your request.",
      "Please do not send full card numbers, passwords, one-time passwords, or other unnecessary sensitive payment credentials in a refund request.",
      "We may contact you to clarify the request or ask for reasonable supporting information before making a decision.",
    ],
  },
  {
    id: "eligibility",
    title: "3. How Refund Eligibility Is Assessed",
    Icon: CheckCircle2,
    paragraphs: [
      "Each request is assessed on its individual circumstances, including the service description and written commitments, work already completed, any deliverables supplied, and any applicable legal requirements.",
      "A refund may be considered where a service has not been delivered as agreed, a duplicate payment has been made, an eligible order is cancelled, or another circumstance justifies a refund under the applicable service terms or law.",
      "Where only part of a service has been completed, the assessment may take into account the work performed and the amount properly attributable to that work, subject to the agreed terms and applicable law.",
      "Submitting a request does not automatically mean that it has been approved. We will review the information provided and communicate the outcome or request further details where reasonably necessary.",
    ],
  },
  {
    id: "work-started",
    title: "4. Requests After Work Has Started",
    Icon: RefreshCw,
    paragraphs: [
      "If work has already started, the review may consider the stage reached, work completed, documents prepared, submissions made, and any deliverables already provided.",
      "The applicable quotation or service-specific terms may explain how charges are handled in these circumstances. Any assessment must remain consistent with applicable consumer protection requirements.",
      "If a service cannot proceed because information or documents are missing, we may contact you to discuss the issue and possible next steps before the request is resolved.",
    ],
  },
  {
    id: "external-fees",
    title: "5. Government and Third-Party Charges",
    Icon: IndianRupee,
    paragraphs: [
      "Some services may involve government filing fees, statutory charges, stamp duty, payment processing costs, or other third-party expenses. The quotation or service confirmation should identify any such charges and explain how they are treated.",
      "Amounts already paid to a government authority or independent third party may be subject to that recipient's rules and refund process. We cannot promise that an external recipient will issue a refund.",
      "Any amount collected by FinClears will be reviewed in accordance with the agreed service terms, the circumstances of the request, and applicable law. No category of charge is automatically exempt from a legally required refund.",
    ],
  },
  {
    id: "duplicate-payment",
    title: "6. Duplicate or Incorrect Payments",
    Icon: CreditCard,
    paragraphs: [
      "If you believe you have paid twice for the same order or that a payment was processed incorrectly, please contact us with the transaction date, amount, payment reference if available, and order details.",
      "We will review the transaction information and, where a duplicate or incorrect payment is confirmed, arrange the appropriate correction or refund in accordance with applicable requirements.",
    ],
  },
  {
    id: "processing",
    title: "7. Review and Refund Processing",
    Icon: Clock,
    paragraphs: [
      "We will review refund requests within a reasonable period and communicate if further information is needed. The time required may depend on the complexity of the request, the service stage, and verification with a payment provider or other recipient.",
      "Where a refund is approved, it will generally be processed through the original payment method where practicable, or through another lawful and mutually appropriate method.",
      "The time taken for the amount to appear in your account may depend on the bank, card issuer, payment provider, or other financial institution. Any mandatory statutory or regulatory timeline will apply where relevant.",
    ],
  },
  {
    id: "non-refundable",
    title: "8. Service-Specific Conditions",
    Icon: ShieldCheck,
    paragraphs: [
      "Some services may have specific cancellation or refund conditions, depending on the work involved and third-party expenses. Any such conditions should be clearly communicated before you proceed with the relevant service.",
      "Please review the quotation, invoice, service description, and any written service-specific terms before making payment. If a condition is unclear, contact us for clarification.",
      "A service-specific condition will not override a mandatory legal right or requirement.",
    ],
  },
  {
    id: "complaints",
    title: "9. Questions, Complaints and Escalation",
    Icon: Headset,
    paragraphs: [
      "If you disagree with the outcome of a refund request, please contact us with the original reference number and explain the point you would like reviewed. We will reassess the information available and respond as appropriate.",
      "You may also use any consumer remedy or complaint mechanism available under applicable law. This policy does not prevent you from exercising your lawful rights.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    Icon: FileText,
    paragraphs: [
      "We may update this Refund Policy to reflect changes in services, payment processes, or legal requirements. The revised policy will be published on this page with an updated effective date.",
      "The terms applicable to a particular order and any mandatory legal provisions will be considered when assessing a request.",
    ],
  },
];

export default function RefundPolicyPage() {
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
              <RefreshCw className="h-8 w-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50 sm:text-sm">
                <ShieldCheck className="h-4 w-4" />
                CLEAR AND TRANSPARENT PROCESS
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Refund Policy
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
                Understand how to submit a cancellation or refund request and
                how FinClears reviews requests relating to its services.
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
              11. Contact Information
            </a>
          </nav>
          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <Headset className="h-5 w-5 text-blue-700" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Need help?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Contact our team about a cancellation or refund request.
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
              Before submitting a request
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              Keep your order reference, service details, and payment
              confirmation available. Refund eligibility depends on the
              circumstances of the request, the service terms, work already
              performed, and applicable law.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
            >
              Submit a request through Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-10 sm:space-y-12">
            {sections.map(({ id, title, Icon, paragraphs }) => (
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
                    11. Contact Information
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    To submit a cancellation or refund request, or ask a
                    question about this policy, please contact FinClears
                    through our website.
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
              This policy is a general draft and should be checked against
              FinClears&apos; actual service agreements, payment workflows,
              cancellation practices, and applicable legal requirements before
              being treated as final policy.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/privacy-policy"
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Terms &amp; Conditions
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
