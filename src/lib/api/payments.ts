import { apiClient } from "./client";

export interface PaymentInitiateRequest {
  order_id: number;
  provider_code?: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentInitiateResponse {
  payment_id: number;
  order_id: number;
  order_number: string;
  provider_code: string;
  provider_reference: string;
  redirect_url?: string | null;
  client_token?: string | null;
  status: string;
  amount: number;
  currency_code: string;
}

export interface PaymentResponse {
  id: number;
  order_id: number;
  order_number: string;
  payment_method: string;
  provider_code: string;
  provider_reference?: string | null;
  status: string;
  currency_code: string;
  amount: number;
  amount_collected: number;
  amount_outstanding: number;
  initiated_at: string;
  confirmed_at?: string | null;
  dispatched_at?: string | null;
  collected_at?: string | null;
  reconciled_at?: string | null;
}

export const paymentsApi = {
  async initiatePayment(data: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    return apiClient<PaymentInitiateResponse>("/customer/payments/initiate", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: false,
    });
  },

  async getOrderPayment(orderNumber: string): Promise<PaymentResponse> {
    return apiClient<PaymentResponse>(`/customer/payments/order/${orderNumber}`, {
      skipAuth: false,
    });
  },

  async confirmCodPayment(orderNumber: string, data: { confirmed: boolean; notes?: string }): Promise<PaymentResponse> {
    return apiClient<PaymentResponse>(`/customer/payments/order/${orderNumber}/confirm-cod`, {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: false,
    });
  },
};
