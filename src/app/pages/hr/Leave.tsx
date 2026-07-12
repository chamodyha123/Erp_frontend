import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import hrExtService, { type LeaveRequest } from '@/services/hrExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({ employeeId:0, leaveType:'ANNUAL', startDate:'', endDate:'', reason:'' });
const statusColor: Record<string,string> = { PENDING:'bg-yellow-100 text-yellow-800', APPROVED:'bg-green-100 text-green-800', REJECTED:'bg-red-100 text-red-800' };

export function Leave() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'approve'|null>(null);
  const [selected, setSelected] = useState<LeaveRequest|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    hrExtService.getLeaveRequests({ size:100 }).then(p=>setLeaves(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = leaves.filter(l => l.employee?.fullName?.toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const diffDays = (a: string, b: string) => {
    const ms = new Date(b).getTime() - new Date(a).getTime();
    return Math.round(ms / 86400000) + 1;
  };

  const handleNew = () => {
    hrExtService.createLeaveRequest(form).then(()=>{load();close();}).catch(console.error);
  };
  const handleApprove = (status: string) => {
    if (!selected) return;
    hrExtService.approveLeaveRequest(selected.id, status).then(()=>{load();close();}).catch(console.error);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" /> Cuti Karyawan</h1><p className="text-gray-500 mt-1">Kelola pengajuan cuti karyawan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Ajukan Cuti</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[{label:'Total',val:leaves.length,color:'text-gray-900'},{label:'Menunggu',val:leaves.filter(l=>l.status==='PENDING').length,color:'text-yellow-600'},{label:'Disetujui',val:leaves.filter(l=>l.status==='APPROVED').length,color:'text-green-600'}].map(s=>(
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.val}</p></div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Karyawan','Jenis Cuti','Dari','Sampai','Hari','Alasan','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(l=>(
            <tr key={l.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{l.employee?.fullName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{l.leaveType}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{l.startDate}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{l.endDate}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{l.startDate && l.endDate ? diffDays(l.startDate,l.endDate) : '-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600 max-w-[150px] truncate">{l.reason??'-'}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{l.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(l);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button>{l.status==='PENDING'&&<button onClick={()=>{setSelected(l);setModal('approve');}} className="text-green-600 hover:text-green-800">Proses</button>}</div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Cuti" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Karyawan" value={selected.employee?.fullName??'-'}/><DetailRow label="Jenis Cuti" value={selected.leaveType}/><DetailRow label="Dari" value={selected.startDate}/><DetailRow label="Sampai" value={selected.endDate}/><DetailRow label="Alasan" value={selected.reason??'-'}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>

      <Modal open={modal==='new'} onClose={close} title="Ajukan Cuti" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Ajukan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ID Karyawan" required><input type="number" value={form.employeeId||''} onChange={e=>setForm(f=>({...f,employeeId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Jenis Cuti"><select value={form.leaveType} onChange={e=>setForm(f=>({...f,leaveType:e.target.value}))} className={selectCls}><option value="ANNUAL">Tahunan</option><option value="SICK">Sakit</option><option value="PERSONAL">Pribadi</option><option value="MATERNITY">Melahirkan</option></select></FormField>
          <FormField label="Dari" required><input type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Sampai" required><input type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Alasan" required={false}><input value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} className={inputCls} /></FormField>
        </div>
      </Modal>

      <Modal open={modal==='approve'} onClose={close} title="Proses Cuti" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={()=>handleApprove('REJECTED')}>Tolak</ModalBtn><ModalBtn variant="primary" onClick={()=>handleApprove('APPROVED')}>Setujui</ModalBtn></>}>
        <p className="text-gray-600">Proses cuti untuk <strong>{selected?.employee?.fullName}</strong>?</p>
      </Modal>
    </div>
  );
}
