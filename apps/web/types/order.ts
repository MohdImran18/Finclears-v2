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

export type OrderPriority = "low" | "medium" | "high" | "urgent";

/* ==========================================================
 | Order Timeline
 * ========================================================= */

export interface TimelineCreator {
        id: number;
        name: string;
        email: string;
}

export interface OrderTimeline {
        id: number;
        title: string;
        description?: string;
        created_by: number;
        created_at: string;
        creator?: TimelineCreator;
}

/* ==========================================================
 | Order Payment
 * ========================================================= */

export interface OrderPayment {
        id: number;
        company_id: number;
        order_id?: number;
        amount: number;
        currency: string;
        payment_status: string;
        payment_gateway: string;
        gateway_order_id?: string;
        gateway_transaction_id?: string;
        paid_at?: string;
        created_at: string;
        updated_at: string;

        gateway_response?: {
                order_id?: string;
                payments?: Array<{
                        payment_status?: string;
                        payment_message?: string;
                        error_details?: {
                                error_code?: string;
                                error_description?: string;
                                error_reason?: string;
                        } | null;
                        cf_payment_id?: string;
                }>;
                successful_payment?: {
                        payment_status?: string;
                        payment_message?: string;
                        error_details?: unknown;
                };
        } | null;
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
        customer_email: string | null;
        customer_mobile: string | null;
        priority: OrderPriority;
        status: OrderStatus;
        amount: number;
        assigned_to?: number | null;
        assigned_user?: AssignedUser | null;
        timeline?: OrderTimeline[];
        payments?: OrderPayment[];
        created_at: string;
        updated_at: string;

        gateway_response?: {
                order_id?: string;
                payments?: Array<{
                        payment_status?: string;
                        payment_message?: string;
                        error_details?: {
                                error_code?: string;
                                error_description?: string;
                                error_reason?: string;
                        } | null;
                        cf_payment_id?: string;
                }>;
                successful_payment?: {
                        payment_status?: string;
                        payment_message?: string;
                        error_details?: unknown;
                };
        } | null;
}

/* ==========================================================
 | Requests
 * ========================================================= */

export interface CreateOrderRequest {
        company_id: number;
        service_name: string;
        priority?: OrderPriority;
        amount?: number;
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {
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
