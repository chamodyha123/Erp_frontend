import { useState, useEffect } from 'react';
import { Wrench, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import manufacturingService, { type WorkOrder } from '@/services/manufacturingService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const statusColor: Record<string, string> = {
  Pending: 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const blank = () => ({
  workOrderNumber: '',
  productionOrderId: 0,
  workCenter: '',
  operation: '',
  plannedHours: 0,
  actualHours: 0,
  status: 'Pending',
  assignedToId: 0,
});

export function WorkOrders() {
  const [records, setRecords] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<WorkOrder | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<WorkOrder | null>(null);

  // Dropdown data
  const [productionOrders, setProductionOrders] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    manufacturingService.getProductionOrders({ size: 500 }).then(res => setProductionOrders(res.content ?? []));
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
  }, []);

  const load = () => {
    setLoading(true);
    manufacturingService.getWorkOrders({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.workOrderNumber ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (wo: WorkOrder) => {
    setSelected(wo);
    setForm({
      workOrderNumber: wo.workOrderNumber ?? '',
      productionOrderId: wo.productionOrder?.id ?? 0,
      workCenter: wo.workCenter ?? '',
      operation: wo.operation ?? '',
      plannedHours: wo.plannedHours ?? 0,
      actualHours: wo.actualHours ?? 0,
      status: wo.status ?? 'Pending',
      assignedToId: wo.assignedTo?.id ?? 0,
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      workOrderNumber: form.workOrderNumber,
      productionOrder: form.productionOrderId ? { id: form.productionOrderId } : null,
      workCenter: form.workCenter,
      operation: form.operation,
      plannedHours: form.plannedHours,
      actualHours: form.actualHours,
      status: form.status,
      assignedTo: form.assignedToId ? { id: form.assignedToId } : null,
    };

    if (selected) {
      manufacturingService.updateWorkOrder(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      manufacturingService.createWorkOrder(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await manufacturingService.deleteWorkOrder(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Wrench className="w-8 h-8 text-blue-600" /> Work Orders
          </h1>
          <p className="text-gray-500 mt-1">Manage production work orders</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New Work Order
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search work orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['WO No.', 'Production Order', 'Operation', 'Work Center', 'Planned Hrs', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.workOrderNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.productionOrder?.orderNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.operation ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.workCenter ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.plannedHours ?? 0}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status ?? ''] ?? 'bg-gray-100 text-gray-800'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(r); setModal('view'); }} className="text-blue-600 hover:text-blue-800">View</button>
                      <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-800"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(r)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      <Modal open={modal === 'view'} onClose={close} title="Work Order Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="WO Number" value={selected.workOrderNumber ?? '-'} />
            <DetailRow label="Production Order" value={selected.productionOrder?.orderNumber ?? '-'} />
            <DetailRow label="Operation" value={selected.operation ?? '-'} />
            <DetailRow label="Work Center" value={selected.workCenter ?? '-'} />
            <DetailRow label="Planned Hours" value={String(selected.plannedHours ?? 0)} />
            <DetailRow label="Actual Hours" value={String(selected.actualHours ?? 0)} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.assignedTo && <DetailRow label="Assigned To" value={selected.assignedTo.fullName} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit Work Order' : 'New Work Order'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="WO Number" required>
            <input value={form.workOrderNumber} onChange={e => setForm(f => ({ ...f, workOrderNumber: e.target.value }))} className={inputCls} />
          </FormField>

          <FormField label="Production Order" required>
            <select value={form.productionOrderId} onChange={e => setForm(f => ({ ...f, productionOrderId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {productionOrders.map(po => (
                <option key={po.id} value={po.id}>{po.orderNumber} - {po.product?.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Operation">
            <input value={form.operation} onChange={e => setForm(f => ({ ...f, operation: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Work Center">
            <input value={form.workCenter} onChange={e => setForm(f => ({ ...f, workCenter: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Planned Hours">
            <input type="number" step="0.5" value={form.plannedHours || ''} onChange={e => setForm(f => ({ ...f, plannedHours: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Actual Hours">
            <input type="number" step="0.5" value={form.actualHours || ''} onChange={e => setForm(f => ({ ...f, actualHours: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </FormField>

          <FormField label="Assigned To">
            <select value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.workOrderNumber}</strong>?</p>
      </Modal>
    </div>
  );
}