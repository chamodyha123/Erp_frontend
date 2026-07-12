import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter } from 'lucide-react';
import salesOrderService, { type SalesOrder } from '@/services/salesOrderService';
import { Modal, DetailRow, ModalBtn, selectCls } from '@/app/components/ui/Modal';

const fmt = (n?: number) => n != null ? 'Rs. ' + Number(n).toLocaleString('en-LK') : '-';
const statusColor: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<SalesOrder | null>(null);

  const load = () => {
    setLoading(true);
    salesOrderService.getAll({ size: 100 })
      .then(p => setOrders(p.content ?? (p as any)))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o =>
    (o.orderNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (o.customer?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (order: SalesOrder, newStatus: string) => {
    await salesOrderService.updateStatus(order.id, newStatus);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600" /> Sales Orders
          </h1>
          <p className="text-gray-500 mt-1">Manage sales orders</p>
        </div>
        {/* No create button if you want to keep read-only; we'll hide it */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter className="w-5 h-5" /> Filter</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400">Loading data...</div> : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Order No.', 'Customer', 'Date', 'Delivery', 'Total', 'Status', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-900">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{o.orderNumber ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{o.customer?.name ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{o.date ?? '-'}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{o.deliveryDate ?? '-'}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">{fmt(o.total)}</td>
                  <td className="px-4 py-4">
                    <select value={o.status} onChange={e => handleStatusChange(o, e.target.value)} className={selectCls}>
                      <option value="DRAFT">Draft</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button onClick={() => setSelected(o)} className="text-blue-600 hover:text-blue-800">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Order Detail" size="md" footer={<ModalBtn onClick={() => setSelected(null)}>Close</ModalBtn>}>
        {selected && (
          <div>
            <DetailRow label="Order Number" value={selected.orderNumber ?? '-'} />
            <DetailRow label="Customer" value={selected.customer?.name ?? '-'} />
            <DetailRow label="Date" value={selected.date ?? '-'} />
            <DetailRow label="Delivery Date" value={selected.deliveryDate ?? '-'} />
            <DetailRow label="Subtotal" value={fmt(selected.subtotal)} />
            <DetailRow label="Tax" value={fmt(selected.taxAmount)} />
            <DetailRow label="Total" value={fmt(selected.total)} />
            <DetailRow label="Status" value={selected.status} />
            {selected.notes && <DetailRow label="Notes" value={selected.notes} />}
          </div>
        )}
      </Modal>
    </div>
  );
}