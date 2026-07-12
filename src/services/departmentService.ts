import api from './api';

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  budget?: number;
  isActive: boolean;
}

const departmentService = {
  async getAll(): Promise<Department[]> {
    const res = await api.get('/departments');
    return res.data.data;
  },

  async getById(id: number): Promise<Department> {
    const res = await api.get(`/departments/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Department>): Promise<Department> {
    const res = await api.post('/departments', data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Department>): Promise<Department> {
    const res = await api.put(`/departments/${id}`, data);
    return res.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/departments/${id}`);
  },
};

export default departmentService;
