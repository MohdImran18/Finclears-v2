import type { Metadata } from "next";

import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import LogoCloud from "@/components/home/LogoCloud";
import Stats from "@/components/home/Stats";
import FeaturedServices from "@/components/home/FeaturedServices";
import WhyChoose from "@/components/home/WhyChoose";
import Process from "@/components/home/Process";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Newsletter from "@/components/home/Newsletter";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = {
  title:
    "FinClears | Company Registration, GST, Trademark & Compliance",

  description:
    "Start and grow your business with FinClears. Company Registration, GST Registration, Trademark Registration, Accounting, ROC Compliance and Tax Filing.",

  openGraph: {
    title:
      "FinClears | Business Registration & Compliance",

    description:
      "Trusted platform for Company Registration, GST, Trademark and Tax Compliance.",

    images: [
      "/images/og/home.jpg",
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "FinClears",

    description:
      "Business Registration & Compliance Platform",
  },
};

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="bg-slate-50">

        <Hero />

        <LogoCloud />

        <Stats />

        <FeaturedServices />

        <WhyChoose />

        <Process />

        <Pricing />

        <Testimonials />

        <FAQ />

        <Newsletter />

        <CTA />

      </main>
    </>
  );
}
