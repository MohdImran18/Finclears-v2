import api from "@/lib/api";

import { API_ENDPOINTS } from "@/constants/api";

import type {
  OrderFilters,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderStatus,
} from "@/types/order";

/* ==========================================================
 | Get All Orders
 * ========================================================= */

export async function getOrders(
  filters?: OrderFilters
) {
  const { data } = await api.get(
    API_ENDPOINTS.ORDERS.INDEX,
    {
      params: filters,
    }
  );

  return data;
}

/* ==========================================================
 | Get Single Order
 * ========================================================= */

export async function getOrder(
  id: number | string
) {
  const { data } = await api.get(
    API_ENDPOINTS.ORDERS.SHOW(id)
  );

  return data;
}

/* ==========================================================
 | Create Order
 * ========================================================= */

export async function createOrder(
  payload: CreateOrderRequest
) {
  const { data } = await api.post(
    API_ENDPOINTS.ORDERS.STORE,
    payload
  );

  return data;
}

/* ==========================================================
 | Update Order
 * ========================================================= */

export async function updateOrder(
  id: number | string,
  payload: UpdateOrderRequest
) {
  const { data } = await api.put(
    API_ENDPOINTS.ORDERS.UPDATE(id),
    payload
  );

  return data;
}

/* ==========================================================
 | Delete Order
 * ========================================================= */

export async function deleteOrder(
  id: number | string
) {
  const { data } = await api.delete(
    API_ENDPOINTS.ORDERS.DELETE(id)
  );

  return data;
}

/* ==========================================================
 | Assign Order
 * ========================================================= */

export async function assignOrder(
  id: number | string,
  userId: number | string
) {
  const { data } = await api.patch(
    `${API_ENDPOINTS.ORDERS.SHOW(id)}/assign`,
    {
      user_id: userId,
    }
  );

  return data;
}

/* ==========================================================
 | Change Status
 * ========================================================= */

export async function changeStatus(
  id: number | string,
  status: OrderStatus
) {
  const { data } = await api.patch(
    `${API_ENDPOINTS.ORDERS.SHOW(id)}/status`,
    {
      status,
    }
  );

  return data;
}

/* ==========================================================
 | Add Timeline
 * ========================================================= */

export async function addTimeline(
  id: number | string,
  payload: {
    title: string;
    description?: string;
  }
) {
  const { data } = await api.post(
    `${API_ENDPOINTS.ORDERS.SHOW(id)}/timeline`,
    payload
  );

  return data;
}