import type { Metadata } from "next";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import CTA from "@/components/pricing/CTA";
import FAQ from "@/components/pricing/FAQ";
import Hero from "@/components/pricing/Hero";
import IncludedServices from "@/components/pricing/IncludedServices";
import PricingPlans from "@/components/pricing/PricingPlans";

export const metadata: Metadata = {
	title: "Pricing | FinClears",

	description:
		"Explore transparent pricing for Company Registration, GST Registration, Trademark, Accounting and Compliance services.",

	openGraph: {
		title: "FinClears Pricing",

		description: "Transparent business registration and compliance pricing.",

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

