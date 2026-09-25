import axios from "axios";

import type {
  SalaryComponent,
  SalaryComponentListResponse,
  SalaryComponentPayload,
  SalaryComponentResponse,
} from "@/types/payroll/salaryComponent";

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

export async function getSalaryComponents(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  type?: "earning" | "deduction";
  calculation_type?: string;
  is_variable?: boolean;
  is_active?: boolean;
  is_reimbursement?: boolean;
}): Promise<SalaryComponentListResponse> {
  const response = await client.get<SalaryComponentListResponse>(
    "/salary-components",
    { params }
  );

  return response.data;
}

export async function getSalaryComponent(
  id: number | string
): Promise<SalaryComponentResponse> {
  const response = await client.get<SalaryComponentResponse>(
    `/salary-components/${id}`
  );

  return response.data;
}

export async function createSalaryComponent(
  payload: SalaryComponentPayload
): Promise<SalaryComponentResponse> {
  const response = await client.post<SalaryComponentResponse>(
    "/salary-components",
    payload
  );

  return response.data;
}

export async function updateSalaryComponent(
  id: number | string,
  payload: Partial<SalaryComponentPayload>
): Promise<SalaryComponentResponse> {
  const response = await client.put<SalaryComponentResponse>(
    `/salary-components/${id}`,
    payload
  );

  return response.data;
}

export async function deleteSalaryComponent(
  id: number | string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(`/salary-components/${id}`);

  return response.data;
}

export async function toggleSalaryComponentStatus(
  id: number | string
): Promise<SalaryComponentResponse> {
  const response = await client.patch<SalaryComponentResponse>(
    `/salary-components/${id}/status`
  );

  return response.data;
}

export type { SalaryComponent };
