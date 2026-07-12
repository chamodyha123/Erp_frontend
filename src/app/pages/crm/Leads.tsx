import { useState, useEffect } from 'react';
import { UserPlus, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import crmService, { type Lead } from '@/services/crmService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-purple-100 text-purple-800',
  Converted: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

const blank = () => ({
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  source: 'Web',
  status: 'New',
  notes: '',
});

export function Leads() {
  const [records, setRecords] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Lead | null>(null);

  const load = () => {
    setLoading(true);
    crmService.getLeads({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.firstName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.lastName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.company ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (lead: Lead) => {
    setSelected(lead);
    setForm({
      firstName: lead.firstName ?? '',
      lastName: lead.lastName ?? '',
      company: lead.company ?? '',
      email: lead.email ?? '',
      phone: lead.phone ?? '',
      source: lead.source ?? 'Web',
      status: lead.status ?? 'New',
      notes: lead.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    if (selected) {
      crmService.updateLead(selected.id, form)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      crmService.createLead(form)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await crmService.deleteLead(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-blue-600" /> Leads
          </h1>
          <p className="text-gray-500 mt-1">Manage potential customers</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Lead
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['First Name', 'Last Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.firstName ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.lastName ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.company ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.email ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.phone ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.source ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Lead Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="First Name" value={selected.firstName ?? '-'} />
            <DetailRow label="Last Name" value={selected.lastName ?? '-'} />
            <DetailRow label="Company" value={selected.company ?? '-'} />
            <DetailRow label="Email" value={selected.email ?? '-'} />
            <DetailRow label="Phone" value={selected.phone ?? '-'} />
            <DetailRow label="Source" value={selected.source ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Lead' : 'New Lead'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name">
            <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Last Name">
            <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Company" required>
            <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Email">
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Phone">
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Source">
            <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className={selectCls}>
              <option value="Web">Web</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
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
        <p>Are you sure you want to delete <strong>{deleteConfirm?.firstName} {deleteConfirm?.lastName}</strong>?</p>
      </Modal>
    </div>
  );
}