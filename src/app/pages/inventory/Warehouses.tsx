import { useState, useEffect } from 'react';
import { Warehouse as WarehouseIcon, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import warehouseService, { type Warehouse } from '@/services/warehouseService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({
  code: '',
  name: '',
  address: '',
  city: '',
  country: 'Sri Lanka',
  isActive: true,
  managerId: 0,
});

export function Warehouses() {
  const [records, setRecords] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Warehouse | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Warehouse | null>(null);

  const load = () => {
    setLoading(true);
    warehouseService.getAll()
      .then(data => setRecords(Array.isArray(data) ? data : (data as any).content ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.code ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (warehouse: Warehouse) => {
    setSelected(warehouse);
    setForm({
      code: warehouse.code ?? '',
      name: warehouse.name ?? '',
      address: warehouse.address ?? '',
      city: warehouse.city ?? '',
      country: warehouse.country ?? 'Sri Lanka',
      isActive: warehouse.isActive ?? true,
      managerId: warehouse.manager?.id ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      code: form.code,
      name: form.name,
      address: form.address,
      city: form.city,
      country: form.country,
      isActive: form.isActive,
      manager: form.managerId ? { id: form.managerId } : null,
    };

    if (selected) {
      warehouseService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      warehouseService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await warehouseService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <WarehouseIcon className="w-8 h-8 text-blue-600" /> Warehouses
          </h1>
          <p className="text-gray-500 mt-1">Manage warehouse and location data</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Warehouse
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search warehouses..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Code', 'Name', 'City', 'Address', 'Active', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.code ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.city ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 truncate max-w-[200px]">{r.address ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {r.isActive ? 'Active' : 'Inactive'}
                    </span>
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
      <Modal open={modal === 'view'} onClose={close} title="Warehouse Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Code" value={selected.code ?? '-'} />
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Address" value={selected.address ?? '-'} />
            <DetailRow label="City" value={selected.city ?? '-'} />
            <DetailRow label="Country" value={selected.country ?? '-'} />
            <DetailRow label="Manager" value={selected.manager?.fullName ?? '-'} />
            <DetailRow label="Active" value={selected.isActive ? 'Yes' : 'No'} />
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Warehouse' : 'New Warehouse'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Code" required>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Address">
            <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="City">
            <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Country">
            <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Manager ID">
            <input type="number" value={form.managerId || ''} onChange={e => setForm(f => ({ ...f, managerId: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Active">
            <select value={form.isActive ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))} className={selectCls}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </FormField>
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