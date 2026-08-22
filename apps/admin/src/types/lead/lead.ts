export interface LeadSource {
  id: number;
  name: string;
  slug: string;
  status?: boolean | number;
}

export interface LeadService {
  id: number;
  title: string;
}

export interface AssignedUser {
  id: number;
  name: string;
  email: string;
}

export interface Lead {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  alternate_phone?: string | null;
  company_name?: string | null;
  service_id?: number | null;
  source_id?: number | null;
  status: string;
  priority: string;
  assigned_to?: number | null;
  estimated_value?: number | string | null;
  notes?: string | null;
  next_follow_up_at?: string | null;
  converted_at?: string | null;
  lost_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  service?: LeadService | null;
  source?: LeadSource | null;
  assignedUser?: AssignedUser | null;
}

export interface LeadPayload {
  name: string;
  email?: string;
  phone: string;
  alternate_phone?: string;
  company_name?: string;
  service_id?: number | null;
  source_id?: number | null;
  assigned_to?: number | null;
  status?: string;
  priority?: string;
  estimated_value?: number | null;
  notes?: string;
  next_follow_up_at?: string;
}

export interface LeadListResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Lead[];
    total: number;
    per_page: number;
    last_page: number;
  };
}





