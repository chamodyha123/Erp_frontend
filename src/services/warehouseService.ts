import api from './api';

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  manager?: { id: number; fullName: string };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const warehouseService = {
  async getAll(): Promise<Warehouse[]> {
    const res = await api.get('/warehouses');
    return res.data.data;
  },
  async getById(id: number): Promise<Warehouse> {
    const res = await api.get(`/warehouses/${id}`);
    return res.data.data;
  },
  async create(data: Partial<Warehouse>): Promise<Warehouse> {
    const res = await api.post('/warehouses', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<Warehouse>): Promise<Warehouse> {
    const res = await api.put(`/warehouses/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/warehouses/${id}`);
  },
};

export default warehouseService;