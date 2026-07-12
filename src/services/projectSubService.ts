import api from './api';
import type { PageResponse } from './employeeService';

export interface Milestone {
  id: number;
  project?: { id: number; name: string };
  name: string;
  dueDate?: string;
  completedDate?: string;
  status: string;
  description?: string;
}

export interface Task {
  id: number;
  project?: { id: number; name: string };
  milestone?: { id: number; name: string };
  title: string;
  description?: string;
  priority?: string;
  status: string;
  assignedTo?: { id: number; fullName: string };
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface TimeEntry {
  id: number;
  employee?: { id: number; fullName: string };
  task?: { id: number; title: string };
  project?: { id: number; name: string };
  date: string;
  hours: number;
  description?: string;
  isBillable?: boolean;
}

const milestoneService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<Milestone>> {
    const res = await api.get('/milestones', { params });
    return res.data.data;
  },
  async create(data: Partial<Milestone>): Promise<Milestone> {
    const res = await api.post('/milestones', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<Milestone>): Promise<Milestone> {
    const res = await api.put(`/milestones/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/milestones/${id}`);
  },
};

const taskService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<Task>> {
    const res = await api.get('/tasks', { params });
    return res.data.data;
  },
  async create(data: Partial<Task>): Promise<Task> {
    const res = await api.post('/tasks', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<Task>): Promise<Task> {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },
};

const timeEntryService = {
  async getAll(params?: { page?: number; size?: number }): Promise<PageResponse<TimeEntry>> {
    const res = await api.get('/time-entries', { params });
    return res.data.data;
  },
  async create(data: Partial<TimeEntry>): Promise<TimeEntry> {
    const res = await api.post('/time-entries', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<TimeEntry>): Promise<TimeEntry> {
    const res = await api.put(`/time-entries/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/time-entries/${id}`);
  },
};

export { milestoneService, taskService, timeEntryService };
