/* ==========================================================
 | Order Status
 * ========================================================= */

export type OrderStatus =
  | "draft"
  | "pending"
  | "assigned"
  | "documents_pending"
  | "processing"
  | "verification"
  | "completed"
  | "cancelled";

/* ==========================================================
 | Order Priority
 * ========================================================= */

export type OrderPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

/* ==========================================================
 | Order Timeline
 * ========================================================= */

export interface OrderTimeline {

  id: number;

  title: string;

  description?: string;

  created_by: string;

  created_at: string;

}

/* ==========================================================
 | Assigned User
 * ========================================================= */

export interface AssignedUser {

  id: number;

  name: string;

  email: string;

}

/* ==========================================================
 | Order
 * ========================================================= */

export interface Order {

  id: number;

  order_no: string;

  company_id: number;

  service_name: string;

  customer_name: string;

  customer_email: string;

  customer_mobile: string;

  priority: OrderPriority;

  status: OrderStatus;

  amount: number;

  assigned_to?: AssignedUser;

  timeline?: OrderTimeline[];

  created_at: string;

  updated_at: string;

}

/* ==========================================================
 | Requests
 * ========================================================= */

export interface CreateOrderRequest {

  company_id: number;

  service_name: string;

  priority: OrderPriority;

}

export interface UpdateOrderRequest
  extends Partial<CreateOrderRequest> {

  status?: OrderStatus;

}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface OrderFilters {

  search?: string;

  status?: OrderStatus;

  priority?: OrderPriority;

  assigned_to?: number;

  page?: number;

  per_page?: number;

}

/* ==========================================================
 | Pagination
 * ========================================================= */

export interface PaginationMeta {

  current_page: number;

  last_page: number;

  per_page: number;

  total: number;

}

/* ==========================================================
 | API Responses
 * ========================================================= */

export interface OrderResponse {

  success: boolean;

  message: string;

  data: Order;

}

export interface OrderListResponse {

  success: boolean;

  message: string;

  data: Order[];

  meta: PaginationMeta;

}