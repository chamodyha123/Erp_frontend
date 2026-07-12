import { useState, useEffect } from 'react';
import { CheckCircle, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import manufacturingService, { type QualityControl } from '@/services/manufacturingService';
import employeeService from '@/services/employeeService';
import { Modal, FormField, DetailRow, ModalBtn, inputCls, selectCls } from '@/app/components/ui/Modal';

const resultColor: Record<string, string> = {
  PASS: 'bg-green-100 text-green-800',
  FAIL: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
};

const statusColor: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const blank = () => ({
  checkNumber: '',
  productionOrderId: 0,
  productId: 0,
  inspectionDate: '',
  batchNumber: '',
  totalInspected: 0,
  passed: 0,
  failed: 0,
  result: 'PENDING',
  status: 'OPEN',
  inspectorId: 0,
  remarks: '',
});

export function QualityControl() {
  const [records, setRecords] = useState<QualityControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view' | 'form' | null>(null);
  const [selected, setSelected] = useState<QualityControl | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteConfirm, setDeleteConfirm] = useState<QualityControl | null>(null);

  // Dropdown data
  const [employees, setEmployees] = useState<any[]>([]);
  const [productionOrders, setProductionOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load employees, production orders, and products for dropdowns
    employeeService.getAll({ size: 500 }).then(res => setEmployees(res.content ?? []));
    manufacturingService.getProductionOrders({ size: 500 }).then(res => setProductionOrders(res.content ?? []));
    // Import productService if you have it; otherwise skip or use a generic product list
    import('@/services/productService').then(m => m.default.getAll({ size: 500 }).then(res => setProducts(res.content ?? []))).catch(console.warn);
  }, []);

  const load = () => {
    setLoading(true);
    manufacturingService.getQCChecks({ size: 100 })
      .then(p => setRecords(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r =>
    (r.checkNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.productionOrder?.orderNumber ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const close = () => { setModal(null); setSelected(null); setForm(blank()); };

  const openEdit = (qc: QualityControl) => {
    setSelected(qc);
    setForm({
      checkNumber: qc.checkNumber ?? '',
      productionOrderId: qc.productionOrder?.id ?? 0,
      productId: qc.product?.id ?? 0,
      inspectionDate: qc.inspectionDate ?? qc.checkDate ?? '',
      batchNumber: qc.batchNumber ?? '',
      totalInspected: qc.totalInspected ?? 0,
      passed: qc.passed ?? 0,
      failed: qc.failed ?? 0,
      result: qc.result ?? 'PENDING',
      status: qc.status ?? 'OPEN',
      inspectorId: qc.inspector?.id ?? 0,
      remarks: qc.remarks ?? qc.notes ?? '',
    });
    setModal('form');
  };

  const handleSubmit = () => {
    const payload = {
      checkNumber: form.checkNumber,
      productionOrder: form.productionOrderId ? { id: form.productionOrderId } : null,
      product: form.productId ? { id: form.productId } : null,
      inspectionDate: form.inspectionDate,
      batchNumber: form.batchNumber,
      totalInspected: form.totalInspected,
      passed: form.passed,
      failed: form.failed,
      result: form.result,
      status: form.status,
      inspector: form.inspectorId ? { id: form.inspectorId } : null,
      remarks: form.remarks,
    };

    if (selected) {
      manufacturingService.updateQualityControl(selected.id, payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    } else {
      manufacturingService.createQualityControl(payload)
        .then(() => { load(); close(); })
        .catch(console.error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    await manufacturingService.deleteQualityControl(deleteConfirm.id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-600" /> Quality Control
          </h1>
          <p className="text-gray-500 mt-1">Production quality inspections</p>
        </div>
        <button onClick={() => { setSelected(null); setForm(blank()); setModal('form'); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-5 h-5" /> New QC Check
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex-1 relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search QC checks..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Check No.', 'Production Order', 'Date', 'Inspector', 'Result', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.checkNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.productionOrder?.orderNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.inspectionDate ?? r.checkDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{r.inspector?.fullName ?? '-'}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${resultColor[r.result ?? ''] ?? 'bg-gray-100 text-gray-800'}`}>{r.result ?? '-'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[r.status ?? ''] ?? 'bg-gray-100 text-gray-800'}`}>{r.status ?? '-'}</span>
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
      <Modal open={modal === 'view'} onClose={close} title="QC Detail" size="md" footer={<ModalBtn onClick={close}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Check Number" value={selected.checkNumber ?? '-'} />
            <DetailRow label="Production Order" value={selected.productionOrder?.orderNumber ?? '-'} />
            <DetailRow label="Inspection Date" value={selected.inspectionDate ?? selected.checkDate ?? '-'} />
            <DetailRow label="Batch" value={selected.batchNumber ?? '-'} />
            <DetailRow label="Total Inspected" value={String(selected.totalInspected ?? 0)} />
            <DetailRow label="Passed" value={String(selected.passed ?? 0)} />
            <DetailRow label="Failed" value={String(selected.failed ?? 0)} />
            <DetailRow label="Result" value={selected.result ?? '-'} />
            <DetailRow label="Status" value={selected.status ?? '-'} />
            {selected.inspector && <DetailRow label="Inspector" value={selected.inspector.fullName} />}
            {selected.remarks && <DetailRow label="Remarks" value={selected.remarks} />}
          </div>
        )}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal open={modal === 'form'} onClose={close} title={selected ? 'Edit QC Check' : 'New QC Check'} size="md"
        footer={<><ModalBtn onClick={close}>Cancel</ModalBtn><ModalBtn variant="primary" onClick={handleSubmit}>{selected ? 'Update' : 'Create'}</ModalBtn></>}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Check Number" required>
            <input value={form.checkNumber} onChange={e => setForm(f => ({ ...f, checkNumber: e.target.value }))} className={inputCls} />
          </FormField>

          <FormField label="Production Order" required>
            <select value={form.productionOrderId} onChange={e => setForm(f => ({ ...f, productionOrderId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {productionOrders.map(po => (
                <option key={po.id} value={po.id}>{po.orderNumber} - {po.product?.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Product">
            <select value={form.productId} onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </FormField>

          <FormField label="Inspector" required>
            <select value={form.inspectorId} onChange={e => setForm(f => ({ ...f, inspectorId: Number(e.target.value) }))} className={selectCls}>
              <option value={0}>-- Select --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Inspection Date">
            <input type="date" value={form.inspectionDate} onChange={e => setForm(f => ({ ...f, inspectionDate: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Batch Number">
            <input value={form.batchNumber} onChange={e => setForm(f => ({ ...f, batchNumber: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Total Inspected">
            <input type="number" value={form.totalInspected || ''} onChange={e => setForm(f => ({ ...f, totalInspected: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Passed">
            <input type="number" value={form.passed || ''} onChange={e => setForm(f => ({ ...f, passed: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Failed">
            <input type="number" value={form.failed || ''} onChange={e => setForm(f => ({ ...f, failed: Number(e.target.value) }))} className={inputCls} />
          </FormField>
          <FormField label="Result">
            <select value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} className={selectCls}>
              <option value="PENDING">Pending</option>
              <option value="PASS">Pass</option>
              <option value="FAIL">Fail</option>
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </FormField>
          <FormField label="Remarks">
            <input value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} className={inputCls} />
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete" size="sm"
        footer={<><ModalBtn onClick={() => setDeleteConfirm(null)}>Cancel</ModalBtn><ModalBtn variant="danger" onClick={handleDelete}>Delete</ModalBtn></>}>
        <p>Are you sure you want to delete <strong>{deleteConfirm?.checkNumber}</strong>?</p>
      </Modal>
    </div>
  );
}