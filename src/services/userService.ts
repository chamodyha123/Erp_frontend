import api from './api';
import type { PageResponse } from './employeeService';

export interface User {
  id: number;
  username: string;
  email?: string;
  role?: string;
  enabled: boolean;
  createdAt?: string;
}

const userService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<User>> {
    const res = await api.get('/users', { params });
    return res.data.data;
  },
  async create(data: Partial<User> & { password?: string }): Promise<User> {
    const res = await api.post('/users', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<User>): Promise<User> {
    const res = await api.put(`/users/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

export default userService;
