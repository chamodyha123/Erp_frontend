import { useState, useEffect } from 'react';
import { FolderKanban, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import projectService, { type Project } from '@/services/projectService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string,string> = {
  PLANNING: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  ON_HOLD: 'bg-gray-100 text-gray-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  projectCode: '',
  name: '',
  clientName: '',
  startDate: '',
  endDate: '',
  budget: 0,
  status: 'PLANNING',
  description: '',
});

export function Projects() {
  const [records, setRecords] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<Project | null>(null);

  const load = () => {
    setLoading(true);
    projectService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.projectCode ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (project: Project) => {
    setSelected(project);
    setForm({
      projectCode: project.projectCode ?? '',
      name: project.name ?? '',
      clientName: project.clientName ?? (project.customer?.companyName ?? ''),
      startDate: project.startDate ?? '',
      endDate: project.endDate ?? '',
      budget: project.budget ?? 0,
      status: project.status ?? 'PLANNING',
      description: project.description ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = { ...form };

    if (selected) {
      projectService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      projectService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await projectService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-blue-600" /> Projects
          </h1>
          <p className="text-gray-500 mt-1">Manage projects and assignments</p>
        </div>
        <button
          onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading data...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Code','Name','Client','Start Date','End Date','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.projectCode ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {r.clientName ?? r.customer?.companyName ?? '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.startDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.endDate ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] ?? 'bg-gray-100 text-gray-800'}`}>
                      {r.status}
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
      <Modal open={modal === 'view'} onClose={close} title="Project Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Code" value={selected.projectCode ?? '-'} />
            <DetailRow label="Name" value={selected.name ?? '-'} />
            <DetailRow label="Client" value={selected.clientName ?? selected.customer?.companyName ?? '-'} />
            <DetailRow label="Start Date" value={selected.startDate ?? '-'} />
            <DetailRow label="End Date" value={selected.endDate ?? '-'} />
            <DetailRow label="Budget" value={selected.budget != null ? 'Rs. ' + selected.budget.toLocaleString() : '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Project' : 'New Project'}
        size="md"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Project Code" required>
            <input value={form.projectCode} onChange={e => setForm(f => ({ ...f, projectCode: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Project Name" required>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Client Name">
            <input value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Start Date">
            <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="End Date">
            <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Budget">
            <input type="number" value={form.budget || ''} onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
        footer={
          <>
            <ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn>
            <ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>?</p>
      </Modal>
    </div>
  );
}