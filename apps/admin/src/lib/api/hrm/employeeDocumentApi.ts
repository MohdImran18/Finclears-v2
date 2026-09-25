import axios from "axios";

export interface EmployeeDocument {
  id: number;
  employee_profile_id: number;
  document_type: string;
  document_name: string;
  document_number: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  verification_status: "pending" | "verified" | "rejected";
  verified_at: string | null;
  verified_by: number | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;

  verifiedBy?: {
    id: number;
    name: string;
    email: string;
  };
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

export async function getEmployeeDocuments(
  employeeProfileId: number | string,
  verification_status?: "pending" | "verified" | "rejected"
) {
  const response = await client.get<
    ApiResponse<EmployeeDocument[]>
  >(`/employees/${employeeProfileId}/documents`, {
    params: verification_status
      ? { verification_status }
      : undefined,
  });

  return response.data;
}

export async function getEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string
) {
  const response = await client.get<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents/${id}`
  );

  return response.data;
}

export async function uploadEmployeeDocument(
  employeeProfileId: number | string,
  payload: {
    document_type: string;
    document_name: string;
    document_number?: string;
    issue_date?: string;
    expiry_date?: string;
    notes?: string;
    file: File;
  }
) {
  const formData = new FormData();

  formData.append("document_type", payload.document_type);
  formData.append("document_name", payload.document_name);
  formData.append(
    "document_number",
    payload.document_number || ""
  );
  formData.append("issue_date", payload.issue_date || "");
  formData.append("expiry_date", payload.expiry_date || "");
  formData.append("notes", payload.notes || "");
  formData.append("file", payload.file);

  const response = await client.post<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents`,
    formData
  );

  return response.data;
}

export async function updateEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string,
  payload: {
    document_type?: string;
    document_name?: string;
    document_number?: string | null;
    issue_date?: string | null;
    expiry_date?: string | null;
    notes?: string | null;
  }
) {
  const response = await client.put<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents/${id}`,
    payload
  );

  return response.data;
}

export async function replaceEmployeeDocumentFile(
  employeeProfileId: number | string,
  id: number | string,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await client.post<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents/${id}/file`,
    formData
  );

  return response.data;
}

export async function verifyEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string
) {
  const response = await client.post<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents/${id}/verify`
  );

  return response.data;
}

export async function rejectEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string,
  notes?: string
) {
  const response = await client.post<ApiResponse<EmployeeDocument>>(
    `/employees/${employeeProfileId}/documents/${id}/reject`,
    {
      notes: notes || "",
    }
  );

  return response.data;
}

export async function deleteEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string
) {
  const response = await client.delete<ApiResponse<null>>(
    `/employees/${employeeProfileId}/documents/${id}`
  );

  return response.data;
}

export async function downloadEmployeeDocument(
  employeeProfileId: number | string,
  id: number | string
) {
  const response = await client.get(
    `/employees/${employeeProfileId}/documents/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
}
export function getEmployeeDocumentDownloadUrl(
  employeeProfileId: number | string,
  id: number | string
) {
  return `${API_URL}/employees/${employeeProfileId}/documents/${id}/download`;
}

