export interface EmployeeUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
}

export interface EmployeeDepartment {
  id: number;
  name: string;
  code: string;
}

export interface EmployeeDesignation {
  id: number;
  name: string;
  code: string;
  department_id: number;
}

export interface EmployeeReportingManager {
  id: number;
  name: string;
  email: string;
}

export interface Employee {
  id: number;
  user_id: number;
  department_id?: number | null;
  designation_id?: number | null;
  employee_code: string;

  date_of_joining?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  employment_type?: string | null;
  work_location?: string | null;

  reporting_manager_id?: number | null;

  personal_email?: string | null;
  personal_phone?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;

  pan_number?: string | null;
  aadhaar_number?: string | null;
  bank_account_number?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  account_holder_name?: string | null;

  status: "active" | "inactive";
  notes?: string | null;

  created_at?: string;
  updated_at?: string;

  user?: EmployeeUser;
  department?: EmployeeDepartment | null;
  designation?: EmployeeDesignation | null;
  reporting_manager?: EmployeeReportingManager | null;
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Employee[];
    first_page_url?: string;
    from?: number | null;
    last_page: number;
    last_page_url?: string;
    per_page: number;
    to?: number | null;
    total: number;
  };
}

export interface EmployeePayload {
  name: string;
  email: string;
  phone?: string | null;
  login_method?: "password" | "whatsapp_otp";
  password: string;
  password_confirmation: string;

  department_id?: number | null;
  designation_id?: number | null;
  employee_code: string;

  date_of_joining?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  employment_type?: string | null;
  work_location?: string | null;
  reporting_manager_id?: number | null;

  personal_email?: string | null;
  personal_phone?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_relation?: string | null;

  pan_number?: string | null;
  aadhaar_number?: string | null;
  bank_account_number?: string | null;
  bank_name?: string | null;
  ifsc_code?: string | null;
  account_holder_name?: string | null;

  status?: "active" | "inactive";
  notes?: string | null;
}
