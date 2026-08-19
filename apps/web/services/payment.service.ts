import api from "@/lib/api";

export interface PaymentPayload {
  itr_return_id?: number;
  itr_return_uuid?: string;
  amount?: number;
  currency?: string;
}

export interface VerifyPaymentPayload {
  payment_id: number;
  cashfree_order_id: string;
}

export interface PaymentData {
  id: number;
  itr_return_id: number;
  transaction_id?: string | null;

  amount: number;
  gst: number;
  total: number;

  currency: string;

  payment_status?: string | null;
  payment_gateway?: string | null;

  gateway_transaction_id?: string | null;

  gateway_response?: Record<string, unknown> | null;

  cashfree_order_id?: string | null;
  payment_session_id?: string | null;

  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;

  data: PaymentData;
  errors?: unknown;
  meta?: unknown;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;

  data?: {
    payment?: PaymentData;

    verification?: {
      status?: string;

      payment?: Record<string, unknown> | null;

      payments?: Record<string, unknown>[];
    };
  };

  errors?: unknown;
  meta?: unknown;
}

class PaymentService {
  /**
   * Create Cashfree payment
   */
  async create(
    payload: PaymentPayload
  ): Promise<PaymentResponse> {
    const response = await api.post(
      "/payments",
      payload
    );

    return response.data;
  }

  /**
   * Verify Cashfree payment
   *
   * Backend securely checks Cashfree API.
   */
  async verify(
    payload: VerifyPaymentPayload
  ): Promise<VerifyPaymentResponse> {
    const response = await api.post(
      "/payments/verify",
      payload
    );

    return response.data;
  }

  /**
   * Get payment by ID
   */
  async get(
    id: number
  ): Promise<PaymentResponse> {
    const response = await api.get(
      `/payments/${id}`
    );

    return response.data;
  }

  /**
   * Get all payments
   */
  async list(): Promise<{
    success: boolean;
    data: unknown;
    errors?: unknown;
    meta?: unknown;
  }> {
    const response = await api.get(
      "/payments"
    );

    return response.data;
  }
}

const paymentService =
  new PaymentService();

export default paymentService;