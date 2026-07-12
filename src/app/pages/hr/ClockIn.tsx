import { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    employeeService.getAll({ size:200 }).then(p=>setEmployees(p.content)).catch(console.error);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = now.toISOString().slice(0,10);
  const timeStr = now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    setLoading(true);
    const payload = {
      employeeId: Number(employeeId),
      date: today,
      checkIn: type === 'IN' ? now.toISOString() : undefined,
      checkOut: type === 'OUT' ? now.toISOString() : undefined,
      notes
    };
    hrExtService.createAttendance(payload)
      .then(() => { setSuccess(true); setEmployeeId(''); setNotes(''); setTimeout(() => setSuccess(false), 3000); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2"><Clock className="w-10 h-10 text-blue-600" /><h1 className="text-3xl font-bold text-gray-900">Absen</h1></div>
        <p className="text-gray-500">Catat kehadiran karyawan</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
        <p className="text-5xl font-mono font-bold text-gray-900 mb-1">{timeStr}</p>
        <p className="text-gray-500">{now.toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">Absensi berhasil dicatat!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan <span className="text-red-500">*</span></label>
          <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)} className={selectCls} required>
            <option value="">-- Pilih Karyawan --</option>
            {employees.map(emp=><option key={emp.id} value={emp.id}>{emp.employeeId} - {emp.fullName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis</label>
          <div className="flex gap-3">
            {(['IN','OUT'] as const).map(t=>(
              <button key={t} type="button" onClick={()=>setType(t)} className={`flex-1 py-2.5 rounded-lg border font-medium text-sm transition-colors ${type===t?'bg-blue-600 text-white':'bg-white text-gray-700'}`}>{t==='IN'?'Masuk':'Keluar'}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
          <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Opsional..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" disabled={loading || !employeeId} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Menyimpan...' : type==='IN' ? 'Catat Masuk' : 'Catat Keluar'}
        </button>
      </form>
    </div>
  );
}
