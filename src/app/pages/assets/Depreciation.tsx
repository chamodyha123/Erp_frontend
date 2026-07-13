import { useState, useEffect } from 'react';
import { TrendingDown, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import assetService, { type AssetDepreciation } from '@/services/assetService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const blank = () => ({
  assetId: 0,
  periodYear: new Date().getFullYear(),
  periodMonth: 1,
  openingValue: 0,
  depreciation: 0,
  closingValue: 0,
  method: 'Straight-Line',
});

export function Depreciation() {
  const [records, setRecords] = useState<AssetDepreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<AssetDepreciation | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<AssetDepreciation | null>(null);

  // Asset list for dropdown
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    assetService.getAll({ size: 500 }).then(res => setAssets(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    assetService.getDepreciation({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.asset?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (dep: AssetDepreciation) => {
    setSelected(dep);
    setForm({
      assetId: dep.asset?.id || 0,
      periodYear: dep.periodYear || new Date().getFullYear(),
      periodMonth: dep.periodMonth || 1,
      openingValue: dep.openingValue || 0,
      depreciation: dep.depreciation || 0,
      closingValue: dep.closingValue || 0,
      method: dep.method || 'Straight-Line',
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
      periodYear: form.periodYear,
      periodMonth: form.periodMonth,
      openingValue: form.openingValue,
      depreciation: form.depreciation,
      closingValue: form.closingValue,
      method: form.method,
    };

    if (selected) {
      assetService.updateDepreciation(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      assetService.createDepreciation(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await assetService.deleteDepreciation(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-blue-600" /> Asset Depreciation
          </h1>
          <p className="text-gray-500 mt-1">Monitor asset depreciation values</p>
        </div>
        <button
          onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> New Entry
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading data...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Asset', 'Period', 'Method', 'Opening Value', 'Depreciation', 'Closing Value', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.asset?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {r.periodYear}-{String(r.periodMonth).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.method ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.openingValue)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-red-600">{fmt(r.depreciation)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.closingValue)}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">
                        View
                      </button>
                      <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-800">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(r)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No depreciation records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Depreciation Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Asset" value={selected.asset?.name ?? '-'} />
            <DetailRow label="Period" value={`${selected.periodYear}-${String(selected.periodMonth).padStart(2, '0')}`} />
            <DetailRow label="Method" value={selected.method ?? '-'} />
            <DetailRow label="Opening Value" value={fmt(selected.openingValue)} />
            <DetailRow label="Depreciation" value={fmt(selected.depreciation)} />
            <DetailRow label="Closing Value" value={fmt(selected.closingValue)} />
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Depreciation' : 'New Depreciation Entry'}
        size="md"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>
              {selected ? 'Update' : 'Create'}
            </ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Asset" required>
            <select
              value={form.assetId}
              onChange={e => setForm(f => ({ ...f, assetId: Number(e.target.value) }))}
              className={selectCls}
              disabled={!!selected}
            >
              <option value={0}>-- Select --</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.assetCode})</option>
              ))}
            </select>
          </FormField>
          <FormField label="Period Year">
            <input
              type="number"
              value={form.periodYear}
              onChange={e => setForm(f => ({ ...f, periodYear: Number(e.target.value) }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Period Month">
            <input
              type="number"
              min="1"
              max="12"
              value={form.periodMonth}
              onChange={e => setForm(f => ({ ...f, periodMonth: Number(e.target.value) }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Method">
            <input
              value={form.method}
              onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Opening Value">
            <input
              type="number"
              value={form.openingValue || ''}
              onChange={e => setForm(f => ({ ...f, openingValue: Number(e.target.value) }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Depreciation">
            <input
              type="number"
              value={form.depreciation || ''}
              onChange={e => setForm(f => ({ ...f, depreciation: Number(e.target.value) }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Closing Value">
            <input
              type="number"
              value={form.closingValue || ''}
              onChange={e => setForm(f => ({ ...f, closingValue: Number(e.target.value) }))}
              className={inputCls}
            />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn>
            <ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn>
          </>
        }
      >
        <p>Are you sure you want to delete this depreciation record?</p>
      </Modal>
    </div>
  );
}