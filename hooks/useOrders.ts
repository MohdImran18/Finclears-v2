"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import * as OrderService from "@/services/orders/order.service";

import type {
  CreateOrderRequest,
  OrderFilters,
  OrderStatus,
  UpdateOrderRequest,
} from "@/types/order";

/* ==========================================================
 | Query Keys
 * ========================================================= */

export const orderKeys = {
  all: ["orders"] as const,

  lists: () =>
    [...orderKeys.all, "list"] as const,

  list: (filters?: OrderFilters) =>
    [...orderKeys.lists(), filters] as const,

  details: () =>
    [...orderKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...orderKeys.details(), id] as const,
};

/* ==========================================================
 | Get Orders
 * ========================================================= */

export function useOrders(
  filters?: OrderFilters
) {
  return useQuery({
    queryKey: orderKeys.list(filters),

    queryFn: () =>
      OrderService.getOrders(filters),
  });
}

/* ==========================================================
 | Get Single Order
 * ========================================================= */

export function useOrder(id: number) {
  return useQuery({
    enabled: !!id,

    queryKey: orderKeys.detail(id),

    queryFn: () =>
      OrderService.getOrder(id),
  });
}

/* ==========================================================
 | Create Order
 * ========================================================= */

export function useCreateOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateOrderRequest
    ) =>
      OrderService.createOrder(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Update Order
 * ========================================================= */

export function useUpdateOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderRequest;
    }) =>
      OrderService.updateOrder(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.detail(
            variables.id
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Delete Order
 * ========================================================= */

export function useDeleteOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: number
    ) =>
      OrderService.deleteOrder(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Assign Order
 * ========================================================= */

export function useAssignOrder() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      userId,
    }: {
      orderId: number;
      userId: number;
    }) =>
      OrderService.assignOrder(
        orderId,
        userId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Change Status
 * ========================================================= */

export function useChangeOrderStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) =>
      OrderService.changeStatus(
        orderId,
        status
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Add Timeline
 * ========================================================= */

export function useAddOrderTimeline() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      title,
      description,
    }: {
      orderId: number;
      title: string;
      description?: string;
    }) =>
      OrderService.addTimeline(
        orderId,
        {
          title,
          description,
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          orderKeys.lists(),
      });
    },
  });
}
