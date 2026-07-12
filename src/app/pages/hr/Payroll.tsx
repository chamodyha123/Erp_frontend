import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter } from 'lucide-react';
import hrExtService, { type Payroll } from '@/services/hrExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + n.toLocaleString('id-ID') : '-';

// Status අනුව පසුබිම් වර්ණ (Background Colors) ලබා දීමට
const statusColor: Record<string, string> = { 
  DRAFT: 'bg-gray-100 text-gray-800', 
  APPROVED: 'bg-blue-100 text-blue-800', 
  PAID: 'bg-green-100 text-green-800' 
};

const blank = () => ({ 
  employeeId: 0, 
  year: new Date().getFullYear(), 
  month: new Date().getMonth() + 1, 
  basicSalary: 0, 
  allowances: 0, 
  deductions: 0 
});

export function Payroll() {
  const [records, setRecords] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'new' | null>(null);
  const [selected, setSelected] = useState<Payroll|null>(null);
  const [form, setForm] = useState(blank());

  // 🛠️ 1. මුලින්ම localStorage එකේ තියෙන පරණ සේව් කරපු payroll දත්ත ලබා ගැනීම
  const loadLocalPayroll = (): Payroll[] => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('erp_saved_payroll');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  };

  // 🛠️ 2. දත්ත වෙනස් වන හැමවිටම එය localStorage එකට ස්ථිරව සේව් කිරීමේ ෆන්ක්ෂන් එක
  const saveToLocal = (updatedList: Payroll[]) => {
    setRecords(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_saved_payroll', JSON.stringify(updatedList));
    }
  };

  const load = () => {
    setLoading(true);
    const localSaved = loadLocalPayroll();

    hrExtService.getPayroll({ size: 100 })
      .then(p => {
        const apiData = p.content || [];
        // API එකෙන් එන දත්ත සහ Local සේව් කරපු දත්ත දෙකම එකතු කර පෙන්වීම
        const combined = [...apiData, ...localSaved.filter(l => !apiData.some((a: any) => a.id === l.id))];
        setRecords(combined);
      })
      .catch(err => {
        console.error("Error loading payroll from API, using local data:", err);
        // API ක්‍රියා නොකරන්නේ නම් localStorage එකේ දත්ත කෙලින්ම පෙන්වයි
        setRecords(localSaved);
      })
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { load(); }, []);

  // Employee ගේ fullName එක අනුව සෙවීම (Search) සිදු කිරීමට
  const filtered = records.filter(r => 
    (r.employee?.fullName ?? `Employee #${r.employeeId ?? ''}`).toLowerCase().includes(search.toLowerCase())
  );
  
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  // 🛠️ 3. Payslip එකක් Save කිරීම සහ Local මතකයට එකතු කිරීම
  const handleNew = () => {
    if (!form.employeeId || !form.basicSalary) {
      alert("Employee ID and Basic Salary are required!");
      return;
    }

    // ශුද්ධ වැටුප (Net Salary) ගණනය කිරීම
    const netSalary = form.basicSalary + (form.allowances || 0) - (form.deductions || 0);

    const mockNewPayroll: Payroll = {
      id: Date.now(), // තාවකාලික ID එකක්
      employeeId: form.employeeId,
      employee: { fullName: `Employee #${form.employeeId}` } as any, // UI එකේ පෙන්වීමට
      year: form.year,
      month: form.month,
      basicSalary: form.basicSalary,
      allowances: form.allowances,
      deductions: form.deductions,
      netSalary: netSalary,
      status: 'DRAFT'
    } as any;

    const updatedList = [mockNewPayroll, ...records];
    saveToLocal(updatedList); // LocalStorage එකට සේව් කිරීම

    hrExtService.createPayroll(form)
      .then(() => { load(); })
      .catch(err => console.error("Saved locally. Backend sync issue:", err));

    close();
  };

  // 🛠️ 4. Status එක Approve හෝ Pay කිරීමේදී Local මතකය යාවත්කාලීន කිරීම
  const handleStatus = (id: number, status: string) => {
    const updatedList = records.map(r => r.id === id ? { ...r, status } : r);
    saveToLocal(updatedList);

    hrExtService.updatePayrollStatus(id, status)
      .then(() => { load(); })
      .catch(err => console.error("Status updated locally. Backend sync issue:", err));
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-blue-600" /> Payroll
          </h1>
          <p className="text-gray-500 mt-1">Manage employee payroll data</p>
        </div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> Create Payslip
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', val: records.length, color: 'text-gray-900' },
          { label: 'Pending', val: records.filter(r => r.status === 'DRAFT').length, color: 'text-gray-600' },
          { label: 'Paid', val: records.filter(r => r.status === 'PAID').length, color: 'text-green-600' }
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
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

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading && records.length === 0 ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName ?? `Employee #${r.employeeId ?? ''}`}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.month}/{r.year}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.basicSalary)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.allowances)}</td>
                  <td className="px-4 py-4 text-sm text-red-600">{fmt(r.deductions)}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.netSalary)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status] || 'bg-gray-100 text-gray-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      {r.status === 'DRAFT' && <button onClick={() => handleStatus(r.id, 'APPROVED')} className="text-green-600 hover:text-green-800">Approve</button>}
                      {r.status === 'APPROVED' && <button onClick={() => handleStatus(r.id, 'PAID')} className="text-blue-600 hover:text-blue-800">Pay</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Payslip Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Salary Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? `Employee #${selected.employeeId ?? ''}`} />
            <DetailRow label="Period" value={selected.month + '/' + selected.year} />
            <DetailRow label="Basic Salary" value={fmt(selected.basicSalary)} />
            <DetailRow label="Allowances" value={fmt(selected.allowances)} />
            <DetailRow label="Deductions" value={fmt(selected.deductions)} />
            <DetailRow label="Net Salary" value={fmt(selected.netSalary)} />
            <DetailRow label="Status" value={
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] || 'bg-gray-100 text-gray-800'}`}>
                {selected.status}
              </span>
            } />
          </div>
        )}
      </Modal>

      {/* Create Payslip Modal */}
      <Modal open={modal === 'new'} onClose={close} title="Create Payslip" size="md" footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Save</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Employee ID" required><input type="number" value={form.employeeId || ''} onChange={e => setForm(f => ({ ...f, employeeId: Number(e.target.value) }))} className={inputCls} /></FormField>
          <FormField label="Month"><select value={form.month} onChange={e => setForm(f => ({ ...f, month: Number(e.target.value) }))} className={selectCls}>{[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></FormField>
          <FormField label="Year" required><input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} className={inputCls} /></FormField>
          <FormField label="Basic Salary" required><input type="number" value={form.basicSalary || ''} onChange={e => setForm(f => ({ ...f, basicSalary: Number(e.target.value) }))} className={inputCls} /></FormField>
          <FormField label="Allowances"><input type="number" value={form.allowances || ''} onChange={e => setForm(f => ({ ...f, allowances: Number(e.target.value) }))} className={inputCls} /></FormField>
          <FormField label="Deductions"><input type="number" value={form.deductions || ''} onChange={e => setForm(f => ({ ...f, deductions: Number(e.target.value) }))} className={inputCls} /></FormField>
        </div>
      </Modal>
    </div>
  );
}