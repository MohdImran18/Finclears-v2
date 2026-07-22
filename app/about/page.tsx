import type { Metadata } from "next";

import Hero from "@/components/about/Hero";
import Story from "@/components/about/Story";
import MissionVision from "@/components/about/MissionVision";
import Values from "@/components/about/Values";
import Achievements from "@/components/about/Achievements";
import Timeline from "@/components/about/Timeline";
import Team from "@/components/about/Team";
import CTA from "@/components/about/CTA";

export const metadata: Metadata = {
  title: "About FinClears",

  description:
    "Learn about FinClears, our mission, vision, leadership team and commitment to helping businesses across India.",

  openGraph: {
    title: "About FinClears",

    description:
      "India's trusted business registration & compliance platform.",

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
