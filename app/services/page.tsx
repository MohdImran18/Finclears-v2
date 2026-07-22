"use client";

import ServiceGrid from "@/components/services/ServiceGrid";
import { useServices } from "@/hooks/useServices";

export default function ServicesPage() {

  const {
    data: services = [],
    isLoading,
  } = useServices();

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-10">
        <p>Loading services...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-20 px-6 py-10">

      <section className="text-center">

        <h1 className="text-5xl font-bold">
          Our Services
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600">
          FinClears offers complete business registration,
          tax, compliance, trademark and payroll services
          for startups, MSMEs and enterprises.
        </p>

      </section>

      <ServiceGrid services={services} />

    </main>
  );
}
