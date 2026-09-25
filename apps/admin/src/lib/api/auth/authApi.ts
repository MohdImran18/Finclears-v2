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

  return response.data;
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
