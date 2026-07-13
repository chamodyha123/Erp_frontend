import { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import assetService, { type AssetTransfer } from '@/services/assetService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  assetId: 0,
  fromEmployeeId: 0,
  toEmployeeId: 0,
  fromLocation: '',
  toLocation: '',
  transferDate: '',
  status: 'PENDING',
  reason: '',
});

export function AssetTransfers() {
  const [records, setRecords] = useState<AssetTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<AssetTransfer | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<AssetTransfer | null>(null);

  // Dropdown data
  const [assets, setAssets] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    assetService.getAll({ size: 500 }).then(res => setAssets(res.content ?? []));
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    assetService.getTransfers({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.asset?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (transfer: AssetTransfer) => {
    setSelected(transfer);
    setForm({
      assetId: transfer.asset?.id || 0,
      fromEmployeeId: transfer.fromEmployee?.id || 0,
      toEmployeeId: transfer.toEmployee?.id || 0,
      fromLocation: transfer.fromLocation || '',
      toLocation: transfer.toLocation || '',
      transferDate: transfer.transferDate || '',
      status: transfer.status || 'PENDING',
      reason: transfer.reason || '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    if (!form.assetId) {
      alert('Please select an asset!');
      return;
    }
    const payload = {
      asset: { id: form.assetId },
      fromEmployee: form.fromEmployeeId ? { id: form.fromEmployeeId } : null,
      toEmployee: form.toEmployeeId ? { id: form.toEmployeeId } : null,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      transferDate: form.transferDate,
      status: form.status,
      reason: form.reason,
    };

    if (selected) {
      assetService.updateTransfer(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      assetService.createTransfer(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await assetService.deleteTransfer(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-blue-600" /> Asset Transfers
          </h1>
          <p className="text-gray-500 mt-1">Manage asset transfers</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Transfer
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Asset', 'From', 'To', 'Transfer Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.fromLocation ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.toLocation ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.transferDate ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Transfer Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Asset" value={selected.asset?.name ?? '-'} />
            <DetailRow label="From Employee" value={selected.fromEmployee?.fullName ?? '-'} />
            <DetailRow label="To Employee" value={selected.toEmployee?.fullName ?? '-'} />
            <DetailRow label="From Location" value={selected.fromLocation ?? '-'} />
            <DetailRow label="To Location" value={selected.toLocation ?? '-'} />
            <DetailRow label="Transfer Date" value={selected.transferDate ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.reason && <DetailRow label="Reason" value={selected.reason} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Transfer' : 'New Transfer'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Asset" required>
            <select value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetCode})</option>)}
            </select>
          </FormField>
          <FormField label="From Employee">
            <select value={form.fromEmployeeId} onChange={e => setForm(f => ({ ...f, fromEmployeeId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="To Employee">
            <select value={form.toEmployeeId} onChange={e => setForm(f => ({ ...f, toEmployeeId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="From Location" required>
            <input value={form.fromLocation} onChange={e => setForm(f => ({ ...f, fromLocation: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="To Location" required>
            <input value={form.toLocation} onChange={e => setForm(f => ({ ...f, toLocation: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Transfer Date">
            <input type="date" value={form.transferDate} onChange={e => setForm(f => ({ ...f, transferDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Reason">
              <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inputCls} rows={2} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete this transfer?</p>
      </Modal>
    </div>
  );
}