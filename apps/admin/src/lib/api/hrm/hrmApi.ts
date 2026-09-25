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