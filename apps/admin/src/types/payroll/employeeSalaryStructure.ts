export type SalaryStructureStatus =
  | "draft"
  | "active"
  | "inactive";

export interface SalaryStructureComponent {
  id: number;
  name: string;
  code: string;
  description?: string | null;

  type: "earning" | "deduction" | "reimbursement";
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
}

export interface EmployeeSalaryStructureItem {
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

  salaryComponent?: SalaryStructureComponent;
}

export interface EmployeeSalaryStructureEmployee {
  id: number;
  user_id: number;
  employee_code: string;

  user?: {
    id: number;
    name: string;
    email: string;
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

  status: SalaryStructureStatus;
  is_current: boolean;

  notes: string | null;

  created_at: string;
  updated_at: string;

  employeeProfile?: EmployeeSalaryStructureEmployee;

  items: EmployeeSalaryStructureItem[];
}

export interface EmployeeSalaryStructureItemPayload {
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

  status: SalaryStructureStatus;
  is_current?: boolean;

  notes?: string | null;

  items?: EmployeeSalaryStructureItemPayload[];
}

export interface EmployeeSalaryStructureListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: EmployeeSalaryStructure[];

    first_page_url?: string;
    from?: number | null;

    last_page: number;
    last_page_url?: string;

    per_page: number;
    to?: number | null;

    total: number;
  };
}

export interface EmployeeSalaryStructureResponse {
  success: boolean;
  message: string;
  data: {
    salary_structure: EmployeeSalaryStructure;
  };
}