import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import departmentService, { type Department } from '@/services/departmentService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({ name:'', code:'', description:'', isActive:true });
const statusColor: Record<string,string> = { true:'bg-green-100 text-green-800', false:'bg-red-100 text-red-800' };

export function Departments() {
  const [depts, setDepts] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Department|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    departmentService.getAll().then(setDepts).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = depts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => {
    departmentService.create(form).then(()=>{load();close();}).catch(console.error);
  };
  const handleEdit = () => {
    if (!selected) return;
    departmentService.update(selected.id, form).then(()=>{load();close();}).catch(console.error);
  };
  const handleDelete = () => {
    if (!selected) return;
    departmentService.delete(selected.id).then(()=>{load();close();}).catch(console.error);
  };
  const openEdit = (d: Department) => { setSelected(d); setForm({ name:d.name, code:d.code, description:d.description??'', isActive:d.isActive }); setModal('edit'); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Building2 className="w-8 h-8 text-blue-600" /> Departemen</h1><p className="text-gray-500 mt-1">Kelola struktur departemen dan divisi</p></div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Departemen Baru</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Departemen</p><p className="text-2xl font-bold text-gray-900">{depts.length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Aktif</p><p className="text-2xl font-bold text-blue-600">{depts.filter(d=>d.isActive).length}</p></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari departemen..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Kode','Nama','Deskripsi','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(d=>(
            <tr key={d.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{d.code}</td><td className="px-4 py-4 text-sm text-gray-900">{d.name}</td><td className="px-4 py-4 text-sm text-gray-600">{d.description ?? '-'}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{d.isActive?'Aktif':'Nonaktif'}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(d);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>openEdit(d)} className="text-yellow-600 hover:text-yellow-800">Edit</button><button onClick={()=>{setSelected(d);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Departemen" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Kode" value={selected.code}/><DetailRow label="Nama" value={selected.name}/><DetailRow label="Deskripsi" value={selected.description??'-'}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.isActive?'Aktif':'Nonaktif'}</span>}/></div>}
      </Modal>

      {[{m:'new',title:'Departemen Baru'},{m:'edit',title:'Edit Departemen'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kode" required><input value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Nama" required><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Deskripsi" required={false}><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Status"><select value={String(form.isActive)} onChange={e=>setForm(f=>({...f,isActive:e.target.value==='true'}))} className={selectCls}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></FormField>
          </div>
        </Modal>
      ))}

      <Modal open={modal==='delete'} onClose={close} title="Hapus Departemen" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus departemen <strong>{selected?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
