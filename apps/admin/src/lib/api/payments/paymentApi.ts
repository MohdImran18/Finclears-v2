import axios from "axios";

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

export interface PaymentCompany {
  id: number;
  company_name: string;
}

export interface PaymentOrder {
  id: number;
  order_no: string;
  service_name: string;
}

export interface CompanyPayment {
  id: number;
  company_id: number;
  order_id?: number | null;

  amount: number | string;
  currency: string;

  payment_status: string;
  payment_gateway: string;

  gateway_order_id?: string | null;
  gateway_transaction_id?: string | null;
  payment_session_id?: string | null;

  gateway_response?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;

  paid_at?: string | null;

  created_at: string;
  updated_at: string;

  company?: PaymentCompany | null;
  order?: PaymentOrder | null;
}

export interface PaymentListResponse {
  success: boolean;
  message: string;
  data: CompanyPayment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function getCompanyPayments(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  gateway?: string;
}) {
  const response = await client.get<PaymentListResponse>(
    "/company-payments",
    {
      params,
    }
  );

  return response.data;
}

export async function getCompanyPayment(id: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      payment: CompanyPayment;
    };
  }>(`/company-payments/${id}`);

  return response.data;
}