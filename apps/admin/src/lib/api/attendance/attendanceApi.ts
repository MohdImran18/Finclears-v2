import type {
  Attendance,
  AttendanceListResponse,
  AttendanceResponse,
  MarkAttendanceStatusPayload,
} from "@/types/attendance/attendance";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

function getAuthHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

export async function getAttendances(params?: {
  employee_profile_id?: number;
  date?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
}): Promise<AttendanceListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.employee_profile_id !== undefined) {
    searchParams.set(
      "employee_profile_id",
      String(params.employee_profile_id)
    );
  }

  if (params?.date) {
    searchParams.set("date", params.date);
  }

  if (params?.from_date) {
    searchParams.set("from_date", params.from_date);
  }

  if (params?.to_date) {
    searchParams.set("to_date", params.to_date);
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();

  return apiRequest<AttendanceListResponse>(
    `/attendances${query ? `?${query}` : ""}`
  );
}

export async function getAttendance(
  id: number
): Promise<AttendanceResponse> {
  return apiRequest<AttendanceResponse>(`/attendances/${id}`);
}

export async function checkIn(payload: {
  employee_profile_id: number;
  check_in_at?: string;
  check_in_source?: string;
  notes?: string;
}): Promise<AttendanceResponse> {
  return apiRequest<AttendanceResponse>("/attendances/check-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function checkOut(payload: {
  employee_profile_id: number;
  check_out_at?: string;
  check_out_source?: string;
  notes?: string;
}): Promise<AttendanceResponse> {
  return apiRequest<AttendanceResponse>("/attendances/check-out", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function markAttendanceStatus(
  payload: MarkAttendanceStatusPayload
): Promise<AttendanceResponse> {
  return apiRequest<AttendanceResponse>("/attendances/mark-status", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getEmployeeAttendance(
  employeeProfileId: number,
  params?: {
    from_date?: string;
    to_date?: string;
  }
): Promise<AttendanceListResponse> {
  const searchParams = new URLSearchParams();

  if (params?.from_date) {
    searchParams.set("from_date", params.from_date);
  }

  if (params?.to_date) {
    searchParams.set("to_date", params.to_date);
  }

  const query = searchParams.toString();

  return apiRequest<AttendanceListResponse>(
    `/employees/${employeeProfileId}/attendance${
      query ? `?${query}` : ""
    }`
  );
}
