import type {
  EmployeeLeaveBalance,
  LeaveApplication,
  LeaveType,
  PaginatedResponse,
  CreateLeaveApplicationPayload,
} from "@/types/leave/leave";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token")
  );
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

export async function getLeaveApplications(
  params: Record<string, string | number> = {}
): Promise<{
  success: boolean;
  data: PaginatedResponse<LeaveApplication>;
}> {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();

  return apiRequest(
    `/leave-applications${query ? `?${query}` : ""}`
  );
}

export async function getLeaveApplication(
  id: number
): Promise<{
  success: boolean;
  data: LeaveApplication;
}> {
  return apiRequest(`/leave-applications/${id}`);
}

export async function createLeaveApplication(
  payload: CreateLeaveApplicationPayload
): Promise<{
  success: boolean;
  message: string;
  data: LeaveApplication;
}> {
  return apiRequest("/leave-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function approveLeaveApplication(
  id: number
): Promise<{
  success: boolean;
  message: string;
  data: LeaveApplication;
}> {
  return apiRequest(`/leave-applications/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectLeaveApplication(
  id: number,
  rejection_reason: string
): Promise<{
  success: boolean;
  message: string;
  data: LeaveApplication;
}> {
  return apiRequest(`/leave-applications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({
      rejection_reason,
    }),
  });
}

export async function cancelLeaveApplication(
  id: number
): Promise<{
  success: boolean;
  message: string;
  data: LeaveApplication;
}> {
  return apiRequest(`/leave-applications/${id}/cancel`, {
    method: "POST",
  });
}

export async function getLeaveBalances(
  params: Record<string, string | number> = {}
): Promise<{
  success: boolean;
  data: PaginatedResponse<EmployeeLeaveBalance>;
}> {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();

  return apiRequest(
    `/employee-leave-balances${query ? `?${query}` : ""}`
  );
}

export async function getLeaveBalance(
  id: number
): Promise<{
  success: boolean;
  data: EmployeeLeaveBalance;
}> {
  return apiRequest(`/employee-leave-balances/${id}`);
}

export async function getLeaveTypes(): Promise<{
  success: boolean;
  data: LeaveType[];
}> {
  return apiRequest("/leave-types");
}