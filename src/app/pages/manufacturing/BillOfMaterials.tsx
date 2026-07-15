import { useState, useEffect } from 'react';
import { Layers, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import manufacturingService, { type BillOfMaterials } from '@/services/manufacturingService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-red-100 text-red-800',
};

const blank = () => ({
  bomNumber: '',
  productId: 0,
  version: '1.0',
  isActive: true,
  description: '',
});

export function BillOfMaterials() {
  const [records, setRecords] = useState<BillOfMaterials[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<BillOfMaterials | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<BillOfMaterials | null>(null);

  // Product list for dropdown
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load products for the dropdown
    import('@/services/productService')
      .then(m => m.default.getAll({ size: 500 }).then(res => setProducts(res.content ?? [])))
      .catch(console.warn);
  }, []);

  const load = () => {
    setLoading(true);
    manufacturingService.getBOMs({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.bomNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.product?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (bom: BillOfMaterials) => {
    setSelected(bom);
    setForm({
      bomNumber: bom.bomNumber ?? '',
      productId: bom.product?.id ?? 0,
      version: bom.version ?? '1.0',
      isActive: bom.isActive ?? true,
      description: bom.description ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload: any = {
      bomNumber: form.bomNumber,
      version: form.version,
      isActive: form.isActive,
      description: form.description,
      product: form.productId ? { id: form.productId } : null,
    };

    if (selected) {
      manufacturingService.updateBom(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      manufacturingService.createBOM(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await manufacturingService.deleteBom(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-600" /> Bill of Materials
          </h1>
          <p className="text-gray-500 mt-1">Manage product material structures</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New BOM
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search BOM or product..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['BOM No.', 'Product', 'Version', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.bomNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.product?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.version ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.isActive === false ? 'INACTIVE' : 'ACTIVE']}`}>
                      {r.isActive === false ? 'Inactive' : 'Active'}
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
      <Modal open={modal === 'view'} onClose={close} title="BOM Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="BOM Number" value={selected.bomNumber ?? '-'} />
            <DetailRow label="Product" value={selected.product?.name ?? '-'} />
            <DetailRow label="Version" value={selected.version ?? '-'} />
            <DetailRow label="Status" value={selected.isActive === false ? 'Inactive' : 'Active'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit BOM' : 'New BOM'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="BOM Number" required>
            <input value={form.bomNumber} onChange={e => setForm(f => ({ ...f, bomNumber: e.target.value }))} className={inputCls} />
          </FormField>

          <FormField label="Product" required>
            <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Version">
            <input value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select
              value={form.isActive ? 'ACTIVE' : 'INACTIVE'}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'ACTIVE' }))}
              className={selectCls}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </FormField>
          <FormField label="Description">
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.bomNumber}</strong>?</p>
      </Modal>
    </div>
  );
}