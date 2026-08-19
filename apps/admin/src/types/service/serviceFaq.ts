export interface ServiceFaq {
  id: number;
  service_id: number;
  question: string;
  answer: string;
  sort_order: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFaqPayload {
  question: string;
  answer: string;
  sort_order: number;
  status: boolean;
}

export interface ServiceFaqResponse {
  success: boolean;
  message: string;
  data: {
    faq: ServiceFaq;
  };
}

export interface ServiceFaqListResponse {
  success: boolean;
  message: string;
  data: {
    faqs: ServiceFaq[];
  };
}