import api from './api';
import type { PageResponse } from './employeeService';

export interface Project {
  id: number;
  projectCode?: string;
  name?: string;
  clientName?: string;          // <-- add this
  customer?: { id: number; companyName: string };
  projectName?: string;
  manager?: { id: number; fullName: string };
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent?: number;
  status: string;
  description?: string;
  tasksTotal?: number;
  tasksDone?: number;
}

const projectService = {
  async getAll(params?: { page?: number; size?: number; search?: string; status?: string }): Promise<PageResponse<Project>> {
    const res = await api.get('/projects', { params });
    return res.data.data ?? res.data;
  },
  async getById(id: number): Promise<Project> {
    const res = await api.get(`/projects/${id}`);
    return res.data.data ?? res.data;
  },
  async create(data: Partial<Project> & { customerId?: number }): Promise<Project> {
    const res = await api.post('/projects', data);
    return res.data.data ?? res.data;
  },
  async update(id: number, data: Partial<Project> & { customerId?: number }): Promise<Project> {
    const res = await api.put(`/projects/${id}`, data);
    return res.data.data ?? res.data;
  },
  async updateStatus(id: number, status: string): Promise<Project> {
    const res = await api.patch(`/projects/${id}/status`, { status });
    return res.data.data ?? res.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};

export default projectService;
