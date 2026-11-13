import type { Metadata } from "next";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

import StructuredData from "@/components/seo/StructuredData";
import Breadcrumb from "@/components/services/Breadcrumb";
import Newsletter from "@/components/services/Newsletter";
import RelatedServices from "@/components/services/RelatedServices";
import ServiceBenefits from "@/components/services/ServiceBenefits";
import ServiceCTA from "@/components/services/ServiceCTA";
import ServiceDocuments from "@/components/services/ServiceDocuments";
import ServiceFAQ from "@/components/services/ServiceFAQ";
import ServiceHero from "@/components/services/ServiceHero";
import ServicePricing from "@/components/services/ServicePricing";
import ServiceProcess from "@/components/services/ServiceProcess";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbSchema";
import { faqSchema } from "@/lib/seo/faqSchema";
import { serviceSchema } from "@/lib/seo/serviceSchema";

import type {
	ServicePricing as PricingItem,
	ServiceProcess as ProcessItem,
	Service,
	ServiceBenefit,
	ServiceDocument,
	ServiceFaq,
} from "@/types/service";

const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/api\/v1\/?$/, "");

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://finclears.com";

interface Props {
	params: Promise<{
		category: string;
		slug: string;
	}>;
}

/* ==========================================================
 | Service
 * ========================================================= */

async function getService(slug: string): Promise<Service | null> {
	const response = await fetch(`${API}/api/v1/services/${slug}`, {
                cache: "no-store",
	});

	if (!response.ok) {
		return null;
	}

	const json = await response.json();

	return json?.data?.service ?? null;
}

/* ==========================================================
 | Related
 * ========================================================= */

async function getRelated(category: string): Promise<Service[]> {
	const response = await fetch(`${API}/api/v1/services`, {
		next: {
			revalidate: 3600,
		},
	});

	if (!response.ok) {
		return [];
	}

	const json = await response.json();

	return (json?.data?.services ?? []).filter(
		(item: Service) => item.category?.slug === category,
	);
}

