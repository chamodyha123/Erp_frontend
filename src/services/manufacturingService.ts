import api from './api';
import type { PageResponse } from './employeeService';

export interface BillOfMaterials {
  id: number;
  bomNumber?: string;
  product?: { id: number; name: string };
  name?: string;
  version?: string;
  isActive?: boolean;
  status?: string;
  description?: string;
}

export interface ProductionOrder {
  id: number;
  orderNumber: string;
  product?: { id: number; name: string };
  bom?: { id: number; name: string };
  plannedQty: number;
  producedQty?: number;
  plannedStart?: string;
  plannedEnd?: string;
  status: string;
  priority?: string;
  notes?: string;
}

export interface WorkOrder {
  id: number;
  workOrderNumber: string;
  productionOrder?: { id: number; orderNumber: string };
  workCenter?: string;
  operation?: string;
  plannedHours?: number;
  actualHours?: number;
  status: string;
  assignedTo?: { id: number; fullName: string };
}

export interface QualityControl {
  id: number;
  checkNumber?: string;
  productionOrder?: { id: number; orderNumber: string };
  product?: { id: number; name: string };
  inspectionDate?: string;
  checkDate?: string;
  batchNumber?: string;
  totalInspected?: number;
  passed?: number;
  failed?: number;
  result?: string;
  status?: string;
  inspector?: { id: number; fullName: string };
  remarks?: string;
  notes?: string;
}

const manufacturingService = {
  async getBoms(params?: { page?: number; size?: number }): Promise<PageResponse<BillOfMaterials>> {
    const res = await api.get('/manufacturing/bill-of-materials', { params });
    return res.data.data;
  },
  async getBOMs(params?: { page?: number; size?: number }): Promise<PageResponse<BillOfMaterials>> {
    return manufacturingService.getBoms(params);
  },
  async createBom(data: Partial<BillOfMaterials>): Promise<BillOfMaterials> {
    const res = await api.post('/manufacturing/bill-of-materials', data);
    return res.data.data;
  },
  async createBOM(data: Partial<BillOfMaterials>): Promise<BillOfMaterials> {
    return manufacturingService.createBom(data);
  },
  async updateBom(id: number, data: Partial<BillOfMaterials>): Promise<BillOfMaterials> {
    const res = await api.put(`/manufacturing/bill-of-materials/${id}`, data);
    return res.data.data;
  },
  async deleteBom(id: number): Promise<void> {
    await api.delete(`/manufacturing/bill-of-materials/${id}`);
  },

  async getProductionOrders(params?: { page?: number; size?: number }): Promise<PageResponse<ProductionOrder>> {
    const res = await api.get('/manufacturing/production-orders', { params });
    return res.data.data;
  },
  async createProductionOrder(data: Partial<ProductionOrder>): Promise<ProductionOrder> {
    const res = await api.post('/manufacturing/production-orders', data);
    return res.data.data;
  },
  async updateProductionOrder(id: number, data: Partial<ProductionOrder>): Promise<ProductionOrder> {
    const res = await api.put(`/manufacturing/production-orders/${id}`, data);
    return res.data.data;
  },
  async deleteProductionOrder(id: number): Promise<void> {
    await api.delete(`/manufacturing/production-orders/${id}`);
  },

  async getWorkOrders(params?: { page?: number; size?: number }): Promise<PageResponse<WorkOrder>> {
    const res = await api.get('/manufacturing/work-orders', { params });
    return res.data.data;
  },
  async createWorkOrder(data: Partial<WorkOrder>): Promise<WorkOrder> {
    const res = await api.post('/manufacturing/work-orders', data);
    return res.data.data;
  },
  async updateWorkOrder(id: number, data: Partial<WorkOrder>): Promise<WorkOrder> {
    const res = await api.put(`/manufacturing/work-orders/${id}`, data);
    return res.data.data;
  },
  async deleteWorkOrder(id: number): Promise<void> {
    await api.delete(`/manufacturing/work-orders/${id}`);
  },

  async getQualityControls(params?: { page?: number; size?: number }): Promise<PageResponse<QualityControl>> {
    const res = await api.get('/manufacturing/quality-control', { params });
    return res.data.data;
  },
  async getQCChecks(params?: { page?: number; size?: number }): Promise<PageResponse<QualityControl>> {
    return manufacturingService.getQualityControls(params);
  },
  async createQualityControl(data: Partial<QualityControl>): Promise<QualityControl> {
    const res = await api.post('/manufacturing/quality-control', data);
    return res.data.data;
  },
  async updateQualityControl(id: number, data: Partial<QualityControl>): Promise<QualityControl> {
    const res = await api.put(`/manufacturing/quality-control/${id}`, data);
    return res.data.data;
  },
  async deleteQualityControl(id: number): Promise<void> {
    await api.delete(`/manufacturing/quality-control/${id}`);
  },
};

export default manufacturingService;
