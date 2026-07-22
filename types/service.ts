export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceBenefit {
  id: number;
  title: string;
  description: string;
}

export interface ServiceProcess {
  id: number;
  title: string;
  description: string;
  sort_order?: number;
}

export interface ServiceDocument {
  id: number;
  title: string;
  description?: string;
}

export interface ServicePricing {
  id: number;
  title: string;
  price: number | string;
  description?: string;
}

export interface ServiceFaq {
  id: number;
  question: string;
  answer: string;
}

export interface Service {
  id: number;

  category: ServiceCategory;

  title: string;
  slug: string;
  code?: string;

  icon?: string;

  featured_image?: string | null;
  banner_image?: string | null;

  short_description: string;
  description: string;

  starting_price: number | string;
  price_label?: string;

  processing_days?: number;

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



