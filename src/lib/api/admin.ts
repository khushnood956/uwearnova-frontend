import { apiClient } from "./client";
import { Category, CategoryTree, Product, ProductListResponse } from "./types";

export interface AdminCategoryCreate {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
  is_coming_soon?: boolean;
}

export interface AdminCategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  sort_order?: number;
  is_active?: boolean;
  is_coming_soon?: boolean;
}

export interface AdminProductCreate {
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  category_id: number;
  collection_ids?: number[];
  price: number;
  original_price?: number;
  brand_label?: string;
  status?: "draft" | "active" | "archived";
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  fabric_care?: string[];
  delivery_notes?: string;
}

export interface AdminVariantCreate {
  sku: string;
  size: string;
  color_name: string;
  color_hex?: string;
  price?: number;
  inventory_count: number;
  is_active?: boolean;
}

export interface AdminReportsOverview {
  gross_sales: number | string;
  net_revenue: number | string;
  collected_payments: number | string;
  outstanding_cod: number | string;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  total_customers: number;
  active_products_count: number;
  low_stock_items_count: number;
}

export interface AdminAuditLog {
  id: number;
  actor_id?: number;
  actor_email?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  changes?: any;
  ip_address?: string;
  created_at: string;
}

export const adminApi = {
  // 1. Reports & Analytics
  async getOverview(): Promise<AdminReportsOverview> {
    return apiClient<AdminReportsOverview>("/admin/reports/overview");
  },

  async getSalesTrends(): Promise<any> {
    return apiClient<any>("/admin/reports/sales");
  },

  async getBestSellers(): Promise<any> {
    return apiClient<any>("/admin/reports/best-sellers");
  },

  async getInventoryReport(): Promise<any> {
    return apiClient<any>("/admin/reports/inventory");
  },

  // 2. Categories & Departments
  async getCategories(is_active?: boolean): Promise<Category[]> {
    return apiClient<Category[]>("/admin/categories", {
      params: is_active !== undefined ? { is_active } : undefined,
    });
  },

  async getCategoryTree(): Promise<CategoryTree[]> {
    return apiClient<CategoryTree[]>("/categories/tree", { skipAuth: false });
  },

  async createCategory(data: AdminCategoryCreate): Promise<Category> {
    return apiClient<Category>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCategory(id: number | string, data: AdminCategoryUpdate): Promise<Category> {
    return apiClient<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: number | string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/categories/${id}`, {
      method: "DELETE",
    });
  },

  // 3. Products
  async getProducts(params?: {
    category_id?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ProductListResponse> {
    return apiClient<ProductListResponse>("/admin/products", { params });
  },

  async getProduct(id: number | string): Promise<Product> {
    return apiClient<Product>(`/admin/products/${id}`);
  },

  async createProduct(data: AdminProductCreate): Promise<Product> {
    return apiClient<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: number | string, data: Partial<AdminProductCreate>): Promise<Product> {
    return apiClient<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: number | string): Promise<{ message: string }> {
    return apiClient<{ message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  async archiveProduct(id: number | string): Promise<Product> {
    return apiClient<Product>(`/admin/products/${id}/archive`, {
      method: "POST",
    });
  },

  async publishProduct(id: number | string): Promise<Product> {
    return apiClient<Product>(`/admin/products/${id}/publish`, {
      method: "POST",
    });
  },

  async bulkUpdateStatus(product_ids: number[], status: "draft" | "active" | "archived"): Promise<any> {
    return apiClient<any>("/admin/products/bulk-status", {
      method: "POST",
      body: JSON.stringify({ product_ids, status }),
    });
  },

  async addVariant(productId: number | string, data: AdminVariantCreate): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/variants`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateVariant(productId: number | string, variantId: number | string, data: Partial<AdminVariantCreate>): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/variants/${variantId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteVariant(productId: number | string, variantId: number | string): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/variants/${variantId}`, {
      method: "DELETE",
    });
  },

  // Product Media
  async getProductImages(productId: number | string): Promise<any[]> {
    return apiClient<any[]>(`/admin/products/${productId}/media`);
  },

  async addProductImageUrl(
    productId: number | string,
    data: { image_url: string; alt_text?: string; is_primary?: boolean }
  ): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/media/add-url`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async uploadProductImage(
    productId: number | string,
    formData: FormData
  ): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/media/upload`, {
      method: "POST",
      body: formData,
    });
  },

  async deleteProductImage(productId: number | string, imageId: number | string): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/media/${imageId}`, {
      method: "DELETE",
    });
  },

  async setPrimaryProductImage(productId: number | string, imageId: number | string): Promise<any> {
    return apiClient<any>(`/admin/products/${productId}/media/${imageId}/set-primary`, {
      method: "PUT",
    });
  },

  // 4. Orders
  async getOrders(params?: { status?: string; payment_status?: string; limit?: number; offset?: number }): Promise<any> {
    return apiClient<any>("/admin/orders", { params });
  },

  async getOrderDetail(id: number | string): Promise<any> {
    return apiClient<any>(`/admin/orders/${id}`);
  },

  async confirmOrder(id: number | string): Promise<any> {
    return apiClient<any>(`/admin/orders/${id}/confirm`, {
      method: "POST",
    });
  },

  async cancelOrder(id: number | string, reason: string): Promise<any> {
    return apiClient<any>(`/admin/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  // 5. Payments & COD Reconciliation
  async getPayments(params?: { status?: string; method?: string; limit?: number; offset?: number }): Promise<any> {
    return apiClient<any>("/admin/payments", { params });
  },

  async collectCodCash(paymentId: number | string, amount: number, notes?: string): Promise<any> {
    return apiClient<any>(`/admin/payments/${paymentId}/collect-cash`, {
      method: "POST",
      body: JSON.stringify({ amount_collected: amount, notes }),
    });
  },

  // 6. Customers
  async getCustomers(params?: { search?: string; status?: string; limit?: number; offset?: number }): Promise<any> {
    return apiClient<any>("/admin/customers", { params });
  },

  async getCustomerDetail(id: number | string): Promise<any> {
    return apiClient<any>(`/admin/customers/${id}`);
  },

  async updateCustomerStatus(id: number | string, status: "active" | "suspended" | "banned", reason?: string): Promise<any> {
    return apiClient<any>(`/admin/customers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    });
  },

  // 7. Returns & Refunds
  async getReturns(params?: { status?: string; limit?: number; offset?: number }): Promise<any> {
    return apiClient<any>("/admin/returns", { params });
  },

  // 8. Audit Trail
  async getAuditLogs(params?: { limit?: number; offset?: number; entity_type?: string }): Promise<{ items: AdminAuditLog[]; total: number }> {
    return apiClient<{ items: AdminAuditLog[]; total: number }>("/admin/audit-logs", { params });
  },

  // 9. Offline Sales (Shop & POS)
  async getOfflineSales(params?: {
    search?: string;
    payment_method?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    items: any[];
    total: number;
    limit: number;
    offset: number;
    summary: {
      total_sales_count: number;
      total_revenue: string | number;
      total_units_sold: number;
      cash_revenue: string | number;
      card_revenue: string | number;
    };
  }> {
    return apiClient<any>("/admin/offline-sales", { params });
  },

  async getOfflineSale(id: number | string): Promise<any> {
    return apiClient<any>(`/admin/offline-sales/${id}`);
  },

  async createOfflineSale(data: {
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
    payment_method: string;
    discount_amount?: number;
    tax_amount?: number;
    notes?: string;
    items: Array<{
      variant_id: number;
      quantity: number;
      unit_price_override?: number;
    }>;
  }): Promise<any> {
    return apiClient<any>("/admin/offline-sales", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async voidOfflineSale(id: number | string): Promise<any> {
    return apiClient<any>(`/admin/offline-sales/${id}/void`, {
      method: "POST",
    });
  },
};
