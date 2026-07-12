import api from './api';
import type { PageResponse } from './employeeService';

export interface StockLevel {
  id: number;
  product: { id: number; name: string; sku: string; unit: string };
  warehouse: { id: number; name: string; code: string };
  quantity: number;
  minStock?: number;
  maxStock?: number;
  reservedQty?: number;
  lastUpdated?: string;
}

export interface StockMovement {
  id: number;
  product?: { id: number; name: string; sku: string };
  warehouse?: { id: number; name: string };
  movementType: string;
  quantity: number;
  unitCost?: number;
  referenceType?: string;
  referenceId?: number;
  notes?: string;
  createdAt?: string;
}

const stockService = {
  async getLevels(): Promise<StockLevel[]> {
    const res = await api.get('/stock-levels');
    return res.data.data;
  },
  async getMovements(params?: { page?: number; size?: number }): Promise<PageResponse<StockMovement>> {
    const res = await api.get('/stock-movements', { params });
    return res.data.data;
  },
  async createMovement(data: Partial<StockMovement>): Promise<StockMovement> {
    const res = await api.post('/stock-movements', data);
    return res.data.data;
  },
};

export const stockLevelService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<StockLevel>> {
    const res = await api.get('/stock-levels', { params });
    const d = res.data.data;
    if (Array.isArray(d)) return {
      content: d,
      totalElements: d.length,
      totalPages: 1,
      number: 0,
      size: d.length,
    } as PageResponse<StockLevel>;
    return d;
  },

  async update(id: number, data: Partial<StockLevel>): Promise<StockLevel> {
    const res = await api.put(`/stock-levels/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/stock-levels/${id}`);
  },
};

export const stockMovementService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<StockMovement>> {
    const res = await api.get('/stock-movements', { params });
    return res.data.data;
  },
  async create(data: Partial<StockMovement>): Promise<StockMovement> {
    const res = await api.post('/stock-movements', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<StockMovement>): Promise<StockMovement> {
    const res = await api.put(`/stock-movements/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/stock-movements/${id}`);
  },
};

export default stockService;