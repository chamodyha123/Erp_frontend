import { useState, useEffect } from 'react';
import { DollarSign, Plus, Search, Filter } from 'lucide-react';
import hrExtService, { type Payroll } from '@/services/hrExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + n.toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', APPROVED:'bg-blue-100 text-blue-800', PAID:'bg-green-100 text-green-800' };
const blank = () => ({ employeeId:0, year: new Date().getFullYear(), month: new Date().getMonth()+1, basicSalary:0, allowances:0, deductions:0 });

export function Payroll() {
  const [records, setRecords] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Payroll|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    hrExtService.getPayroll({ size:100 }).then(p=>setRecords(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r => r.employee?.fullName?.toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => {
    hrExtService.createPayroll(form).then(()=>{load();close();}).catch(console.error);
  };

  const handleStatus = (id: number, status: string) => {
    hrExtService.updatePayrollStatus(id, status).then(load).catch(console.error);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><DollarSign className="w-8 h-8 text-blue-600" /> Penggajian</h1><p className="text-gray-500 mt-1">Kelola data penggajian karyawan</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Buat Slip Gaji</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[{label:'Total',val:records.length,color:'text-gray-900'},{label:'Menunggu',val:records.filter(r=>r.status==='DRAFT').length,color:'text-gray-600'},{label:'Dibayar',val:records.filter(r=>r.status==='PAID').length,color:'text-green-600'}].map(s=>(
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.val}</p></div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Karyawan','Periode','Gaji Pokok','Tunjangan','Potongan','Gaji Bersih','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.employee?.fullName??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.month}/{r.year}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.basicSalary)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(r.allowances)}</td>
              <td className="px-4 py-4 text-sm text-red-600">{fmt(r.deductions)}</td>
              <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(r.netSalary)}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td>
              <td className="px-4 py-4 text-sm">
                <div className="flex gap-2">
                  <button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button>
                  {r.status==='DRAFT'&&<button onClick={()=>handleStatus(r.id,'APPROVED')} className="text-green-600 hover:text-green-800">Setujui</button>}
                  {r.status==='APPROVED'&&<button onClick={()=>handleStatus(r.id,'PAID')} className="text-blue-600 hover:text-blue-800">Bayar</button>}
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Gaji" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Karyawan" value={selected.employee?.fullName??'-'}/><DetailRow label="Periode" value={selected.month+'/'+selected.year}/><DetailRow label="Gaji Pokok" value={fmt(selected.basicSalary)}/><DetailRow label="Tunjangan" value={fmt(selected.allowances)}/><DetailRow label="Potongan" value={fmt(selected.deductions)}/><DetailRow label="Gaji Bersih" value={fmt(selected.netSalary)}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>

      <Modal open={modal==='new'} onClose={close} title="Buat Slip Gaji" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ID Karyawan" required><input type="number" value={form.employeeId||''} onChange={e=>setForm(f=>({...f,employeeId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Bulan"><select value={form.month} onChange={e=>setForm(f=>({...f,month:Number(e.target.value)}))} className={selectCls}>{[...Array(12)].map((_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></FormField>
          <FormField label="Tahun" required><input type="number" value={form.year} onChange={e=>setForm(f=>({...f,year:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Gaji Pokok" required><input type="number" value={form.basicSalary||''} onChange={e=>setForm(f=>({...f,basicSalary:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tunjangan"><input type="number" value={form.allowances||''} onChange={e=>setForm(f=>({...f,allowances:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Potongan"><input type="number" value={form.deductions||''} onChange={e=>setForm(f=>({...f,deductions:Number(e.target.value)}))} className={inputCls} /></FormField>
        </div>
      </Modal>
    </div>
  );
}
