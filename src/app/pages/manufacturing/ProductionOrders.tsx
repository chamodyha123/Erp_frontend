import { useState, useEffect } from 'react';
import { Factory, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import manufacturingService, { type ProductionOrder } from '@/services/manufacturingService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-800',
  Planned: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const blank = () => ({
  orderNumber: '',
  productId: 0,
  bomId: 0,
  plannedQty: 0,
  producedQty: 0,
  plannedStart: '',
  plannedEnd: '',
  status: 'Draft',
  priority: 'Normal',
  notes: '',
});

export function ProductionOrders() {
  const [records, setRecords] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<ProductionOrder | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<ProductionOrder | null>(null);

  // Dropdown data
  const [products, setProducts] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);

  useEffect(() => {
    // Load products and BOMs for dropdowns
    import('@/services/productService')
      .then(m => m.default.getAll({ size: 500 }).then(res => setProducts(res.content ?? [])))
      .catch(console.warn);
    manufacturingService.getBOMs({ size: 500 }).then(res => setBoms(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    manufacturingService.getProductionOrders({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.orderNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.product?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (order: ProductionOrder) => {
    setSelected(order);
    setForm({
      orderNumber: order.orderNumber ?? '',
      productId: order.product?.id ?? 0,
      bomId: order.bom?.id ?? 0,
      plannedQty: order.plannedQty ?? 0,
      producedQty: order.producedQty ?? 0,
      plannedStart: order.plannedStart ?? '',
      plannedEnd: order.plannedEnd ?? '',
      status: order.status ?? 'Draft',
      priority: order.priority ?? 'Normal',
      notes: order.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      orderNumber: form.orderNumber,
      product: form.productId ? { id: form.productId } : null,
      bom: form.bomId ? { id: form.bomId } : null,
      plannedQty: form.plannedQty,
      producedQty: form.producedQty,
      plannedStart: form.plannedStart,
      plannedEnd: form.plannedEnd,
      status: form.status,
      priority: form.priority,
      notes: form.notes,
    };

    if (selected) {
      manufacturingService.updateProductionOrder(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      manufacturingService.createProductionOrder(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await manufacturingService.deleteProductionOrder(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Factory className="w-8 h-8 text-blue-600" /> Production Orders
          </h1>
          <p className="text-gray-500 mt-1">Manage production orders</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Order
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search production orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Order No.', 'Product', 'Planned Qty', 'Produced', 'Start', 'End', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.orderNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.product?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.plannedQty ?? 0}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.producedQty ?? 0}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.plannedStart ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.plannedEnd ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Production Order Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Order Number" value={selected.orderNumber ?? '-'} />
            <DetailRow label="Product" value={selected.product?.name ?? '-'} />
            <DetailRow label="BOM" value={selected.bom?.bomNumber ?? (selected.bom?.name ?? '-')} />
            <DetailRow label="Planned Qty" value={String(selected.plannedQty ?? 0)} />
            <DetailRow label="Produced Qty" value={String(selected.producedQty ?? 0)} />
            <DetailRow label="Planned Start" value={selected.plannedStart ?? '-'} />
            <DetailRow label="Planned End" value={selected.plannedEnd ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            <DetailRow label="Priority" value={selected.priority ?? '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Production Order' : 'New Production Order'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Order Number" required>
            <input value={form.orderNumber} onChange={e => setForm(f => ({ ...f, orderNumber: e.target.value }))} className={inputCls} />
          </FormField>

          <FormField label="Product" required>
            <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </FormField>

          <FormField label="BOM">
            <select value={form.bomId} onChange={e => setForm(f => ({ ...f, bomId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {boms.map(b => (
                <option key={b.id} value={b.id}>{b.bomNumber ?? b.name} - {b.product?.name ?? ''}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Planned Qty">
            <input type="number" value={form.plannedQty || ''} onChange={e => setForm(f => ({ ...f, plannedQty: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Planned Start">
            <input type="date" value={form.plannedStart} onChange={e => setForm(f => ({ ...f, plannedStart: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Planned End">
            <input type="date" value={form.plannedEnd} onChange={e => setForm(f => ({ ...f, plannedEnd: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className={selectCls}>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="Draft">Draft</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Notes">
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.orderNumber}</strong>?</p>
      </Modal>
    </div>
  );
}