import type { Metadata } from "next";

import Hero from "@/components/pricing/Hero";
import PricingPlans from "@/components/pricing/PricingPlans";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import IncludedServices from "@/components/pricing/IncludedServices";
import FAQ from "@/components/pricing/FAQ";
import CTA from "@/components/pricing/CTA";

export const metadata: Metadata = {
  title: "Pricing | FinClears",

  description:
    "Explore transparent pricing for Company Registration, GST Registration, Trademark, Accounting and Compliance services.",

  openGraph: {
    title: "FinClears Pricing",

    description:
      "Transparent business registration and compliance pricing.",

    images: ["/images/og/pricing.jpg"],
  },
};

export default function PricingPage() {
  return (
    <main>

      <Hero />

      <PricingPlans />

      <ComparisonTable />

      <IncludedServices />

      <FAQ />

      <CTA />

    </main>
  );
}
