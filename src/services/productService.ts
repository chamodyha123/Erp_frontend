import api from './api';
import type { PageResponse } from './employeeService';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  unitPrice: number;
  costPrice?: number;
  reorderLevel?: number;
  isActive: boolean;
}

const productService = {
  async getAll(params?: { search?: string; page?: number; size?: number }): Promise<PageResponse<Product>> {
    const res = await api.get('/products', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<Product> {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Product>): Promise<Product> {
    const res = await api.post('/products', data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};

export default productService;
