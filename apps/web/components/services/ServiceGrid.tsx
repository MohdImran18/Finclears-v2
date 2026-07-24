"use client";

import ServiceCard from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

interface Props {
  services?: Service[];
  title?: string;
  description?: string;
  loading?: boolean;
}

export default function ServiceGrid({
  services = [],
  title,
  description,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <section className="space-y-10">
        {(title || description) && (
          <div className="text-center">
            {title && (
              <h2 className="text-4xl font-bold">
                {title}
              </h2>
            )}

            {description && (
              <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <h3 className="text-2xl font-semibold text-gray-900">
            Loading Services...
          </h3>

          <p className="mt-3 text-gray-500">
            Please wait while we load the services.
          </p>
        </div>
      </section>
    );
  }

  if (!services.length) {
    return (
      <section className="space-y-10">
        {(title || description) && (
          <div className="text-center">
            {title && (
              <h2 className="text-4xl font-bold">
                {title}
              </h2>
            )}

            {description && (
              <p className="mx-auto mt-4 max-w-3xl text-gray-600">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
          <h3 className="text-2xl font-bold">
            No Services Found
          </h3>

          <p className="mt-3 text-gray-500">
            We couldn't find any services.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-4xl font-bold">
              {title}
            </h2>
          )}

          {description && (
            <p className="mx-auto mt-4 max-w-3xl text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>
    </section>
  );
}