import { useState, useEffect } from 'react';
import { TrendingUp, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import crmService, { type Opportunity } from '@/services/crmService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';

const stageColor: Record<string, string> = {
  Prospecting: 'bg-blue-100 text-blue-800',
  Proposal: 'bg-yellow-100 text-yellow-800',
  Negotiation: 'bg-orange-100 text-orange-800',
  'Closed Won': 'bg-green-100 text-green-800',
  'Closed Lost': 'bg-red-100 text-red-800',
};

const blank = () => ({
  name: '',
  customerId: 0,
  leadId: 0,
  value: 0,
  stage: 'Prospecting',
  probability: 0,
  expectedClose: '',
  notes: '',
});

export function Opportunities() {
  const [records, setRecords] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Opportunity | null>(null);

  // Dropdown data
  const [customers, setCustomers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  useEffect(() => {
    import('@/services/customerService').then(m =>
      m.default.getAll({ size: 500 }).then(res => setCustomers(res.content ?? []))
    );
    crmService.getLeads({ size: 500 }).then(res => setLeads(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    crmService.getOpportunities({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.customer?.name ?? '').toLowerCase().includes(search.toLowerCase())   // changed from companyName
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (opp: Opportunity) => {
    setSelected(opp);
    setForm({
      name: opp.name ?? '',
      customerId: opp.customer?.id ?? 0,
      leadId: opp.lead?.id ?? 0,
      value: opp.value ?? 0,
      stage: opp.stage ?? 'Prospecting',
      probability: opp.probability ?? 0,
      expectedClose: opp.expectedClose ?? '',
      notes: opp.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      customer: form.customerId ? { id: form.customerId } : null,
      lead: form.leadId ? { id: form.leadId } : null,
    };
    delete (payload as any).customerId;
    delete (payload as any).leadId;

    if (selected) {
      crmService.updateOpportunity(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      crmService.createOpportunity(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await crmService.deleteOpportunity(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" /> Opportunities
          </h1>
          <p className="text-gray-500 mt-1">Manage sales opportunities</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Opportunity
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Customer', 'Value', 'Probability', 'Expected Close', 'Stage', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.customer?.name ?? '-'}</td>   {/* changed */}
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.value)}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.probability ?? 0}%</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.expectedClose ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColor[r.stage] ?? 'bg-gray-100 text-gray-800'}`}>{r.stage}</span>
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
      <Modal open={modal === 'view'} onClose={close} title="Opportunity Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Customer" value={selected.customer?.name ?? '-'} />   {/* changed */}
            <DetailRow label="Lead" value={selected.lead?.company ?? '-'} />
            <DetailRow label="Value" value={fmt(selected.value)} />
            <DetailRow label="Probability" value={`${selected.probability ?? 0}%`} />
            <DetailRow label="Expected Close" value={selected.expectedClose ?? '-'} />
            <DetailRow label="Stage" value={selected.stage ?? '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Opportunity' : 'New Opportunity'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Customer">
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}   {/* c.name is sufficient now */}
            </select>
          </FormField>
          <FormField label="Lead">
            <select value={form.leadId} onChange={e => setForm(f => ({ ...f, leadId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.company} ({l.firstName} {l.lastName})</option>)}
            </select>
          </FormField>
          <FormField label="Value">
            <input type="number" value={form.value || ''} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Probability (%)">
            <input type="number" min="0" max="100" value={form.probability || ''} onChange={e => setForm(f => ({ ...f, probability: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Expected Close">
            <input type="date" value={form.expectedClose} onChange={e => setForm(f => ({ ...f, expectedClose: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Stage">
            <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} className={selectCls}>
              <option value="Prospecting">Prospecting</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Notes">
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} rows={3} />
            </FormField>
          </div>
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