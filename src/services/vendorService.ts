import api from './api';
import type { PageResponse } from './employeeService';

export interface Vendor {
  id: number;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  paymentTerms?: string;
  isActive: boolean;
}

const vendorService = {
  async getAll(params?: { search?: string; page?: number; size?: number }): Promise<PageResponse<Vendor>> {
    const res = await api.get('/vendors', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<Vendor> {
    const res = await api.get(`/vendors/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Vendor>): Promise<Vendor> {
    const res = await api.post('/vendors', data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Vendor>): Promise<Vendor> {
    const res = await api.put(`/vendors/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/vendors/${id}`);
  },
};

export default vendorService;
