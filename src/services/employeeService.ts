import api from './api';

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  position: string;
  status: string;
  salary?: number;
  hireDate?: string;
  address?: string;
  department?: { id: number; name: string; code: string };
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const employeeService = {
  async getAll(params?: { search?: string; page?: number; size?: number }): Promise<PageResponse<Employee>> {
    const res = await api.get('/employees', { params });
    return res.data.data;
  },

  async getById(id: number): Promise<Employee> {
    const res = await api.get(`/employees/${id}`);
    return res.data.data;
  },

  async create(data: Partial<Employee>): Promise<Employee> {
    const res = await api.post('/employees', data);
    return res.data.data;
  },

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const res = await api.put(`/employees/${id}`, data);
    return res.data.data;
  },

  async terminate(id: number): Promise<void> {
    await api.delete(`/employees/${id}`);
  },
};

export default employeeService;
