import { useState, useEffect } from 'react';
import { FileSearch, Search, Filter } from 'lucide-react';
import systemService, { type AuditLog } from '@/services/systemService';
import { Modal, DetailRow, ModalBtn } from '@/app/components/ui/Modal';
export function AuditLogs() {
  const [records, setRecords] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AuditLog|null>(null);
  const load = () => { setLoading(true); systemService.getAuditLogs({ size:100 }).then(p=>setRecords(p.content??p as any)).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(() => { load(); }, []);
  const filtered = records.filter(r => (r.user?.username??'').toLowerCase().includes(search.toLowerCase()) || (r.action??'').toLowerCase().includes(search.toLowerCase()) || (r.entity??'').toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><FileSearch className="w-8 h-8 text-blue-600" /> Log Audit</h1><p className="text-gray-500 mt-1">Riwayat aktivitas sistem</p></div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6"><div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari pengguna atau aksi..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div></div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (<table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['Pengguna','Aksi','Entitas','ID Entitas','Waktu','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{r.user?.username??'-'}</td><td className="px-4 py-4"><span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">{r.action??'-'}</span></td><td className="px-4 py-4 text-sm text-gray-600">{r.entity??'-'}</td><td className="px-4 py-4 text-sm text-gray-600">{r.entityId??'-'}</td><td className="px-4 py-4 text-sm text-gray-500">{r.createdAt?new Date(r.createdAt).toLocaleString('id-ID'):'-'}</td><td className="px-4 py-4 text-sm"><button onClick={()=>setSelected(r)} className="text-blue-600 hover:text-blue-800">Lihat</button></td></tr>
          ))}</tbody></table>)}
      </div>
      <Modal open={!!selected} onClose={()=>setSelected(null)} title="Detail Log Audit" size="md" footer={<ModalBtn onClick={()=>setSelected(null)}>Tutup</ModalBtn>}>{selected&&<div><DetailRow label="Pengguna" value={selected.user?.username??'-'}/><DetailRow label="Aksi" value={selected.action??'-'}/><DetailRow label="Entitas" value={selected.entity??'-'}/><DetailRow label="ID Entitas" value={String(selected.entityId??'-')}/><DetailRow label="Perubahan" value={selected.changes??'-'}/><DetailRow label="IP Address" value={selected.ipAddress??'-'}/><DetailRow label="Waktu" value={selected.createdAt?new Date(selected.createdAt).toLocaleString('id-ID'):'-'}/></div>}</Modal>
    </div>
  );
}
