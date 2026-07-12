import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import customerService, { type Customer } from '@/services/customerService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  PROSPECT: 'bg-blue-100 text-blue-800',
};

const blank = () => ({
  code: '',
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  creditLimit: 0,
  isActive: true,
});

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Customer | null>(null);

  const load = () => {
    setLoading(true);
    customerService.getAll({ size: 200 })
      .then(p => setCustomers(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    (c.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.code ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (customer: Customer) => {
    setSelected(customer);
    setForm({
      code: customer.code ?? '',
      name: customer.name ?? '',
      contactPerson: customer.contactPerson ?? '',
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      city: customer.city ?? '',
      country: customer.country ?? '',
      creditLimit: customer.creditLimit ?? 0,
      isActive: customer.isActive ?? true,
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = { ...form };
    if (selected) {
      customerService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      customerService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await customerService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Customers
          </h1>
          <p className="text-gray-500 mt-1">Manage customer data</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Customer
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.isActive).length}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Code', 'Company', 'Contact', 'Email', 'Phone', 'City', 'Credit Limit', 'Active', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{c.code ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{c.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.contactPerson ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.email ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.phone ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{c.city ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(c.creditLimit)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(c); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(c)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(c)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Customer Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Code" value={selected.code ?? '-'} />
            <DetailRow label="Company Name" value={selected.name ?? '-'} />
            <DetailRow label="Contact Person" value={selected.contactPerson ?? '-'} />
            <DetailRow label="Email" value={selected.email ?? '-'} />
            <DetailRow label="Phone" value={selected.phone ?? '-'} />
            <DetailRow label="Address" value={selected.address ?? '-'} />
            <DetailRow label="City" value={selected.city ?? '-'} />
            <DetailRow label="Country" value={selected.country ?? '-'} />
            <DetailRow label="Credit Limit" value={fmt(selected.creditLimit)} />
            <DetailRow label="Active" value={selected.isActive ? 'Yes' : 'No'} />
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Customer' : 'New Customer'} size="lg"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Code" required>
            <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Company Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Contact Person">
            <input value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Email">
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Phone">
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="City">
            <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Country">
            <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Credit Limit">
            <input type="number" value={form.creditLimit || ''} onChange={e => setForm(f => ({ ...f, creditLimit: Number(e.target.value) }))} className={inputCls} />
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