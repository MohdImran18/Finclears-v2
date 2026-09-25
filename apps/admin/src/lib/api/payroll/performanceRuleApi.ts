import axios from "axios";

import type {
  PerformanceRule,
  PerformanceRuleListResponse,
  PerformanceRulePayload,
  PerformanceRuleResponse,
} from "@/types/payroll/performanceRule";

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

export interface PerformanceRuleListParams {
  employee_profile_id?: number;
  metric_type?: string;
  period_type?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export async function getPerformanceRules(
  params?: PerformanceRuleListParams
): Promise<PerformanceRuleListResponse> {
  const response = await client.get<PerformanceRuleListResponse>(
    "/performance-rules",
    { params }
  );

  return response.data;
}

export async function getPerformanceRule(
  id: number | string
): Promise<PerformanceRuleResponse> {
  const response = await client.get<PerformanceRuleResponse>(
    `/performance-rules/${id}`
  );

  return response.data;
}

export async function createPerformanceRule(
  payload: PerformanceRulePayload
): Promise<PerformanceRuleResponse> {
  const response = await client.post<PerformanceRuleResponse>(
    "/performance-rules",
    payload
  );

  return response.data;
}

export async function updatePerformanceRule(
  id: number | string,
  payload: Partial<PerformanceRulePayload>
): Promise<PerformanceRuleResponse> {
  const response = await client.put<PerformanceRuleResponse>(
    `/performance-rules/${id}`,
    payload
  );

  return response.data;
}

export async function togglePerformanceRuleStatus(
  id: number | string
): Promise<PerformanceRuleResponse> {
  const response = await client.patch<PerformanceRuleResponse>(
    `/performance-rules/${id}/status`
  );

  return response.data;
}

export async function deletePerformanceRule(
  id: number | string
): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(`/performance-rules/${id}`);

  return response.data;
}

export type { PerformanceRule };
