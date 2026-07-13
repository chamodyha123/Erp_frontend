import { useState, useEffect } from 'react';
import { Box, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import assetService, { type Asset } from '@/services/assetService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const statusColor: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  'Disposed': 'bg-red-100 text-red-800',
  'Under Maintenance': 'bg-yellow-100 text-yellow-800',
};

const blank = () => ({
  assetCode: '',
  name: '',
  category: '',
  location: '',
  purchaseDate: '',
  purchasePrice: 0,
  status: 'Active',
  assignedToId: 0,
  description: '',
});

export function Assets() {
  const [records, setRecords] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Asset | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    assetService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.assetCode ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (asset: Asset) => {
    setSelected(asset);
    setForm({
      assetCode: asset.assetCode || '',
      name: asset.name || '',
      category: asset.category || '',
      location: asset.location || '',
      purchaseDate: asset.purchaseDate || '',
      purchasePrice: asset.purchasePrice || 0,
      status: asset.status || 'Active',
      assignedToId: asset.assignedTo?.id ?? 0,
      description: asset.description || '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      assignedTo: form.assignedToId ? { id: form.assignedToId } : null,
    };
    delete (payload as any).assignedToId;

    if (selected) {
      assetService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      assetService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await assetService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Box className="w-8 h-8 text-blue-600" /> Assets
          </h1>
          <p className="text-gray-500 mt-1">Manage company asset data</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Asset
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                {['Code', 'Name', 'Category', 'Location', 'Purchase Date', 'Purchase Price', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.assetCode ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.category ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.location ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.purchaseDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.purchasePrice)}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Asset Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Code" value={selected.assetCode ?? '-'} />
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Category" value={selected.category ?? '-'} />
            <DetailRow label="Location" value={selected.location ?? '-'} />
            <DetailRow label="Purchase Date" value={selected.purchaseDate ?? '-'} />
            <DetailRow label="Purchase Price" value={fmt(selected.purchasePrice)} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.assignedTo && <DetailRow label="Assigned To" value={selected.assignedTo.fullName} />}
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Asset' : 'New Asset'}
        size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Asset Code" required>
            <input value={form.assetCode} onChange={e => setForm(f => ({ ...f, assetCode: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Asset Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Category">
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Location">
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Assigned To">
            <select value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Not Assigned --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="Purchase Date">
            <input type="date" value={form.purchaseDate} onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Purchase Price">
            <input type="number" value={form.purchasePrice || ''} onChange={e => setForm(f => ({ ...f, purchasePrice: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Disposed">Disposed</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} rows={3} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}