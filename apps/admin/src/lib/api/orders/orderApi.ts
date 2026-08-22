import axios from "axios";

import type {
  Order,
  OrderListResponse,
} from "@/types/order/order";

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

export async function getOrders(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigned_to?: number;
}) {
  const response =
    await client.get<OrderListResponse>(
      "/orders",
      { params }
    );

  return response.data;
}

export async function getOrder(id: number) {
  const response =
    await client.get<{
      success: boolean;
      message: string;
      data: Order;
    }>(`/orders/${id}`);

  return response.data;
}

export async function updateOrder(
  id: number,
  payload: Partial<Order>
) {
  const response =
    await client.put(
      `/orders/${id}`,
      payload
    );

  return response.data;
}

export async function changeOrderStatus(
  id: number,
  status: string
) {
  const response =
    await client.patch(
      `/orders/${id}/status`,
      { status }
    );

  return response.data;
}

export async function assignOrder(
  id: number,
  assigned_to: number
) {
  const response =
    await client.patch(
      `/orders/${id}/assign`,
      { assigned_to }
    );

  return response.data;
}

export async function addOrderTimeline(
  id: number,
  title: string,
  description?: string
) {
  const response =
    await client.post(
      `/orders/${id}/timeline`,
      {
        title,
        description,
      }
    );

  return response.data;
}
