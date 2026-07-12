import api from './api';
import type { PageResponse } from './employeeService';

export interface Asset { /* ... same as before ... */ }
export interface AssetMaintenance { /* ... */ }
export interface AssetTransfer { /* ... */ }
export interface AssetDepreciation { /* ... */ }

const assetService = {
  // ---------- Assets ----------
  getAll: (params?: { page?: number; size?: number }) =>
    api.get('/assets', { params }).then(res => res.data.data),
  create: (data: Partial<Asset>) =>
    api.post('/assets', data).then(res => res.data.data),
  update: (id: number, data: Partial<Asset>) =>
    api.put(`/assets/${id}`, data).then(res => res.data.data),
  delete: (id: number) => api.delete(`/assets/${id}`),

  // ---------- Maintenance ----------
  getMaintenance: (params?: { page?: number; size?: number }) =>
    api.get('/assets/maintenance', { params }).then(res => res.data.data),
  createMaintenance: (data: Partial<AssetMaintenance>) =>
    api.post('/assets/maintenance', data).then(res => res.data.data),
  updateMaintenance: (id: number, data: Partial<AssetMaintenance>) =>
    api.put(`/assets/maintenance/${id}`, data).then(res => res.data.data),
  deleteMaintenance: (id: number) => api.delete(`/assets/maintenance/${id}`),

  // ---------- Transfers ----------
  getTransfers: (params?: { page?: number; size?: number }) =>
    api.get('/assets/transfers', { params }).then(res => res.data.data),
  createTransfer: (data: Partial<AssetTransfer>) =>
    api.post('/assets/transfers', data).then(res => res.data.data),
  updateTransfer: (id: number, data: Partial<AssetTransfer>) =>
    api.put(`/assets/transfers/${id}`, data).then(res => res.data.data),
  deleteTransfer: (id: number) => api.delete(`/assets/transfers/${id}`),

  // ---------- Depreciation ----------
  getDepreciation: (params?: { page?: number; size?: number }) =>
    api.get('/assets/depreciation', { params }).then(res => res.data.data),
  createDepreciation: (data: Partial<AssetDepreciation>) =>
    api.post('/assets/depreciation', data).then(res => res.data.data),
  updateDepreciation: (id: number, data: Partial<AssetDepreciation>) =>
    api.put(`/assets/depreciation/${id}`, data).then(res => res.data.data),
  deleteDepreciation: (id: number) => api.delete(`/assets/depreciation/${id}`),
};

export default assetService;