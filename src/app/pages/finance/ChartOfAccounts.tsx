import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';
import chartOfAccountsService, { type ChartOfAccount } from '@/services/chartOfAccountsService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string,string> = { true:'bg-green-100 text-green-800', false:'bg-gray-100 text-gray-800' };
const blank = () => ({ accountCode:'', accountName:'', accountType:'ASSET', description:'', isActive:true });

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<ChartOfAccount|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    chartOfAccountsService.getAll({ size:200 }).then(p=>setAccounts(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = accounts.filter(a => a.accountCode.toLowerCase().includes(search.toLowerCase()) || a.accountName.toLowerCase().includes(search.toLowerCase()) || a.accountType.toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => { chartOfAccountsService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleEdit = () => { if (!selected) return; chartOfAccountsService.update(selected.id, form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; chartOfAccountsService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };
  const openEdit = (a: ChartOfAccount) => { setSelected(a); setForm({ accountCode:a.accountCode, accountName:a.accountName, accountType:a.accountType, description:a.description??'', isActive:a.isActive }); setModal('edit'); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><BookOpen className="w-8 h-8 text-blue-600" /> Bagan Akun</h1><p className="text-gray-500 mt-1">Kelola chart of accounts</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Akun Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari kode atau nama akun..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Kode','Nama Akun','Tipe','Deskripsi','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(a=>(
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{a.accountCode}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{a.accountName}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{a.accountType}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{a.description??'-'}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{a.isActive?'Aktif':'Nonaktif'}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(a);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>openEdit(a)} className="text-yellow-600 hover:text-yellow-800">Edit</button><button onClick={()=>{setSelected(a);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Akun" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="Kode" value={selected.accountCode}/><DetailRow label="Nama" value={selected.accountName}/><DetailRow label="Tipe" value={selected.accountType}/><DetailRow label="Deskripsi" value={selected.description??'-'}/><DetailRow label="Status" value={selected.isActive?'Aktif':'Nonaktif'}/></div>}
      </Modal>
      {[{m:'new',title:'Akun Baru'},{m:'edit',title:'Edit Akun'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Kode Akun" required><input value={form.accountCode} onChange={e=>setForm(f=>({...f,accountCode:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Nama Akun" required><input value={form.accountName} onChange={e=>setForm(f=>({...f,accountName:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Tipe Akun"><select value={form.accountType} onChange={e=>setForm(f=>({...f,accountType:e.target.value}))} className={selectCls}><option value="ASSET">Aset</option><option value="LIABILITY">Kewajiban</option><option value="EQUITY">Ekuitas</option><option value="REVENUE">Pendapatan</option><option value="EXPENSE">Beban</option></select></FormField>
            <FormField label="Status"><select value={String(form.isActive)} onChange={e=>setForm(f=>({...f,isActive:e.target.value==='true'}))} className={selectCls}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></FormField>
            <FormField label="Deskripsi"><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls} /></FormField>
          </div>
        </Modal>
      ))}
      <Modal open={modal==='delete'} onClose={close} title="Hapus Akun" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus akun <strong>{selected?.accountName}</strong>?</p>
      </Modal>
    </div>
  );
}
