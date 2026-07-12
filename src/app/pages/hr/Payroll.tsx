import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import hrExtService, { type Payroll } from '@/services/hrExtService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + n.toLocaleString('en-LK') : '-';

const statusColor: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
};

const blank = () => ({
  employeeId: 0,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  netSalary: 0,
});

export function Payroll() {
  const [records, setRecords] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Payroll | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Payroll | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    hrExtService.getPayroll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.employee?.fullName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (pr: Payroll) => {
    setSelected(pr);
    setForm({
      employeeId: pr.employee?.id ?? 0,
      year: pr.year ?? new Date().getFullYear(),
      month: pr.month ?? new Date().getMonth() + 1,
      basicSalary: pr.basicSalary ?? 0,
      allowances: pr.allowances ?? 0,
      deductions: pr.deductions ?? 0,
      netSalary: pr.netSalary ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = async () => {
    const netSalary = form.basicSalary + (form.allowances ?? 0) - (form.deductions ?? 0);
    const payload = {
      employee: { id: form.employeeId },
      year: form.year,
      month: form.month,
      basicSalary: form.basicSalary,
      allowances: form.allowances,
      deductions: form.deductions,
      netSalary,
      status: selected?.status ?? 'DRAFT',
    };

    if (selected) {
      await hrExtService.updatePayroll(selected.id, payload);
    } else {
      await hrExtService.createPayroll(payload);
    }
    close();
    load();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await hrExtService.deletePayroll(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await hrExtService.updatePayrollStatus(id, newStatus);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" /> Payroll
          </h1>
          <p className="text-gray-500 mt-1">Manage employee payroll data</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Create Payslip
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', val: records.length, color: 'text-gray-900' },
          { label: 'Pending', val: records.filter(r => r.status === 'DRAFT').length, color: 'text-gray-600' },
          { label: 'Paid', val: records.filter(r => r.status === 'PAID').length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.month}/{r.year}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.basicSalary)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.allowances)}</td>
                  <td className="px-4 py-4 text-sm text-red-600">{fmt(r.deductions)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.netSalary)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] || 'bg-gray-100 text-gray-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(r)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                      {r.status === 'DRAFT' && (
                        <button onClick={() => handleStatusChange(r.id, 'APPROVED')} className="text-green-600 hover:text-green-800">Approve</button>
                      )}
                      {r.status === 'APPROVED' && (
                        <button onClick={() => handleStatusChange(r.id, 'PAID')} className="text-blue-600 hover:text-blue-800">Pay</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Salary Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? '-'} />
            <DetailRow label="Period" value={selected.month + '/' + selected.year} />
            <DetailRow label="Basic Salary" value={fmt(selected.basicSalary)} />
            <DetailRow label="Allowances" value={fmt(selected.allowances)} />
            <DetailRow label="Deductions" value={fmt(selected.deductions)} />
            <DetailRow label="Net Salary" value={fmt(selected.netSalary)} />
            <DetailRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] || 'bg-gray-100 text-gray-800'}`}>
                {selected.status}
              </span>
            } />
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Payslip' : 'Create Payslip'}
        size="md"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee" required>
            <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: Number(e.target.value) }))} className={selectCls} disabled={!!selected}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Month">
            <select value={form.month} onChange={e => setForm(f => ({ ...f, month: Number(e.target.value) }))} className={selectCls}>
              {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </FormField>
          <FormField label="Year" required>
            <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Basic Salary" required>
            <input type="number" value={form.basicSalary || ''} onChange={e => setForm(f => ({ ...f, basicSalary: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Allowances">
            <input type="number" value={form.allowances || ''} onChange={e => setForm(f => ({ ...f, allowances: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Deductions">
            <input type="number" value={form.deductions || ''} onChange={e => setForm(f => ({ ...f, deductions: Number(e.target.value) }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete the payslip for <strong>{deleteConfirm?.employee?.fullName}</strong>?</p>
      </Modal>
    </div>
  );
}