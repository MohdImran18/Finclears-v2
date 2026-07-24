"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import * as PaymentService from "@/services/payments/payment.service";

import type {
  CreatePaymentRequest,
  PaymentFilters,
  VerifyPaymentRequest,
} from "@/types/payment";

/* ==========================================================
 | Query Keys
 * ========================================================= */

export const paymentKeys = {
  all: ["payments"] as const,

  lists: () =>
    [...paymentKeys.all, "list"] as const,

  list: (filters?: PaymentFilters) =>
    [...paymentKeys.lists(), filters] as const,

  details: () =>
    [...paymentKeys.all, "detail"] as const,

  detail: (id: number) =>
    [...paymentKeys.details(), id] as const,

  invoices: ["invoices"] as const,

  invoice: (id: number) =>
    [...paymentKeys.invoices, id] as const,
};

/* ==========================================================
 | Payments
 * ========================================================= */

export function usePayments(
  filters?: PaymentFilters
) {
  return useQuery({
    queryKey: paymentKeys.list(filters),

    queryFn: () =>
      PaymentService.getPayments(filters),
  });
}

export function usePayment(
  id: number
) {
  return useQuery({
    enabled: !!id,

    queryKey: paymentKeys.detail(id),

    queryFn: () =>
      PaymentService.getPayment(id),
  });
}

/* ==========================================================
 | Create Payment
 * ========================================================= */

export function useCreatePayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreatePaymentRequest
    ) =>
      PaymentService.createPayment(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          paymentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Verify Payment
 * ========================================================= */

export function useVerifyPayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: VerifyPaymentRequest
    ) =>
      PaymentService.verifyPayment(
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          paymentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Refund
 * ========================================================= */

export function useRefundPayment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: number
    ) =>
      PaymentService.refundPayment(
        id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          paymentKeys.lists(),
      });
    },
  });
}

/* ==========================================================
 | Invoices
 * ========================================================= */

export function useInvoices() {
  return useQuery({
    queryKey:
      paymentKeys.invoices,

    queryFn: () =>
      PaymentService.getInvoices(),
  });
}

export function useInvoice(
  id: number
) {
  return useQuery({
    enabled: !!id,

    queryKey:
      paymentKeys.invoice(id),

    queryFn: () =>
      PaymentService.getInvoice(id),
  });
}

/* ==========================================================
 | Download Invoice
 * ========================================================= */

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (
      id: number
    ) =>
      PaymentService.downloadInvoice(
        id
      ),
  });
}
