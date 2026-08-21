import axios from "axios";
import type {
  Customer,
  CustomerListResponse,
  CustomerPayload,
} from "@/types/customer/customer";

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

export async function getCustomers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
}) {
  const response = await client.get<CustomerListResponse>(
    "/customers",
    { params }
  );

  return response.data;
}

export async function getCustomer(id: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { customer: Customer };
  }>(`/customers/${id}`);

  return response.data;
}

export async function createCustomer(
  payload: CustomerPayload
) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: { customer: Customer };
  }>("/customers", payload);

  return response.data;
}

export async function updateCustomer(
  id: number,
  payload: Partial<CustomerPayload>
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: { customer: Customer };
  }>(`/customers/${id}`, payload);

  return response.data;
}

export async function deleteCustomer(id: number) {
  const response = await client.delete(
    `/customers/${id}`
  );

  return response.data;
}
