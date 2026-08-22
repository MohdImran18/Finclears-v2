export interface OrderCompany {
  id: number;
  company_name: string;
}

export interface OrderAssignedUser {
  id: number;
  name: string;
  email?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  service_name: string;
  description?: string | null;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
}

export interface OrderTimeline {
  id: number;
  order_id: number;
  created_by?: number | null;
  title: string;
  description?: string | null;
  created_at: string;
  creator?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface OrderPayment {
  id: number;
  order_id: number;
  amount?: number | string;
  status?: string;
  payment_id?: string;
  transaction_id?: string;
  created_at?: string;
}

export interface Order {
  id: number;
  order_no: string;

  company_id?: number | null;

  service_name: string;

  customer_name?: string | null;
  customer_email?: string | null;
  customer_mobile?: string | null;

  priority: "low" | "medium" | "high" | "urgent";

  status:
    | "draft"
    | "pending"
    | "assigned"
    | "documents_pending"
    | "processing"
    | "verification"
    | "completed"
    | "cancelled";

  amount: number | string;

  assigned_to?: number | null;

  created_at: string;
  updated_at: string;

  company?: OrderCompany;

  assigned_user?: OrderAssignedUser;

  assignedUser?: OrderAssignedUser;

  items?: OrderItem[];

  timeline?: OrderTimeline[];

  payments?: OrderPayment[];
}

export interface OrderListResponse {
  success: boolean;
  message: string;

  data: Order[];

  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
