import axios from "axios";

export interface ShiftAssignment {
  id: number;
  employee_profile_id: number;
  shift_id: number;
  effective_from: string;
  effective_to: string | null;
  is_current: boolean;
  notes: string | null;
  created_at?: string;
  updated_at?: string;

  employeeProfile?: {
    id: number;
    employee_code: string;
    user_id: number;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };

  employee_profile?: {
    id: number;
    employee_code: string;
    user_id: number;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };

  shift?: {
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
  };
}

export interface ShiftAssignmentPayload {
  employee_profile_id: number;
  shift_id: number;
  effective_from: string;
  effective_to?: string | null;
  is_current?: boolean;
  notes?: string | null;
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

export async function getEmployeeShiftAssignments(params?: {
  employee_profile_id?: number;
  shift_id?: number;
  is_current?: boolean;
}) {
  const response = await client.get<
    ApiResponse<ShiftAssignment[]>
  >("/employee-shift-assignments", {
    params,
  });

  return response.data;
}

export async function getEmployeeShiftAssignment(
  id: number | string
) {
  const response = await client.get<
    ApiResponse<ShiftAssignment>
  >(`/employee-shift-assignments/${id}`);

  return response.data;
}

export async function createEmployeeShiftAssignment(
  payload: ShiftAssignmentPayload
) {
  const response = await client.post<
    ApiResponse<ShiftAssignment>
  >("/employee-shift-assignments", payload);

  return response.data;
}

export async function updateEmployeeShiftAssignment(
  id: number | string,
  payload: Partial<ShiftAssignmentPayload>
) {
  const response = await client.put<
    ApiResponse<ShiftAssignment>
  >(`/employee-shift-assignments/${id}`, payload);

  return response.data;
}

export async function deleteEmployeeShiftAssignment(
  id: number | string
) {
  const response = await client.delete<ApiResponse<null>>(
    `/employee-shift-assignments/${id}`
  );

  return response.data;
}

export async function getCurrentEmployeeShift(
  employeeProfileId: number | string
) {
  const response = await client.get<
    ApiResponse<ShiftAssignment | null>
  >(
    `/employees/${employeeProfileId}/shift/current`
  );

  return response.data;
}

export async function getEmployeeShiftHistory(
  employeeProfileId: number | string
) {
  const response = await client.get<
    ApiResponse<ShiftAssignment[]>
  >(
    `/employees/${employeeProfileId}/shift/history`
  );

  return response.data;
}
