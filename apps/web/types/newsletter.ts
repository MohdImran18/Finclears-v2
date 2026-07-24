export interface NewsletterInput {
  email: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: boolean;
  created_at: string;
}