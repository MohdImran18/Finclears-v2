import type { Metadata } from "next";

import Hero from "@/components/contact/Hero";
import EnquiryForm from "@/components/forms/EnquiryForm";
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

     <EnquiryForm
  source="Contact Page"
  title="Tell Us About Your Requirement"
  description="Fill out the form and one of our business experts will contact you shortly."
/>

      <ContactInfo />

      <OfficeLocations />

      <BusinessHours />

      <GoogleMap />

      <FAQ />

      <CTA />

    </main>
  );
}
