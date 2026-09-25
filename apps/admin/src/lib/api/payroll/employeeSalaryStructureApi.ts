import axios from "axios";

export interface SalaryStructureItem {
  id?: number;
  employee_salary_structure_id?: number;
  salary_component_id: number;

  calculation_type: string;
  calculation_basis?: string | null;

  amount?: string | number | null;
  percentage?: string | number | null;

  formula?: string | null;
  rule_config?: Record<string, unknown> | null;

  minimum_amount?: string | number | null;
  maximum_amount?: string | number | null;

  is_variable?: boolean;
  is_taxable?: boolean;
  is_statutory?: boolean;
  is_reimbursement?: boolean;
  is_enabled?: boolean;

  display_order?: number;
  notes?: string | null;

  salaryComponent?: {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    type: string;
    calculation_type: string;
    calculation_basis?: string | null;
    default_value?: string | null;
    default_percentage?: string | null;
    minimum_amount?: string | null;
    maximum_amount?: string | null;
    is_variable: boolean;
    is_taxable: boolean;
    is_statutory: boolean;
    is_reimbursement: boolean;
    is_active: boolean;
    display_order: number;
  };
}

export interface EmployeeSalaryStructure {
  id: number;
  employee_profile_id: number;

  structure_name: string;
  salary_type: string;
  pay_frequency: string;
  currency: string;

  effective_from: string;
  effective_to: string | null;

  basic_salary: string;
  gross_salary: string;
  monthly_ctc: string;
  annual_ctc: string;

  monthly_variable_target: string | null;
  annual_variable_target: string | null;

  status: "draft" | "active" | "inactive";
  is_current: boolean;

  notes: string | null;

  created_at: string;
  updated_at: string;

  items: SalaryStructureItem[];

  employeeProfile?: {
    id: number;
    user_id: number;
    employee_code: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };

  // Laravel Eloquent relationship serialization
  employee_profile?: {
    id: number;
    user_id: number;
    employee_code: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface EmployeeSalaryStructurePayload {
  employee_profile_id: number;

  structure_name: string;
  salary_type: string;
  pay_frequency: string;
  currency: string;

  effective_from: string;
  effective_to?: string | null;

  basic_salary: number;
  gross_salary: number;
  monthly_ctc: number;
  annual_ctc: number;

  monthly_variable_target?: number | null;
  annual_variable_target?: number | null;

  status: "draft" | "active" | "inactive";
  is_current?: boolean;

  notes?: string | null;

  items?: Array<{
    salary_component_id: number;
    calculation_type: string;
    calculation_basis?: string | null;
    amount?: number | null;
    percentage?: number | null;
    formula?: string | null;
    rule_config?: Record<string, unknown> | null;
    minimum_amount?: number | null;
    maximum_amount?: number | null;
    is_variable?: boolean;
    is_taxable?: boolean;
    is_statutory?: boolean;
    is_reimbursement?: boolean;
    is_enabled?: boolean;
    display_order?: number;
    notes?: string | null;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface Pagination<T> {
  current_page: number;
  data: T[];
  first_page_url?: string;
  from?: number | null;
  last_page: number;
  last_page_url?: string;
  per_page: number;
  to?: number | null;
  total: number;
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

export async function getEmployeeSalaryStructures(params?: {
  employee_profile_id?: number;
  status?: string;
  is_current?: boolean;
  page?: number;
  per_page?: number;
}) {
  const response = await client.get<
    ApiResponse<Pagination<EmployeeSalaryStructure>>
  >("/employee-salary-structures", {
    params,
  });

  const result = response.data;

  result.data.data = result.data.data.map((structure) => ({
    ...structure,
    employeeProfile:
      structure.employeeProfile ??
      structure.employee_profile,
  }));

  return result;
}

export async function getEmployeeSalaryStructure(
  id: number | string
) {
  const response = await client.get<
    ApiResponse<{
      salary_structure: EmployeeSalaryStructure;
    }>
  >(`/employee-salary-structures/${id}`);

  return response.data;
}

export async function createEmployeeSalaryStructure(
  payload: EmployeeSalaryStructurePayload
) {
  const response = await client.post<
    ApiResponse<{
      salary_structure: EmployeeSalaryStructure;
    }>
  >("/employee-salary-structures", payload);

  return response.data;
}

export async function updateEmployeeSalaryStructure(
  id: number | string,
  payload: Partial<EmployeeSalaryStructurePayload>
) {
  const response = await client.put<
    ApiResponse<{
      salary_structure: EmployeeSalaryStructure;
    }>
  >(`/employee-salary-structures/${id}`, payload);

  return response.data;
}

export async function deleteEmployeeSalaryStructure(
  id: number | string
) {
  const response = await client.delete<
    ApiResponse<null>
  >(`/employee-salary-structures/${id}`);

  return response.data;
}

export async function setCurrentEmployeeSalaryStructure(
  id: number | string
) {
  const response = await client.patch<
    ApiResponse<{
      salary_structure: EmployeeSalaryStructure;
    }>
  >(`/employee-salary-structures/${id}/current`);

  return response.data;
}