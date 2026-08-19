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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      uuid?: string;
      name: string;
      email: string;
      phone?: string | null;
      role: string;
      status: string;
    };
  };
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

export function logoutLocal() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
  }
}