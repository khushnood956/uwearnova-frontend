import { apiClient } from "./client";

export interface StaffDashboardSummary {
  staff_name: string;
  assigned_role: string;
  pending_orders_count?: number;
  pending_fulfillments_count?: number;
  low_stock_alerts_count?: number;
  open_support_cases_count?: number;
  assigned_tasks_count?: number;
}

export interface StaffTask {
  id: number;
  title: string;
  description?: string;
  task_type: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  due_date?: string;
  created_at: string;
}

export const staffApi = {
  async getDashboardSummary(): Promise<StaffDashboardSummary> {
    return apiClient<StaffDashboardSummary>("/staff/dashboard");
  },

  async getOrderQueue(): Promise<any> {
    return apiClient<any>("/staff/queues/orders");
  },

  async getFulfillmentQueue(): Promise<any> {
    return apiClient<any>("/staff/queues/fulfillment");
  },

  async getInventoryQueue(): Promise<any> {
    return apiClient<any>("/staff/queues/inventory");
  },

  async getReturnsQueue(): Promise<any> {
    return apiClient<any>("/staff/queues/returns");
  },

  async getSupportQueue(): Promise<any> {
    return apiClient<any>("/staff/queues/support");
  },

  async getMyTasks(): Promise<{ items: StaffTask[]; total: number }> {
    return apiClient<{ items: StaffTask[]; total: number }>("/staff/tasks");
  },

  async updateTaskStatus(taskId: number | string, status: "in_progress" | "completed" | "cancelled"): Promise<any> {
    return apiClient<any>(`/staff/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  async processOrder(orderId: number | string, action: string, notes?: string): Promise<any> {
    return apiClient<any>(`/staff/orders/${orderId}/process`, {
      method: "POST",
      body: JSON.stringify({ action, notes }),
    });
  },

  async packShipment(shipmentId: number | string, package_weight_kg?: number): Promise<any> {
    return apiClient<any>(`/staff/fulfillment/shipments/${shipmentId}/pack`, {
      method: "POST",
      body: JSON.stringify({ package_weight_kg }),
    });
  },

  async dispatchShipment(shipmentId: number | string, courier_tracking_number: string): Promise<any> {
    return apiClient<any>(`/staff/fulfillment/shipments/${shipmentId}/dispatch`, {
      method: "POST",
      body: JSON.stringify({ courier_tracking_number }),
    });
  },

  async receiveStock(variant_id: number, quantity: number, reference_note?: string): Promise<any> {
    return apiClient<any>("/staff/inventory/receive", {
      method: "POST",
      body: JSON.stringify({ variant_id, quantity, reference_note }),
    });
  },

  async replySupportTicket(ticketId: number | string, message: string): Promise<any> {
    return apiClient<any>(`/staff/support/tickets/${ticketId}/reply`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};
