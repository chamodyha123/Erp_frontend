import { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { accountsPayableService, type AccountsPayable } from '@/services/financeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2 }) : '-';
const statusColor: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

const blank = () => ({
  vendorId: 0,
  invoiceNumber: '',
  invoiceDate: '',
  dueDate: '',
  amount: 0,
  paidAmount: 0,
  status: 'OPEN',
  notes: '',
});

export function AccountsPayable() {
  const [records, setRecords] = useState<AccountsPayable[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<AccountsPayable | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<AccountsPayable | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/vendorService')
      .then(m => m.default.getAll({ size: 500 }).then(res => setVendors(res.content ?? [])))
      .catch(console.error);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await accountsPayableService.getAll({ size: 100 });
      setRecords(res.content ?? (res as any));
    } catch (err) {
      console.error('Failed to load AP', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.vendor?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.invoiceNumber ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (r: AccountsPayable) => {
    setSelected(r);
    setForm({
      vendorId: r.vendor?.id ?? 0,
      invoiceNumber: r.invoiceNumber ?? '',
      invoiceDate: r.invoiceDate ?? '',
      dueDate: r.dueDate ?? '',
      amount: r.amount ?? 0,
      paidAmount: r.paidAmount ?? 0,
      status: r.status ?? 'OPEN',
      notes: r.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = async () => {
    const payload = {
      vendor: form.vendorId ? { id: form.vendorId } : null,
      invoiceNumber: form.invoiceNumber,
      invoiceDate: form.invoiceDate,
      dueDate: form.dueDate,
      amount: form.amount,
      paidAmount: form.paidAmount,
      status: form.status,
      notes: form.notes,
    };
    try {
      if (selected) {
        await accountsPayableService.update(selected.id, payload);
      } else {
        await accountsPayableService.create(payload);
      }
      load();
      close();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await accountsPayableService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  const total = records.reduce((s, r) => s + (r.amount ?? 0), 0);
  const paid = records.reduce((s, r) => s + (r.paidAmount ?? 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-blue-600" /> Accounts Payable
          </h1>
          <p className="text-gray-500 mt-1">Manage debts to suppliers</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Bill
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Bills', val: fmt(total), color: 'text-gray-900' },
          { label: 'Paid Amount', val: fmt(paid), color: 'text-green-600' },
          { label: 'Outstanding', val: fmt(total - paid), color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search supplier or invoice..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                {['Supplier', 'Invoice No.', 'Due Date', 'Total', 'Paid', 'Outstanding', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.vendor?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.invoiceNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.dueDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.amount)}</td>
                  <td className="px-4 py-4 text-sm text-green-600">{fmt(r.paidAmount)}</td>
                  <td className="px-4 py-4 text-sm text-red-600">{fmt((r.amount ?? 0) - (r.paidAmount ?? 0))}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? 'bg-gray-100 text-gray-800'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-2">
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
      <Modal open={modal === 'view'} onClose={close} title="Bill Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Supplier" value={selected.vendor?.name ?? '-'} />
            <DetailRow label="Invoice No." value={selected.invoiceNumber ?? '-'} />
            <DetailRow label="Invoice Date" value={selected.invoiceDate ?? '-'} />
            <DetailRow label="Due Date" value={selected.dueDate ?? '-'} />
            <DetailRow label="Total" value={fmt(selected.amount)} />
            <DetailRow label="Paid" value={fmt(selected.paidAmount)} />
            <DetailRow label="Outstanding" value={fmt((selected.amount ?? 0) - (selected.paidAmount ?? 0))} />
            <DetailRow label="Status" value={<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] ?? ''}`}>{selected.status}</span>} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Bill' : 'New Bill'}
        size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Supplier" required>
            <select value={form.vendorId} onChange={e => setForm(f => ({ ...f, vendorId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </FormField>
          <FormField label="Invoice No.">
            <input value={form.invoiceNumber} onChange={e => setForm(f => ({ ...f, invoiceNumber: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Invoice Date">
            <input type="date" value={form.invoiceDate} onChange={e => setForm(f => ({ ...f, invoiceDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Due Date">
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Amount">
            <input type="number" value={form.amount || ''} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Paid Amount">
            <input type="number" value={form.paidAmount || ''} onChange={e => setForm(f => ({ ...f, paidAmount: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="OPEN">Open</option>
              <option value="PARTIAL">Partial</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Notes">
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete bill <strong>{deleteConfirm?.invoiceNumber}</strong>?</p>
      </Modal>
    </div>
  );
}