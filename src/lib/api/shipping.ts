import { apiClient } from "./client";

export interface DeliveryAddressValidationRequest {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  postal_code?: string | null;
  country_code?: string;
}

export interface DeliveryAddressValidationResponse {
  is_valid: boolean;
  city: string;
  is_serviceable: boolean;
  zone_code?: string | null;
  normalized_phone: string;
  message?: string | null;
}

export interface ShippingQuoteRequest {
  city: string;
  postal_code?: string | null;
  country_code?: string;
  subtotal?: number;
  is_cod?: boolean;
}

export interface ShippingMethodQuoteItem {
  code: string;
  name: string;
  description?: string | null;
  estimated_days_min: number;
  estimated_days_max: number;
  is_cod_supported: boolean;
  base_fee: number;
  discount: number;
  final_fee: number;
  is_free: boolean;
  free_shipping_threshold?: number | null;
  amount_needed_for_free_shipping?: number | null;
}

export interface ShippingQuoteResponse {
  destination_city: string;
  is_serviceable: boolean;
  zone_code?: string | null;
  subtotal: number;
  available_methods: ShippingMethodQuoteItem[];
  recommended_method_code: string;
}

export const shippingApi = {
  async getQuote(data: ShippingQuoteRequest): Promise<ShippingQuoteResponse> {
    return apiClient<ShippingQuoteResponse>("/shipping/quote", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: false,
    });
  },

  async validateAddress(data: DeliveryAddressValidationRequest): Promise<DeliveryAddressValidationResponse> {
    return apiClient<DeliveryAddressValidationResponse>("/shipping/validate-address", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: false,
    });
  },
};
