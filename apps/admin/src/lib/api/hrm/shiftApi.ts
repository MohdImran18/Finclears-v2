import axios from "axios";

export interface Shift {
  id: number;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  grace_period_minutes: number;
  minimum_working_hours: number;
  overtime_eligible: boolean;
  overtime_after_hours: number | null;
  cross_midnight: boolean;
  is_active: boolean;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

export async function getShifts(active?: boolean) {
  const response = await client.get<ApiResponse<Shift[]>>("/shifts", {
    params:
      typeof active === "boolean"
        ? { active }
        : undefined,
  });

  return response.data;
}

export async function getShift(id: number | string) {
  const response = await client.get<ApiResponse<Shift>>(
    `/shifts/${id}`
  );

  return response.data;
}

export interface ShiftPayload {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_duration_minutes?: number;
  grace_period_minutes?: number;
  minimum_working_hours?: number;
  overtime_eligible?: boolean;
  overtime_after_hours?: number | null;
  cross_midnight?: boolean;
  is_active?: boolean;
  description?: string | null;
}

export async function createShift(payload: ShiftPayload) {
  const response = await client.post<ApiResponse<Shift>>(
    "/shifts",
    payload
  );

  return response.data;
}

export async function updateShift(
  id: number | string,
  payload: Partial<ShiftPayload>
) {
  const response = await client.put<ApiResponse<Shift>>(
    `/shifts/${id}`,
    payload
  );

  return response.data;
}

export async function toggleShift(id: number | string) {
  const response = await client.patch<ApiResponse<Shift>>(
    `/shifts/${id}/toggle`
  );

  return response.data;
}

export async function deleteShift(id: number | string) {
  const response = await client.delete<ApiResponse<null>>(
    `/shifts/${id}`
  );

  return response.data;
}
