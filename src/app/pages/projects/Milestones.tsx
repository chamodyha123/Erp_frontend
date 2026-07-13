import { useState, useEffect } from 'react';
import { Flag, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { milestoneService, type Milestone } from '@/services/projectSubService';
import projectService from '@/services/projectService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

const blank = () => ({
  name: '',
  projectId: 0,
  dueDate: '',
  status: 'PENDING',
  description: '',
});

export function Milestones() {
  const [records, setRecords] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Milestone | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Milestone | null>(null);

  // Project list for dropdown
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    projectService.getAll({ size: 500 }).then(res => setProjects(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    milestoneService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.project?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (m: Milestone) => {
    setSelected(m);
    setForm({
      name: m.name ?? '',
      projectId: m.project?.id ?? 0,
      dueDate: m.dueDate ?? '',
      status: m.status ?? 'PENDING',
      description: m.description ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    if (!form.name?.trim()) {
      alert('Milestone name is required!');
      return;
    }
    const payload = {
      name: form.name,
      project: form.projectId ? { id: form.projectId } : null,
      dueDate: form.dueDate,
      status: form.status,
      description: form.description,
    };

    if (selected) {
      milestoneService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      milestoneService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await milestoneService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Flag className="w-8 h-8 text-blue-600" /> Milestones
          </h1>
          <p className="text-gray-500 mt-1">Manage project milestones</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Milestone
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search milestones..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Name', 'Project', 'Due Date', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.project?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.dueDate ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Milestone Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Project" value={selected.project?.name ?? '-'} />
            <DetailRow label="Due Date" value={selected.dueDate ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Milestone' : 'New Milestone'}
        size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>

          <FormField label="Project" required>
            <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.projectCode})</option>)}
            </select>
          </FormField>

          <FormField label="Due Date">
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
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
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}