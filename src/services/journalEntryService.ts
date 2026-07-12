import api from './api';
import type { PageResponse } from './employeeService';

export interface JournalEntry {
  id: number;
  entryNumber: string;
  date: string;
  description?: string;
  reference?: string;
  status: string;
  totalDebit: number;
  totalCredit: number;
  createdAt?: string;
}

const journalEntryService = {
  async getAll(params?: { status?: string; page?: number; size?: number }): Promise<PageResponse<JournalEntry>> {
    const res = await api.get('/journal-entries', { params });
    return res.data.data;
  },
  async getById(id: number): Promise<JournalEntry> {
    const res = await api.get(`/journal-entries/${id}`);
    return res.data.data;
  },
  async create(data: Partial<JournalEntry>): Promise<JournalEntry> {
    const res = await api.post('/journal-entries', data);
    return res.data.data;
  },
  async update(id: number, data: Partial<JournalEntry>): Promise<JournalEntry> {
    const res = await api.put(`/journal-entries/${id}`, data);
    return res.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/journal-entries/${id}`);
  },
};

export default journalEntryService;
