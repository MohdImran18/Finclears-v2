"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  ShieldCheck,
  Receipt,
  Globe,
  Landmark,
} from "lucide-react";

const sections = [
  {
    title: "Business Registration",
    items: [
      {
        icon: Building2,
        title: "Private Limited",
        href: "/private-limited-company-registration",
      },
      {
        icon: Building2,
        title: "LLP Registration",
        href: "/llp-registration",
      },
      {
        icon: Building2,
        title: "OPC Registration",
        href: "/one-person-company-registration",
      },
      {
        icon: Building2,
        title: "Partnership Firm",
        href: "/partnership-firm-registration",
      },
    ],
  },
  {
    title: "Tax & Compliance",
    items: [
      {
        icon: Receipt,
        title: "GST Registration",
        href: "/gst-registration",
      },
      {
        icon: FileText,
        title: "Income Tax Return",
        href: "/income-tax-return",
      },
      {
        icon: Landmark,
        title: "ROC Filing",
        href: "/roc-filing",
      },
      {
        icon: Receipt,
        title: "TDS Return",
        href: "/tds-return",
      },
    ],
  },
  {
    title: "Legal Services",
    items: [
      {
        icon: ShieldCheck,
        title: "Trademark",
        href: "/trademark-registration",
      },
      {
        icon: ShieldCheck,
        title: "Copyright",
        href: "/copyright-registration",
      },
      {
        icon: Globe,
        title: "IEC Registration",
        href: "/iec-registration",
      },
      {
        icon: Globe,
        title: "FSSAI License",
        href: "/fssai-license",
      },
    ],
  },
];

export default function MegaMenu() {
  return (
    <div className="absolute left-1/2 top-full z-50 mt-6 hidden w-[1100px] -translate-x-1/2 rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl group-hover:block">

      <div className="grid grid-cols-3 gap-10">

        {sections.map((section) => (

          <div key={section.title}>

            <h4 className="mb-6 text-lg font-bold text-slate-900">
              {section.title}
            </h4>

            <div className="space-y-3">

              {section.items.map((item) => {

                const Icon = item.icon;

                return (

                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-4 rounded-2xl p-4 transition hover:bg-slate-100"
                  >

                    <div className="rounded-xl bg-blue-100 p-3">

                      <Icon
                        size={22}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <div className="font-semibold">
                        {item.title}
                      </div>

                      <div className="text-sm text-slate-500">
                        Learn more
                      </div>

                    </div>

                  </Link>

                );

              })}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
