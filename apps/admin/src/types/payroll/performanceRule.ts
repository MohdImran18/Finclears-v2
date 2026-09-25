export type PerformanceRuleIncentiveType =
  | "fixed"
  | "percentage"
  | "slab";

export type PerformanceRuleDeductionType =
  | "fixed"
  | "percentage"
  | "slab";

export interface PerformanceRuleEmployee {
  id: number;
  employee_code: string;
  user_id: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface PerformanceRule {
  id: number;
  employee_profile_id: number;

  name: string;
  code: string;

  metric_type: string;
  period_type: string;

  target_value: string | number;
  minimum_target: string | number | null;
  maximum_target: string | number | null;

  minimum_achievement_percentage: string | number | null;
  maximum_achievement_percentage: string | number | null;

  incentive_type: PerformanceRuleIncentiveType | null;
  incentive_value: string | number | null;
  incentive_slabs: unknown[] | null;

  deduction_type: PerformanceRuleDeductionType | null;
  deduction_value: string | number | null;
  deduction_slabs: unknown[] | null;

  loss_deduction_enabled: boolean;
  loss_deduction_type: string | null;
  loss_deduction_value: string | number | null;

  attendance_deduction_enabled: boolean;
  attendance_deduction_type: string | null;
  attendance_deduction_value: string | number | null;

  minimum_incentive: string | number | null;
  maximum_incentive: string | number | null;

  minimum_deduction: string | number | null;
  maximum_deduction: string | number | null;

  effective_from: string | null;
  effective_to: string | null;

  is_active: boolean;
  notes: string | null;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  employee_profile?: PerformanceRuleEmployee;
}

export interface PerformanceRuleListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: PerformanceRule[];
    first_page_url?: string;
    from?: number | null;
    last_page: number;
    last_page_url?: string;
    links?: unknown[];
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number | null;
    total: number;
  };
}

export interface PerformanceRuleResponse {
  success: boolean;
  message: string;
  data: {
    performance_rule: PerformanceRule;
  };
}

export interface PerformanceRulePayload {
  employee_profile_id: number;

  name: string;
  code: string;

  metric_type: string;
  period_type: string;

  target_value?: number | null;
  minimum_target?: number | null;
  maximum_target?: number | null;

  minimum_achievement_percentage?: number | null;
  maximum_achievement_percentage?: number | null;

  incentive_type?: PerformanceRuleIncentiveType | null;
  incentive_value?: number | null;
  incentive_slabs?: unknown[] | null;

  deduction_type?: PerformanceRuleDeductionType | null;
  deduction_value?: number | null;
  deduction_slabs?: unknown[] | null;

  loss_deduction_enabled?: boolean;
  loss_deduction_type?: string | null;
  loss_deduction_value?: number | null;

  attendance_deduction_enabled?: boolean;
  attendance_deduction_type?: string | null;
  attendance_deduction_value?: number | null;

  minimum_incentive?: number | null;
  maximum_incentive?: number | null;

  minimum_deduction?: number | null;
  maximum_deduction?: number | null;

  effective_from?: string | null;
  effective_to?: string | null;

  is_active?: boolean;
  notes?: string | null;
}
