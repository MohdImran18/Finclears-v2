import api from "@/lib/api";

import { API_ENDPOINTS } from "@/constants/api";

import type {
  PaymentFilters,
  VerifyPaymentRequest,
} from "@/types/payment";

/* ==========================================================
 | Get Payments
 * ========================================================= */

export async function getPayments(
  filters?: PaymentFilters
) {
  const { data } = await api.get(
    API_ENDPOINTS.PAYMENTS.INDEX,
    {
      params: filters,
    }
  );

  return data;
}

/* ==========================================================
 | Get Payment
 * ========================================================= */

export async function getPayment(
  id: number | string
) {
  const { data } = await api.get(
    API_ENDPOINTS.PAYMENTS.SHOW(id)
  );

  return data;
}

/* ==========================================================
 | Create Payment
 * ========================================================= */

export async function createPayment(
  payload: unknown
) {
  const { data } = await api.post(
    API_ENDPOINTS.PAYMENTS.STORE,
    payload
  );

  return data;
}

/* ==========================================================
 | Verify Payment
 * ========================================================= */

export async function verifyPayment(
  payload: VerifyPaymentRequest
) {
  const { data } = await api.post(
    API_ENDPOINTS.PAYMENTS.VERIFY,
    payload
  );

  return data;
}

/* ==========================================================
 | Refund Payment
 * ========================================================= */

export async function refundPayment(
  id: number | string
) {
  const { data } = await api.post(
    `${API_ENDPOINTS.PAYMENTS.SHOW(id)}/refund`
  );

  return data;
}

/* ==========================================================
 | Invoices
 * ========================================================= */

export async function getInvoices() {
  const { data } = await api.get(
    "/payments/invoices"
  );

  return data;
}

export async function getInvoice(
  id: number | string
) {
  const { data } = await api.get(
    `/payments/invoices/${id}`
  );

  return data;
}

export async function downloadInvoice(
  id: number | string
) {
  const { data } = await api.get(
    `/payments/invoice/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return data;
}