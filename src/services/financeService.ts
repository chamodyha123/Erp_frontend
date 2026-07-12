import api from './api';
import type { PageResponse } from './employeeService';

export interface AccountsPayable {
  id: number;
  vendor?: { id: number; name: string };
  vendorName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  amount: number;
  paidAmount?: number;
  status: string;
  notes?: string;
}

export interface AccountsReceivable {
  id: number;
  customer?: { id: number; name: string };
  customerName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  amount: number;
  paidAmount?: number;
  status: string;
  notes?: string;
}

export interface Budget {
  id: number;
  name: string;
  department?: { id: number; name: string };
  periodYear: number;
  periodMonth?: number;
  account?: { id: number; accountName: string };
  budgetedAmount: number;
  actualAmount?: number;
  status: string;
  notes?: string;
}

const accountsPayableService = {
  async getAll(params?: { status?: string; page?: number; size?: number }): Promise<PageResponse<AccountsPayable>> {
    const res = await api.get('/accounts-payable', { params });
    return res.data.data;
  },
  async create(data: Partial<AccountsPayable>): Promise<AccountsPayable> {
    const res = await api.post('/accounts-payable', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<AccountsPayable>): Promise<AccountsPayable> {
    const res = await api.put(`/accounts-payable/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/accounts-payable/${id}`);
  },
};

const accountsReceivableService = {
  async getAll(params?: { status?: string; page?: number; size?: number }): Promise<PageResponse<AccountsReceivable>> {
    const res = await api.get('/accounts-receivable', { params });
    return res.data.data;
  },
  async create(data: Partial<AccountsReceivable>): Promise<AccountsReceivable> {
    const res = await api.post('/accounts-receivable', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<AccountsReceivable>): Promise<AccountsReceivable> {
    const res = await api.put(`/accounts-receivable/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/accounts-receivable/${id}`);
  },
};

const budgetService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<Budget>> {
    const res = await api.get('/budgets', { params });
    return res.data.data;
  },
  async create(data: Partial<Budget>): Promise<Budget> {
    const res = await api.post('/budgets', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<Budget>): Promise<Budget> {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};

export { accountsPayableService, accountsReceivableService, budgetService };
