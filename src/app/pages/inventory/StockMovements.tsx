import { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { stockMovementService, type StockMovement } from '@/services/stockService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const typeColor: Record<string, string> = {
  IN: 'bg-green-100 text-green-800',
  OUT: 'bg-red-100 text-red-800',
  TRANSFER: 'bg-blue-100 text-blue-800',
  ADJUSTMENT: 'bg-yellow-100 text-yellow-800',
};

const blank = () => ({
  productId: 0,
  warehouseId: 0,
  movementType: 'IN',
  quantity: 0,
  unitCost: 0,
  referenceType: '',
  referenceId: 0,
  notes: '',
});

export function StockMovements() {
  const [records, setRecords] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<StockMovement | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<StockMovement | null>(null);

  // Dropdowns
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/productService').then(m => m.default.getAll({ size: 500 }).then(res => setProducts(res.content ?? [])));
    import('@/services/warehouseService').then(m => m.default.getAll().then(data => setWarehouses(Array.isArray(data) ? data : data.content ?? [])));
  }, []);

  const load = () => {
    setLoading(true);
    stockMovementService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.product?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (mov: StockMovement) => {
    setSelected(mov);
    setForm({
      productId: mov.product?.id ?? 0,
      warehouseId: mov.warehouse?.id ?? 0,
      movementType: mov.movementType ?? 'IN',
      quantity: mov.quantity ?? 0,
      unitCost: mov.unitCost ?? 0,
      referenceType: mov.referenceType ?? '',
      referenceId: mov.referenceId ?? 0,
      notes: mov.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      product: form.productId ? { id: form.productId } : null,
      warehouse: form.warehouseId ? { id: form.warehouseId } : null,
      movementType: form.movementType,
      quantity: form.quantity,
      unitCost: form.unitCost,
      referenceType: form.referenceType,
      referenceId: form.referenceId,
      notes: form.notes,
    };

    if (selected) {
      stockMovementService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      stockMovementService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await stockMovementService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8 text-blue-600" /> Stock Movements
          </h1>
          <p className="text-gray-500 mt-1">Stock movement history</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Movement
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Product', 'Warehouse', 'Type', 'Qty', 'Ref. Doc', 'Date', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.product?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.warehouse?.name ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor[r.movementType ?? ''] ?? 'bg-gray-100 text-gray-800'}`}>{r.movementType ?? '-'}</span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{r.quantity ?? 0}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.referenceType ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB') : '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Movement Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Product" value={selected.product?.name ?? '-'} />
            <DetailRow label="Warehouse" value={selected.warehouse?.name ?? '-'} />
            <DetailRow label="Type" value={selected.movementType ?? '-'} />
            <DetailRow label="Quantity" value={String(selected.quantity ?? 0)} />
            <DetailRow label="Unit Cost" value={String(selected.unitCost ?? 0)} />
            <DetailRow label="Reference Type" value={selected.referenceType ?? '-'} />
            <DetailRow label="Reference ID" value={selected.referenceId?.toString() ?? '-'} />
            <DetailRow label="Date" value={selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-GB') : '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Movement' : 'New Movement'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Product" required>
            <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {products.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.sku})</option>))}
            </select>
          </FormField>
          <FormField label="Warehouse" required>
            <select value={form.warehouseId} onChange={e => setForm(f => ({ ...f, warehouseId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {warehouses.map(w => (<option key={w.id} value={w.id}>{w.name} ({w.code})</option>))}
            </select>
          </FormField>
          <FormField label="Type">
            <select value={form.movementType} onChange={e => setForm(f => ({ ...f, movementType: e.target.value }))} className={selectCls}>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="TRANSFER">TRANSFER</option>
              <option value="ADJUSTMENT">ADJUSTMENT</option>
            </select>
          </FormField>
          <FormField label="Quantity">
            <input type="number" value={form.quantity ?? ''} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Unit Cost">
            <input type="number" value={form.unitCost ?? ''} onChange={e => setForm(f => ({ ...f, unitCost: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Reference Type">
            <input value={form.referenceType} onChange={e => setForm(f => ({ ...f, referenceType: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Reference ID">
            <input type="number" value={form.referenceId ?? ''} onChange={e => setForm(f => ({ ...f, referenceId: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Notes">
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete this movement record? This may affect inventory integrity.</p>
      </Modal>
    </div>
  );
}