/* ==========================================================
 | Category
 * ========================================================= */

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

/* ==========================================================
 | Benefits
 * ========================================================= */

export interface ServiceBenefit {
  id: number;
  title: string;
  description: string;
}

/* ==========================================================
 | Process
 * ========================================================= */

export interface ServiceProcess {
  id: number;
  title: string;
  description: string;
  sort_order?: number;
}

/* ==========================================================
 | Documents
 * ========================================================= */

export interface ServiceDocument {
  id: number;
  title: string;
  description?: string;
}

/* ==========================================================
 | Pricing
 * ========================================================= */

export interface ServicePricing {
  id: number;
  title: string;
  price: number;
  description?: string;
}

/* ==========================================================
 | FAQ
 * ========================================================= */

export interface ServiceFaq {
  id: number;
  question: string;
  answer: string;
}

/* ==========================================================
 | Service
 * ========================================================= */

export interface Service {
  id: number;

  category?: ServiceCategory;

  title: string;

  slug: string;

  code?: string;

  icon?: string;

  featured_image?: string | null;

  banner_image?: string | null;

  short_description: string;

  description: string;

  starting_price: number;

  price_label?: string;

  processing_days?: number;

  processing_time?: string;

  meta_title?: string;

  meta_description?: string;

  meta_keywords?: string;

  seo_title?: string;

  seo_description?: string;

  is_featured: boolean;

  is_popular: boolean;

  status?: boolean;

  sort_order?: number;

  views?: number;

  orders?: number;

  benefits?: ServiceBenefit[];

  processes?: ServiceProcess[];

  documents?: ServiceDocument[];

  pricing?: ServicePricing[];

  faqs?: ServiceFaq[];

  created_at?: string;

  updated_at?: string;
}

/* ==========================================================
 | API Responses
 * ========================================================= */

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

export interface ServiceListResponse {
  success: boolean;
  message: string;
  data: Service[];
}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface ServiceFilters {
  search?: string;
  category?: string;
  featured?: boolean;
  popular?: boolean;
  page?: number;
  per_page?: number;
}