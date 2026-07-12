import { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Search, Filter } from 'lucide-react';
import userService, { type User } from '@/services/userService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';
const blank = () => ({ username:'', email:'', password:'', roleId:0, isActive:true });
export function Users() {
  const [records, setRecords] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'delete'|null>(null);
  const [selected, setSelected] = useState<User|null>(null);
  const [form, setForm] = useState(blank());
  const load = () => { setLoading(true); userService.getAll({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.username??'').toLowerCase().includes(search.toLowerCase()) || (r.email??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { userService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; userService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><UsersIcon className="w-8 h-8 text-blue-600" /> Pengguna</h1><p className="text-gray-500 mt-1">Kelola akun pengguna sistem</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Pengguna Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pengguna..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Username','Email','Role','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.username??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.email??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.role?.name??'-'}</td><td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${r.isActive?'bg-green-100 text-green-800':'bg-gray-100 text-gray-800'}`}>{r.isActive?'Aktif':'Nonaktif'}</span></td><td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>{setSelected(r);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Pengguna" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Username" value={selected.username??'-'}/><DetailRow label="Email" value={selected.email??'-'}/><DetailRow label="Role" value={selected.role?.name??'-'}/><DetailRow label="Status" value={selected.isActive?'Aktif':'Nonaktif'}/></div>}</Modal>
      <Modal open={modal==='new'} onClose={close} title="Pengguna Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}><div className="grid grid-cols-2 gap-4"><FormField label="Username" required><input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} className={inputCls} /></FormField><FormField label="Email" required><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inputCls} /></FormField><FormField label="Password" required><input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} className={inputCls} /></FormField><FormField label="ID Role"><input type="number" value={form.roleId||''} onChange={e=>setForm(f=>({...f,roleId:Number(e.target.value)}))} className={inputCls} /></FormField><FormField label="Status"><select value={form.isActive?'true':'false'} onChange={e=>setForm(f=>({...f,isActive:e.target.value==='true'}))} className={selectCls}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></FormField></div></Modal>
      <Modal open={modal==='delete'} onClose={close} title="Hapus Pengguna" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}><p className="text-gray-600">Yakin hapus pengguna <strong>{selected?.username}</strong>?</p></Modal>
    </div>
  );
}
