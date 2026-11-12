import { apiClient } from "./client";

export interface CustomerProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  user_type: string;
  status: string;
  created_at: string;
}

export interface CustomerPreferences {
  marketing_email: boolean;
  marketing_sms: boolean;
  marketing_whatsapp: boolean;
  language: string;
  currency: string;
}

export interface CustomerAddress {
  id: number;
  label?: string | null;
  full_name: string;
  phone: string;
  street_address: string;
  apartment_suite?: string | null;
  city: string;
  province?: string | null;
  postal_code?: string | null;
  delivery_instructions?: string | null;
  is_default: boolean;
}

export interface CustomerOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_slug: string;
  variant_sku: string;
  size: string;
  color_name: string;
  image_url?: string | null;
  unit_price: number | string;
  quantity: number;
  line_total: number | string;
}

export interface CustomerShipment {
  id: number;
  tracking_number: string;
  courier_name: string;
  status: string;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export interface OrderStatusTimelineItem {
  id: number;
  status: string;
  notes?: string | null;
  created_at: string;
}

export interface CustomerOrderDetail {
  id: number;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number | string;
  shipping_fee: number | string;
  discount_amount: number | string;
  grand_total: number | string;
  created_at: string;
  shipping_address: any;
  items: CustomerOrderItem[];
  shipments: CustomerShipment[];
  timeline: OrderStatusTimelineItem[];
}

export interface CustomerOrderListResponse {
  items: CustomerOrderDetail[];
  total: number;
  limit: number;
  offset: number;
}

export interface CustomerReturnItem {
  id: number;
  order_item_id: number;
  product_name: string;
  variant_sku: string;
  quantity: number;
  reason: string;
  condition: string;
  status: string;
}

export interface CustomerReturnDetail {
  id: number;
  return_number: string;
  order_number: string;
  request_type: "return" | "exchange";
  status: string;
  refund_status?: string | null;
  refund_amount?: number | string | null;
  items: CustomerReturnItem[];
  created_at: string;
  updated_at: string;
}

export interface CustomerSecurityOverview {
  email: string;
  is_verified: boolean;
  active_sessions_count: number;
  last_login_at?: string | null;
  last_password_change_at?: string | null;
}

export const customerApi = {
  // Profile & Preferences
  async getProfile(): Promise<CustomerProfile> {
    return apiClient<CustomerProfile>("/customer/profile");
  },

  async updateProfile(data: { first_name?: string; last_name?: string; phone?: string }): Promise<CustomerProfile> {
    return apiClient<CustomerProfile>("/customer/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async getPreferences(): Promise<CustomerPreferences> {
    return apiClient<CustomerPreferences>("/customer/preferences");
  },

  async updatePreferences(data: Partial<CustomerPreferences>): Promise<CustomerPreferences> {
    return apiClient<CustomerPreferences>("/customer/preferences", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Address Book
  async getAddresses(): Promise<{ items: CustomerAddress[]; total: number }> {
    return apiClient<{ items: CustomerAddress[]; total: number }>("/customer/addresses");
  },

  async createAddress(data: Omit<CustomerAddress, "id" | "is_default"> & { is_default?: boolean }): Promise<CustomerAddress> {
    return apiClient<CustomerAddress>("/customer/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateAddress(id: number, data: Partial<CustomerAddress>): Promise<CustomerAddress> {
    return apiClient<CustomerAddress>(`/customer/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAddress(id: number): Promise<void> {
    return apiClient<void>(`/customer/addresses/${id}`, {
      method: "DELETE",
    });
  },

  async setDefaultAddress(id: number): Promise<CustomerAddress> {
    return apiClient<CustomerAddress>(`/customer/addresses/${id}/default`, {
      method: "POST",
    });
  },

  // Orders
  async getOrders(params?: { limit?: number; offset?: number }): Promise<CustomerOrderListResponse> {
    return apiClient<CustomerOrderListResponse>("/customer/orders", { params });
  },

  async getOrderDetail(orderNumber: string): Promise<CustomerOrderDetail> {
    return apiClient<CustomerOrderDetail>(`/customer/orders/${orderNumber}`);
  },

  // Returns & Exchanges
  async getReturns(params?: { page?: number; page_size?: number }): Promise<{ items: CustomerReturnDetail[]; total: number }> {
    return apiClient<{ items: CustomerReturnDetail[]; total: number }>("/customer/returns", { params });
  },

  async getReturnDetail(id: number): Promise<CustomerReturnDetail> {
    return apiClient<CustomerReturnDetail>(`/customer/returns/${id}`);
  },

  async submitReturn(data: {
    order_number: string;
    request_type: "return" | "exchange";
    reason: string;
    items: Array<{ order_item_id: number; quantity: number; reason: string }>;
  }): Promise<CustomerReturnDetail> {
    return apiClient<CustomerReturnDetail>("/returns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Security
  async getSecurityOverview(): Promise<CustomerSecurityOverview> {
    return apiClient<CustomerSecurityOverview>("/customer/security");
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/customer/security/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async revokeSessions(): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/customer/security/revoke-sessions", {
      method: "POST",
    });
  },
};
