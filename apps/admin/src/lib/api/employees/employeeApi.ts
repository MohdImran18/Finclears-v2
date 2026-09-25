import axios from "axios";
import type {
  Employee,
  EmployeeListResponse,
  EmployeePayload,
} from "@/types/employee/employee";

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

export async function getEmployees(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  department_id?: number;
  designation_id?: number;
  status?: string;
}) {
  const response = await client.get<EmployeeListResponse>("/employees", {
    params,
  });

  return response.data;
}

export async function getEmployee(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      employee: Employee;
    };
  }>(`/employees/${id}`);

  return response.data;
}

export async function createEmployee(payload: EmployeePayload) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: {
      employee: Employee;
    };
  }>("/employees", payload);

  return response.data;
}

export async function updateEmployee(
  id: number | string,
  payload: Partial<EmployeePayload>
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: {
      employee: Employee;
    };
  }>(`/employees/${id}`, payload);

  return response.data;
}

export async function deleteEmployee(id: number | string) {
  const response = await client.delete<{
    success: boolean;
    message: string;
  }>(`/employees/${id}`);

  return response.data;
}
