export interface ServiceCategory {
  id: number;
  name: string;
  slug?: string;
}

export interface ServiceBenefit {
  id: number;
  service_id: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
  status: boolean;
}

export interface ServiceDocument {
  id: number;
  service_id: number;
  document_name: string;
  description?: string | null;
  is_required: boolean;
  sort_order: number;
  status: boolean;
}

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

export interface ServiceProcess {
  id: number;
  service_id: number;
  step_number: number;
  title: string;
  description: string;
  icon?: string | null;
  sort_order: number;
  status: boolean;
}

export interface ServiceFaq {
  id: number;
  service_id: number;
  question: string;
  answer: string;
  sort_order: number;
  status: boolean;
}

export interface Service {
  id: number;
  service_category_id: number;
  title: string;
  slug: string;
  code?: string | null;
  icon?: string | null;
  featured_image?: string | null;
  banner_image?: string | null;
  short_description: string;
  description: string;
  starting_price?: number | null;
  price_label?: string | null;
  processing_days?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  is_featured: boolean;
  is_popular: boolean;
  status: boolean;
  sort_order: number;

  category?: ServiceCategory | null;
  benefits?: ServiceBenefit[];
  documents?: ServiceDocument[];
  pricing?: ServicePricing[];
  processes?: ServiceProcess[];
  faqs?: ServiceFaq[];

  created_at?: string;
  updated_at?: string;
}

export interface ServicePayload {
  service_category_id: number;
  title: string;
  slug: string;
  code?: string | null;
  icon?: string | null;
  featured_image?: string | null;
  banner_image?: string | null;
  short_description: string;
  description: string;
  starting_price?: number | null;
  price_label?: string | null;
  processing_days?: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  is_featured?: boolean;
  is_popular?: boolean;
  status?: boolean;
  sort_order?: number;
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: {
    services: Service[];
  };
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: {
    service: Service;
  };
}