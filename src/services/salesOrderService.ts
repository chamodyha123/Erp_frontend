import api from './api';
import type { PageResponse } from './employeeService';

export interface SalesOrderItem {
  id?: number;
  product?: { id: number };
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface SalesOrder {
  id: number;
  orderNumber: string;
  customer: { id: number; name: string; code: string };
  date: string;
  deliveryDate?: string;
  subtotal: number;
  taxAmount?: number;
  total: number;
  status: string;
  notes?: string;
  items?: SalesOrderItem[];
}

const salesOrderService = {
  async getAll(params?: { status?: string; customerId?: number; page?: number; size?: number }): Promise<PageResponse<SalesOrder>> {
    const res = await api.get('/sales-orders', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<SalesOrder> {
    const res = await api.get(`/sales-orders/${id}`);
    return res.data.data;
  },

  async create(data: Partial<SalesOrder>): Promise<SalesOrder> {
    const res = await api.post('/sales-orders', data);
    return res.data.data;
  },

  async updateStatus(id: number, status: string): Promise<SalesOrder> {
    const res = await api.patch(`/sales-orders/${id}/status`, { status });
    return res.data.data;
  },
};

export default salesOrderService;
