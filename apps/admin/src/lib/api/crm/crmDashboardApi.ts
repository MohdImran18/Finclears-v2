import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api/v1";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export interface CrmDashboardSummary {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  converted_leads: number;
  lost_leads: number;
  unassigned_leads: number;
  active_ownership: number;
  expired_ownership: number;
  expiring_soon: number;
  pipeline_value: number;
  converted_value: number;
  conversion_rate: number;
}

export interface CrmDashboardData {
  summary: CrmDashboardSummary;

  status_breakdown: Record<string, number>;

  priority_breakdown: Record<string, number>;

  leads_by_owner: Array<{
    assigned_to: number | null;
    name: string | null;
    total: number;
  }>;

  leads_by_source: Array<{
    source_id: number | null;
    name: string | null;
    total: number;
  }>;

  leads_by_service: Array<{
    service_id: number | null;
    title: string | null;
    total: number;
  }>;

  upcoming_followups: unknown[];

  recent_activity: Array<{
    id: number;
    lead_id: number;
    user_id: number | null;
    type: string;
    subject: string | null;
    description: string | null;
    activity_at: string | null;
    lead?: {
      id: number;
      name: string;
    } | null;
    user?: {
      id: number;
      name: string;
    } | null;
  }>;
}

export async function getCrmDashboard() {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: CrmDashboardData;
  }>("/crm/dashboard");

  return response.data;
}