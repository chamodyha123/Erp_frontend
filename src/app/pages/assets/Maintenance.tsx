import { useState, useEffect } from 'react';
import { Wrench, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import assetService, { type AssetMaintenance } from '@/services/assetService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const statusColor: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  assetId: 0,
  maintenanceType: 'PREVENTIVE',
  scheduledDate: '',
  cost: 0,
  status: 'SCHEDULED',
  description: '',
});

export function Maintenance() {
  const [records, setRecords] = useState<AssetMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<AssetMaintenance | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<AssetMaintenance | null>(null);

  // Asset list for dropdown
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    assetService.getAll({ size: 500 }).then(res => setAssets(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    assetService.getMaintenance({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.asset?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (maintenance: AssetMaintenance) => {
    setSelected(maintenance);
    setForm({
      assetId: maintenance.asset?.id || 0,
      maintenanceType: maintenance.maintenanceType || 'PREVENTIVE',
      scheduledDate: maintenance.scheduledDate || '',
      cost: maintenance.cost || 0,
      status: maintenance.status || 'SCHEDULED',
      description: maintenance.description || '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      asset: form.assetId ? { id: form.assetId } : null,
      maintenanceType: form.maintenanceType,
      scheduledDate: form.scheduledDate,
      cost: form.cost,
      status: form.status,
      description: form.description,
    };

    if (selected) {
      assetService.updateMaintenance(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      assetService.createMaintenance(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await assetService.deleteMaintenance(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-600" /> Asset Maintenance
          </h1>
          <p className="text-gray-500 mt-1">Manage asset maintenance schedules</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Schedule
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
                {['Asset', 'Type', 'Scheduled', 'Cost', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.maintenanceType ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.scheduledDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.cost)}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Maintenance Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Asset" value={selected.asset?.name ?? '-'} />
            <DetailRow label="Type" value={selected.maintenanceType ?? '-'} />
            <DetailRow label="Scheduled" value={selected.scheduledDate ?? '-'} />
            <DetailRow label="Cost" value={fmt(selected.cost)} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Maintenance' : 'New Maintenance Schedule'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Asset" required>
            <select value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetCode})</option>)}
            </select>
          </FormField>
          <FormField label="Type">
            <select value={form.maintenanceType} onChange={e => setForm(f => ({ ...f, maintenanceType: e.target.value }))} className={selectCls}>
              <option value="PREVENTIVE">Preventive</option>
              <option value="CORRECTIVE">Corrective</option>
              <option value="INSPECTION">Inspection</option>
            </select>
          </FormField>
          <FormField label="Scheduled Date">
            <input type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Cost">
            <input type="number" value={form.cost || ''} onChange={e => setForm(f => ({ ...f, cost: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} rows={3} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete this maintenance record?</p>
      </Modal>
    </div>
  );
}