export interface Customer {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  alternate_phone?: string | null;
  company_name?: string | null;
  status: string;
  total_value?: string | number | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerPayload {
  name: string;
  email?: string;
  phone: string;
  alternate_phone?: string;
  company_name?: string;
  status?: string;
  total_value?: number;
  notes?: string;
}

export interface CustomerListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Customer[];
    total: number;
    per_page: number;
  };
}
