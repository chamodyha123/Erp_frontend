import api from './api';
import type { PageResponse } from './employeeService';

export interface PurchaseRequisition {
  id: number;
  prNumber: string;
  requestedBy?: { id: number; fullName: string };
  department?: { id: number; name: string };
  date: string;
  neededBy?: string;
  status: string;
  notes?: string;
}

export interface PurchaseInvoice {
  id: number;
  invoiceNumber: string;
  vendor?: { id: number; name: string };
  purchaseOrder?: { id: number; poNumber: string };
  date: string;
  dueDate?: string;
  subtotal?: number;
  taxAmount?: number;
  total: number;
  paidAmount?: number;
  status: string;
  notes?: string;
}

const purchaseRequisitionService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<PurchaseRequisition>> {
    const res = await api.get('/purchase-requisitions', { params });
    return res.data.data;
  },
  async create(data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
    const res = await api.post('/purchase-requisitions', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<PurchaseRequisition>): Promise<PurchaseRequisition> {
    const res = await api.put(`/purchase-requisitions/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/purchase-requisitions/${id}`);
  },
};

const purchaseInvoiceService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<PurchaseInvoice>> {
    const res = await api.get('/purchase-invoices', { params });
    return res.data.data;
  },
  async create(data: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> {
    const res = await api.post('/purchase-invoices', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<PurchaseInvoice>): Promise<PurchaseInvoice> {
    const res = await api.put(`/purchase-invoices/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/purchase-invoices/${id}`);
  },
};

export { purchaseRequisitionService, purchaseInvoiceService };
