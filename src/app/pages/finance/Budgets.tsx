import { useState, useEffect } from 'react';
import { PieChart, Plus, Search, Filter } from 'lucide-react';
import { budgetService, type Budget } from '@/services/financeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { ACTIVE:'bg-green-100 text-green-800', DRAFT:'bg-gray-100 text-gray-800', CLOSED:'bg-red-100 text-red-800' };
const blank = () => ({ departmentId:0, fiscalYear:new Date().getFullYear(), budgetType:'OPERATIONAL', amount:0, status:'DRAFT', description:'' });

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|null>(null);
  const [selected, setSelected] = useState<Budget|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    budgetService.getAll({ size:100 }).then(p=>setBudgets(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = budgets.filter(b => (b.department?.name??'').toLowerCase().includes(search.toLowerCase()) || (b.budgetType??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { budgetService.create(form).then(()=>{load();close();}).catch(console.error); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><PieChart className="w-8 h-8 text-blue-600" /> Anggaran</h1><p className="text-gray-500 mt-1">Kelola anggaran departemen</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Anggaran Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari departemen atau tipe..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Departemen','Tahun','Tipe','Total Anggaran','Terpakai','Sisa','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(b=>(
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{b.department?.name??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{b.fiscalYear??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{b.budgetType??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(b.amount)}</td>
              <td className="px-4 py-4 text-sm text-orange-600">{fmt(b.spentAmount)}</td>
              <td className="px-4 py-4 text-sm text-green-600">{fmt((b.amount??0)-(b.spentAmount??0))}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{b.status}</span></td>
              <td className="px-4 py-4 text-sm"><button onClick={()=>{setSelected(b);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Anggaran" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Departemen" value={selected.department?.name??'-'}/><DetailRow label="Tahun Fiskal" value={String(selected.fiscalYear??'-')}/><DetailRow label="Tipe" value={selected.budgetType??'-'}/><DetailRow label="Total Anggaran" value={fmt(selected.amount)}/><DetailRow label="Terpakai" value={fmt(selected.spentAmount)}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>
      <Modal open={modal==='new'} onClose={close} title="Anggaran Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="ID Departemen"><input type="number" value={form.departmentId||''} onChange={e=>setForm(f=>({...f,departmentId:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tahun Fiskal"><input type="number" value={form.fiscalYear} onChange={e=>setForm(f=>({...f,fiscalYear:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Tipe Anggaran"><select value={form.budgetType} onChange={e=>setForm(f=>({...f,budgetType:e.target.value}))} className={selectCls}><option value="OPERATIONAL">Operasional</option><option value="CAPITAL">Modal</option><option value="MARKETING">Marketing</option></select></FormField>
          <FormField label="Total Anggaran" required><input type="number" value={form.amount||''} onChange={e=>setForm(f=>({...f,amount:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="ACTIVE">Aktif</option></select></FormField>
        </div>
      </Modal>
    </div>
  );
}
