export interface ServiceBenefit {
  id: number;
  service_id: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
  status: boolean;
}

export interface ServiceBenefitPayload {
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
  status: boolean;
}