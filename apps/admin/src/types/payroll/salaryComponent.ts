export type SalaryComponentType =
  | "earning"
  | "deduction";

export type SalaryCalculationType =
  | "fixed"
  | "percentage"
  | "formula"
  | "rule_based";

export interface SalaryComponent {
  id: number;
  name: string;
  code: string;
  description: string | null;

  type: SalaryComponentType;
  calculation_type: SalaryCalculationType;
  calculation_basis: string | null;

  default_value: string | number | null;
  default_percentage: string | number | null;

  minimum_amount: string | number | null;
  maximum_amount: string | number | null;

  is_variable: boolean;
  is_taxable: boolean;
  is_statutory: boolean;
  is_reimbursement: boolean;
  is_active: boolean;

  display_order: number;

  created_at: string;
  updated_at: string;
}

export interface SalaryComponentListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: SalaryComponent[];
    first_page_url?: string;
    from?: number | null;
    last_page: number;
    last_page_url?: string;
    per_page: number;
    to?: number | null;
    total: number;
  };
}

export interface SalaryComponentResponse {
  success: boolean;
  message: string;
  data: {
    salary_component: SalaryComponent;
  };
}

export interface SalaryComponentPayload {
  name: string;
  code: string;
  description?: string | null;

  type: SalaryComponentType;
  calculation_type: SalaryCalculationType;
  calculation_basis?: string | null;

  default_value?: number | null;
  default_percentage?: number | null;

  minimum_amount?: number | null;
  maximum_amount?: number | null;

  is_variable?: boolean;
  is_taxable?: boolean;
  is_statutory?: boolean;
  is_reimbursement?: boolean;
  is_active?: boolean;

  display_order?: number;
}