/* ==========================================================
 | Metadata
 * ========================================================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;

	const service = await getService(slug);

	if (!service) {
		return {
			title: "Service Not Found",
		};
	}

	const canonical = `${SITE_URL}/services/${service.category?.slug}/${service.slug}`;

	return {
		title: service.meta_title ?? service.title,

		description: service.meta_description ?? service.description ?? "",

		keywords: service.meta_keywords,

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

			title: service.meta_title ?? service.title,

			description: service.meta_description ?? service.description ?? "",

			images: service.featured_image
				? [
						{
							url: service.featured_image,
							width: 1200,
							height: 630,
							alt: service.title,
						},
					]
				: [],
		},

		twitter: {
			card: "summary_large_image",

			title: service.meta_title ?? service.title,

			description: service.meta_description ?? service.description ?? "",
		},
	};
}

export default async function ServicePage({ params }: Props) {
	const { category, slug } = await params;

	const service = await getService(slug);

	if (!service) {
		notFound();
	}

	const related = (await getRelated(category)).filter(
		(item: Service) => item.id !== service.id,
	);

	/* ==========================================================
   | Structured Data
   * ========================================================= */

	const serviceJson = serviceSchema({
		name: service.title,

		description: service.meta_description ?? service.description ?? "",

		url: `${SITE_URL}/services/${category}/${slug}`,

		image: service.featured_image ?? undefined,

		price: String(service.starting_price),
	});

	const breadcrumbJson = breadcrumbSchema([
		{
			name: "Home",
			url: SITE_URL,
		},

		{
			name: "Services",
			url: `${SITE_URL}/services`,
		},

		{
			name: service.category?.name ?? "Service",

			url: `${SITE_URL}/services/${service.category?.slug}`,
		},

		{
			name: service.title,

			url: `${SITE_URL}/services/${category}/${slug}`,
		},
	]);

	const faqJson = faqSchema(
		(service.faqs ?? [])
			.map((item: ServiceFaq) => ({
				question: item.question,

				answer: item.answer,
			}))
			.filter((item) => item.question && item.answer),
	);

	/* ==========================================================
   | Mapped Data
   * ========================================================= */

	const benefits = (service.benefits ?? []).map(
		(item: ServiceBenefit) => item.title,
	);

	const processSteps = (service.processes ?? []).map(
		(item: ProcessItem) => item.title,
	);

	const documents = (service.documents ?? [])
		.map((item: ServiceDocument) => item.document_name || (item as any).title)
		.filter(Boolean);

	const pricingFeatures = (service.pricing ?? [])
                .filter((item: PricingItem) => item.status !== false)
                .map((item: PricingItem) => item.plan_name)
                .filter(Boolean);

        if (pricingFeatures.length === 0) {
                pricingFeatures.push(
                        ...(service.benefits ?? [])
                                .filter((item: ServiceBenefit) => item.status !== false)
                                .map((item: ServiceBenefit) => item.title)
                                .filter(Boolean),
                );
        }
        const aboutDescription = (service.description ?? "").replace(
                /<h[23][^>]*>\s*(?:What Is|Key Benefits|Who Should|Eligibility|Documents Required|Private Limited Company Registration Process|What Is Included|Important Compliance|Why Choose|Frequently Asked Questions|Get Started)\b[\s\S]*$/i,
                "",
        );

	return (
		<main>
			<StructuredData data={serviceJson} />

			<StructuredData data={breadcrumbJson} />

			{service.faqs && service.faqs.length > 0 && (
				<StructuredData data={faqJson} />
			)}

			<div className="container mx-auto px-6 pt-8">
				<Breadcrumb
					category={service.category?.slug ?? ""}
					title={service.title}
				/>
			</div>

			<ServiceHero service={service} />

			{/* Overview */}
                    <section className="bg-slate-50 py-10 sm:py-14">
                        <div className="mx-auto max-w-6xl px-5 sm:px-6">
                            <div className="mx-auto max-w-3xl text-center">
                                <span className="inline-flex items-center rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm">
                                    Service Overview
                                </span>
                                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                                    About This Service
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                    Understand the service, key requirements and how FinClears can help you move forward.
                                </p>
                            </div>

                            <article
                                className="service-description mx-auto mt-7 max-w-5xl rounded-2xl border border-slate-200/80 bg-white px-6 py-7 shadow-sm sm:mt-9 sm:px-9 sm:py-9 lg:px-12 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:mb-5 [&_p]:text-base [&_p]:leading-8 [&_p]:text-slate-600 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_img]:mx-auto [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-200 [&_blockquote]:pl-5 [&_hr]:my-8 [&_hr]:border-slate-200"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(aboutDescription, {
                                        allowedTags: [
                                            "p", "br", "strong", "b", "em", "i", "u",
                                            "h2", "h3", "ul", "ol", "li", "a", "img",
                                            "blockquote", "hr", "span",
                                        ],
                                        allowedAttributes: {
                                            a: ["href", "target", "rel"],
                                            img: ["src", "alt", "title", "width", "height"],
                                            p: ["style"],
                                            h2: ["style"],
                                            h3: ["style"],
                                            span: ["style"],
                                        },
                                        allowedSchemes: ["http", "https", "mailto"],
                                        allowedSchemesByTag: {
                                            img: ["http", "https"],
                                        },
                                        allowedStyles: {
                                            "*": {
                                                "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
                                            },
                                        },
                                    }),
                                }}
                            />
                        </div>
                    </section>

                    {benefits.length > 0 && <ServiceBenefits benefits={benefits} />}

			<ServicePricing
				price={service.starting_price ?? 0}
				priceLabel={service.price_label ?? undefined}
				features={pricingFeatures}
			/>

			{processSteps.length > 0 && <ServiceProcess steps={processSteps} />}

			{documents.length > 0 && <ServiceDocuments documents={documents} />}

			{service.faqs && service.faqs.length > 0 && (
				<ServiceFAQ faqs={service.faqs} />
			)}

			{related.length > 0 && <RelatedServices services={related} />}

			<ServiceCTA />

			<Newsletter />
		</main>
	);
}

