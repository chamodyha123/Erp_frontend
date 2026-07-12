import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import journalEntryService, { type JournalEntry } from '@/services/journalEntryService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rp ' + Number(n).toLocaleString('id-ID') : '-';
const statusColor: Record<string,string> = { DRAFT:'bg-gray-100 text-gray-800', POSTED:'bg-green-100 text-green-800', REVERSED:'bg-red-100 text-red-800' };
const blank = () => ({ entryNumber:'', date:'', description:'', totalDebit:0, totalCredit:0, status:'DRAFT' });

export function JournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'delete'|null>(null);
  const [selected, setSelected] = useState<JournalEntry|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    journalEntryService.getAll({ size:100 }).then(p=>setEntries(p.content)).catch(console.error).finally(()=>setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = entries.filter(e => (e.entryNumber??'').toLowerCase().includes(search.toLowerCase()) || (e.description??'').toLowerCase().includes(search.toLowerCase()));
  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => { journalEntryService.create(form).then(()=>{load();close();}).catch(console.error); };
  const handleDelete = () => { if (!selected) return; journalEntryService.delete(selected.id).then(()=>{load();close();}).catch(console.error); };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600" /> Jurnal Umum</h1><p className="text-gray-500 mt-1">Kelola entri jurnal akuntansi</p></div>
        <button onClick={()=>setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Entri Baru</button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari entri jurnal..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['No. Entri','Tanggal','Keterangan','Total Debit','Total Kredit','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(e=>(
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{e.entryNumber??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.date??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{e.description??'-'}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(e.totalDebit)}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{fmt(e.totalCredit)}</td>
              <td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{e.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(e);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>{setSelected(e);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </div>
      <Modal open={modal==='view'} onClose={close} title="Detail Jurnal" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="No. Entri" value={selected.entryNumber??'-'}/><DetailRow label="Tanggal" value={selected.date??'-'}/><DetailRow label="Keterangan" value={selected.description??'-'}/><DetailRow label="Total Debit" value={fmt(selected.totalDebit)}/><DetailRow label="Total Kredit" value={fmt(selected.totalCredit)}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>
      <Modal open={modal==='new'} onClose={close} title="Entri Jurnal Baru" size="md" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={handleNew}>Simpan</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="No. Entri" required><input value={form.entryNumber} onChange={e=>setForm(f=>({...f,entryNumber:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Tanggal" required><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className={inputCls} /></FormField>
          <FormField label="Total Debit"><input type="number" value={form.totalDebit||''} onChange={e=>setForm(f=>({...f,totalDebit:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Total Kredit"><input type="number" value={form.totalCredit||''} onChange={e=>setForm(f=>({...f,totalCredit:Number(e.target.value)}))} className={inputCls} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}><option value="DRAFT">Draft</option><option value="POSTED">Posted</option></select></FormField>
          <div className="col-span-2"><FormField label="Keterangan"><input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className={inputCls} /></FormField></div>
        </div>
      </Modal>
      <Modal open={modal==='delete'} onClose={close} title="Hapus Jurnal" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus jurnal <strong>{selected?.entryNumber}</strong>?</p>
      </Modal>
    </div>
  );
}
