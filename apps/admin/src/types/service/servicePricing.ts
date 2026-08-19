export interface ServicePricing {
  id: number;
  service_id: number;
  plan_name: string;
  price: number;
  original_price?: number | null;
  currency: string;
  features?: string[] | null;
  is_popular: boolean;
  is_recommended: boolean;
  status: boolean;
  sort_order: number;
}

export interface ServicePricingPayload {
  plan_name: string;
  price: number;
  original_price: number | null;
  currency: string;
  features: string[];
  is_popular: boolean;
  is_recommended: boolean;
  status: boolean;
  sort_order: number;
}