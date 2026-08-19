/* ==========================================================
 | Category
 * ========================================================== */

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

/* ==========================================================
 | Benefits
 * ========================================================== */

export interface ServiceBenefit {
  id: number;
  service_id?: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  status?: boolean;
}

/* ==========================================================
 | Process
 * ========================================================== */

export interface ServiceProcess {
  id: number;
  service_id?: number;
  step_number?: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  status?: boolean;
}

/* ==========================================================
 | Documents
 * ========================================================== */

export interface ServiceDocument {
  id: number;
  service_id?: number;
  document_name: string;
  description?: string | null;
  is_required?: boolean;
  sort_order?: number;
  status?: boolean;
}

/* ==========================================================
 | Pricing
 * ========================================================== */

export interface ServicePricing {
  id: number;
  service_id?: number;
  plan_name: string;
  price: string | number;
  original_price?: string | number | null;
  currency?: string | null;
  features?: string[] | Record<string, unknown> | null;
  is_popular?: boolean;
  is_recommended?: boolean;
  status?: boolean;
  sort_order?: number;
}

/* ==========================================================
 | FAQ
 * ========================================================== */

export interface ServiceFaq {
  id: number;
  service_id?: number;
  question: string;
  answer: string;
  sort_order?: number;
  status?: boolean;
}

/* ==========================================================
 | Service
 * ========================================================== */

export interface Service {
  id: number;

  // Basic Information
  name?: string;
  title: string;
  slug: string;
  code?: string | null;

  // Category
  category?: ServiceCategory | null;

  // Media
  icon?: string | null;
  image?: string | null;
  featured_image?: string | null;
  banner_image?: string | null;

  // Description
  short_description?: string | null;
  description?: string | null;

  // Pricing
  starting_price?: string | number | null;
  price_label?: string | null;

  // Processing
  processing_days?: number | null;
  processing_time?: string | null;

  // SEO
  seo_keywords?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;

  // Status
  is_featured: boolean;
  is_popular: boolean;
  status?: boolean;
  sort_order?: number;

  // Analytics
  views?: number;
  orders?: number;

  // Relations
  benefits?: ServiceBenefit[];
  processes?: ServiceProcess[];
  documents?: ServiceDocument[];
  pricing?: ServicePricing[];
  faqs?: ServiceFaq[];

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

/* ==========================================================
 | API Responses
 * ========================================================== */

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: {
    service: Service;
  };
  meta?: Record<string, unknown>;
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: {
    services: Service[];
  };
  meta?: Record<string, unknown>;
}

/* ==========================================================
 | Filters
 * ========================================================== */

export interface ServiceFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  popular?: boolean;
  page?: number;
  per_page?: number;
}
