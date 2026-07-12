import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import hrExtService, { type Recruitment } from '@/services/hrExtService';
import departmentService from '@/services/departmentService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  jobTitle: '',
  departmentId: 0,
  description: '',
  requirements: '',
  positions: 1,           // ← changed from vacancies
  status: 'OPEN',
  postedDate: '',
});

export function Recruitment() {
  const [records, setRecords] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'new' | 'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Recruitment | null>(null);
  const [form, setForm] = useState(blank());
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    departmentService.getAll()
      .then(res => setDepartments(Array.isArray(res) ? res : (res as any)?.content ?? []))
      .catch(console.error);
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await hrExtService.getRecruitment({ size: 100 });
      setRecords(res.content ?? (res as any));
    } catch (err) {
      console.error('Failed to load recruitment', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.jobTitle ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.department?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (r: Recruitment) => {
    setSelected(r);
    setForm({
      jobTitle: r.jobTitle,
      departmentId: r.department?.id ?? 0,
      description: r.description ?? '',
      requirements: r.requirements ?? '',
      positions: r.positions ?? 1,
      status: r.status,
      postedDate: r.postedDate ?? '',
    });
    setModal('edit');
  };

  const handleCreate = async () => {
    if (!form.jobTitle) {
      alert('Position title is required!');
      return;
    }
    try {
      await hrExtService.createRecruitment({
        jobTitle: form.jobTitle,
        department: form.departmentId ? { id: form.departmentId } : null,
        description: form.description,
        requirements: form.requirements,
        positions: form.positions,
        status: form.status,
        postedDate: form.postedDate,
      });
      load();
      close();
    } catch (err) {
      console.error('Failed to create vacancy', err);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    try {
      await hrExtService.updateRecruitment(selected.id, {
        jobTitle: form.jobTitle,
        department: form.departmentId ? { id: form.departmentId } : null,
        description: form.description,
        requirements: form.requirements,
        positions: form.positions,
        status: form.status,
        postedDate: form.postedDate,
      });
      load();
      close();
    } catch (err) {
      console.error('Failed to update vacancy', err);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await hrExtService.deleteRecruitment(selected.id);
      load();
      close();
    } catch (err) {
      console.error('Failed to delete vacancy', err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Recruitment
          </h1>
          <p className="text-gray-500 mt-1">Manage recruitment process and job vacancies</p>
        </div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Create Vacancy
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Vacancies', val: records.length, color: 'text-gray-900' },
          { label: 'Open', val: records.filter(r => r.status === 'OPEN').length, color: 'text-green-600' },
          { label: 'In Progress', val: records.filter(r => r.status === 'IN_PROGRESS').length, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search position or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading data...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Position', 'Department', 'Open Date', 'Positions', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.jobTitle}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.department?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.postedDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.positions ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] || ''}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-3 items-center">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                      <button onClick={() => openEdit(r)} className="text-yellow-600 hover:text-yellow-700 flex items-center" aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setSelected(r); setModal('delete'); }} className="text-red-600 hover:text-red-700 flex items-center" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Vacancy Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Position" value={selected.jobTitle} />
            <DetailRow label="Department" value={selected.department?.name ?? '-'} />
            <DetailRow label="Description" value={selected.description ?? '-'} />
            <DetailRow label="Requirements" value={selected.requirements ?? '-'} />
            <DetailRow label="Positions" value={String(selected.positions ?? '-')} />
            <DetailRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] || ''}`}>
                {selected.status}
              </span>
            } />
          </div>
        )}
      </Modal>

      {/* Create & Edit Modal */}
      {[
        { mode: 'new', title: 'Create Vacancy', handler: handleCreate },
        { mode: 'edit', title: 'Edit Vacancy', handler: handleEdit },
      ].map(({ mode, title, handler }) => (
        <Modal
          key={mode}
          open={modal === mode}
          onClose={close}
          title={title}
          size="lg"
          footer={
            <>
              <ModalBtn onClick={close}>Cancel</ModalBtn>
              <ModalBtn variant="primary" onClick={handler}>Save</ModalBtn>
            </>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Position" required>
              <input value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Department">
              <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: Number(e.target.value) }))} className={selectCls}>
                <option value={0}>-- Select --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Positions">
              <input type="number" value={form.positions} onChange={e => setForm(f => ({ ...f, positions: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </FormField>
            <FormField label="Open Date">
              <input type="date" value={form.postedDate} onChange={e => setForm(f => ({ ...f, postedDate: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Description">
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
            </FormField>
            <div className="col-span-2">
              <FormField label="Requirements">
                <input value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} className={inputCls} />
              </FormField>
            </div>
          </div>
        </Modal>
      ))}

      {/* Delete Modal */}
      <Modal
        open={modal === 'delete'}
        onClose={close}
        title="Delete Vacancy"
        size="sm"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete vacancy <strong>{selected?.jobTitle}</strong>?
        </p>
      </Modal>
    </div>
  );
}