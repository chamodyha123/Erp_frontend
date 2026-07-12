import { useState, useEffect } from 'react';
import { BarChart3, Search, Pencil, Trash2 } from 'lucide-react';
import { stockLevelService, type StockLevel } from '@/services/stockService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls } from '@/app/components/ui/Modal';

const blank = () => ({
  quantity: 0,
  minStock: 0,
  maxStock: 0,
  reservedQty: 0,
});

export function StockLevels() {
  const [records, setRecords] = useState<StockLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<StockLevel | null>(null);
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<StockLevel | null>(null);

  const load = () => {
    setLoading(true);
    stockLevelService.getAll({ size: 200 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.product?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.warehouse?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (level: StockLevel) => {
    setSelected(level);
    setForm({
      quantity: level.quantity ?? 0,
      minStock: level.minStock ?? 0,
      maxStock: level.maxStock ?? 0,
      reservedQty: level.reservedQty ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = async () => {
    if (!selected) return;
    await stockLevelService.update(selected.id, form);
    close();
    load();
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await stockLevelService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" /> Stock Levels
        </h1>
        <p className="text-gray-500 mt-1">Monitor and adjust stock levels</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product or warehouse..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Product', 'Warehouse', 'Qty', 'Min Stock', 'Max Stock', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.product?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.warehouse?.name ?? '-'}</td>
                  <td className={`px-4 py-4 text-sm font-semibold ${(r.quantity ?? 0) < (r.minStock ?? 0) ? 'text-red-600' : 'text-gray-900'}`}>
                    {r.quantity ?? 0}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.minStock ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.maxStock ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Stock Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Product" value={selected.product?.name ?? '-'} />
            <DetailRow label="Warehouse" value={selected.warehouse?.name ?? '-'} />
            <DetailRow label="Quantity" value={String(selected.quantity ?? 0)} />
            <DetailRow label="Min Stock" value={String(selected.minStock ?? '-')} />
            <DetailRow label="Max Stock" value={String(selected.maxStock ?? '-')} />
            <DetailRow label="Reserved Qty" value={String(selected.reservedQty ?? 0)} />
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title="Edit Stock Level"
        size="sm"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>Save</ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Quantity">
            <input type="number" value={form.quantity ?? ''} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Min Stock">
            <input type="number" value={form.minStock ?? ''} onChange={e => setForm(f => ({ ...f, minStock: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Max Stock">
            <input type="number" value={form.maxStock ?? ''} onChange={e => setForm(f => ({ ...f, maxStock: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Reserved Qty">
            <input type="number" value={form.reservedQty ?? ''} onChange={e => setForm(f => ({ ...f, reservedQty: Number(e.target.value) }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete the stock record for <strong>{deleteConfirm?.product?.name}</strong>?</p>
      </Modal>
    </div>
  );
}