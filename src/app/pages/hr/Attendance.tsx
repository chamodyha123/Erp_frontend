import { useState, useEffect } from 'react';
import { Clock, Search, Filter, Calendar } from 'lucide-react';
import hrExtService, { type Attendance } from '@/services/hrExtService';
import { DetailRow, Modal, ModalBtn } from '@/app/components/ui/Modal';

const fmt = (s?: string) => s ? new Date(s).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) : '-';
const statusColor: Record<string,string> = { PRESENT:'bg-green-100 text-green-800', LATE:'bg-yellow-100 text-yellow-800', ABSENT:'bg-red-100 text-red-800', HALF_DAY:'bg-orange-100 text-orange-800' };

export function Attendance() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Attendance|null>(null);

  const load = (d: string) => {
    setLoading(true);
    hrExtService.getAttendanceByDate(d).then(setRecords).catch(()=>setRecords([])).finally(()=>setLoading(false));
  };
  useEffect(() => { load(date); }, [date]);

  const filtered = records.filter(r => r.employee?.fullName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Clock className="w-8 h-8 text-blue-600" /> Absensi</h1><p className="text-gray-500 mt-1">Catatan kehadiran karyawan</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[{label:'Total',val:records.length,color:'text-gray-900'},{label:'Hadir',val:records.filter(r=>r.status==='PRESENT').length,color:'text-green-600'},{label:'Terlambat',val:records.filter(r=>r.status==='LATE').length,color:'text-yellow-600'},{label:'Tidak Hadir',val:records.filter(r=>r.status==='ABSENT').length,color:'text-red-600'}].map(s=>(
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.val}</p></div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400" /><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1 relative min-w-[200px]"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Karyawan','Departemen','Masuk','Keluar','Jam Kerja','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName ?? '-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.employee?.department?.name ?? '-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.checkIn)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.checkOut)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{r.workHours != null ? r.workHours + ' jam' : '-'}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td>
              <td className="px-4 py-4 text-sm"><button onClick={()=>setSelected(r)} className="text-blue-600 hover:text-blue-800">Lihat</button></td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Tidak ada data untuk tanggal ini</td></tr>}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail Absensi" size="md" footer={<ModalBtn onClick={()=>setSelected(null)}>Tutup</ModalBtn>}>
        {selected && <div>
          <DetailRow label="Karyawan" value={selected.employee?.fullName ?? '-'} />
          <DetailRow label="Departemen" value={selected.employee?.department?.name ?? '-'} />
          <DetailRow label="Tanggal" value={selected.date} />
          <DetailRow label="Jam Masuk" value={fmt(selected.checkIn)} />
          <DetailRow label="Jam Keluar" value={fmt(selected.checkOut)} />
          <DetailRow label="Jam Kerja" value={selected.workHours != null ? selected.workHours + ' jam' : '-'} />
          <DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>} />
          {selected.notes && <DetailRow label="Catatan" value={selected.notes} />}
        </div>}
      </Modal>
    </div>
  );
}
