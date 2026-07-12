import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import { salesQuotationService, type SalesQuotation } from '@/services/salesExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';
const statusColor: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SENT: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-orange-100 text-orange-800',
};

const blank = () => ({
  quotationNumber: '',
  customerId: 0,
  date: '',
  validUntil: '',
  status: 'DRAFT',
  notes: '',
  total: 0,
});

export function SalesQuotations() {
  const [records, setRecords] = useState<SalesQuotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<SalesQuotation | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<SalesQuotation | null>(null);

  // customer dropdown
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    import('@/services/customerService').then(m => m.default.getAll({ size: 500 }).then(res => setCustomers(res.content ?? [])));
  }, []);

  const load = () => {
    setLoading(true);
    salesQuotationService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.quotationNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.customer?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (q: SalesQuotation) => {
    setSelected(q);
    setForm({
      quotationNumber: q.quotationNumber ?? '',
      customerId: q.customer?.id ?? 0,
      date: q.date ?? '',
      validUntil: q.validUntil ?? '',
      status: q.status ?? 'DRAFT',
      notes: q.notes ?? '',
      total: q.total ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      customer: { id: form.customerId },
    };
    delete (payload as any).customerId;
    if (selected) {
      salesQuotationService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      salesQuotationService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await salesQuotationService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" /> Sales Quotations
          </h1>
          <p className="text-gray-500 mt-1">Manage customer quotations</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Quotation
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotations..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Quotation No.', 'Customer', 'Date', 'Valid Until', 'Total', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.quotationNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.customer?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.date ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.validUntil ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.total)}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? 'bg-gray-100 text-gray-800'}`}>{r.status}</span></td>
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
      <Modal open={modal === 'view'} onClose={close} title="Quotation Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Quotation Number" value={selected.quotationNumber ?? '-'} />
            <DetailRow label="Customer" value={selected.customer?.name ?? '-'} />
            <DetailRow label="Date" value={selected.date ?? '-'} />
            <DetailRow label="Valid Until" value={selected.validUntil ?? '-'} />
            <DetailRow label="Total" value={fmt(selected.total)} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Quotation' : 'New Quotation'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Quotation Number" required>
            <input value={form.quotationNumber} onChange={e => setForm(f => ({ ...f, quotationNumber: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Customer" required>
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Valid Until">
            <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Total">
            <input type="number" value={form.total || ''} onChange={e => setForm(f => ({ ...f, total: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
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
        <p>Are you sure you want to delete <strong>{deleteConfirm?.quotationNumber}</strong>?</p>
      </Modal>
    </div>
  );
}