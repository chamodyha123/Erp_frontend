import { useState, useEffect } from 'react';
import { Clock, CheckCircle, UserCheck } from 'lucide-react';
import employeeService, { type Employee } from '@/services/employeeService';
import hrExtService from '@/services/hrExtService';
import { selectCls } from '@/app/components/ui/Modal';

export function ClockIn() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<'IN'|'OUT'>('IN');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [now, setNow] = useState(new Date());
  const [todayLogs, setTodayLogs] = useState<any[]>([]);

  const today = now.toISOString().slice(0,10);
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  // 🛠️ Reading old logs from Local Storage
  const loadLocalLogs = (): any[] => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('erp_saved_attendance');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  };

  const fetchTodayAttendance = () => {
    const localLogs = loadLocalLogs().filter((item: any) => item.date === today);
    
    if (hrExtService.getAllAttendance) {
      hrExtService.getAllAttendance({ size: 100 })
        .then((res: any) => {
          const apiData = res.content || res.data || [];
          const filteredApi = apiData.filter((item: any) => item.date === today);
          // Combining both Local and API logs
          const combined = [...filteredApi, ...localLogs.filter(l => !filteredApi.some((a: any) => a.id === l.id))];
          setTodayLogs(combined);
        })
        .catch(() => {
          setTodayLogs(localLogs);
        });
    } else {
      setTodayLogs(localLogs);
    }
  };

  useEffect(() => {
    employeeService.getAll({ size:200 })
      .then(p => {
        setEmployees(p.content || []);
        fetchTodayAttendance();
      })
      .catch(console.error);

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    setLoading(true);
    
    const currentISO = new Date().toISOString();
    
    // 🛠️ Creating the object suitable for the Attendance Table and saving to Local Storage
    const allLocal = loadLocalLogs();
    
    // Checking if a record already exists for this employee for today
    const existingIndex = allLocal.findIndex(item => Number(item.employeeId) === Number(employeeId) && item.date === today);

    let newRecord: any = {};

    if (existingIndex > -1) {
      // If it exists, update the existing record (e.g., adding the Clock Out)
      newRecord = {
        ...allLocal[existingIndex],
        checkIn: type === 'IN' ? currentISO : allLocal[existingIndex].checkIn,
        checkOut: type === 'OUT' ? currentISO : allLocal[existingIndex].checkOut,
        status: type === 'IN' ? 'PRESENT' : allLocal[existingIndex].status,
        notes: notes || allLocal[existingIndex].notes
      };
      allLocal[existingIndex] = newRecord;
    } else {
      // Otherwise, create a brand new Attendance Record
      newRecord = {
        id: Date.now(),
        employeeId: Number(employeeId),
        date: today,
        checkIn: type === 'IN' ? currentISO : undefined,
        checkOut: type === 'OUT' ? currentISO : undefined,
        status: 'PRESENT',
        notes: notes
      };
      allLocal.push(newRecord);
    }

    // Updating Local Storage
    localStorage.setItem('erp_saved_attendance', JSON.stringify(allLocal));

    const payload = {
      employeeId: Number(employeeId),
      date: today,
      checkIn: type === 'IN' ? currentISO : undefined,
      checkOut: type === 'OUT' ? currentISO : undefined,
      notes
    };

    hrExtService.createAttendance(payload)
      .then(() => { fetchTodayAttendance(); })
      .catch(err => console.error("Saved locally. Backend sync issue:", err))
      .finally(() => {
        setSuccess(true); 
        setEmployeeId(''); 
        setNotes(''); 
        setLoading(false);
        fetchTodayAttendance();
        setTimeout(() => setSuccess(false), 3000); 
      });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Clock className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Clock Attendance</h1>
        </div>
        <p className="text-gray-500">Record employee attendance status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
        <p className="text-5xl font-mono font-bold text-gray-900 mb-1">{timeStr}</p>
        <p className="text-gray-500">{now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">Attendance successfully recorded!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee <span className="text-red-500">*</span></label>
          <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)} className={selectCls} required>
            <option value="">-- Select Employee --</option>
            {employees.map(emp=><option key={emp.id} value={emp.id}>{emp.employeeId || emp.id} - {emp.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <div className="flex gap-3">
            {(['IN','OUT'] as const).map(t=>(
              <button key={t} type="button" onClick={()=>setType(t)} className={`flex-1 py-2.5 rounded-lg border font-medium text-sm transition-colors ${type===t?'bg-blue-600 text-white':'bg-white text-gray-700'}`}>{t==='IN'?'Clock In':'Clock Out'}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={loading || !employeeId} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Saving...' : type==='IN' ? 'Clock In' : 'Clock Out'}
        </button>
      </form>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4 border-b pb-3">
          <UserCheck className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Today's Attendance Logs</h2>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {todayLogs.map((log, index) => {
            const emp = employees.find(e => Number(e.id) === Number(log.employeeId));
            const logTime = log.checkIn ? new Date(log.checkIn) : log.checkOut ? new Date(log.checkOut) : null;
            
            return (
              <div key={log.id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div>
                  <span className="font-semibold text-gray-800 block text-sm">
                    {emp ? `${emp.employeeId || emp.id} - ${emp.fullName}` : `Employee #${log.employeeId}`}
                  </span>
                  {log.notes && <p className="text-xs text-gray-500 italic mt-0.5">Note: {log.notes}</p>}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${log.checkIn ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {log.checkIn ? 'IN' : 'OUT'}
                  </span>
                  <p className="text-xs font-mono text-gray-500 mt-0.5">
                    {logTime ? logTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>
              </div>
            );
          })}
          
          {todayLogs.length === 0 && (
            <p className="text-gray-400 text-center text-sm py-4">No attendance recorded for today yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}