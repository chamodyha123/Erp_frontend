import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { purchaseRequisitionService, type PurchaseRequisition } from '@/services/purchasingExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const blank = () => ({
  prNumber: '',
  requestedById: 0,
  departmentId: 0,
  date: '',
  neededBy: '',
  status: 'Draft',
  notes: '',
});

export function PurchaseRequisitions() {
  const [records, setRecords] = useState<PurchaseRequisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<PurchaseRequisition | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<PurchaseRequisition | null>(null);

  // Dropdown data
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  useEffect(() => {
    import('@/services/employeeService').then(m => m.default.getAll({ size: 500 }).then(res => setEmployees(res.content ?? [])));
    import('@/services/departmentService').then(m => m.default.getAll().then(res => setDepartments(Array.isArray(res) ? res : res.content ?? [])));
  }, []);

  const load = () => {
    setLoading(true);
    purchaseRequisitionService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.prNumber ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (pr: PurchaseRequisition) => {
    setSelected(pr);
    setForm({
      prNumber: pr.prNumber ?? '',
      requestedById: pr.requestedBy?.id ?? 0,
      departmentId: pr.department?.id ?? 0,
      date: pr.date ?? '',
      neededBy: pr.neededBy ?? '',
      status: pr.status ?? 'Draft',
      notes: pr.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      requestedBy: form.requestedById ? { id: form.requestedById } : null,
      department: form.departmentId ? { id: form.departmentId } : null,
    };
    delete (payload as any).requestedById;
    delete (payload as any).departmentId;

    if (selected) {
      purchaseRequisitionService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      purchaseRequisitionService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await purchaseRequisitionService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-blue-600" /> Purchase Requisitions
          </h1>
          <p className="text-gray-500 mt-1">Manage purchase requests</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New PR
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search PRs..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['PR No.', 'Requested By', 'Department', 'Date', 'Needed By', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.prNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.requestedBy?.fullName ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.department?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.date ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.neededBy ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? 'bg-gray-100 text-gray-800'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(r)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="PR Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="PR Number" value={selected.prNumber ?? '-'} />
            <DetailRow label="Requested By" value={selected.requestedBy?.fullName ?? '-'} />
            <DetailRow label="Department" value={selected.department?.name ?? '-'} />
            <DetailRow label="Date" value={selected.date ?? '-'} />
            <DetailRow label="Needed By" value={selected.neededBy ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit PR' : 'New PR'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="PR Number" required>
            <input value={form.prNumber} onChange={e => setForm(f => ({ ...f, prNumber: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Requested By" required>
            <select value={form.requestedById} onChange={e => setForm(f => ({ ...f, requestedById: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="Department">
            <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Needed By">
            <input type="date" value={form.neededBy} onChange={e => setForm(f => ({ ...f, neededBy: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
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
        <p>Are you sure you want to delete <strong>{deleteConfirm?.prNumber}</strong>?</p>
      </Modal>
    </div>
  );
}