import axios from "axios";

export interface DepartmentOption {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  status: boolean;
  designations_count?: number;
}

export interface DesignationOption {
  id: number;
  department_id: number;
  name: string;
  code: string;
  description?: string | null;
  status: boolean;

  department?: {
    id: number;
    name: string;
    code: string;
  } | null;
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

export async function getDepartments() {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: DepartmentOption[];
  }>("/departments");

  return response.data;
}

export async function getDesignations(departmentId?: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: DesignationOption[];
  }>("/designations", {
    params: departmentId
      ? { department_id: departmentId }
      : undefined,
  });

  return response.data;
}
export interface DepartmentPayload {
  name: string;
  code: string;
  description?: string | null;
  status?: boolean;
}

export async function getDepartment(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: DepartmentOption;
  }>(`/departments/${id}`);

  return response.data;
}

export async function createDepartment(
  payload: DepartmentPayload
) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: DepartmentOption;
  }>("/departments", payload);

  return response.data;
}

export async function updateDepartment(
  id: number | string,
  payload: Partial<DepartmentPayload>
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: DepartmentOption;
  }>(`/departments/${id}`, payload);

  return response.data;
}

export async function deleteDepartment(
  id: number | string
) {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(`/departments/${id}`);

  return response.data;
}
export interface DesignationPayload {
  department_id: number;
  name: string;
  code: string;
  description?: string | null;
  status?: boolean;
}

export async function getDesignation(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: DesignationOption;
  }>(`/designations/${id}`);

  return response.data;
}

export async function createDesignation(
  payload: DesignationPayload
) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: DesignationOption;
  }>("/designations", payload);

  return response.data;
}

export async function updateDesignation(
  id: number | string,
  payload: Partial<DesignationPayload>
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: DesignationOption;
  }>(`/designations/${id}`, payload);

  return response.data;
}

export async function deleteDesignation(
  id: number | string
) {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(`/designations/${id}`);

  return response.data;
}
// Employee Presence API
export interface EmployeePresenceItem {
  employee_profile_id: number;
  user_id: number;
  employee_code: string | null;
  name: string | null;
  email: string | null;
  department: string | null;
  designation: string | null;
  presence_status: "online" | "away" | "offline";
  last_seen_at: string | null;
}

export interface EmployeePresenceResponse {
  success: boolean;
  data: EmployeePresenceItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    offline_after_seconds: number;
  };
}

export async function getEmployeePresence(perPage = 100) {
  const response = await client.get<EmployeePresenceResponse>(
    "/employee-presence",
    { params: { per_page: perPage } }
  );

  return response.data;
}

// Employee Presence Heartbeat API
export async function sendEmployeePresenceHeartbeat(active = true) {
  const response = await client.post(
    "/employee-presence/heartbeat",
    { active }
  );

  return response.data;
}
// Employee Monitoring Session API
export interface EmployeeMonitoringSession {
  id: number;
  employee_user_id: number;
  requester_user_id: number;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "expired" | "ended";
  requested_at: string;
  expires_at: string;
  responded_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  response_note?: string | null;
  employee?: { id: number; name: string; email: string };
  requester?: { id: number; name: string; email: string };
}

export async function requestEmployeeMonitoringSession(employee_user_id: number) {
  const response = await client.post<{
    success: boolean;
    data: EmployeeMonitoringSession;
  }>("/employee-monitoring/sessions", { employee_user_id });

  return response.data;
}

export async function getPendingEmployeeMonitoringSessions() {
  const response = await client.get<{
    success: boolean;
    data: EmployeeMonitoringSession[];
  }>("/employee-monitoring/sessions/pending");

  return response.data;
}
export async function getActiveEmployeeMonitoringSession() {
  const response = await client.get<{
    success: boolean;
    data: EmployeeMonitoringSession | null;
  }>("/employee-monitoring/sessions/active");

  return response.data;
}

export async function respondToEmployeeMonitoringSession(
  id: number,
  decision: "accept" | "reject",
  note?: string
) {
  const response = await client.post<{
    success: boolean;
    data: EmployeeMonitoringSession;
  }>(`/employee-monitoring/sessions/${id}/respond`, {
    decision,
    note,
  });

  return response.data;
}

export async function cancelEmployeeMonitoringSession(id: number) {
  const response = await client.post<{
    success: boolean;
    data: EmployeeMonitoringSession;
  }>(`/employee-monitoring/sessions/${id}/cancel`);

  return response.data;
}

export async function endEmployeeMonitoringSession(id: number) {
  const response = await client.post<{
    success: boolean;
    data: EmployeeMonitoringSession;
  }>(`/employee-monitoring/sessions/${id}/end`);

  return response.data;
}

// Employee WebRTC Signaling API
export type EmployeeMonitoringSignalType =
  | "offer"
  | "answer"
  | "ice-candidate";

export async function sendEmployeeMonitoringSignal(
  sessionId: number,
  signalType: EmployeeMonitoringSignalType,
  payload: Record<string, unknown>
) {
  const response = await client.post(
    `/employee-monitoring/sessions/${sessionId}/signal`,
    {
      signal_type: signalType,
      payload,
    }
  );

  return response.data;
}
