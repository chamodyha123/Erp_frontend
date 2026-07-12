import api from './api';
import type { PageResponse } from './employeeService';

export interface Attendance {
  id: number;
  employee?: { id: number; fullName: string; employeeId: string };
  date: string;
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  status: string;
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  employee?: { id: number; fullName: string; employeeId: string };
  leaveType: string;
  startDate: string;
  endDate: string;
  days?: number;
  reason?: string;
  status: string;
  approvedBy?: { id: number; fullName: string };
}

export interface Payroll {
  id: number;
  employee?: { id: number; fullName: string; employeeId: string };
  period?: string;
  year?: number;
  month?: number;
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  netSalary?: number;
  status: string;
}

export interface Recruitment {
  id: number;
  jobTitle: string;
  department?: { id: number; name: string };
  positions?: number;
  applications?: number;
  shortlisted?: number;
  status: string;
  postedDate?: string;
  closingDate?: string;
}

const hrExtService = {
  // Attendance — endpoint: /attendance/date/TODAY returns list
  async getAttendanceByDate(date: string): Promise<Attendance[]> {
    const res = await api.get(`/attendance/date/${date}`);
    return res.data.data;
  },
  async createAttendance(data: Partial<Attendance>): Promise<Attendance> {
    const res = await api.post('/attendance', data);
    return res.data.data;
  },

  // Leave requests
  async getLeaveRequests(params?: { page?: number; size?: number; status?: string }): Promise<PageResponse<LeaveRequest>> {
    const res = await api.get('/leave-requests', { params });
    return res.data.data;
  },
  async createLeaveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const res = await api.post('/leave-requests', data);
    return res.data.data;
  },
  async approveLeaveRequest(id: number, status: string): Promise<LeaveRequest> {
    const res = await api.patch(`/leave-requests/${id}/approve`, { status });
    return res.data.data;
  },

  // Payroll
  async getPayroll(params?: { page?: number; size?: number; year?: number; month?: number; status?: string }): Promise<PageResponse<Payroll>> {
    const res = await api.get('/payroll', { params });
    return res.data.data;
  },
  async createPayroll(data: Partial<Payroll>): Promise<Payroll> {
    const res = await api.post('/payroll', data);
    return res.data.data;
  },
  async updatePayrollStatus(id: number, status: string): Promise<Payroll> {
    const res = await api.patch(`/payroll/${id}/status`, { status });
    return res.data.data;
  },

  // Recruitment
  async getRecruitment(params?: { page?: number; size?: number }): Promise<PageResponse<Recruitment>> {
    const res = await api.get('/recruitment', { params });
    return res.data.data;
  },
  async createRecruitment(data: Partial<Recruitment>): Promise<Recruitment> {
    const res = await api.post('/recruitment', data);
    return res.data.data;
  },
  async updateRecruitment(id: number, data: Partial<Recruitment>): Promise<Recruitment> {
    const res = await api.put(`/recruitment/${id}`, data);
    return res.data.data;
  },
  async deleteRecruitment(id: number): Promise<void> {
    await api.delete(`/recruitment/${id}`);
  },
};

export default hrExtService;
