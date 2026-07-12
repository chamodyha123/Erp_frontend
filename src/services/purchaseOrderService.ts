import api from './api';
import type { PageResponse } from './employeeService';

export interface PurchaseOrderItem {
  id?: number;
  product?: { id: number };
  productName: string;
  quantity: number;
  unitPrice: number;
  receivedQty?: number;
  subtotal?: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendor: { id: number; name: string; code: string };
  date: string;
  expectedDate?: string;
  subtotal: number;
  taxAmount?: number;
  total: number;
  status: string;
  notes?: string;
  items?: PurchaseOrderItem[];
}

const purchaseOrderService = {
  async getAll(params?: { status?: string; vendorId?: number; page?: number; size?: number }): Promise<PageResponse<PurchaseOrder>> {
    const res = await api.get('/purchase-orders', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<PurchaseOrder> {
    const res = await api.get(`/purchase-orders/${id}`);
    return res.data.data;
  },

  async create(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    const res = await api.post('/purchase-orders', data);
    return res.data.data;
  },

  async updateStatus(id: number, status: string): Promise<PurchaseOrder> {
    const res = await api.patch(`/purchase-orders/${id}/status`, { status });
    return res.data.data;
  },
};

export default purchaseOrderService;
