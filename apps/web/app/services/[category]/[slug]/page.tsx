import { notFound } from "next/navigation";
import type { Metadata } from "next";

import StructuredData from "@/components/seo/StructuredData";

import { serviceSchema } from "@/lib/seo/serviceSchema";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbSchema";
import { faqSchema } from "@/lib/seo/faqSchema";

import Breadcrumb from "@/components/services/Breadcrumb";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceDocuments from "@/components/services/ServiceDocuments";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceCTA from "@/components/services/ServiceCTA";
import Newsletter from "@/components/services/Newsletter";

import type {
  Service,
  ServiceBenefit,
  ServiceFaq,
  ServicePricing as PricingItem,
  ServiceProcess as ProcessItem,
  ServiceDocument,
} from "@/types/service";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://finclears.com";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/* ==========================================================
 | Service
 * ========================================================= */

async function getService(
  slug: string
): Promise<Service | null> {
  const response = await fetch(
    `${API}/api/v1/services/${slug}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const json = await response.json();

  return json?.data?.service ?? null;
}

/* ==========================================================
 | Related
 * ========================================================= */

async function getRelated(
  category: string
): Promise<Service[]> {
  const response = await fetch(
    `${API}/api/v1/services`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const json = await response.json();

  return (
    json?.data?.services ?? []
  ).filter(
    (item: Service) =>
      item.category?.slug === category
  );
}

/* ==========================================================
 | Metadata
 * ========================================================= */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const service =
    await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  const canonical =
    `${SITE_URL}/services/${service.category?.slug}/${service.slug}`;

  return {
    title:
      service.meta_title ??
      service.title,

    description:
      service.meta_description ??
      service.description,

    keywords:
      service.meta_keywords,

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical,
    },

    openGraph: {
      siteName: "FinClears",

      type: "website",

      url: canonical,

      title:
        service.meta_title ??
        service.title,

      description:
        service.meta_description ??
        service.description,

      images:
        service.featured_image
          ? [
              {
                url:
                  service.featured_image,
                width: 1200,
                height: 630,
                alt:
                  service.title,
              },
            ]
          : [],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        service.meta_title ??
        service.title,

      description:
        service.meta_description ??
        service.description,
    },
  };
}

export default async function ServicePage({
  params,
}: Props) {
  const {
    category,
    slug,
  } = await params;

  const service =
    await getService(slug);

  if (!service) {
    notFound();
  }

  const related = (
    await getRelated(category)
  ).filter(
    (item: Service) =>
      item.id !== service.id
  );

  /* ==========================================================
   | Structured Data
   * ========================================================= */

  const serviceJson = serviceSchema({
    name: service.title,

    description:
      service.meta_description ??
      service.description,

    url:
      `${SITE_URL}/services/${category}/${slug}`,

    image:
 service.featured_image ?? undefined,
 
    price:
  String(service.starting_price),
  });

  const breadcrumbJson =
    breadcrumbSchema([
      {
        name: "Home",
        url: SITE_URL,
      },

      {
        name: "Services",
        url:
          `${SITE_URL}/services`,
      },

      {
        name:
          service.category?.name ??
          "Service",

        url:
          `${SITE_URL}/services/${service.category?.slug}`,
      },

      {
        name:
          service.title,

        url:
          `${SITE_URL}/services/${category}/${slug}`,
      },
    ]);

  const faqJson = faqSchema(
    (
      service.faqs ?? []
    )
      .map(
        (
          item: ServiceFaq
        ) => ({
          question:
            item.question,

          answer:
            item.answer,
        })
      )
      .filter(
        (item) =>
          item.question &&
          item.answer
      )
  );

  /* ==========================================================
   | Mapped Data
   * ========================================================= */

  const benefits =
    (
      service.benefits ??
      []
    ).map(
      (
        item: ServiceBenefit
      ) =>
        item.title
    );

  const processSteps =
    (
      service.processes ??
      []
    ).map(
      (
        item: ProcessItem
      ) =>
        item.title
    );

  const documents =
    (
      service.documents ??
      []
    ).map(
      (
        item: ServiceDocument
      ) =>
        item.title
    );

  const pricingFeatures =
    (
      service.pricing ??
      []
    ).map(
      (
        item: PricingItem
      ) =>
        item.title
    );
      return (
    <main>

      <StructuredData
        data={serviceJson}
      />

      <StructuredData
        data={breadcrumbJson}
      />

      {service.faqs &&
        service.faqs.length > 0 && (
          <StructuredData
            data={faqJson}
          />
        )}

      <div className="container mx-auto px-6 pt-8">

        <Breadcrumb
          category={
            service.category?.slug ??
            ""
          }
          title={service.title}
        />

      </div>

      <ServiceHero
        service={service}
      />

      {/* Overview */}

      <section className="py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-4xl text-center">

            <h2 className="text-4xl font-bold">

              About this Service

            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">

              {service.description}

            </p>

          </div>

        </div>

      </section>

      {benefits.length > 0 && (

        <ServiceBenefits
          benefits={benefits}
        />

      )}

      <ServicePricing
        price={
          service.starting_price
        }
        priceLabel={
          service.price_label
        }
        features={
          pricingFeatures
        }
      />

      {processSteps.length > 0 && (

        <ServiceProcess
          steps={
            processSteps
          }
        />

      )}

      {documents.length > 0 && (

        <ServiceDocuments
          documents={
            documents
          }
        />

      )}

      {service.faqs &&
        service.faqs.length > 0 && (

          <ServiceFAQ
            faqs={service.faqs}
          />

      )}

      {related.length > 0 && (

        <RelatedServices
          services={related}
        />

      )}

      <ServiceCTA />

      <Newsletter />

    </main>
  );
}