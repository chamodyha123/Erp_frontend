import api from './api';
import type { PageResponse } from './employeeService';

export interface ChartOfAccount {
  id: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  balance?: number;
  isActive: boolean;
  description?: string;
  parentAccount?: { id: number; accountCode: string; accountName: string };
}

const chartOfAccountsService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<ChartOfAccount>> {
    const res = await api.get('/chart-of-accounts', { params });
    const d = res.data.data;
    // Backend returns a raw List (not paginated) — normalize to PageResponse shape
    if (Array.isArray(d)) {
      return { content: d, totalElements: d.length, totalPages: 1, number: 0, size: d.length } as PageResponse<ChartOfAccount>;
    }
    return d;
  },
  async getById(id: number): Promise<ChartOfAccount> {
    const res = await api.get(`/chart-of-accounts/${id}`);
    return res.data.data;
  },
  async create(data: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    const res = await api.post('/chart-of-accounts', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<ChartOfAccount>): Promise<ChartOfAccount> {
    const res = await api.put(`/chart-of-accounts/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/chart-of-accounts/${id}`);
  },
};

export default chartOfAccountsService;
