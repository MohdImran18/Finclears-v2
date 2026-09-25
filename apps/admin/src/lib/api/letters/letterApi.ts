import axios from "axios";

export interface LetterTemplateField {
  id: number;
  letter_template_id: number;
  field_key: string;
  label: string;
  field_type: string;
  is_required: boolean;
  sort_order?: number;
}

export interface LetterTemplate {
  id: number;
  name: string;
  code: string;
  letter_type: string;
  subject?: string | null;
  content: string;
  language?: string;
  is_active: boolean;
  is_default: boolean;
  version: number;
  fields?: LetterTemplateField[];
}

export interface EmployeeLetter {
  id: number;
  employee_profile_id: number;
  letter_template_id: number;
  letter_type: string;
  letter_number?: string | null;
  title: string;
  letter_date?: string | null;
  effective_date?: string | null;
  status: string;
  rendered_content?: string | null;
  field_values?: Record<string, any>;
  pdf_path?: string | null;
  generated_at?: string | null;
  generated_by?: number | null;
  approved_by?: number | null;
  approved_at?: string | null;
  notes?: string | null;
  employeeProfile?: any;
  template?: LetterTemplate;
}

export interface LetterListResponse {
  success: boolean;
  message: string;
  data: {
    data: EmployeeLetter[];
    current_page?: number;
    last_page?: number;
    total?: number;
  };
}

export interface LetterResponse {
  success: boolean;
  message: string;
  data: {
    letter: EmployeeLetter;
    rendered_content?: string;
    version?: number;
    pdf_path?: string | null;
    pdf_url?: string | null;
  };
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

export async function getLetters(params?: Record<string, any>) {
  const response = await client.get<LetterListResponse>("/letters", {
    params,
  });

  return response.data;
}

export async function getLetter(id: number | string) {
  const response = await client.get<LetterResponse>(`/letters/${id}`);

  return response.data;
}

export async function getLetterTemplates() {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: LetterTemplate[];
  }>("/letters/templates");

  return response.data;
}

export async function getLetterTemplate(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: LetterTemplate;
  }>(`/letters/templates/${id}`);

  return response.data;
}

export async function getEmployeeLetters(
  employeeProfileId: number | string
) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      employee: any;
      letters: EmployeeLetter[];
    };
  }>(`/letters/employees/${employeeProfileId}`);

  return response.data;
}

export async function getEmployeeLetterFields(
  employeeProfileId: number | string
) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: Record<string, any>;
  }>(`/letters/employees/${employeeProfileId}/fields`);

  return response.data;
}

export async function createLetter(payload: Record<string, any>) {
  const response = await client.post<LetterResponse>(
    "/letters",
    payload
  );

  return response.data;
}

export async function updateLetter(
  id: number | string,
  payload: Record<string, any>
) {
  const response = await client.put<LetterResponse>(
    `/letters/${id}`,
    payload
  );

  return response.data;
}

export async function generateLetter(id: number | string, payload?: {
  field_values?: Record<string, any>;
  change_notes?: string;
}) {
  const response = await client.post<LetterResponse>(
    `/letters/${id}/generate`,
    payload || {}
  );

  return response.data;
}

export async function regenerateLetter(
  id: number | string,
  payload?: {
    field_values?: Record<string, any>;
    change_notes?: string;
    force?: boolean;
  }
) {
  const response = await client.post<LetterResponse>(
    `/letters/${id}/regenerate`,
    payload || {}
  );

  return response.data;
}

export async function approveLetter(id: number | string) {
  const response = await client.post<LetterResponse>(
    `/letters/${id}/approve`
  );

  return response.data;
}

export async function getLetterVersions(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      letter_id: number;
      versions: any[];
    };
  }>(`/letters/${id}/versions`);

  return response.data;
}

export async function getLetterVersion(
  id: number | string,
  version: number
) {
  const response = await client.get<LetterResponse>(
    `/letters/${id}/versions/${version}`
  );

  return response.data;
}

export async function downloadLetter(id: number | string) {
  const response = await client.get(
    `/letters/${id}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
}

export async function downloadLetterVersion(
  id: number | string,
  version: number
) {
  const response = await client.get(
    `/letters/${id}/versions/${version}/download`,
    {
      responseType: "blob",
    }
  );

  return response;
}
export async function previewLetter(id: number | string) {
  const response = await client.get(
    `/letters/${id}/preview`,
    {
      responseType: "blob",
    }
  );

  return response;
}
