import api from "@/lib/api";

export interface ServiceCategory {
        id: number;
        name: string;
        slug: string;
}

export interface ServiceBenefit {
        id: number;
        service_id: number;
        title: string;
        description?: string | null;
        icon?: string | null;
        sort_order: number;
        status: boolean;
}

export interface ServiceProcess {
        id: number;
        service_id: number;
        step_number: number;
        title: string;
        description?: string | null;
        icon?: string | null;
        sort_order: number;
        status: boolean;
}

export interface ServiceDocument {
        id: number;
        service_id: number;
        document_name: string;
        description?: string | null;
        is_required: boolean;
        sort_order: number;
        status: boolean;
}

export interface ServicePricing {
        id: number;
        service_id: number;
        plan_name: string;
        price: string | number;
        original_price?: string | number | null;
        currency?: string | null;
        features?: string[] | Record<string, unknown> | null;
        is_popular: boolean;
        is_recommended: boolean;
        status: boolean;
        sort_order: number;
}

export interface ServiceFaq {
        id: number;
        service_id: number;
        question: string;
        answer: string;
        sort_order: number;
        status: boolean;
}

export interface Service {
        id: number;
        category?: ServiceCategory | null;
        title: string;
        slug: string;
        code?: string | null;
        icon?: string | null;
        featured_image?: string | null;
        banner_image?: string | null;
        short_description?: string | null;
        description?: string | null;
        starting_price?: string | number | null;
        price_label?: string | null;
        processing_days?: number | null;
        meta_title?: string | null;
        meta_description?: string | null;
        meta_keywords?: string | null;
        is_featured: boolean;
        is_popular: boolean;
        status: boolean;
        sort_order: number;
        views?: number;
        orders?: number;

        benefits?: ServiceBenefit[];
        processes?: ServiceProcess[];
        documents?: ServiceDocument[];
        pricing?: ServicePricing[];
        faqs?: ServiceFaq[];
}

interface ServiceListResponse {
        success: boolean;
        message: string;
        data: {
                services: Service[];
        };
        meta?: Record<string, unknown>;
}

interface ServiceResponse {
        success: boolean;
        message: string;
        data: {
                service: Service;
        };
        meta?: Record<string, unknown>;
}

export async function getServices(): Promise<Service[]> {
        const response = await api.get<ServiceListResponse>("/services");

        return response.data.data.services;
}

export async function getService(slug: string): Promise<Service> {
        const response = await api.get<ServiceResponse>(
                `/services/${encodeURIComponent(slug)}`
        );

        return response.data.data.service;
}

export async function getFeaturedServices(): Promise<Service[]> {
        const response = await api.get<ServiceListResponse>(
                "/services/featured"
        );

        return response.data.data.services;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
        const response = await api.get<{
                success: boolean;
                message: string;
                data: {
                        categories: ServiceCategory[];
                };
        }>("/services/categories");

        return response.data.data.categories;
}

export async function searchServices(query: string): Promise<Service[]> {
        const response = await api.get<ServiceListResponse>(
                "/services/search",
                {
                        params: {
                                q: query,
                        },
                }
        );

        return response.data.data.services;
}
