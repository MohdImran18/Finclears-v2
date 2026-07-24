"use client";

import { useMemo, useState } from "react";

import type { Service } from "@/types/service";

import SearchBar from "@/components/services/SearchBar";
import CategoryTabs, {
  type ServiceCategory,
} from "@/components/services/CategoryTabs";
import FeaturedServices from "@/components/services/FeaturedServices";
import ServiceListingHero from "@/components/services/ServiceListingHero";
import ServiceGrid from "@/components/services/ServiceGrid";
import Stats from "@/components/services/Stats";
import ServiceProcess from "@/components/services/ServiceProcess";
import Testimonials from "@/components/services/Testimonials";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceCTA from "@/components/services/ServiceCTA";
import Newsletter from "@/components/services/Newsletter";

import { useServices } from "@/hooks/useServices";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("all");

  const {
    data: services = [],
    isLoading,
    isError,
  } = useServices();

  const categories: ServiceCategory[] = useMemo(() => {
    const map = new Map<string, ServiceCategory>();

    services.forEach((service: Service) => {
      if (!service.category) return;

      map.set(service.category.slug, {
        id: service.category.id,
        name: service.category.name,
        slug: service.category.slug,
      });
    });

    return Array.from(map.values());
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service: Service) => {
      const matchesCategory =
        activeCategory === "all" ||
        service.category?.slug === activeCategory;

      const matchesSearch =
        search.trim() === "" ||
        service.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        service.short_description
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, search]);

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <p className="text-lg font-medium">
          Loading services...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold">
          Unable to load services
        </h2>

        <p className="mt-4 text-slate-500">
          Please try again later.
        </p>
      </main>
    );
  }

  return (
  <main>

    <ServiceListingHero />

    <SearchBar
      value={search}
      onChange={setSearch}
    />

    <CategoryTabs
      categories={categories}
      activeCategory={activeCategory}
      onChange={setActiveCategory}
    />

    <FeaturedServices
      services={services}
      loading={isLoading}
    />

  

    <ServiceGrid
      title="All Services"
      description="Explore our complete range of business registration, GST, compliance, trademark, tax and legal services."
      services={filteredServices}
      loading={isLoading}
    />

    <Stats />

    <ServiceProcess
      steps={[
        "Choose your required service.",
        "Upload the necessary documents.",
        "Verification by our experts.",
        "Government filing and approval.",
        "Receive your registration certificate.",
      ]}
    />

    <Testimonials />

    <ServiceFAQ
      faqs={[
        {
          question: "How long does company registration take?",
          answer:
            "Most company registrations are completed within 5–10 working days depending on document verification and government approval.",
        },
        {
          question: "Can I complete the registration online?",
          answer:
            "Yes. FinClears offers a completely online registration process from document upload to certificate delivery.",
        },
        {
          question: "Which documents are required?",
          answer:
            "PAN Card, Aadhaar Card, Address Proof and Passport-size Photograph are generally required. Additional documents depend on the selected service.",
        },
        {
          question: "Are there any hidden charges?",
          answer:
            "No. Our pricing is completely transparent with no hidden charges.",
        },
        {
          question: "Do you provide GST, Trademark and ROC services?",
          answer:
            "Yes. We provide Company Registration, GST Registration, Trademark Registration, ROC Compliance, Income Tax, FSSAI, IEC and many other business services.",
        },
        {
          question: "How can I track my application?",
          answer:
            "You can track your application from your customer dashboard or contact our support team anytime.",
        },
      ]}
    />

    <ServiceCTA />

    <Newsletter />

  </main>
);
}