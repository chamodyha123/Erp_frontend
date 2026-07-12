import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import employeeService, { type Employee } from '@/services/employeeService';
import departmentService, { type Department } from '@/services/departmentService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const blank = () => ({ 
  employeeId: '', 
  fullName: '', 
  position: '', 
  email: '', 
  phone: '', 
  hireDate: '', 
  status: 'Active', 
  departmentId: '' 
});

const statusColor: Record<string, string> = { 
  Active: 'bg-green-100 text-green-800', 
  Inactive: 'bg-red-100 text-red-800', 
  'On Leave': 'bg-yellow-100 text-yellow-800' 
};

const defaultDepartments: Department[] = [
  { id: '1', name: 'IT Department', code: 'IT' },
  { id: '2', name: 'Financial Department', code: 'FIN' },
  { id: '3', name: 'Human Resources (HR) Department', code: 'HR' },
  { id: '4', name: 'Marketing & Communications Department', code: 'MKT' },
  { id: '5', name: 'Operations Department', code: 'OPS' },
  { id: '6', name: 'Sales & Business Development', code: 'SALES' },
  { id: '7', name: 'Legal & Compliance Department', code: 'LEGAL' },
  { id: '8', name: 'Procurement & Supply Chain', code: 'PROC' }
] as any;

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'new'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Employee|null>(null);
  const [form, setForm] = useState(blank());

  // 🛠️ 1. මුලින්ම localStorage එකේ තියෙන පරණ සේව් කරපු දත්ත ලබා ගැනීම
  const loadLocalEmployees = (): Employee[] => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('erp_saved_employees');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  };

  // 🛠️ 2. දත්ත වෙනස් වන හැමවිටම එය localStorage එකට ස්ථිරව සේව් කිරීමේ ෆන්ක්ෂන් එක
  const saveToLocal = (updatedList: Employee[]) => {
    setEmployees(updatedList);
    setTotal(updatedList.length);
    if (typeof window !== 'undefined') {
      localStorage.setItem('erp_saved_employees', JSON.stringify(updatedList));
    }
  };

  const load = () => {
    setLoading(true);
    const localSaved = loadLocalEmployees();

    employeeService.getAll({ size: 100 })
      .then(p => { 
        const apiData = p.content || [];
        // API එකෙන් දත්ත ආවොත් ඒවා සහ localStorage එකේ දත්ත එකතු කර පෙන්වීම
        const combined = [...apiData, ...localSaved.filter(l => !apiData.some((a: any) => a.id === l.id))];
        setEmployees(combined); 
        setTotal(p.totalElements || combined.length); 
      })
      .catch(err => {
        console.error("Error loading from API, showing local saved data:", err);
        // API ක්‍රියා නොකරන්නේ නම් localStorage එකේ දත්ත කෙලින්ම පෙන්වයි
        setEmployees(localSaved);
        setTotal(localSaved.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    departmentService.getAll()
      .then(res => {
        let apiDepts: Department[] = [];
        if (Array.isArray(res)) apiDepts = res;
        else if (res && Array.isArray((res as any).content)) apiDepts = (res as any).content;
        else if (res && Array.isArray((res as any).data)) apiDepts = (res as any).data;

        if (apiDepts && apiDepts.length > 0) setDepartments(apiDepts);
      })
      .catch(() => setDepartments(defaultDepartments));
  }, []);

  const filtered = employees.filter(e =>
    (e.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.employeeId || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.department?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  // 🛠️ 3. සේවකයෙකු අලුතින් සේව් කිරීම සහ Local මතකයට එකතු කිරීම
  const handleNew = () => {
    if (!form.employeeId || !form.fullName) {
      alert("Please fill required fields (Employee ID and Full Name)");
      return;
    }

    const dept = departments.find(d => 
      String(d.id) === String(form.departmentId) || 
      d.name.toLowerCase() === form.departmentId.toLowerCase()
    );
    
    const newEmployeeData: Employee = {
      id: Date.now(), 
      employeeId: form.employeeId,
      fullName: form.fullName,
      position: form.position,
      email: form.email,
      phone: form.phone,
      hireDate: form.hireDate,
      status: form.status,
      department: dept ? { id: dept.id, name: dept.name, code: dept.code } : { id: '1', name: form.departmentId || 'IT Department', code: 'IT' }
    } as any;

    const updatedList = [newEmployeeData, ...employees];
    saveToLocal(updatedList); // LocalStorage එකට සේව් කිරීම

    employeeService.create(newEmployeeData as any)
      .then(() => { load(); })
      .catch(err => console.error("Saved locally. Backend sync issue:", err));

    close();
  };

  // 🛠️ 4. පවතින සේවකයෙකු Edit කර යාවත්කාලීන කිරීම
  const handleEdit = () => {
    if (!selected) return;
    
    const dept = departments.find(d => 
      String(d.id) === String(form.departmentId) || 
      d.name.toLowerCase() === form.departmentId.toLowerCase()
    );
    
    const updatedEmployeeData = {
      ...selected,
      employeeId: form.employeeId,
      fullName: form.fullName,
      position: form.position,
      email: form.email,
      phone: form.phone,
      hireDate: form.hireDate,
      status: form.status,
      department: dept ? { id: dept.id, name: dept.name, code: dept.code } : { id: '1', name: form.departmentId || 'IT Department', code: 'IT' }
    };

    const updatedList = employees.map(e => e.id === selected.id ? (updatedEmployeeData as any) : e);
    saveToLocal(updatedList);

    employeeService.update(selected.id, updatedEmployeeData as any)
      .then(() => { load(); })
      .catch(err => console.error("Updated locally. Backend sync issue:", err));

    close();
  };

  const handleDelete = () => {
    if (!selected) return;
    const updatedList = employees.filter(e => e.id !== selected.id);
    saveToLocal(updatedList);

    employeeService.terminate(selected.id)
      .then(() => { load(); })
      .catch(console.error);

    close();
  };

  const openEdit = (e: Employee) => {
    setSelected(e);
    setForm({ 
      employeeId: e.employeeId, 
      fullName: e.fullName, 
      position: e.position, 
      email: e.email, 
      phone: e.phone ?? '', 
      hireDate: e.hireDate ?? '', 
      status: e.status, 
      departmentId: e.department?.name || String(e.department?.id ?? '')
    });
    setModal('edit');
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" /> Employees
          </h1>
          <p className="text-gray-500 mt-1">Manage company employee data</p>
        </div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Total Employees</p><p className="text-2xl font-bold text-gray-900">{total}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">Active</p><p className="text-2xl font-bold text-green-600">{employees.filter(e=>e.status==='Active').length}</p></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"><p className="text-sm text-gray-600">On Leave</p><p className="text-2xl font-bold text-yellow-600">{employees.filter(e=>e.status==='On Leave').length}</p></div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employees or departments..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading && employees.length === 0 ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{['ID','Name','Department','Position','Email','Phone','Join Date','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(e=>(
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium text-gray-900">{e.employeeId}</td>
              <td className="px-4 py-4 text-sm text-gray-900">{e.fullName}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.department?.name ?? '-'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.position}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.email}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.phone}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{e.hireDate}</td>
              <td className="px-4 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[e.status] || ''}`}>{e.status}</span></td>
              <td className="px-4 py-4 text-sm">
                <div className="flex gap-3 items-center">
                  <button onClick={()=>{setSelected(e);setModal('view');}} className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                  <button onClick={()=>openEdit(e)} className="text-yellow-600 hover:text-yellow-700 flex items-center" aria-label="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={()=>{setSelected(e);setModal('delete');}} className="text-red-600 hover:text-red-700 flex items-center" aria-label="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>))}
          </tbody>
        </table>
        )}
      </div>

      <Modal open={modal==='view'} onClose={close} title="Employee Details" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected&&<div><DetailRow label="Employee ID" value={selected.employeeId}/><DetailRow label="Full Name" value={selected.fullName}/><DetailRow label="Department" value={selected.department?.name??'-'}/><DetailRow label="Position" value={selected.position}/><DetailRow label="Email" value={selected.email}/><DetailRow label="Phone" value={selected.phone??'-'}/><DetailRow label="Join Date" value={selected.hireDate??'-'}/><DetailRow label="Status" value={<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status] || ''}`}>{selected.status}</span>}/></div>}
      </Modal>

      {[{m:'new',title:'New Employee'},{m:'edit',title:'Edit Employee'}].map(({m,title})=>(
        <Modal key={m} open={modal===m} onClose={close} title={title} size="lg" footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={m==='new'?handleNew:handleEdit}>Save</ModalBtn></>}>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Employee ID" required>
              <input value={form.employeeId} onChange={e=>setForm(f=>({...f,employeeId:e.target.value}))} className={inputCls} />
            </FormField>
            <FormField label="Full Name" required>
              <input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} className={inputCls} />
            </FormField>
            
            <FormField label="Department">
              <select value={form.departmentId} onChange={e=>setForm(f=>({...f,departmentId:e.target.value}))} className={selectCls}>
                <option value="">-- Select --</option>
                {departments.map(d=>(
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </FormField>
            
            <FormField label="Position">
              <input value={form.position} onChange={e=>setForm(f=>({...f,position:e.target.value}))} className={inputCls} />
            </FormField>
            
            <FormField label="Email">
              <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className={inputCls} />
            </FormField>
            
            <FormField label="Phone">
              <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className={inputCls} />
            </FormField>
            <FormField label="Join Date">
              <input type="date" value={form.hireDate} onChange={e=>setForm(f=>({...f,hireDate:e.target.value}))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className={selectCls}>
                {['Active','Inactive','On Leave'].map(s=><option key={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
        </Modal>
      ))}

      <Modal open={modal==='delete'} onClose={close} title="Delete Employee" size="sm" footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p className="text-gray-600">Are you sure you want to delete employee <strong>{selected?.fullName}</strong>?</p>
      </Modal>
    </div>
  );
}