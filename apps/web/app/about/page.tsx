import type { Metadata } from "next";
import Achievements from "@/components/about/Achievements";
import CTA from "@/components/about/CTA";
import Hero from "@/components/about/Hero";
import MissionVision from "@/components/about/MissionVision";
import Story from "@/components/about/Story";
import Team from "@/components/about/Team";
import Timeline from "@/components/about/Timeline";
import Values from "@/components/about/Values";

export const metadata: Metadata = {
	title: "About FinClears",

	description:
		"Learn about FinClears, our mission, vision, leadership team and commitment to helping businesses across India.",

	openGraph: {
		title: "About FinClears",

		description: "India's trusted business registration & compliance platform.",

		images: ["/images/og/about.jpg"],
	},
};

export default function AboutPage() {
	return (
		<main>
			<Hero />

			<Story />

			<MissionVision />

			<Values />

			<Achievements />

			<Timeline />

			<Team />

			<CTA />
		</main>
	);
}

