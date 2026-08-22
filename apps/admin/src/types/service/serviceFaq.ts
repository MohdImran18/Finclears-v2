export interface ServiceFaq {
  id: number;
  service_id: number;
  question: string;
  answer: string;
  sort_order: number;
  status: boolean;
}

export interface ServiceFaqPayload {
  question: string;
  answer: string;
  sort_order?: number;
  status?: boolean;
}
