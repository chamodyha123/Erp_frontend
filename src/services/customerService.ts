import api from './api';
import type { PageResponse } from './employeeService';

export interface Customer {
  id: number;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
   contactPerson?: string;   // <-- add this
  country?: string;
  creditLimit?: number;
  isActive: boolean;
}

const customerService = {
  async getAll(params?: { search?: string; page?: number; size?: number }): Promise<PageResponse<Customer>> {
    const res = await api.get('/customers', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<Customer> {
    const res = await api.get(`/customers/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Customer>): Promise<Customer> {
    const res = await api.post('/customers', data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Customer>): Promise<Customer> {
    const res = await api.put(`/customers/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};

export default customerService;
