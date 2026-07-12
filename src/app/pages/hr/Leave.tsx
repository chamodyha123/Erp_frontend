import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import hrExtService, { type LeaveRequest } from '@/services/hrExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({ employeeId: 0, leaveType: 'ANNUAL', startDate: '', endDate: '', reason: '' });
const statusColor: Record<string, string> = { 
  PENDING: 'bg-yellow-100 text-yellow-800', 
  APPROVED: 'bg-green-100 text-green-800', 
  REJECTED: 'bg-red-100 text-red-800' 
};

export function Leave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'approve'|null>(null);
  const [selected, setSelected] = useState<LeaveRequest|null>(null);
  const [form, setForm] = useState(blank());

  // 🛠️ 1. මුලින්ම localStorage එකේ තියෙන පරණ සේව් කරපු නිවාඩු දත්ත ලබා ගැනීම
  const loadLocalLeaves = (): LeaveRequest[] => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('erp_saved_leaves');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  };

  // 🛠️ 2. දත්ත වෙනස් වන හැමවිටම එය localStorage එකට ස්ථිරව සේව් කිරීමේ ෆන්ක්ෂන් එක
  const saveToLocal = (updatedList: LeaveRequest[]) => {
    setLeaves(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_saved_leaves', JSON.stringify(updatedList));
    }
  };

  const load = () => {
    setLoading(true);
    const localSaved = loadLocalLeaves();

    hrExtService.getLeaveRequests({ size: 100 })
      .then(p => {
        const apiData = p.content || [];
        // API එකෙන් එන දත්ත සහ Local සේව් කරපු දත්ත දෙකම එකතු කර පෙන්වීම
        const combined = [...apiData, ...localSaved.filter(l => !apiData.some((a: any) => a.id === l.id))];
        setLeaves(combined);
      })
      .catch(err => {
        console.error("Error loading leave requests from API, using local data:", err);
        // API ක්‍රියා නොකරන්නේ නම් localStorage එකේ දත්ත කෙලින්ම පෙන්වයි
        setLeaves(localSaved);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = leaves.filter(l => 
    (l.employee?.fullName ?? `Employee #${l.employeeId ?? ''}`).toLowerCase().includes(search.toLowerCase())
  );
  
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const diffDays = (a: string, b: string) => {
    const ms = new Date(b).getTime() - new Date(a).getTime();
    return Math.round(ms / 86400000) + 1;
  };

  // 🛠️ 3. නිවාඩු අයදුම්පතක් Submit කිරීම සහ Local මතකයට එකතු කිරීම
  const handleNew = () => {
    if (!form.employeeId || !form.startDate || !form.endDate) {
      alert("Employee ID, From, and To dates are required!");
      return;
    }

    const mockNewLeave: LeaveRequest = {
      id: Date.now(), // තාවකාලික ID එකක්
      employeeId: form.employeeId,
      employee: { fullName: `Employee #${form.employeeId}` } as any, // UI එකේ පෙන්වීමට
      leaveType: form.leaveType,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: 'PENDING'
    } as any;

    const updatedList = [mockNewLeave, ...leaves];
    saveToLocal(updatedList); // LocalStorage එකට සේව් කිරීම

    hrExtService.createLeaveRequest(form)
      .then(() => { load(); })
      .catch(err => console.error("Submitted locally. Backend sync issue:", err));

    close();
  };

  // 🛠️ 4. Leave එකක් Approve හෝ Reject කිරීමේදී Local මතකය යාවත්කාලීන කිරීම
  const handleApprove = (status: string) => {
    if (!selected) return;

    const updatedList = leaves.map(l => l.id === selected.id ? { ...l, status } : l);
    saveToLocal(updatedList);

    hrExtService.approveLeaveRequest(selected.id, status)
      .then(() => { load(); })
      .catch(err => console.error("Status updated locally. Backend sync issue:", err));

    close();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" /> Employee Leave
          </h1>
          <p className="text-gray-500 mt-1">Manage employee leave requests</p>
        </div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Submit Leave
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', val: leaves.length, color: 'text-gray-900' },
          { label: 'Pending', val: leaves.filter(l => l.status === 'PENDING').length, color: 'text-yellow-600' },
          { label: 'Approved', val: leaves.filter(l => l.status === 'APPROVED').length, color: 'text-green-600' }
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading && leaves.length === 0 ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Employee', 'Leave Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{l.employee?.fullName ?? `Employee #${l.employeeId ?? ''}`}</td>
                <td className="px-4 py-4 text-sm text-gray-600">{l.leaveType}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{l.startDate}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{l.endDate}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{l.startDate && l.endDate ? diffDays(l.startDate, l.endDate) : '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate">{l.reason ?? '-'}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[l.status] || ''}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelected(l); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                    {l.status === 'PENDING' && (
                      <button onClick={() => { setSelected(l); setModal('approve'); }} className="text-green-600 hover:text-green-800">Process</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal === 'view'} onClose={close} title="Leave Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? `Employee #${selected.employeeId ?? ''}`} />
            <DetailRow label="Leave Type" value={selected.leaveType} />
            <DetailRow label="From" value={selected.startDate} />
            <DetailRow label="To" value={selected.endDate} />
            <DetailRow label="Reason" value={selected.reason ?? '-'} />
            <DetailRow label="Status" value={<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] || ''}`}>{selected.status}</span>} />
          </div>
        )}
      </Modal>

      <Modal open={modal === 'new'} onClose={close} title="Submit Leave" size="md" footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Submit</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee ID" required>
            <input type="number" value={form.employeeId || ''} onChange={e => setForm(f => ({ ...f, employeeId: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Leave Type">
            <select value={form.leaveType} onChange={e => setForm(f => ({ ...f, leaveType: e.target.value }))} className={selectCls}>
              <option value="ANNUAL">Annual</option>
              <option value="SICK">Sick</option>
              <option value="PERSONAL">Personal</option>
              <option value="MATERNITY">Maternity</option>
            </select>
          </FormField>
          <FormField label="From" required>
            <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="To" required>
            <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Reason" required={false}>
            <input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      <Modal open={modal === 'approve'} onClose={close} title="Process Leave" size="sm" footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={() => handleApprove('REJECTED')}>Reject</ModalBtn><ModalBtn variant="primary" onClick={() => handleApprove('APPROVED')}>Approve</ModalBtn></>}>
        <p className="text-gray-600">Process leave for <strong>{selected?.employee?.fullName ?? `Employee #${selected?.employeeId ?? ''}`}</strong>?</p>
      </Modal>
    </div>
  );
}