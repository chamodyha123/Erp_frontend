import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter } from 'lucide-react';
import hrExtService, { type Recruitment } from '@/services/hrExtService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string,string> = { OPEN:'bg-green-100 text-green-800', IN_PROGRESS:'bg-blue-100 text-blue-800', CLOSED:'bg-gray-100 text-gray-800', CANCELLED:'bg-red-100 text-red-800' };
const blank = () => ({ jobTitle:'', departmentId:0, description:'', requirements:'', vacancies:1, status:'OPEN', postedDate:'' });

export function Recruitment() {
  const [records, setRecords] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Recruitment|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    hrExtService.getRecruitment({ size:100 }).then(p=>setRecords(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = records.filter(r => r.jobTitle.toLowerCase().includes(search.toLowerCase()) || (r.department?.name??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => {
    hrExtService.createRecruitment(form).then(()=>{load();close();}).catch(console.error);
  };
  const handleEdit = () => {
    if (!selected) return;
    hrExtService.updateRecruitment(selected.id, form).then(()=>{load();close();}).catch(console.error);
  };
  const handleDelete = () => {
    if (!selected) return;
    hrExtService.deleteRecruitment(selected.id).then(()=>{load();close();}).catch(console.error);
  };
  const openEdit = (r: Recruitment) => { setSelected(r); setForm({ jobTitle:r.jobTitle, departmentId:r.department?.id??0, description:r.description??'', requirements:r.requirements??'', vacancies:r.vacancies??1, status:r.status, postedDate:r.postedDate??'' }); setModal('edit'); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-8 h-8 text-blue-600" /> Rekrutmen</h1><p className="text-gray-500 mt-1">Kelola proses rekrutmen dan lowongan kerja</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Buat Lowongan</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[{label:'Total Lowongan',val:records.length,color:'text-gray-900'},{label:'Terbuka',val:records.filter(r=>r.status==='OPEN').length,color:'text-green-600'},{label:'Proses',val:records.filter(r=>r.status==='IN_PROGRESS').length,color:'text-blue-600'}].map(s=>(
          <div key={s.label} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.val}</p></div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari posisi atau departemen..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Posisi','Departemen','Tgl Buka','Kuota','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.jobTitle}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{r.department?.name??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{r.postedDate??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{r.vacancies??'-'}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{r.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>openEdit(r)} className="text-yellow-600 hover:text-yellow-800">Edit</button><button onClick={()=>{setSelected(r);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Lowongan" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Posisi" value={selected.jobTitle}/><DetailRow label="Departemen" value={selected.department?.name??'-'}/><DetailRow label="Deskripsi" value={selected.description??'-'}/><DetailRow label="Persyaratan" value={selected.requirements??'-'}/><DetailRow label="Kuota" value={String(selected.vacancies??'-')}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>

      {[{m:'new',title:'Buat Lowongan'},{m:'edit',title:'Edit Lowongan'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="lg" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Posisi" required><input value={form.jobTitle} onChange={e=>setForm(f=>({...f,jobTitle:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="ID Departemen"><input type="number" value={form.departmentId||''} onChange={e=>setForm(f=>({...f,departmentId:Number(e.target.value)}))} className={inputCls} /></FormField>
            <FormField label="Kuota"><input type="number" value={form.vacancies} onChange={e=>setForm(f=>({...f,vacancies:Number(e.target.value)}))} className={inputCls} /></FormField>
            <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="OPEN">Terbuka</option><option value="IN_PROGRESS">Proses</option><option value="CLOSED">Ditutup</option><option value="CANCELLED">Dibatalkan</option></select></FormField>
            <FormField label="Tanggal Buka"><input type="date" value={form.postedDate} onChange={e=>setForm(f=>({...f,postedDate:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Deskripsi"><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls} /></FormField>
            <div className="col-span-2"><FormField label="Persyaratan"><input value={form.requirements} onChange={e=>setForm(f=>({...f,requirements:e.target.value}))} className={inputCls} /></FormField></div>
          </div>
        </Modal>
      ))}

      <Modal open={modal==='delete'} onClose={close} title="Hapus Lowongan" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus lowongan <strong>{selected?.jobTitle}</strong>?</p>
      </Modal>
    </div>
  );
}
