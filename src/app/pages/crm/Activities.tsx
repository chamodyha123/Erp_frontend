import { useState, useEffect } from 'react';
import { PhoneCall, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import crmService, { type Activity } from '@/services/crmService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  Planned: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const blank = () => ({
  type: 'Call',
  subject: '',
  description: '',
  status: 'Planned',
  dueDate: '',
  leadId: 0,
  opportunityId: 0,
  customerId: 0,
  assignedToId: 0,
});

export function Activities() {
  const [records, setRecords] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Activity | null>(null);

  // Dropdown data
  const [employees, setEmployees] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  useEffect(() => {
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
    crmService.getLeads({ size: 500 }).then(res => setLeads(res.content ?? []));
    crmService.getOpportunities({ size: 500 }).then(res => setOpportunities(res.content ?? []));
    import('@/services/customerService').then(m => m.default.getAll({ size: 500 }).then(res => setCustomers(res.content ?? [])));
  }, []);

  const load = () => {
    setLoading(true);
    crmService.getActivities({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.subject ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (act: Activity) => {
    setSelected(act);
    setForm({
      type: act.type ?? 'Call',
      subject: act.subject ?? '',
      description: act.description ?? '',
      status: act.status ?? 'Planned',
      dueDate: act.dueDate?.slice(0, 16) ?? '',
      leadId: act.lead?.id ?? 0,
      opportunityId: act.opportunity?.id ?? 0,
      customerId: act.customer?.id ?? 0,
      assignedToId: act.assignedTo?.id ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      lead: form.leadId ? { id: form.leadId } : null,
      opportunity: form.opportunityId ? { id: form.opportunityId } : null,
      customer: form.customerId ? { id: form.customerId } : null,
      assignedTo: form.assignedToId ? { id: form.assignedToId } : null,
    };
    delete (payload as any).leadId;
    delete (payload as any).opportunityId;
    delete (payload as any).customerId;
    delete (payload as any).assignedToId;

    if (selected) {
      crmService.updateActivity(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      crmService.createActivity(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await crmService.deleteActivity(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <PhoneCall className="w-8 h-8 text-blue-600" /> Activities
          </h1>
          <p className="text-gray-500 mt-1">Manage CRM activities</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Activity
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Type', 'Subject', 'Due Date', 'Status', 'Assigned To', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-600">{r.type ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.subject ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.dueDate ? new Date(r.dueDate).toLocaleString('en-GB') : '-'}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? 'bg-gray-100 text-gray-800'}`}>{r.status}</span></td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.assignedTo?.fullName ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Activity Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Type" value={selected.type ?? '-'} />
            <DetailRow label="Subject" value={selected.subject ?? '-'} />
            <DetailRow label="Description" value={selected.description ?? '-'} />
            <DetailRow label="Due Date" value={selected.dueDate ? new Date(selected.dueDate).toLocaleString('en-GB') : '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            <DetailRow label="Assigned To" value={selected.assignedTo?.fullName ?? '-'} />
            {selected.lead && <DetailRow label="Lead" value={selected.lead.company} />}
            {selected.opportunity && <DetailRow label="Opportunity" value={selected.opportunity.name} />}
            {selected.customer && <DetailRow label="Customer" value={selected.customer.companyName} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Activity' : 'New Activity'} size="lg"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Type" required>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={selectCls}>
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Meeting">Meeting</option>
              <option value="Task">Task</option>
            </select>
          </FormField>
          <FormField label="Subject" required>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Due Date">
            <input type="datetime-local" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Lead">
            <select value={form.leadId} onChange={e => setForm(f => ({ ...f, leadId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {leads.map(l => <option key={l.id} value={l.id}>{l.company} ({l.firstName} {l.lastName})</option>)}
            </select>
          </FormField>
          <FormField label="Opportunity">
            <select value={form.opportunityId} onChange={e => setForm(f => ({ ...f, opportunityId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {opportunities.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </FormField>
          <FormField label="Customer">
            <select value={form.customerId} onChange={e => setForm(f => ({ ...f, customerId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.companyName ?? c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Assigned To">
            <select value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <div className="col-span-2">
            <FormField label="Description">
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} rows={3} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.subject}</strong>?</p>
      </Modal>
    </div>
  );
}