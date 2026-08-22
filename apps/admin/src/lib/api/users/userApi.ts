import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
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

export interface AdminUser {
  id: number;
  uuid?: string;
  name: string;
  email: string;
  mobile?: string | null;
  phone?: string | null;
  role?: string | null;
  status?: string | null;
  created_at?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role: "admin" | "employee" | "client";
  status: "active" | "inactive" | "blocked";
}

export async function getUsers(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const response = await client.get("/users", { params });
  return response.data;
}

export async function getUser(id: number) {
  const response = await client.get(`/users/${id}`);
  return response.data;
}

export async function createUser(payload: UserPayload) {
  const response = await client.post("/users", payload);
  return response.data;
}

export async function updateUser(
  id: number,
  payload: UserPayload
) {
  const response = await client.put(`/users/${id}`, payload);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await client.delete(`/users/${id}`);
  return response.data;
}
