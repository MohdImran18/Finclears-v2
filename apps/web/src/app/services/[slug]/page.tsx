import { notFound } from "next/navigation";
import type { Service } from "@/types/service";

import {
    getService,
    getServices,
} from "../../../lib/api/services/serviceApi";

import ServiceHero from "@/components/services/ServiceHero";
import ServiceOverview from "@/components/services/ServiceOverview";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceDocuments from "@/components/services/ServiceDocuments";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceFaqs from "@/components/services/ServiceFaqs";
import ServiceCTA from "@/components/services/ServiceCTA";
import RelatedServices from "@/components/services/RelatedServices";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { slug } = await params;

    let service;

    try {
        service = await getService(slug);
    } catch {
        notFound();
    }

    if (!service || !service.status) {
        notFound();
    }

    let relatedServices: Service[] = [];

    try {
        relatedServices = await getServices();
    } catch {
        relatedServices = [];
    }

    return (
        <main>
            <ServiceHero service={service} />

            <ServiceOverview service={service} />

            <ServiceBenefits benefits={service.benefits} />

            <ServiceProcess processes={service.processes} />

            <ServiceDocuments documents={service.documents} />

            <ServicePricing pricing={service.pricing} />

            <ServiceFaqs faqs={service.faqs} />

            <ServiceCTA />

            <RelatedServices
                services={relatedServices}
                currentId={service.id}
            />
        </main>
    );
}
