import { apiClient } from "./client";

export interface AddressSnapshot {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  postal_code?: string | null;
  country_code?: string;
}

export interface CheckoutRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: AddressSnapshot;
  shipping_method_code?: string;
  payment_method?: string; // "cod" | "card" | "mock"
  customer_note?: string | null;
  coupon_code?: string | null;
  idempotency_key?: string | null;
}

export interface OrderItemResponse {
  id: number;
  product_id?: number | null;
  variant_id?: number | null;
  product_name: string;
  product_slug: string;
  sku: string;
  size: string;
  color: string;
  unit_price: number;
  quantity: number;
  line_discount: number;
  line_total: number;
  image_url?: string | null;
}

export interface OrderStatusHistoryResponse {
  id: number;
  from_status: string;
  to_status: string;
  note?: string | null;
  created_at: string;
}

export interface OrderResponse {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  payment_method: string;
  currency_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  shipping_method_code: string;
  shipping_method_name: string;
  shipping_address: AddressSnapshot;
  customer_note?: string | null;
  items: OrderItemResponse[];
  status_history: OrderStatusHistoryResponse[];
  placed_at: string;
  created_at: string;
}

export const ordersApi = {
  async checkout(data: CheckoutRequest, idempotencyKey?: string): Promise<OrderResponse> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }
    return apiClient<OrderResponse>("/orders/checkout", {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      skipAuth: false,
    });
  },

  async getOrder(orderNumber: string): Promise<OrderResponse> {
    return apiClient<OrderResponse>(`/orders/${orderNumber}`, {
      skipAuth: false,
    });
  },
};
