export type LeaveStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface LeaveType {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  annual_quota: string;
  is_paid: boolean;
  requires_approval: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeLeaveBalance {
  id: number;
  employee_profile_id: number;
  leave_type_id: number;
  year: number;
  opening_balance: string;
  allocated: string;
  used: string;
  pending: string;
  adjusted: string;
  available_balance?: number;
  created_at: string;
  updated_at: string;

  employee_profile?: {
    id: number;
    employee_code: string;
    user_id?: number;
  } | null;

  leave_type?: {
    id: number;
    name: string;
    code: string;
    annual_quota: string;
    is_paid: boolean;
  } | null;
}

export interface CreateLeaveApplicationPayload {
  employee_profile_id: number;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  reason?: string | null;
}

export interface LeaveApplication {
  id: number;
  employee_profile_id: number;
  leave_type_id: number;
  from_date: string;
  to_date: string;
  total_days: string;
  reason: string | null;
  status: LeaveStatus;
  approved_by: number | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;

  employee_profile?: {
    id: number;
    employee_code: string;
    user_id?: number;
    user?: {
      name?: string;
      email?: string;
    } | null;
  } | null;

  leave_type?: {
    id: number;
    name: string;
    code: string;
    is_paid: boolean;
    requires_approval: boolean;
  } | null;

  approver?: {
    id: number;
    name: string;
  } | null;
}