import { useState, useEffect } from 'react';
import { PieChart, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { budgetService, type Budget } from '@/services/financeService';
import departmentService from '@/services/departmentService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '-';
const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  CLOSED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  name: '',
  departmentId: 0,
  periodYear: new Date().getFullYear(),
  periodMonth: new Date().getMonth() + 1,
  budgetType: 'OPERATIONAL',
  amount: 0,
  status: 'DRAFT',
  notes: '',
});

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Budget | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Budget | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    departmentService.getAll()
      .then(res => setDepartments(Array.isArray(res) ? res : (res as any)?.content ?? []))
      .catch(console.error);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await budgetService.getAll({ size: 100 });
      setBudgets(res.content ?? (res as any));
    } catch (err) {
      console.error('Failed to load budgets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = budgets.filter(b =>
    (b.department?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (b.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (b: Budget) => {
    setSelected(b);
    setForm({
      name: b.name ?? '',
      departmentId: b.department?.id ?? 0,
      periodYear: b.periodYear ?? new Date().getFullYear(),
      periodMonth: b.periodMonth ?? new Date().getMonth() + 1,
      budgetType: b.budgetType ?? 'OPERATIONAL',
      amount: b.amount ?? 0,
      status: b.status ?? 'DRAFT',
      notes: b.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      alert('Budget name is required!');
      return;
    }
    const payload = {
      name: form.name,
      department: form.departmentId ? { id: form.departmentId } : null,
      periodYear: form.periodYear,
      periodMonth: form.periodMonth,
      budgetType: form.budgetType,
      amount: form.amount,
      status: form.status,
      notes: form.notes,
    };

    try {
      if (selected) {
        await budgetService.update(selected.id, payload);
      } else {
        await budgetService.create(payload);
      }
      load();
      close();
    } catch (err) {
      console.error('Failed to save budget', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await budgetService.delete(deleteConfirm.id);
      setDeleteConfirm(null);
      load();
    } catch (err) {
      console.error('Failed to delete budget', err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PieChart className="w-8 h-8 text-blue-600" /> Budgets
          </h1>
          <p className="text-gray-500 mt-1">Manage department budgets</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Budget
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search department or type..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                {['Name', 'Department', 'Period', 'Type', 'Budget', 'Spent', 'Remaining', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{b.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{b.department?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {b.periodYear ?? '-'}{b.periodMonth ? `/${String(b.periodMonth).padStart(2, '0')}` : ''}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{b.budgetType ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(b.amount)}</td>
                  <td className="px-4 py-4 text-sm text-orange-600">{fmt(b.actualAmount)}</td>
                  <td className="px-4 py-4 text-sm text-green-600">{fmt((b.amount ?? 0) - (b.actualAmount ?? 0))}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[b.status] ?? 'bg-gray-100 text-gray-800'}`}>{b.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(b); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(b)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(b)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Budget Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Department" value={selected.department?.name ?? '-'} />
            <DetailRow label="Period Year" value={String(selected.periodYear ?? '-')} />
            <DetailRow label="Period Month" value={String(selected.periodMonth ?? '-')} />
            <DetailRow label="Type" value={selected.budgetType ?? '-'} />
            <DetailRow label="Budget" value={fmt(selected.amount)} />
            <DetailRow label="Spent" value={fmt(selected.actualAmount)} />
            <DetailRow label="Remaining" value={fmt((selected.amount ?? 0) - (selected.actualAmount ?? 0))} />
            <DetailRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] ?? 'bg-gray-100 text-gray-800'}`}>{selected.status}</span>
            } />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Budget' : 'New Budget'}
        size="md"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Department">
            <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Period Year" required>
            <input type="number" value={form.periodYear} onChange={e => setForm(f => ({ ...f, periodYear: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Period Month" required>
            <select value={form.periodMonth} onChange={e => setForm(f => ({ ...f, periodMonth: Number(e.target.value) }))} className={selectCls}>
              {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </FormField>
          <FormField label="Type">
            <select value={form.budgetType} onChange={e => setForm(f => ({ ...f, budgetType: e.target.value }))} className={selectCls}>
              <option value="OPERATIONAL">Operational</option>
              <option value="CAPITAL">Capital</option>
              <option value="MARKETING">Marketing</option>
            </select>
          </FormField>
          <FormField label="Total Budget" required>
            <input type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Notes">
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}