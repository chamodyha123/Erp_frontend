import { useState } from 'react';
import { Shield, Plus, Search } from 'lucide-react';
import { mockRoles } from '@/data/mockData';
import { Modal, FormField, DetailRow, ModalBtn, inputCls } from '@/app/components/ui/Modal';

type Role = typeof mockRoles[0];
const blank = (): Omit<Role,'id'> => ({ name:'', description:'', permissionsCount:0, usersCount:0, createdAt:'' });

export function Roles() {
  const [items, setItems] = useState(mockRoles);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Role|null>(null);
  const [form, setForm] = useState(blank());

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };
  const handleNew = () => { setItems(prev => [...prev, { id: String(Date.now()), ...form, createdAt: new Date().toISOString().split('T')[0] }]); close(); };
  const handleEdit = () => { if (selected) setItems(prev => prev.map(i => i.id === selected.id ? { ...selected, ...form } : i)); close(); };
  const handleDelete = () => { if (selected) setItems(prev => prev.filter(i => i.id !== selected.id)); close(); };
  const openEdit = (r: Role) => { setSelected(r); setForm({ name:r.name, description:r.description, permissionsCount:r.permissionsCount, usersCount:r.usersCount, createdAt:r.createdAt }); setModal('edit'); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Shield className="w-8 h-8 text-blue-600" /> Role & Hak Akses</h1><p className="text-gray-500 mt-1">Kelola role dan izin sistem</p></div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Tambah Role</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Role</p><p className="text-2xl font-bold text-gray-900">{items.length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Izin</p><p className="text-2xl font-bold text-blue-600">{items.reduce((s,i)=>s+i.permissionsCount,0)}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Pengguna Tertaut</p><p className="text-2xl font-bold text-purple-600">{items.reduce((s,i)=>s+i.usersCount,0)}</p></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari role..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Nama Role','Deskripsi','Jumlah Izin','Jumlah Pengguna','Dibuat','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.name}</td><td className="px-4 py-4 text-sm text-gray-600 max-w-[200px]">{r.description}</td><td className="px-4 py-4 text-sm text-gray-600">{r.permissionsCount}</td><td className="px-4 py-4 text-sm text-gray-600">{r.usersCount}</td><td className="px-4 py-4 text-sm text-gray-600">{r.createdAt}</td>
              <td className="px-4 py-4"><div className="flex gap-2"><button onClick={()=>{setSelected(r);setModal('view');}} className="text-blue-600 hover:text-blue-800 text-sm">Lihat</button><button onClick={()=>openEdit(r)} className="text-yellow-600 hover:text-yellow-800 text-sm">Edit</button><button onClick={()=>{setSelected(r);setModal('delete');}} className="text-red-600 hover:text-red-800 text-sm">Hapus</button></div></td>
            </tr>))}
          </tbody>
        </table>
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Role" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Nama Role" value={selected.name}/><DetailRow label="Deskripsi" value={selected.description}/><DetailRow label="Jumlah Izin" value={selected.permissionsCount}/><DetailRow label="Jumlah Pengguna" value={selected.usersCount}/><DetailRow label="Dibuat" value={selected.createdAt}/></div>}
      </Modal>

      {[{m:'new',title:'Tambah Role'},{m:'edit',title:'Edit Role'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="space-y-4">
            <FormField label="Nama Role" required><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Deskripsi"><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Jumlah Izin"><input type="number" value={form.permissionsCount||''} onChange={e=>setForm(f=>({...f,permissionsCount:Number(e.target.value)}))} className={inputCls} /></FormField>
          </div>
        </Modal>
      ))}

      <Modal open={modal==='delete'} onClose={close} title="Hapus Role" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus role <strong>{selected?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
