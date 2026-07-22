import type { Metadata } from "next";

import Hero from "@/components/contact/Hero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import OfficeLocations from "@/components/contact/OfficeLocations";
import BusinessHours from "@/components/contact/BusinessHours";
import GoogleMap from "@/components/contact/GoogleMap";
import FAQ from "@/components/contact/FAQ";
import CTA from "@/components/contact/CTA";

export const metadata: Metadata = {
  title: "Contact FinClears",

  description:
    "Get in touch with FinClears for Company Registration, GST Registration, Trademark, Tax Filing and Business Compliance services.",

  openGraph: {
    title: "Contact FinClears",
    description:
      "Talk to our experts for business registration and compliance services.",
    images: ["/images/og/contact.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main>

      <Hero />

      <ContactForm />

      <ContactInfo />

      <OfficeLocations />

      <BusinessHours />

      <GoogleMap />

      <FAQ />

      <CTA />

    </main>
  );
}
