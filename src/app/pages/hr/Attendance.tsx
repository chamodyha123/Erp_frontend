import { useState, useEffect } from 'react';
import { Clock, Search, Filter, Calendar } from 'lucide-react';
import hrExtService, { type Attendance } from '@/services/hrExtService';
import employeeService, { type Employee } from '@/services/employeeService';
import { DetailRow, Modal, ModalBtn } from '@/app/components/ui/Modal';

const fmt = (s?: string) => s ? new Date(s).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' }) : '-';
const statusColor: Record<string,string> = { PRESENT:'bg-green-100 text-green-800', LATE:'bg-yellow-100 text-yellow-800', ABSENT:'bg-red-100 text-red-800', HALF_DAY:'bg-orange-100 text-orange-800' };

export function Attendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Attendance|null>(null);

  // 🛠️ Reading data from Local Storage
  const loadLocalAttendance = (): any[] => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('erp_saved_attendance');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  };

  const load = async (d: string) => {
    setLoading(true);
    try {
      // 1. First fetch the employee list (to match details)
      const empRes = await employeeService.getAll({ size: 200 });
      const empList = empRes.content || [];
      setEmployees(empList);

      // 2. Fetch today's data available in Local Storage
      const localSaved = loadLocalAttendance().filter((item: any) => item.date === d);

      // 3. Fetch data from the API
      let apiData: any[] = [];
      try {
        apiData = await hrExtService.getAttendanceByDate(d);
        if (!Array.isArray(apiData)) apiData = [];
      } catch (e) {
        console.error("API error, switching to local storage data:", e);
      }

      // 4. Combine both API and Local Storage data
      const combined = [...apiData, ...localSaved.filter(l => !apiData.some((a: any) => a.id === l.id || (a.employeeId === l.employeeId && a.date === l.date)))];

      // 5. Map employee's Full Name and Department using the Employee ID
      const mappedRecords = combined.map(rec => {
        const foundEmp = empList.find((e: any) => Number(e.id) === Number(rec.employeeId));
        return {
          ...rec,
          employee: rec.employee || foundEmp ? {
            fullName: foundEmp?.fullName,
            department: foundEmp?.department
          } : undefined
        };
      });

      setRecords(mappedRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(date); 
    
    // Add a window focus event listener to instantly update if clocked-in from another tab
    const handleFocus = () => load(date);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [date]);

  const filtered = records.filter(r => r.employee?.fullName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" /> Attendance
          </h1>
          <p className="text-gray-500 mt-1">Employee attendance records</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', val: records.length, color: 'text-gray-900' },
          { label: 'Present', val: records.filter(r => r.status === 'PRESENT' || r.checkIn).length, color: 'text-green-600' },
          { label: 'Late', val: records.filter(r => r.status === 'LATE').length, color: 'text-yellow-600' },
          { label: 'Absent', val: records.filter(r => r.status === 'ABSENT').length, color: 'text-red-600' }
        ].map(s => (
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1 relative min-w-[200px]">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Department', 'Check In', 'Check Out', 'Work Hours', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName ?? `- (ID: ${r.employeeId})`}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.employee?.department?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.checkIn)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.checkOut)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{r.workHours != null ? r.workHours + ' hrs' : '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status || 'PRESENT'] || 'bg-gray-100 text-gray-800'}`}>
                      {(r.status || 'PRESENT').replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button onClick={() => setSelected(r)} className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No records found for this date</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Attendance Details" size="md" footer={<ModalBtn onClick={() => setSelected(null)}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Employee" value={selected.employee?.fullName ?? `- (ID: ${selected.employeeId})`} />
            <DetailRow label="Department" value={selected.employee?.department?.name ?? '-'} />
            <DetailRow label="Date" value={selected.date} />
            <DetailRow label="Check In Time" value={fmt(selected.checkIn)} />
            <DetailRow label="Check Out Time" value={fmt(selected.checkOut)} />
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
    </div>
  );
}