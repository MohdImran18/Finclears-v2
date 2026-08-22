import axios from "axios";

import type {
  Service,
  ServiceCategory,
  ServiceListResponse,
  ServicePayload,
  ServiceResponse,
  ServiceBenefit,
  ServiceDocument,
  ServicePricing,
  ServiceProcess,
} from "@/types/service/service";

import type {
  ServiceFaq,
  ServiceFaqPayload,
} from "@/types/service/serviceFaq";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* Service Categories */

export async function getServiceCategories() {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      categories: ServiceCategory[];
    };
  }>("/services/categories");

  return response.data;
}

/* Services */

export async function getServices(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: boolean;
  featured?: boolean;
}) {
  const response = await client.get<ServiceListResponse>(
    "/admin/services",
    { params }
  );

  return response.data;
}

export async function getService(id: number) {
  const response = await client.get<ServiceResponse>(
    `/admin/services/${id}`
  );

  return response.data;
}

export async function createService(payload: ServicePayload) {
  const response = await client.post<ServiceResponse>(
    "/admin/services",
    payload
  );

  return response.data;
}

export async function updateService(
  id: number,
  payload: ServicePayload
) {
  const response = await client.put<ServiceResponse>(
    `/admin/services/${id}`,
    payload
  );

  return response.data;
}

export async function deleteService(id: number) {
  const response = await client.delete(
    `/admin/services/${id}`
  );

  return response.data;
}

/* Benefits */

export async function getServiceBenefits(serviceId: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { benefits: ServiceBenefit[] };
  }>(`/admin/services/${serviceId}/benefits`);

  return response.data;
}

export async function createServiceBenefit(
  serviceId: number,
  payload: Omit<ServiceBenefit, "id" | "service_id">
) {
  const response = await client.post(
    `/admin/services/${serviceId}/benefits`,
    payload
  );

  return response.data;
}

export async function updateServiceBenefit(
  serviceId: number,
  id: number,
  payload: Partial<Omit<ServiceBenefit, "id" | "service_id">>
) {
  const response = await client.put(
    `/admin/services/${serviceId}/benefits/${id}`,
    payload
  );

  return response.data;
}

export async function deleteServiceBenefit(
  serviceId: number,
  id: number
) {
  const response = await client.delete(
    `/admin/services/${serviceId}/benefits/${id}`
  );

  return response.data;
}

/* Documents */

export async function getServiceDocuments(serviceId: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { documents: ServiceDocument[] };
  }>(`/admin/services/${serviceId}/documents`);

  return response.data;
}

export async function createServiceDocument(
  serviceId: number,
  payload: Omit<ServiceDocument, "id" | "service_id">
) {
  const response = await client.post(
    `/admin/services/${serviceId}/documents`,
    payload
  );

  return response.data;
}

export async function updateServiceDocument(
  serviceId: number,
  id: number,
  payload: Partial<Omit<ServiceDocument, "id" | "service_id">>
) {
  const response = await client.put(
    `/admin/services/${serviceId}/documents/${id}`,
    payload
  );

  return response.data;
}

export async function deleteServiceDocument(
  serviceId: number,
  id: number
) {
  const response = await client.delete(
    `/admin/services/${serviceId}/documents/${id}`
  );

  return response.data;
}

/* Pricing */

export async function getServicePricing(serviceId: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { pricing: ServicePricing[] };
  }>(`/admin/services/${serviceId}/pricing`);

  return response.data;
}

export async function createServicePricing(
  serviceId: number,
  payload: Omit<ServicePricing, "id" | "service_id">
) {
  const response = await client.post(
    `/admin/services/${serviceId}/pricing`,
    payload
  );

  return response.data;
}

export async function updateServicePricing(
  serviceId: number,
  id: number,
  payload: Partial<Omit<ServicePricing, "id" | "service_id">>
) {
  const response = await client.put(
    `/admin/services/${serviceId}/pricing/${id}`,
    payload
  );

  return response.data;
}

export async function deleteServicePricing(
  serviceId: number,
  id: number
) {
  const response = await client.delete(
    `/admin/services/${serviceId}/pricing/${id}`
  );

  return response.data;
}

/* Processes */

export async function getServiceProcesses(serviceId: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { processes: ServiceProcess[] };
  }>(`/admin/services/${serviceId}/processes`);

  return response.data;
}

export async function createServiceProcess(
  serviceId: number,
  payload: Omit<ServiceProcess, "id" | "service_id">
) {
  const response = await client.post(
    `/admin/services/${serviceId}/processes`,
    payload
  );

  return response.data;
}

export async function updateServiceProcess(
  serviceId: number,
  id: number,
  payload: Partial<Omit<ServiceProcess, "id" | "service_id">>
) {
  const response = await client.put(
    `/admin/services/${serviceId}/processes/${id}`,
    payload
  );

  return response.data;
}

export async function deleteServiceProcess(
  serviceId: number,
  id: number
) {
  const response = await client.delete(
    `/admin/services/${serviceId}/processes/${id}`
  );

  return response.data;
}

/* FAQs */

export async function getServiceFaqs(serviceId: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { faqs: ServiceFaq[] };
  }>(`/admin/services/${serviceId}/faqs`);

  return response.data;
}

export async function createServiceFaq(
  serviceId: number,
  payload: ServiceFaqPayload
) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: { faq: ServiceFaq };
  }>(
    `/admin/services/${serviceId}/faqs`,
    payload
  );

  return response.data;
}

export async function updateServiceFaq(
  serviceId: number,
  id: number,
  payload: ServiceFaqPayload
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: { faq: ServiceFaq };
  }>(
    `/admin/services/${serviceId}/faqs/${id}`,
    payload
  );

  return response.data;
}

export async function deleteServiceFaq(
  serviceId: number,
  id: number
) {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(
    `/admin/services/${serviceId}/faqs/${id}`
  );

  return response.data;
}
