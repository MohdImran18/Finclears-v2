import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Cookie,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | FinClears",
  description:
    "Read the FinClears Privacy Policy to understand how information may be collected, used, stored and shared when you use our website and services.",
  alternates: {
    canonical: "https://finclears.com/privacy-policy",
  },
};

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We May Collect",
    Icon: Database,
    paragraphs: [
      "Depending on how you interact with FinClears, we may collect information that you choose to provide, such as your name, email address, phone number, business details, and information included in enquiries or service requests.",
      "If you submit documents or information required for a registration, tax, or compliance service, that information may also be processed to the extent necessary to respond to your request or provide the relevant service.",
      "Our website and service providers may also process technical information such as your browser type, device information, pages visited, approximate usage data, and server logs. The information actually collected depends on the features and tools enabled on the website.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "2. How We Use Information",
    Icon: FileText,
    paragraphs: [
      "Information may be used to respond to enquiries, communicate with you, understand your service requirements, facilitate requested business registration or tax-related assistance, maintain website functionality, prevent misuse, and meet applicable legal obligations.",
      "We may also use relevant information to improve our website, understand service performance, and address support requests. Where consent is required by applicable law, we will seek it before using information for the relevant purpose.",
    ],
  },
  {
    id: "cookies-analytics",
    title: "3. Cookies and Website Analytics",
    Icon: Cookie,
    paragraphs: [
      "Cookies and similar technologies may be used to support website functionality, remember preferences, understand website usage, or measure performance if these tools are enabled.",
      "You can review your browser settings to manage or block cookies. Blocking certain cookies may affect some website features. Where required, consent will be requested before setting non-essential cookies or using similar technologies.",
      "If analytics, advertising, or other tracking tools are enabled, their use should be explained in accordance with the tools deployed and applicable privacy requirements.",
    ],
  },
  {
    id: "sharing-information",
    title: "4. When Information May Be Shared",
    Icon: UserCheck,
    paragraphs: [
      "We do not describe information as being shared with every possible category of recipient. Where necessary for a requested service, information may be shared with relevant professional advisers, service providers, technology providers, or government authorities, as applicable.",
      "Information may also be disclosed where required by law, in response to lawful requests, to protect rights and safety, or in connection with a legitimate business reorganisation, subject to applicable legal requirements.",
      "We do not sell personal information as a standalone product. Any additional sharing or use will be subject to applicable law and the circumstances of the relevant service.",
    ],
  },
  {
    id: "data-security",
    title: "5. Data Security and Retention",
    Icon: LockKeyhole,
    paragraphs: [
      "Reasonable safeguards should be used to protect personal information against unauthorised access, alteration, disclosure, or loss. However, no method of internet transmission or electronic storage can be guaranteed to be completely secure.",
      "Information should be retained only for as long as reasonably necessary for the purpose for which it was collected, to provide requested services, maintain relevant records, resolve disputes, or comply with applicable legal obligations.",
      "If you believe your information has been used improperly, please contact us using the details provided below so that your concern can be reviewed.",
    ],
  },
  {
    id: "your-choices",
    title: "6. Your Choices and Privacy Requests",
    Icon: ShieldCheck,
    paragraphs: [
      "Depending on applicable law, you may be entitled to request access to, correction of, or deletion of certain personal information, withdraw consent where processing is based on consent, or raise a concern about how your information is handled.",
      "To submit a privacy-related request, contact us through our Contact Us page. We may need to verify your identity and clarify the request before responding. Some records may need to be retained where the law requires it or where another lawful basis applies.",
    ],
  },
  {
    id: "third-party-services",
    title: "7. Third-Party Websites and Services",
    Icon: ArrowRight,
    paragraphs: [
      "Our website may link to third-party websites or use external services. Those services may have their own privacy policies, terms, and data-handling practices.",
      "FinClears does not control the privacy practices of independent third-party websites. Please review their policies before providing personal information directly to them.",
    ],
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    Icon: UserCheck,
    paragraphs: [
      "Our website and services are intended for people seeking business, tax, registration, or compliance-related assistance. If you believe a child has provided personal information to us in circumstances where this is not appropriate, please contact us so the matter can be reviewed.",
    ],
  },
  {
    id: "policy-updates",
    title: "9. Changes to This Policy",
    Icon: FileText,
    paragraphs: [
      "We may update this Privacy Policy to reflect changes in our services, website features, or applicable requirements. The revised version will be published on this page with an updated effective date.",
      "Please review this page periodically to remain informed about our privacy practices.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-50 sm:text-sm">
                <LockKeyhole className="h-4 w-4" />
                YOUR PRIVACY MATTERS
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
                How FinClears may collect, use, protect, and share information
                when you visit our website or request our services.
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
              10. Contact Information
            </a>
          </nav>
          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <Mail className="h-5 w-5 text-blue-700" />
            <p className="mt-2 text-sm font-semibold text-slate-900">
              Privacy question?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Contact our team to raise a privacy-related request.
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
              About this Privacy Policy
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              This policy describes general privacy practices relevant to
              FinClears and its website. The information actually collected
              and the tools used may depend on the features you access and
              the service you request. Please contact us if you need
              clarification about a specific data-handling practice.
            </p>
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
                    10. Contact Information
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    For privacy questions or requests relating to personal
                    information, please contact FinClears through our website.
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
              This page provides general information about privacy practices
              and should be reviewed against FinClears&apos; actual data
              collection, technology providers, retention practices, and
              applicable legal obligations before being treated as a final
              legal policy.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to FinClears
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
