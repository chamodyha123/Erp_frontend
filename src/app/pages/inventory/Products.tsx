import { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import productService, { type Product } from '@/services/productService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const blank = () => ({
  sku: '',
  name: '',
  category: '',
  unit: 'unit',
  unitPrice: 0,
  costPrice: 0,
  reorderLevel: 0,
  isActive: true,
  description: '',
});

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const load = () => {
    setLoading(true);
    productService.getAll({ size: 200 })
      .then(p => setProducts(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    (p.sku ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (product: Product) => {
    setSelected(product);
    setForm({
      sku: product.sku ?? '',
      name: product.name ?? '',
      category: product.category ?? '',
      unit: product.unit ?? 'unit',
      unitPrice: product.unitPrice ?? 0,
      costPrice: product.costPrice ?? 0,
      reorderLevel: product.reorderLevel ?? 0,
      isActive: product.isActive ?? true,
      description: product.description ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = { ...form };

    if (selected) {
      productService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      productService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await productService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" /> Products
          </h1>
          <p className="text-gray-500 mt-1">Manage product and stock data</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                {['SKU', 'Name', 'Category', 'Unit', 'Unit Price', 'Active', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{p.sku ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{p.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{p.category ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{p.unit ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(p.unitPrice)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(p); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(p)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(p)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Product Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="SKU" value={selected.sku ?? '-'} />
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Category" value={selected.category ?? '-'} />
            <DetailRow label="Unit" value={selected.unit ?? '-'} />
            <DetailRow label="Unit Price" value={fmt(selected.unitPrice)} />
            <DetailRow label="Cost Price" value={fmt(selected.costPrice)} />
            <DetailRow label="Reorder Level" value={String(selected.reorderLevel ?? 0)} />
            <DetailRow label="Active" value={selected.isActive ? 'Yes' : 'No'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Product' : 'New Product'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="SKU" required>
            <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Category">
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Unit">
            <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Unit Price">
            <input type="number" value={form.unitPrice || ''} onChange={e => setForm(f => ({ ...f, unitPrice: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Cost Price">
            <input type="number" value={form.costPrice || ''} onChange={e => setForm(f => ({ ...f, costPrice: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Reorder Level">
            <input type="number" value={form.reorderLevel || ''} onChange={e => setForm(f => ({ ...f, reorderLevel: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Active">
            <select value={form.isActive ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === 'true' }))} className={selectCls}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
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
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}