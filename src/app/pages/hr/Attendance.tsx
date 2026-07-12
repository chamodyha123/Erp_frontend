import { useState, useEffect } from 'react';
import { Clock, Search, Filter, Calendar, Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import hrExtService, { type Attendance } from '@/services/hrExtService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (s?: string) =>
  s ? new Date(s).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';

const statusColor: Record<string, string> = {
  PRESENT: 'bg-green-100 text-green-800',
  LATE: 'bg-yellow-100 text-yellow-800',
  ABSENT: 'bg-red-100 text-red-800',
  HALF_DAY: 'bg-orange-100 text-orange-800',
};

const blankForm = () => ({
  employeeId: 0,
  date: new Date().toISOString().slice(0, 10),
  clockIn: '',
  clockOut: '',
  status: 'Present',
  notes: '',
});

export function Attendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<Attendance | null>(null);
  const [form, setForm] = useState(blankForm());
  const [deleteConfirm, setDeleteConfirm] = useState<Attendance | null>(null);

  const load = async (d: string) => {
    setLoading(true);
    try {
      const data = await hrExtService.getAttendanceByDate(d);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(date); }, [date]);

  // Fetch employees for dropdown
  useEffect(() => {
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
  }, []);

  const filtered = records.filter(r =>
    (r.employee?.fullName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blankForm()); };

  // Open edit (manual time correction)
  const openEdit = (att: Attendance) => {
    setSelected(att);
    setForm({
      employeeId: att.employee?.id ?? 0,
      date: att.date ?? '',
      clockIn: att.clockIn ? att.clockIn.slice(0, 16) : '',
      clockOut: att.clockOut ? att.clockOut.slice(0, 16) : '',
      status: att.status || 'Present',
      notes: att.notes || '',
    });
    setModal('form');
  };

  // Clock Out action
  const handleClockOut = async (att: Attendance) => {
    await hrExtService.updateAttendance(att.id, {
      clockOut: new Date().toISOString(),
      status: 'PRESENT',
    });
    load(date);
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    const payload = {
      employee: { id: form.employeeId },
      date: form.date,
      clockIn: form.clockIn ? new Date(form.clockIn).toISOString() : null,
      clockOut: form.clockOut ? new Date(form.clockOut).toISOString() : null,
      status: form.status,
      notes: form.notes,
    };

    if (selected) {
      await hrExtService.updateAttendance(selected.id, payload);
    } else {
      await hrExtService.createAttendance(payload);
    }
    close();
    load(date);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await hrExtService.deleteAttendance(deleteConfirm.id);
    setDeleteConfirm(null);
    load(date);
  };

  const total = records.length;
  const present = records.filter(r => r.status === 'PRESENT' || r.clockIn).length;
  const late = records.filter(r => r.status === 'LATE').length;
  const absent = records.filter(r => r.status === 'ABSENT').length;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" /> Attendance
          </h1>
          <p className="text-gray-500 mt-1">Employee attendance records</p>
        </div>
        <button
          onClick={() => { setSelected(null); setForm(blankForm()); setModal('form'); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" /> Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', val: total, color: 'text-gray-900' },
          { label: 'Present', val: present, color: 'text-green-600' },
          { label: 'Late', val: late, color: 'text-yellow-600' },
          { label: 'Absent', val: absent, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading data...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {r.employee?.fullName ?? `ID: ${r.employee?.id}`}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {(r.employee as any)?.department?.name ?? '-'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.clockIn)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.clockOut)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {r.workHours != null ? r.workHours + ' hrs' : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status || 'PRESENT'] || 'bg-gray-100 text-gray-800'}`}>
                      {(r.status || 'PRESENT').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      {!r.clockOut && (
                        <button onClick={() => handleClockOut(r)} className="text-green-600 hover:text-green-800" title="Clock Out">
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(r)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No records found for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Attendance Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? `ID: ${selected.employee?.id}`} />
            <DetailRow label="Department" value={(selected.employee as any)?.department?.name ?? '-'} />
            <DetailRow label="Date" value={selected.date} />
            <DetailRow label="Check In" value={fmt(selected.clockIn)} />
            <DetailRow label="Check Out" value={fmt(selected.clockOut)} />
            <DetailRow label="Work Hours" value={selected.workHours != null ? selected.workHours + ' hrs' : '-'} />
            <DetailRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status || 'PRESENT'] || 'bg-gray-100 text-gray-800'}`}>
                {(selected.status || 'PRESENT').replace('_', ' ')}
              </span>
            } />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        open={modal === 'form'}
        onClose={close}
        title={selected ? 'Edit Attendance' : 'Add Attendance Record'}
        size="md"
        footer={
          <>
            <ModalBtn onClick={close}>Cancel</ModalBtn>
            <ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee" required>
            <select
              value={form.employeeId}
              onChange={e => setForm(f => ({ ...f, employeeId: Number(e.target.value) }))}
              className={selectCls}
              disabled={!!selected}
            >
              <option value={0}>-- Select --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Date">
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Clock In">
            <input
              type="datetime-local"
              value={form.clockIn}
              onChange={e => setForm(f => ({ ...f, clockIn: e.target.value }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Clock Out">
            <input
              type="datetime-local"
              value={form.clockOut}
              onChange={e => setForm(f => ({ ...f, clockOut: e.target.value }))}
              className={inputCls}
            />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="PRESENT">Present</option>
              <option value="LATE">Late</option>
              <option value="ABSENT">Absent</option>
              <option value="HALF_DAY">Half Day</option>
            </select>
          </FormField>
          <FormField label="Notes">
            <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
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
        <p>Are you sure you want to delete the attendance record for <strong>{deleteConfirm?.employee?.fullName}</strong>?</p>
      </Modal>
    </div>
  );
}