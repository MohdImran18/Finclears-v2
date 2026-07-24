"use client";

import ServiceCard from "@/components/services/ServiceCard";

import type { Service } from "@/types/service";

interface Props {
  services: Service[];
}

export default function RelatedServices({
  services,
}: Props) {

  const related = services.slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-14 text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            Related Services
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Explore other services that may help your business.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {related.map((service) => (

            <ServiceCard
              key={service.id}
              service={service}
            />

          ))}

        </div>

      </div>

    </section>
  );
}
