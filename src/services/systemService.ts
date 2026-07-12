import api from './api';
import type { PageResponse } from './employeeService';

export interface AuditLog {
  id: number;
  user?: { id: number; username: string };
  module?: string;
  action?: string;
  entity?: string;
  entityId?: number;
  oldValues?: string;
  newValues?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface Setting {
  id: number;
  key: string;
  value?: string;
  description?: string;
  type?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
}

const systemService = {
  async getAuditLogs(params?: { page?: number; size?: number }): Promise<PageResponse<AuditLog>> {
    const res = await api.get('/system/audit-logs', { params });
    return res.data.data;
  },

  async getSettings(): Promise<Setting[]> {
    const res = await api.get('/system/settings');
    return res.data.data;
  },
  async updateSetting(id: number, data: Partial<Setting>): Promise<Setting> {
    const res = await api.put(`/system/settings/${id}`, data);
    return res.data.data;
  },

  async getRoles(): Promise<Role[]> {
    const res = await api.get('/system/roles');
    return res.data.data;
  },
};

export default systemService;
