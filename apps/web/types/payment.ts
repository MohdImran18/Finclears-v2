/* ==========================================================
 | Payment Status
 * ========================================================= */

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

/* ==========================================================
 | Payment Method
 * ========================================================= */

export type PaymentMethod =
  | "razorpay"
  | "cashfree"
  | "stripe"
  | "bank_transfer"
  | "cash";

/* ==========================================================
 | Invoice Status
 * ========================================================= */

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";

/* ==========================================================
 | Invoice
 * ========================================================= */

export interface Invoice {

  id: number;

  invoice_no: string;

  company_id: number;

  order_id?: number;

  subtotal: number;

  tax: number;

  discount: number;

  total: number;

  status: InvoiceStatus;

  due_date: string;

  invoice_url?: string;

  created_at: string;

}

/* ==========================================================
 | Payment
 * ========================================================= */

export interface Payment {

  id: number;

  invoice_id: number;

  company_id: number;

  amount: number;

  currency: string;

  method: PaymentMethod;

  status: PaymentStatus;

  transaction_id?: string;

  gateway_order_id?: string;

  gateway_payment_id?: string;

  gateway_signature?: string;

  paid_at?: string;

  created_at: string;

}

/* ==========================================================
 | Requests
 * ========================================================= */

export interface CreatePaymentRequest {

  invoice_id: number;

  method: PaymentMethod;

}

export interface VerifyPaymentRequest {

  payment_id: string;

  order_id: string;

  signature: string;

}

/* ==========================================================
 | Filters
 * ========================================================= */

export interface PaymentFilters {

  search?: string;

  status?: PaymentStatus;

  method?: PaymentMethod;

  company_id?: number;

  page?: number;

  per_page?: number;

}

/* ==========================================================
 | Responses
 * ========================================================= */

export interface PaymentResponse {

  success: boolean;

  message: string;

  data: Payment;

}

export interface PaymentListResponse {

  success: boolean;

  message: string;

  data: Payment[];

}

export interface InvoiceResponse {

  success: boolean;

  message: string;

  data: Invoice;

}

export interface InvoiceListResponse {

  success: boolean;

  message: string;

  data: Invoice[];

}