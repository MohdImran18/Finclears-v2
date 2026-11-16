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

export interface AuthUser {
  id: number;
  uuid?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;

  spatie_roles?: string[];
  permissions?: string[];

  employee_profile?: {
    id: number;
    employee_code?: string | null;

    department?: {
      id: number;
      name: string;
      code: string;
    } | null;

    designation?: {
      id: number;
      name: string;
      code: string;
    } | null;

    reporting_manager?: {
      id: number;
      name: string;
      email: string;
    } | null;
  } | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    user: AuthUser;
  };
}

export interface MeResponse {
  success: boolean;

  data: AuthUser;
}

export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>(
    "/auth/login",
    payload
  );

  let body: any = response.data;

  if (typeof body === "string") {
    const cleanBody = body.replace(/^\uFEFF/, "").trim();

    try {
      body = JSON.parse(cleanBody);
    } catch {
      throw new Error("Login response could not be parsed as JSON.");
    }
  }
  if (!body || typeof body !== "object") {
    throw new Error("Login response has an invalid format.");
  }

  console.log("AUTH API PARSED RESPONSE:", {
    status: response.status,
    success: body.success,
    hasToken: Boolean(body.data?.token),
    hasUser: Boolean(body.data?.user),
    topLevelKeys: Object.keys(body),
  });

  return body;
}

export async function getMe(
  token?: string
): Promise<MeResponse> {
  const accessToken =
    token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  const response = await client.get<MeResponse>(
    "/auth/me",
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    }
  );

  return response.data;
}

export function logoutLocal() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("admin_user");
  }
}

export interface EmployeeConsentData {
  work_date: string;
  policy_version: string;
  policy_available: boolean;
  policy_text: string | null;
  retention_period: string | null;
  support_contact: string | null;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  accepted_at: string | null;
  withdrawn_at: string | null;
}

export interface EmployeeConsentResponse {
  success: boolean;
  message?: string;
  data: EmployeeConsentData;
}

export interface EmployeeConsentActionResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
    token: string;
    token_type: string;
    work_date?: string;
    policy_version?: string;
  };
}

function getConsentHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEmployeeConsentStatus() {
  const response = await client.get<EmployeeConsentResponse>(
    "/auth/employee-consent/status",
    { headers: getConsentHeaders() }
  );
  return response.data;
}

export async function acceptEmployeeConsent(policy_version: string) {
  const response = await client.post<EmployeeConsentActionResponse>(
    "/auth/employee-consent/accept",
    { policy_version },
    { headers: getConsentHeaders() }
  );
  return response.data;
}

export async function declineEmployeeConsent(policy_version: string) {
  const response = await client.post<EmployeeConsentActionResponse>(
    "/auth/employee-consent/decline",
    { policy_version },
    { headers: getConsentHeaders() }
  );
  return response.data;
}

export async function withdrawEmployeeConsent(policy_version: string) {
  const response = await client.post<EmployeeConsentActionResponse>(
    "/auth/employee-consent/withdraw",
    { policy_version },
    { headers: getConsentHeaders() }
  );
  return response.data;
}

export type EmployeeBrowserPermission = "camera" | "microphone";

export async function reportEmployeePermissionRevoked(
  permission: EmployeeBrowserPermission
) {
  const response = await client.post(
    "/auth/employee-consent/permission-revoked",
    { permission },
    { headers: getConsentHeaders() }
  );

  return response.data;
}