import api from './api';
import type { PageResponse } from './employeeService';

export interface Lead {
  id: number;
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: string;
  assignedTo?: { id: number; fullName: string };
  notes?: string;
  createdAt?: string;
}

export interface Opportunity {
  id: number;
  name: string;
   customer?: { id: number; name: string };
  lead?: { id: number; company: string };
  value?: number;
  currency?: string;
  stage: string;
  probability?: number;
  expectedClose?: string;
  owner?: { id: number; fullName: string };
  notes?: string;
  createdAt?: string;
}

export interface Activity {
  id: number;
  type: string;
  subject: string;
  description?: string;
  status: string;
  dueDate?: string;
  lead?: { id: number; company: string };
  opportunity?: { id: number; name: string };
  customer?: { id: number; companyName: string };
  assignedTo?: { id: number; fullName: string };
  createdBy?: { id: number; username: string };
  createdAt?: string;
}

export interface Campaign {
  id: number;
  name: string;
  type?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  targetAudience?: string;
  description?: string;
  createdAt?: string;
}

const crmService = {
  // Leads
  async getLeads(params?: { page?: number; size?: number }): Promise<PageResponse<Lead>> {
    const res = await api.get('/crm/leads', { params });
    return res.data.data;
  },
  async createLead(data: Partial<Lead>): Promise<Lead> {
    const res = await api.post('/crm/leads', data);
    return res.data.data;
  },
  async updateLead(id: number, data: Partial<Lead>): Promise<Lead> {
    const res = await api.put(`/crm/leads/${id}`, data);
    return res.data.data;
  },
  async deleteLead(id: number): Promise<void> {
    await api.delete(`/crm/leads/${id}`);
  },

  // Opportunities
  async getOpportunities(params?: { page?: number; size?: number }): Promise<PageResponse<Opportunity>> {
    const res = await api.get('/crm/opportunities', { params });
    return res.data.data;
  },
  async createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await api.post('/crm/opportunities', data);
    return res.data.data;
  },
  async updateOpportunity(id: number, data: Partial<Opportunity>): Promise<Opportunity> {
    const res = await api.put(`/crm/opportunities/${id}`, data);
    return res.data.data;
  },
  async deleteOpportunity(id: number): Promise<void> {
    await api.delete(`/crm/opportunities/${id}`);
  },

  // Activities
  async getActivities(params?: { page?: number; size?: number }): Promise<PageResponse<Activity>> {
    const res = await api.get('/crm/activities', { params });
    return res.data.data;
  },
  async createActivity(data: Partial<Activity>): Promise<Activity> {
    const res = await api.post('/crm/activities', data);
    return res.data.data;
  },
  async updateActivity(id: number, data: Partial<Activity>): Promise<Activity> {
    const res = await api.put(`/crm/activities/${id}`, data);
    return res.data.data;
  },
  async deleteActivity(id: number): Promise<void> {
    await api.delete(`/crm/activities/${id}`);
  },

  // Campaigns
  async getCampaigns(params?: { page?: number; size?: number }): Promise<PageResponse<Campaign>> {
    const res = await api.get('/crm/campaigns', { params });
    return res.data.data;
  },
  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const res = await api.post('/crm/campaigns', data);
    return res.data.data;
  },
  async updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign> {
    const res = await api.put(`/crm/campaigns/${id}`, data);
    return res.data.data;
  },
  async deleteCampaign(id: number): Promise<void> {
    await api.delete(`/crm/campaigns/${id}`);
  },
};

export default crmService;