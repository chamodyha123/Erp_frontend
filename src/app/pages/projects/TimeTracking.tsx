import { useState, useEffect } from 'react';
import { Clock, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { timeEntryService, type TimeEntry } from '@/services/projectSubService';
import employeeService from '@/services/employeeService';
import projectService from '@/services/projectService';
import { taskService } from '@/services/projectSubService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({
  employeeId: 0,
  projectId: 0,
  taskId: 0,
  date: '',
  hours: 0,
  description: '',
});

export function TimeTracking() {
  const [records, setRecords] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<TimeEntry | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<TimeEntry | null>(null);

  // Dropdown data
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
    projectService.getAll({ size: 500 }).then(res => setProjects(res.content ?? []));
    taskService.getAll({ size: 500 }).then(res => setTasks(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    timeEntryService.getAll({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.employee?.fullName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.project?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (entry: TimeEntry) => {
    setSelected(entry);
    setForm({
      employeeId: entry.employee?.id ?? 0,
      projectId: entry.project?.id ?? 0,
      taskId: entry.task?.id ?? 0,
      date: entry.date ?? '',
      hours: entry.hours ?? 0,
      description: entry.description ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    if (!form.employeeId || !form.projectId) {
      alert('Employee and Project are required!');
      return;
    }
    const payload = {
      employee: { id: form.employeeId },
      project: { id: form.projectId },
      task: form.taskId ? { id: form.taskId } : null,
      date: form.date,
      hours: form.hours,
      description: form.description,
    };

    if (selected) {
      timeEntryService.update(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      timeEntryService.create(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await timeEntryService.delete(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" /> Time Tracking
          </h1>
          <p className="text-gray-500 mt-1">Record project work hours</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Entry
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee or project..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Project', 'Task', 'Date', 'Hours', 'Description', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.project?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.task?.title ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.date ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{r.hours ?? 0} hrs</td>
                  <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{r.description ?? '-'}</td>
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
      <Modal open={modal === 'view'} onClose={close} title="Time Entry Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? '-'} />
            <DetailRow label="Project" value={selected.project?.name ?? '-'} />
            <DetailRow label="Task" value={selected.task?.title ?? '-'} />
            <DetailRow label="Date" value={selected.date ?? '-'} />
            <DetailRow label="Hours" value={selected.hours != null ? selected.hours + ' hrs' : '-'} />
            {selected.description && <DetailRow label="Description" value={selected.description} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Time Entry' : 'New Time Entry'}
        size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee" required>
            <select value={form.employeeId} onChange={e => setForm(f => ({ ...f, employeeId: Number(e.target.value) }))} className={selectCls} disabled={!!selected}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.fullName}</option>)}
            </select>
          </FormField>
          <FormField label="Project" required>
            <select value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </FormField>
          <FormField label="Task (optional)">
            <select value={form.taskId} onChange={e => setForm(f => ({ ...f, taskId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </FormField>
          <FormField label="Date">
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Hours">
            <input type="number" step="0.5" value={form.hours || ''} onChange={e => setForm(f => ({ ...f, hours: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <div className="col-span-2">
            <FormField label="Description">
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete this time entry?</p>
      </Modal>
    </div>
  );
}