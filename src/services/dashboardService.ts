import api from './api';

export interface RecentSalesOrder {
  id: number;
  orderNumber: string;
  customer?: { id: number; companyName: string };
  total?: number;
  status: string;
  date?: string;
}

export interface RecentPurchaseOrder {
  id: number;
  poNumber: string;
  vendor?: { id: number; companyName: string };
  total?: number;
  status: string;
  date?: string;
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  totalProducts: number;
  totalCustomers: number;
  totalVendors: number;
  totalSalesOrders: number;
  totalPurchaseOrders: number;
  totalProjects: number;
  recentSalesOrders?: RecentSalesOrder[];
  recentPurchaseOrders?: RecentPurchaseOrder[];
}

const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await api.get('/dashboard/summary');
    return res.data.data;
  },
};

export default dashboardService;
