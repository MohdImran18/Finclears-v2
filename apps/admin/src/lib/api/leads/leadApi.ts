import axios from "axios";
import type {
  Lead,
  LeadListResponse,
  LeadPayload,
} from "@/types/lead/lead";

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

export async function getLeads(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  priority?: string;
  assigned_to?: number;
}) {
  const response = await client.get<LeadListResponse>("/leads", {
    params,
  });

  return response.data;
}

export async function getLead(id: number) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: { lead: Lead };
  }>(`/leads/${id}`);

  return response.data;
}

export async function createLead(payload: LeadPayload) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: { lead: Lead };
  }>("/leads", payload);

  return response.data;
}

export async function updateLead(
  id: number,
  payload: Partial<LeadPayload>
) {
  const response = await client.put<{
    success: boolean;
    message: string;
    data: { lead: Lead };
  }>(`/leads/${id}`, payload);

  return response.data;
}

export async function deleteLead(id: number) {
  const response = await client.delete(`/leads/${id}`);

  return response.data;
}

export interface LeadAssignee {
  id: number;
  uuid?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  role?: string | null;
  status?: string | null;
}

export async function getLeadAssignees() {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      data?: LeadAssignee[];
      users?: LeadAssignee[];
    };
  }>("/users", {
    params: {
      role: "employee",
      status: "active",
      per_page: 100,
    },
  });

  return response.data;
}

export async function getLeadPool(params?: {
  page?: number;
  per_page?: number;
  status?: string;
  priority?: string;
}) {
  const response = await client.get<LeadListResponse>("/lead-pool", {
    params,
  });

  return response.data;
}

export async function assignLead(
  id: number,
  payload: {
    assigned_to: number;
    reason: string;
    assignment_type?: "manual" | "manager_reassign" | "escalation";
  }
) {
  const response = await client.post<{
    success: boolean;
    message: string;
    data: {
      lead: Lead;
    };
  }>(`/leads/${id}/assign`, payload);

  return response.data;
}


export async function getLeadTimeline(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      lead_id: number;
      timeline: Array<{
        id: number;
        category: string;
        type: string;
        subject: string | null;
        description: string | null;
        occurred_at: string | null;
        user?: {
          id: number;
          name: string;
          email?: string | null;
        } | null;
        status?: string | null;
        outcome?: string | null;
        next_action?: string | null;
        duration_seconds?: number | null;
        started_at?: string | null;
        ended_at?: string | null;
        follow_up_at?: string | null;
        completed_at?: string | null;
        from_user?: {
          id: number;
          name: string;
          email?: string | null;
        } | null;
        to_user?: {
          id: number;
          name: string;
          email?: string | null;
        } | null;
        changed_by?: {
          id: number;
          name: string;
          email?: string | null;
        } | null;
        reason?: string | null;
      }>;
    };
  }>(`/leads/${id}/timeline`);

  return response.data;
}

export async function getLeadComments(id: number | string) {
  const response = await client.get<{
    success: boolean;
    message: string;
    data: {
      comments: Array<{
        id: number;
        comment: string;
        created_at: string;
        user?: {
          id: number;
          name: string;
          email?: string | null;
        } | null;
      }>;
    };
  }>(`/leads/${id}/comments`);

  return response.data;
}

export async function addLeadComment(
  id: number | string,
  comment: string
) {
  const response = await client.post(
    `/leads/${id}/comments`,
    { comment }
  );

  return response.data;
}

export async function getLeadCalls(id: number | string) {
  const response = await client.get(
    `/leads/${id}/calls`
  );

  return response.data;
}

export async function addLeadCall(
  id: number | string,
  payload: {
    call_type: "incoming" | "outgoing" | "missed" | "callback" | "whatsapp" | "other";
    started_at: string;
    ended_at?: string | null;
    duration_seconds?: number;
    outcome?: string | null;
    discussion: string;
    next_action?: string | null;
    follow_up_at?: string | null;
  }
) {
  const response = await client.post(
    `/leads/${id}/calls`,
    payload
  );

  return response.data;
}

export async function getLeadFollowups(id: number | string) {
  const response = await client.get(
    `/leads/${id}/followups`
  );

  return response.data;
}

export async function addLeadFollowup(
  id: number | string,
  payload: {
    follow_up_at: string;
    type: "call" | "email" | "whatsapp" | "meeting" | "reminder" | "other";
    subject: string;
    notes?: string | null;
    status?: "pending" | "completed" | "cancelled";
  }
) {
  const response = await client.post(
    `/leads/${id}/followups`,
    payload
  );

  return response.data;
}

export async function updateLeadFollowup(
  id: number | string,
  followupId: number | string,
  payload: {
    follow_up_at?: string;
    type?: "call" | "email" | "whatsapp" | "meeting" | "reminder" | "other";
    subject?: string;
    notes?: string | null;
    status?: "pending" | "completed" | "cancelled";
    completed_at?: string | null;
  }
) {
  const response = await client.put(
    `/leads/${id}/followups/${followupId}`,
    payload
  );

  return response.data;
}

export async function getLeadAssignmentHistory(id: number | string) {
  const response = await client.get(
    `/leads/${id}/assignment-history`
  );

  return response.data;
}
