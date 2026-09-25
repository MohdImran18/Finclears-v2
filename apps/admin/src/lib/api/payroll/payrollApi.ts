import axios from "axios";





export interface PayrollRunItem {
  id: number;
  payroll_run_id: number;
  salary_component_id: number;
  employee_salary_structure_item_id: number | null;
  component_name: string;
  component_code: string;
  type: "earning" | "deduction" | "reimbursement";
  calculation_type: string;
  calculation_basis: string | null;
  configured_amount: string;
  configured_percentage: string | null;
  calculated_amount: string;
  target_value: string | null;
  achievement_value: string | null;
  achievement_percentage: string | null;
  working_days: string | null;
  present_days: string | null;
  leave_days: string | null;
  lop_days: string | null;
  calculation_data: unknown;
  is_variable: boolean;
  is_taxable: boolean;
  is_statutory: boolean;
  is_reimbursement: boolean;
  display_order: number;
  notes: string | null;
}

export interface PayrollRun {
  id: number;
  employee_profile_id: number;
  employee_salary_structure_id: number | null;

  payroll_year: number;
  payroll_month: number;

  period_start: string;
  period_end: string;

  basic_salary: string;
  fixed_earnings: string;
  variable_earnings: string;

  performance_incentive: string;
  performance_deduction: string;

  reimbursement_amount: string;
  pending_payment_amount: string;
  other_payment_amount: string;

  gross_pay: string;

  loss_deduction: string;
  attendance_deduction: string;
  statutory_deduction: string;
  other_deduction: string;
  total_deductions: string;

  net_payable: string;

  working_days: string;
  present_days: string;
  leave_days: string;
  lop_days: string;

  target_value: string;
  achievement_value: string;
  achievement_percentage: string;

  status: "draft" | "calculated" | "approved" | "paid";

  calculated_at: string | null;
  approved_at: string | null;
  paid_at: string | null;

  approved_by: number | null;
  payment_reference: string | null;
  notes: string | null;

  created_at: string;
  updated_at: string;

  items?: PayrollRunItem[];

  employeeProfile?: {
    id: number;
    employee_code: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };

  salaryStructure?: unknown;
  approver?: {
    id: number;
    name: string;
  } | null;
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

export interface PayrollPagination {
  current_page: number;
  data: PayrollRun[];
  first_page_url?: string;
  from?: number;
  last_page: number;
  last_page_url?: string;
  links?: unknown[];
  next_page_url?: string | null;
  path?: string;
  per_page: number;
  prev_page_url?: string | null;
  to?: number;
  total: number;
}

export async function getPayrollRuns(params?: {
  employee_profile_id?: number;
  year?: number;
  month?: number;
  status?: string;
}) {
  const response = await client.get<ApiResponse<PayrollPagination>>(
    "/payroll",
    { params }
  );

  return response.data;
}

export async function getPayrollRun(id: number | string) {
  const response = await client.get<ApiResponse<PayrollRun>>(
    `/payroll/${id}`
  );

  return response.data;
}

export async function generatePayroll(payload: {
  employee_profile_id: number;
  year: number;
  month: number;
}) {
  const response = await client.post<ApiResponse<PayrollRun>>(
    "/payroll/generate",
    payload
  );

  return response.data;
}

export async function approvePayroll(id: number | string) {
  const response = await client.post<ApiResponse<PayrollRun>>(
    `/payroll/${id}/approve`
  );

  return response.data;
}

export async function payPayroll(
  id: number | string,
  payment_reference: string
) {
  const response = await client.post<ApiResponse<PayrollRun>>(
    `/payroll/${id}/pay`,
    { payment_reference }
  );

  return response.data;
}
