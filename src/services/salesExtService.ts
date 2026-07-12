import api from './api';
import type { PageResponse } from './employeeService';

export interface SalesQuotation {
  id: number;
  quotationNumber: string;
  customer?: { id: number; name: string };
  date: string;
  validUntil?: string;
  subtotal?: number;
  taxAmount?: number;
  discount?: number;
  total: number;
  status: string;
  notes?: string;
}

export interface SalesInvoice {
  id: number;
  invoiceNumber: string;
  customer?: { id: number; name: string };
  salesOrder?: { id: number; orderNumber: string };
  date: string;
  dueDate?: string;
  subtotal?: number;
  taxAmount?: number;
  total: number;
  paidAmount?: number;
  status: string;
  notes?: string;
}

const salesQuotationService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<SalesQuotation>> {
    const res = await api.get('/sales-quotations', { params });
    return res.data.data;
  },
  async create(data: Partial<SalesQuotation>): Promise<SalesQuotation> {
    const res = await api.post('/sales-quotations', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<SalesQuotation>): Promise<SalesQuotation> {
    const res = await api.put(`/sales-quotations/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/sales-quotations/${id}`);
  },
};

const salesInvoiceService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<SalesInvoice>> {
    const res = await api.get('/sales-invoices', { params });
    return res.data.data;
  },
  async create(data: Partial<SalesInvoice>): Promise<SalesInvoice> {
    const res = await api.post('/sales-invoices', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<SalesInvoice>): Promise<SalesInvoice> {
    const res = await api.put(`/sales-invoices/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/sales-invoices/${id}`);
  },
};

export { salesQuotationService, salesInvoiceService };
