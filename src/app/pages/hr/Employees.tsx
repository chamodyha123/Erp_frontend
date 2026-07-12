import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter } from 'lucide-react';
import employeeService, { type Employee } from '@/services/employeeService';
import departmentService, { type Department } from '@/services/departmentService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({ employeeId:'', fullName:'', position:'', email:'', phone:'', hireDate:'', status:'Active', departmentId:'' });
const statusColor: Record<string,string> = { Active:'bg-green-100 text-green-800', Inactive:'bg-red-100 text-red-800', 'On Leave':'bg-yellow-100 text-yellow-800' };

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Employee|null>(null);
  const [form, setForm] = useState(blank());

  const load = () => {
    setLoading(true);
    employeeService.getAll({ size: 100 })
      .then(p => { setEmployees(p.content); setTotal(p.totalElements); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    departmentService.getAll().then(setDepartments).catch(console.error);
  }, []);

  const filtered = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    (e.department?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const handleNew = () => {
    const dept = departments.find(d => String(d.id) === form.departmentId);
    employeeService.create({ ...form, department: dept ? { id: dept.id, name: dept.name, code: dept.code } : undefined })
      .then(() => { load(); close(); })
      .catch(console.error);
  };

  const handleEdit = () => {
    if (!selected) return;
    const dept = departments.find(d => String(d.id) === form.departmentId);
    employeeService.update(selected.id, { ...form, department: dept ? { id: dept.id, name: dept.name, code: dept.code } : undefined })
      .then(() => { load(); close(); })
      .catch(console.error);
  };

  const handleDelete = () => {
    if (!selected) return;
    employeeService.terminate(selected.id).then(() => { load(); close(); }).catch(console.error);
  };

  const openEdit = (e: Employee) => {
    setSelected(e);
    setForm({ employeeId: e.employeeId, fullName: e.fullName, position: e.position, email: e.email, phone: e.phone ?? '', hireDate: e.hireDate ?? '', status: e.status, departmentId: String(e.department?.id ?? '') });
    setModal('edit');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Users className="w-8 h-8 text-blue-600" /> Karyawan</h1><p className="text-gray-500 mt-1">Kelola data karyawan perusahaan</p></div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Plus className="w-5 h-5" /> Karyawan Baru</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Karyawan</p><p className="text-2xl font-bold text-gray-900">{total}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Aktif</p><p className="text-2xl font-bold text-green-600">{employees.filter(e=>e.status==='Active').length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Cuti</p><p className="text-2xl font-bold text-yellow-600">{employees.filter(e=>e.status==='On Leave').length}</p></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4"><div className="flex-1 relative"><Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari karyawan atau departemen..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Memuat data...</div> : (
        <table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr>{['ID','Nama','Departemen','Jabatan','Email','No. HP','Tgl Masuk','Status','Aksi'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">{filtered.map(e=>(
            <tr key={e.id} className="hover:bg-gray-50"><td className="px-4 py-4 text-sm font-medium text-gray-900">{e.employeeId}</td><td className="px-4 py-4 text-sm text-gray-900">{e.fullName}</td><td className="px-4 py-4 text-sm text-gray-600">{e.department?.name ?? '-'}</td><td className="px-4 py-4 text-sm text-gray-600">{e.position}</td><td className="px-4 py-4 text-sm text-gray-600">{e.email}</td><td className="px-4 py-4 text-sm text-gray-600">{e.phone}</td><td className="px-4 py-4 text-sm text-gray-600">{e.hireDate}</td><td className="px-4 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{e.status}</span></td>
              <td className="px-4 py-4 text-sm"><div className="flex gap-2"><button onClick={()=>{setSelected(e);setModal('view');}} className="text-blue-600 hover:text-blue-800">Lihat</button><button onClick={()=>openEdit(e)} className="text-yellow-600 hover:text-yellow-800">Edit</button><button onClick={()=>{setSelected(e);setModal('delete');}} className="text-red-600 hover:text-red-800">Hapus</button></div></td>
            </tr>))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Detail Karyawan" size="md" footer={<ModalBtn onClick={close}>Tutup</ModalBtn>}>
        {selected&&<div><DetailRow label="ID Karyawan" value={selected.employeeId}/><DetailRow label="Nama Lengkap" value={selected.fullName}/><DetailRow label="Departemen" value={selected.department?.name??'-'}/><DetailRow label="Jabatan" value={selected.position}/><DetailRow label="Email" value={selected.email}/><DetailRow label="No. HP" value={selected.phone??'-'}/><DetailRow label="Tgl Masuk" value={selected.hireDate??'-'}/><DetailRow label="Status" value={<span className="px-2.5 py-0.5 rounded-full text-xs font-medium">{selected.status}</span>}/></div>}
      </Modal>

      {[{m:'new',title:'Karyawan Baru'},{m:'edit',title:'Edit Karyawan'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="lg" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Simpan</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="ID Karyawan" required><input value={form.employeeId} onChange={e=>setForm(f=>({...f,employeeId:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Nama Lengkap" required><input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Departemen"><select value={form.departmentId} onChange={e=>setForm(f=>({...f,departmentId:e.target.value}))} className={selectCls}><option value="">-- Pilih --</option>{departments.map(d=><option key={d.id} value={String(d.id)}>{d.name}</option>)}</select></FormField>
            <FormField label="Jabatan"><input value={form.position} onChange={e=>setForm(f=>({...f,position:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Email"><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="No. HP"><input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Tgl Masuk"><input type="date" value={form.hireDate} onChange={e=>setForm(f=>({...f,hireDate:e.target.value}))} className={inputCls} /></FormField>
            <FormField label="Status"><select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}>{['Active','Inactive','On Leave'].map(s=><option key={s}>{s}</option>)}</select></FormField>
          </div>
        </Modal>
      ))}

      <Modal open={modal==='delete'} onClose={close} title="Hapus Karyawan" size="sm" footer={<><ModalBtn onClick={close}>Batal</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Hapus</ModalBtn></>}>
        <p className="text-gray-600">Yakin ingin menghapus karyawan <strong>{selected?.fullName}</strong>?</p>
      </Modal>
    </div>
  );
}
