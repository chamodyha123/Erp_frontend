// ============================================================
// MOCK DATA — Temporary placeholder until Spring Boot API ready
// Replace with real API calls when backend is connected
// ============================================================

// ─── FINANCE ─────────────────────────────────────────────────

export const mockChartOfAccounts = [
  { id: '1', accountCode: '1000', accountName: 'Cash & Bank', type: 'Asset', balance: 250000000, isActive: true },
  { id: '2', accountCode: '1100', accountName: 'Accounts Receivable', type: 'Asset', balance: 180000000, isActive: true },
  { id: '3', accountCode: '1200', accountName: 'Inventory', type: 'Asset', balance: 320000000, isActive: true },
  { id: '4', accountCode: '1500', accountName: 'Fixed Assets', type: 'Asset', balance: 750000000, isActive: true },
  { id: '5', accountCode: '2000', accountName: 'Accounts Payable', type: 'Liability', balance: 90000000, isActive: true },
  { id: '6', accountCode: '2100', accountName: 'Short-term Loans', type: 'Liability', balance: 150000000, isActive: true },
  { id: '7', accountCode: '3000', accountName: 'Share Capital', type: 'Equity', balance: 500000000, isActive: true },
  { id: '8', accountCode: '3100', accountName: 'Retained Earnings', type: 'Equity', balance: 210000000, isActive: true },
  { id: '9', accountCode: '4000', accountName: 'Sales Revenue', type: 'Income', balance: 880000000, isActive: true },
  { id: '10', accountCode: '5000', accountName: 'Cost of Goods Sold', type: 'Expense', balance: 540000000, isActive: true },
  { id: '11', accountCode: '5100', accountName: 'Salaries Expense', type: 'Expense', balance: 120000000, isActive: true },
  { id: '12', accountCode: '5200', accountName: 'Rent Expense', type: 'Expense', balance: 24000000, isActive: true },
];

export const mockJournalEntries = [
  { id: '1', entryNumber: 'JE-2025-001', date: '2025-01-05', description: 'Sales revenue January', debit: 45000000, credit: 45000000, status: 'Posted', createdBy: 'Ahmad Fauzi' },
  { id: '2', entryNumber: 'JE-2025-002', date: '2025-01-10', description: 'Purchase inventory from vendor', debit: 12500000, credit: 12500000, status: 'Posted', createdBy: 'Dewi Sari' },
  { id: '3', entryNumber: 'JE-2025-003', date: '2025-01-15', description: 'Payroll January payable', debit: 32000000, credit: 32000000, status: 'Posted', createdBy: 'Ahmad Fauzi' },
  { id: '4', entryNumber: 'JE-2025-004', date: '2025-01-20', description: 'Monthly rent payment', debit: 8000000, credit: 8000000, status: 'Posted', createdBy: 'Budi Santoso' },
  { id: '5', entryNumber: 'JE-2025-005', date: '2025-01-25', description: 'Fixed asset depreciation', debit: 5000000, credit: 5000000, status: 'Posted', createdBy: 'Dewi Sari' },
  { id: '6', entryNumber: 'JE-2025-006', date: '2025-02-01', description: 'Customer advance payment', debit: 20000000, credit: 20000000, status: 'Draft', createdBy: 'Rina Handayani' },
];

export const mockAccountsPayable = [
  { id: '1', invoiceNumber: 'AP-INV-001', vendor: 'PT Bahan Baku Nusantara', amount: 28500000, invoiceDate: '2025-01-08', dueDate: '2025-02-07', status: 'Unpaid' },
  { id: '2', invoiceNumber: 'AP-INV-002', vendor: 'CV Suplai Teknik', amount: 12000000, invoiceDate: '2025-01-12', dueDate: '2025-02-11', status: 'Paid' },
  { id: '3', invoiceNumber: 'AP-INV-003', vendor: 'PT Logistik Andalan', amount: 5750000, invoiceDate: '2025-01-18', dueDate: '2025-02-17', status: 'Unpaid' },
  { id: '4', invoiceNumber: 'AP-INV-004', vendor: 'Toko Elektronik Jaya', amount: 18900000, invoiceDate: '2025-01-22', dueDate: '2025-02-21', status: 'Partial' },
  { id: '5', invoiceNumber: 'AP-INV-005', vendor: 'PT Packaging Indah', amount: 3200000, invoiceDate: '2025-01-28', dueDate: '2025-02-27', status: 'Overdue' },
];

export const mockAccountsReceivable = [
  { id: '1', invoiceNumber: 'AR-INV-001', customer: 'PT Retail Maju', amount: 47500000, invoiceDate: '2025-01-06', dueDate: '2025-02-05', status: 'Unpaid' },
  { id: '2', invoiceNumber: 'AR-INV-002', customer: 'CV Toko Besar', amount: 22000000, invoiceDate: '2025-01-10', dueDate: '2025-02-09', status: 'Paid' },
  { id: '3', invoiceNumber: 'AR-INV-003', customer: 'PT Distributor Nasional', amount: 89000000, invoiceDate: '2025-01-14', dueDate: '2025-02-13', status: 'Partial' },
  { id: '4', invoiceNumber: 'AR-INV-004', customer: 'Koperasi Sumber Makmur', amount: 6500000, invoiceDate: '2025-01-20', dueDate: '2025-02-19', status: 'Overdue' },
  { id: '5', invoiceNumber: 'AR-INV-005', customer: 'PT Agen Jaya Sentosa', amount: 31000000, invoiceDate: '2025-01-25', dueDate: '2025-02-24', status: 'Unpaid' },
];

export const mockBudgets = [
  { id: '1', budgetCode: 'BDG-2025-001', name: 'Operational Budget Q1', department: 'Operations', amount: 500000000, spent: 210000000, remaining: 290000000, period: '2025 Q1', status: 'Active' },
  { id: '2', budgetCode: 'BDG-2025-002', name: 'Marketing Campaign', department: 'Marketing', amount: 150000000, spent: 75000000, remaining: 75000000, period: '2025 Q1', status: 'Active' },
  { id: '3', budgetCode: 'BDG-2025-003', name: 'IT Infrastructure', department: 'IT', amount: 200000000, spent: 120000000, remaining: 80000000, period: '2025 H1', status: 'Active' },
  { id: '4', budgetCode: 'BDG-2025-004', name: 'HR Training Program', department: 'HR', amount: 80000000, spent: 80000000, remaining: 0, period: '2025 Q1', status: 'Exhausted' },
  { id: '5', budgetCode: 'BDG-2025-005', name: 'R&D New Products', department: 'R&D', amount: 300000000, spent: 50000000, remaining: 250000000, period: '2025', status: 'Active' },
];

// ─── SALES ────────────────────────────────────────────────────

export const mockCustomers = [
  { id: '1', customerCode: 'CUST-001', companyName: 'PT Retail Maju', contact: 'Budi Santoso', email: 'budi@retailmaju.co.id', phone: '021-55501001', creditLimit: 200000000, status: 'Active' },
  { id: '2', customerCode: 'CUST-002', companyName: 'CV Toko Besar', contact: 'Sari Dewi', email: 'sari@tokobesar.com', phone: '021-55501002', creditLimit: 100000000, status: 'Active' },
  { id: '3', customerCode: 'CUST-003', companyName: 'PT Distributor Nasional', contact: 'Agus Wijaya', email: 'agus@distribnasional.co.id', phone: '021-55501003', creditLimit: 500000000, status: 'Active' },
  { id: '4', customerCode: 'CUST-004', companyName: 'Koperasi Sumber Makmur', contact: 'Nurul Hida', email: 'nurul@ksm.org', phone: '021-55501004', creditLimit: 50000000, status: 'Active' },
  { id: '5', customerCode: 'CUST-005', companyName: 'PT Agen Jaya Sentosa', contact: 'Hendra Eko', email: 'hendra@agenjaya.co.id', phone: '021-55501005', creditLimit: 150000000, status: 'Inactive' },
];

export const mockSalesQuotations = [
  { id: '1', quotationNumber: 'SQ-2025-001', customer: 'PT Retail Maju', date: '2025-01-05', validUntil: '2025-02-04', amount: 75000000, status: 'Accepted' },
  { id: '2', quotationNumber: 'SQ-2025-002', customer: 'CV Toko Besar', date: '2025-01-12', validUntil: '2025-02-11', amount: 32000000, status: 'Sent' },
  { id: '3', quotationNumber: 'SQ-2025-003', customer: 'PT Distributor Nasional', date: '2025-01-20', validUntil: '2025-02-19', amount: 120000000, status: 'Draft' },
  { id: '4', quotationNumber: 'SQ-2025-004', customer: 'Koperasi Sumber Makmur', date: '2025-01-22', validUntil: '2025-02-21', amount: 18500000, status: 'Rejected' },
  { id: '5', quotationNumber: 'SQ-2025-005', customer: 'PT Agen Jaya Sentosa', date: '2025-01-28', validUntil: '2025-02-27', amount: 55000000, status: 'Sent' },
];

export const mockSalesOrders = [
  { id: '1', orderNumber: 'SO-2025-001', customer: 'PT Retail Maju', orderDate: '2025-01-08', deliveryDate: '2025-01-22', amount: 75000000, status: 'Delivered' },
  { id: '2', orderNumber: 'SO-2025-002', customer: 'PT Distributor Nasional', orderDate: '2025-01-15', deliveryDate: '2025-01-29', amount: 95000000, status: 'Shipped' },
  { id: '3', orderNumber: 'SO-2025-003', customer: 'CV Toko Besar', orderDate: '2025-01-20', deliveryDate: '2025-02-03', amount: 28000000, status: 'Confirmed' },
  { id: '4', orderNumber: 'SO-2025-004', customer: 'Koperasi Sumber Makmur', orderDate: '2025-01-25', deliveryDate: '2025-02-08', amount: 12500000, status: 'Pending' },
  { id: '5', orderNumber: 'SO-2025-005', customer: 'PT Agen Jaya Sentosa', orderDate: '2025-01-30', deliveryDate: '2025-02-13', amount: 47000000, status: 'Confirmed' },
];

export const mockSalesInvoices = [
  { id: '1', invoiceNumber: 'SI-2025-001', customer: 'PT Retail Maju', invoiceDate: '2025-01-22', dueDate: '2025-02-21', amount: 75000000, status: 'Paid' },
  { id: '2', invoiceNumber: 'SI-2025-002', customer: 'PT Distributor Nasional', invoiceDate: '2025-01-29', dueDate: '2025-02-28', amount: 95000000, status: 'Sent' },
  { id: '3', invoiceNumber: 'SI-2025-003', customer: 'CV Toko Besar', invoiceDate: '2025-02-03', dueDate: '2025-03-04', amount: 28000000, status: 'Sent' },
  { id: '4', invoiceNumber: 'SI-2025-004', customer: 'Koperasi Sumber Makmur', invoiceDate: '2025-02-08', dueDate: '2025-03-09', amount: 12500000, status: 'Partial' },
  { id: '5', invoiceNumber: 'SI-2025-005', customer: 'PT Agen Jaya Sentosa', invoiceDate: '2025-02-13', dueDate: '2025-03-14', amount: 47000000, status: 'Overdue' },
];

// ─── PURCHASING ───────────────────────────────────────────────

export const mockVendors = [
  { id: '1', vendorCode: 'VND-001', companyName: 'PT Bahan Baku Nusantara', contact: 'Rudi Hermawan', email: 'rudi@bbnusantara.co.id', phone: '022-4401001', paymentTerms: 'Net 30', status: 'Active' },
  { id: '2', vendorCode: 'VND-002', companyName: 'CV Suplai Teknik', contact: 'Lina Kurnia', email: 'lina@suplaim.com', phone: '022-4401002', paymentTerms: 'Net 14', status: 'Active' },
  { id: '3', vendorCode: 'VND-003', companyName: 'PT Logistik Andalan', contact: 'Toni Susanto', email: 'toni@logandalan.co.id', phone: '022-4401003', paymentTerms: 'Net 45', status: 'Active' },
  { id: '4', vendorCode: 'VND-004', companyName: 'Toko Elektronik Jaya', contact: 'Mega Putri', email: 'mega@tekjaya.com', phone: '022-4401004', paymentTerms: 'COD', status: 'Active' },
  { id: '5', vendorCode: 'VND-005', companyName: 'PT Packaging Indah', contact: 'Fajar Nugroho', email: 'fajar@packindah.co.id', phone: '022-4401005', paymentTerms: 'Net 30', status: 'Inactive' },
];

export const mockPurchaseRequisitions = [
  { id: '1', requisitionNumber: 'PR-2025-001', requestedBy: 'Dewi Sari', department: 'Production', dateRequested: '2025-01-06', dateRequired: '2025-01-20', amount: 15000000, status: 'Approved' },
  { id: '2', requisitionNumber: 'PR-2025-002', requestedBy: 'Budi Santoso', department: 'Maintenance', dateRequested: '2025-01-10', dateRequired: '2025-01-24', amount: 8500000, status: 'Pending' },
  { id: '3', requisitionNumber: 'PR-2025-003', requestedBy: 'Rina Handayani', department: 'IT', dateRequested: '2025-01-15', dateRequired: '2025-01-29', amount: 25000000, status: 'Approved' },
  { id: '4', requisitionNumber: 'PR-2025-004', requestedBy: 'Agus Wijaya', department: 'Operations', dateRequested: '2025-01-18', dateRequired: '2025-02-01', amount: 3200000, status: 'Rejected' },
  { id: '5', requisitionNumber: 'PR-2025-005', requestedBy: 'Hendra Eko', department: 'Finance', dateRequested: '2025-01-22', dateRequired: '2025-02-05', amount: 5600000, status: 'Draft' },
];

export const mockPurchaseOrders = [
  { id: '1', poNumber: 'PO-2025-001', vendor: 'PT Bahan Baku Nusantara', orderDate: '2025-01-08', expectedDelivery: '2025-01-22', amount: 28500000, status: 'Received' },
  { id: '2', poNumber: 'PO-2025-002', vendor: 'CV Suplai Teknik', orderDate: '2025-01-12', expectedDelivery: '2025-01-26', amount: 12000000, status: 'Acknowledged' },
  { id: '3', poNumber: 'PO-2025-003', vendor: 'PT Logistik Andalan', orderDate: '2025-01-18', expectedDelivery: '2025-02-01', amount: 5750000, status: 'Sent' },
  { id: '4', poNumber: 'PO-2025-004', vendor: 'Toko Elektronik Jaya', orderDate: '2025-01-22', expectedDelivery: '2025-02-05', amount: 18900000, status: 'Draft' },
  { id: '5', poNumber: 'PO-2025-005', vendor: 'PT Packaging Indah', orderDate: '2025-01-28', expectedDelivery: '2025-02-11', amount: 3200000, status: 'Sent' },
];

export const mockPurchaseInvoices = [
  { id: '1', invoiceNumber: 'PI-2025-001', vendor: 'PT Bahan Baku Nusantara', invoiceDate: '2025-01-22', dueDate: '2025-02-21', amount: 28500000, status: 'Paid' },
  { id: '2', invoiceNumber: 'PI-2025-002', vendor: 'CV Suplai Teknik', invoiceDate: '2025-01-26', dueDate: '2025-02-09', amount: 12000000, status: 'Paid' },
  { id: '3', invoiceNumber: 'PI-2025-003', vendor: 'PT Logistik Andalan', invoiceDate: '2025-02-01', dueDate: '2025-03-02', amount: 5750000, status: 'Unpaid' },
  { id: '4', invoiceNumber: 'PI-2025-004', vendor: 'Toko Elektronik Jaya', invoiceDate: '2025-02-05', dueDate: '2025-03-06', amount: 18900000, status: 'Partial' },
  { id: '5', invoiceNumber: 'PI-2025-005', vendor: 'PT Packaging Indah', invoiceDate: '2025-02-11', dueDate: '2025-03-12', amount: 3200000, status: 'Unpaid' },
];

// ─── INVENTORY ────────────────────────────────────────────────

export const mockWarehouses = [
  { id: '1', warehouseCode: 'WH-001', name: 'Gudang Utama Jakarta', location: 'Jakarta Timur', capacity: 10000, used: 7400, manager: 'Toni Susanto', status: 'Active' },
  { id: '2', warehouseCode: 'WH-002', name: 'Gudang Bandung', location: 'Bandung Barat', capacity: 5000, used: 2100, manager: 'Mega Putri', status: 'Active' },
  { id: '3', warehouseCode: 'WH-003', name: 'Gudang Surabaya', location: 'Surabaya Utara', capacity: 8000, used: 5500, manager: 'Fajar Nugroho', status: 'Active' },
  { id: '4', warehouseCode: 'WH-004', name: 'Gudang Transit Cikampek', location: 'Karawang', capacity: 3000, used: 800, manager: 'Rudi Hermawan', status: 'Active' },
];

export const mockProducts = [
  { id: '1', productCode: 'PRD-001', name: 'Laptop Bisnis X200', category: 'Electronics', unit: 'pcs', cost: 7500000, price: 9500000, stock: 85, status: 'Active' },
  { id: '2', productCode: 'PRD-002', name: 'Printer Laser A4', category: 'Electronics', unit: 'pcs', cost: 2200000, price: 3100000, stock: 42, status: 'Active' },
  { id: '3', productCode: 'PRD-003', name: 'Meja Kantor Minimalis', category: 'Furniture', unit: 'pcs', cost: 850000, price: 1200000, stock: 120, status: 'Active' },
  { id: '4', productCode: 'PRD-004', name: 'Kursi Ergonomis', category: 'Furniture', unit: 'pcs', cost: 600000, price: 950000, stock: 200, status: 'Active' },
  { id: '5', productCode: 'PRD-005', name: 'Bahan Baku Plastik ABS', category: 'Raw Material', unit: 'kg', cost: 15000, price: 22000, stock: 2500, status: 'Active' },
  { id: '6', productCode: 'PRD-006', name: 'Komponen PCB V3', category: 'Component', unit: 'pcs', cost: 45000, price: 75000, stock: 12, status: 'Low Stock' },
];

export const mockStockLevels = [
  { id: '1', product: 'Laptop Bisnis X200', warehouse: 'Gudang Utama Jakarta', quantity: 50, minLevel: 10, maxLevel: 100, status: 'Normal' },
  { id: '2', product: 'Laptop Bisnis X200', warehouse: 'Gudang Surabaya', quantity: 35, minLevel: 10, maxLevel: 60, status: 'Normal' },
  { id: '3', product: 'Printer Laser A4', warehouse: 'Gudang Utama Jakarta', quantity: 42, minLevel: 15, maxLevel: 80, status: 'Normal' },
  { id: '4', product: 'Komponen PCB V3', warehouse: 'Gudang Utama Jakarta', quantity: 12, minLevel: 50, maxLevel: 500, status: 'Low' },
  { id: '5', product: 'Bahan Baku Plastik ABS', warehouse: 'Gudang Transit Cikampek', quantity: 2500, minLevel: 500, maxLevel: 5000, status: 'Normal' },
  { id: '6', product: 'Meja Kantor Minimalis', warehouse: 'Gudang Bandung', quantity: 120, minLevel: 20, maxLevel: 200, status: 'Normal' },
];

export const mockStockMovements = [
  { id: '1', movementNumber: 'SM-2025-001', type: 'Inbound', product: 'Laptop Bisnis X200', fromLocation: 'Supplier', toLocation: 'Gudang Utama Jakarta', quantity: 20, date: '2025-01-10', reference: 'PO-2025-001' },
  { id: '2', movementNumber: 'SM-2025-002', type: 'Outbound', product: 'Printer Laser A4', fromLocation: 'Gudang Utama Jakarta', toLocation: 'Customer', quantity: 5, date: '2025-01-14', reference: 'SO-2025-001' },
  { id: '3', movementNumber: 'SM-2025-003', type: 'Transfer', product: 'Meja Kantor Minimalis', fromLocation: 'Gudang Utama Jakarta', toLocation: 'Gudang Bandung', quantity: 30, date: '2025-01-18', reference: 'TR-2025-001' },
  { id: '4', movementNumber: 'SM-2025-004', type: 'Inbound', product: 'Bahan Baku Plastik ABS', fromLocation: 'Supplier', toLocation: 'Gudang Transit Cikampek', quantity: 500, date: '2025-01-22', reference: 'PO-2025-002' },
  { id: '5', movementNumber: 'SM-2025-005', type: 'Outbound', product: 'Komponen PCB V3', fromLocation: 'Gudang Utama Jakarta', toLocation: 'Production', quantity: 100, date: '2025-01-25', reference: 'WO-2025-001' },
];

// ─── MANUFACTURING ────────────────────────────────────────────

export const mockBillOfMaterials = [
  { id: '1', bomNumber: 'BOM-001', product: 'Laptop Bisnis X200', version: 2, components: 24, effectiveDate: '2024-01-01', status: 'Active' },
  { id: '2', bomNumber: 'BOM-002', product: 'Printer Laser A4', version: 1, components: 18, effectiveDate: '2024-03-15', status: 'Active' },
  { id: '3', bomNumber: 'BOM-003', product: 'Komponen PCB V3', version: 3, components: 12, effectiveDate: '2024-06-01', status: 'Active' },
  { id: '4', bomNumber: 'BOM-004', product: 'Produk Lama Z100', version: 1, components: 8, effectiveDate: '2023-01-01', status: 'Obsolete' },
];

export const mockProductionOrders = [
  { id: '1', productionOrderNumber: 'PO-MFG-001', product: 'Laptop Bisnis X200', plannedQty: 50, actualQty: 50, plannedStart: '2025-01-06', plannedEnd: '2025-01-18', status: 'Completed' },
  { id: '2', productionOrderNumber: 'PO-MFG-002', product: 'Printer Laser A4', plannedQty: 30, actualQty: 20, plannedStart: '2025-01-13', plannedEnd: '2025-01-24', status: 'In Progress' },
  { id: '3', productionOrderNumber: 'PO-MFG-003', product: 'Komponen PCB V3', plannedQty: 200, actualQty: 0, plannedStart: '2025-01-20', plannedEnd: '2025-02-01', status: 'Planned' },
  { id: '4', productionOrderNumber: 'PO-MFG-004', product: 'Laptop Bisnis X200', plannedQty: 80, actualQty: 0, plannedStart: '2025-02-03', plannedEnd: '2025-02-20', status: 'Planned' },
];

export const mockWorkOrders = [
  { id: '1', workOrderNumber: 'WO-2025-001', productionOrder: 'PO-MFG-001', operation: 'PCB Assembly', workCenter: 'Line A', plannedStart: '2025-01-06', plannedEnd: '2025-01-10', status: 'Completed' },
  { id: '2', workOrderNumber: 'WO-2025-002', productionOrder: 'PO-MFG-001', operation: 'Final Assembly', workCenter: 'Line B', plannedStart: '2025-01-13', plannedEnd: '2025-01-18', status: 'Completed' },
  { id: '3', workOrderNumber: 'WO-2025-003', productionOrder: 'PO-MFG-002', operation: 'Component Install', workCenter: 'Line A', plannedStart: '2025-01-13', plannedEnd: '2025-01-18', status: 'In Progress' },
  { id: '4', workOrderNumber: 'WO-2025-004', productionOrder: 'PO-MFG-003', operation: 'Soldering', workCenter: 'Line C', plannedStart: '2025-01-20', plannedEnd: '2025-01-26', status: 'Pending' },
  { id: '5', workOrderNumber: 'WO-2025-005', productionOrder: 'PO-MFG-003', operation: 'Quality Checking', workCenter: 'QC Station', plannedStart: '2025-01-27', plannedEnd: '2025-02-01', status: 'Pending' },
];

export const mockQualityControl = [
  { id: '1', inspectionNumber: 'QC-2025-001', product: 'Laptop Bisnis X200', batch: 'BATCH-250106', inspectionDate: '2025-01-18', quantityInspected: 50, passed: 48, failed: 2, result: 'Passed', inspector: 'Dewi Sari' },
  { id: '2', inspectionNumber: 'QC-2025-002', product: 'Printer Laser A4', batch: 'BATCH-250113', inspectionDate: '2025-01-22', quantityInspected: 20, passed: 20, failed: 0, result: 'Passed', inspector: 'Budi Santoso' },
  { id: '3', inspectionNumber: 'QC-2025-003', product: 'Komponen PCB V3', batch: 'BATCH-250120', inspectionDate: '2025-01-29', quantityInspected: 50, passed: 45, failed: 5, result: 'Conditional', inspector: 'Dewi Sari' },
];

// ─── PROJECTS ─────────────────────────────────────────────────

export const mockProjects = [
  { id: '1', projectCode: 'PRJ-2025-001', projectName: 'ERP System Implementation', manager: 'Ahmad Fauzi', startDate: '2025-01-01', endDate: '2025-06-30', budget: 500000000, spent: 120000000, status: 'Active' },
  { id: '2', projectCode: 'PRJ-2025-002', projectName: 'Warehouse Automation', manager: 'Toni Susanto', startDate: '2025-02-01', endDate: '2025-08-31', budget: 750000000, spent: 45000000, status: 'Active' },
  { id: '3', projectCode: 'PRJ-2025-003', projectName: 'New Product Line Launch', manager: 'Rina Handayani', startDate: '2025-01-15', endDate: '2025-04-30', budget: 200000000, spent: 80000000, status: 'Active' },
  { id: '4', projectCode: 'PRJ-2024-005', projectName: 'Office Renovation', manager: 'Hendra Eko', startDate: '2024-10-01', endDate: '2024-12-31', budget: 100000000, spent: 100000000, status: 'Completed' },
  { id: '5', projectCode: 'PRJ-2025-004', projectName: 'Mobile App Development', manager: 'Agus Wijaya', startDate: '2025-03-01', endDate: '2025-09-30', budget: 350000000, spent: 0, status: 'Planning' },
];

export const mockTasks = [
  { id: '1', taskName: 'Requirements Gathering', project: 'ERP System Implementation', assignedTo: 'Ahmad Fauzi', priority: 'High', status: 'Done', dueDate: '2025-01-15', estimatedHours: 40, loggedHours: 38 },
  { id: '2', taskName: 'System Architecture Design', project: 'ERP System Implementation', assignedTo: 'Agus Wijaya', priority: 'High', status: 'Done', dueDate: '2025-01-25', estimatedHours: 60, loggedHours: 55 },
  { id: '3', taskName: 'Database Schema Design', project: 'ERP System Implementation', assignedTo: 'Budi Santoso', priority: 'High', status: 'In Progress', dueDate: '2025-02-10', estimatedHours: 80, loggedHours: 45 },
  { id: '4', taskName: 'Sensor Integration Research', project: 'Warehouse Automation', assignedTo: 'Toni Susanto', priority: 'Medium', status: 'In Progress', dueDate: '2025-02-28', estimatedHours: 50, loggedHours: 20 },
  { id: '5', taskName: 'Product Prototype Testing', project: 'New Product Line Launch', assignedTo: 'Rina Handayani', priority: 'Critical', status: 'In Progress', dueDate: '2025-02-20', estimatedHours: 30, loggedHours: 18 },
  { id: '6', taskName: 'Market Research', project: 'New Product Line Launch', assignedTo: 'Hendra Eko', priority: 'Medium', status: 'To Do', dueDate: '2025-03-01', estimatedHours: 20, loggedHours: 0 },
];

export const mockMilestones = [
  { id: '1', milestoneName: 'Phase 1 Kickoff', project: 'ERP System Implementation', targetDate: '2025-01-31', completedDate: '2025-01-30', status: 'Achieved' },
  { id: '2', milestoneName: 'Backend API Complete', project: 'ERP System Implementation', targetDate: '2025-03-31', completedDate: null, status: 'Pending' },
  { id: '3', milestoneName: 'UAT Sign-off', project: 'ERP System Implementation', targetDate: '2025-05-31', completedDate: null, status: 'Pending' },
  { id: '4', milestoneName: 'Automation Design Approved', project: 'Warehouse Automation', targetDate: '2025-03-31', completedDate: null, status: 'Pending' },
  { id: '5', milestoneName: 'Prototype Ready', project: 'New Product Line Launch', targetDate: '2025-02-28', completedDate: null, status: 'Delayed' },
];

export const mockTimeEntries = [
  { id: '1', employee: 'Ahmad Fauzi', project: 'ERP System Implementation', task: 'Requirements Gathering', date: '2025-01-08', hours: 8, description: 'Stakeholder interviews and documentation' },
  { id: '2', employee: 'Agus Wijaya', project: 'ERP System Implementation', task: 'System Architecture Design', date: '2025-01-15', hours: 7, description: 'Drafted microservices architecture diagram' },
  { id: '3', employee: 'Budi Santoso', project: 'ERP System Implementation', task: 'Database Schema Design', date: '2025-01-22', hours: 8, description: 'ERD design for finance module' },
  { id: '4', employee: 'Toni Susanto', project: 'Warehouse Automation', task: 'Sensor Integration Research', date: '2025-02-01', hours: 6, description: 'Evaluated RFID vs barcode solutions' },
  { id: '5', employee: 'Rina Handayani', project: 'New Product Line Launch', task: 'Product Prototype Testing', date: '2025-02-05', hours: 5, description: 'First iteration prototype stress test' },
];

// ─── HR ───────────────────────────────────────────────────────

export const mockDepartments = [
  { id: '1', code: 'DEPT-001', name: 'Finance & Accounting', manager: 'Ahmad Fauzi', parentDept: null, employeeCount: 8, status: 'Active' },
  { id: '2', code: 'DEPT-002', name: 'Human Resources', manager: 'Rina Handayani', parentDept: null, employeeCount: 6, status: 'Active' },
  { id: '3', code: 'DEPT-003', name: 'Operations', manager: 'Toni Susanto', parentDept: null, employeeCount: 25, status: 'Active' },
  { id: '4', code: 'DEPT-004', name: 'Sales & Marketing', manager: 'Hendra Eko', parentDept: null, employeeCount: 12, status: 'Active' },
  { id: '5', code: 'DEPT-005', name: 'IT & Technology', manager: 'Agus Wijaya', parentDept: null, employeeCount: 10, status: 'Active' },
  { id: '6', code: 'DEPT-006', name: 'Production', manager: 'Dewi Sari', parentDept: 'DEPT-003', employeeCount: 40, status: 'Active' },
];

export const mockEmployees = [
  { id: '1', employeeId: 'EMP-001', fullName: 'Ahmad Fauzi', department: 'Finance & Accounting', position: 'Finance Manager', email: 'ahmad.fauzi@erp.co.id', phone: '081200001111', hireDate: '2020-03-01', status: 'Active' },
  { id: '2', employeeId: 'EMP-002', fullName: 'Rina Handayani', department: 'Human Resources', position: 'HR Manager', email: 'rina.handayani@erp.co.id', phone: '081200002222', hireDate: '2019-07-15', status: 'Active' },
  { id: '3', employeeId: 'EMP-003', fullName: 'Toni Susanto', department: 'Operations', position: 'Operations Manager', email: 'toni.susanto@erp.co.id', phone: '081200003333', hireDate: '2018-11-01', status: 'Active' },
  { id: '4', employeeId: 'EMP-004', fullName: 'Dewi Sari', department: 'Production', position: 'QC Supervisor', email: 'dewi.sari@erp.co.id', phone: '081200004444', hireDate: '2021-02-10', status: 'Active' },
  { id: '5', employeeId: 'EMP-005', fullName: 'Budi Santoso', department: 'IT & Technology', position: 'Backend Developer', email: 'budi.santoso@erp.co.id', phone: '081200005555', hireDate: '2022-06-01', status: 'Active' },
  { id: '6', employeeId: 'EMP-006', fullName: 'Hendra Eko', department: 'Sales & Marketing', position: 'Sales Executive', email: 'hendra.eko@erp.co.id', phone: '081200006666', hireDate: '2022-09-01', status: 'Active' },
  { id: '7', employeeId: 'EMP-007', fullName: 'Nurul Hida', department: 'Finance & Accounting', position: 'Accountant', email: 'nurul.hida@erp.co.id', phone: '081200007777', hireDate: '2023-01-16', status: 'Active' },
  { id: '8', employeeId: 'EMP-008', fullName: 'Fajar Nugroho', department: 'Operations', position: 'Warehouse Staff', email: 'fajar.nugroho@erp.co.id', phone: '081200008888', hireDate: '2023-04-01', status: 'Active' },
];

export const mockPayroll = [
  { id: '1', employee: 'Ahmad Fauzi', period: 'January 2025', basicSalary: 18000000, allowances: 3000000, deductions: 2700000, netSalary: 18300000, status: 'Paid' },
  { id: '2', employee: 'Rina Handayani', period: 'January 2025', basicSalary: 16000000, allowances: 2500000, deductions: 2400000, netSalary: 16100000, status: 'Paid' },
  { id: '3', employee: 'Toni Susanto', period: 'January 2025', basicSalary: 17000000, allowances: 2800000, deductions: 2550000, netSalary: 17250000, status: 'Paid' },
  { id: '4', employee: 'Dewi Sari', period: 'January 2025', basicSalary: 10000000, allowances: 1500000, deductions: 1500000, netSalary: 10000000, status: 'Paid' },
  { id: '5', employee: 'Budi Santoso', period: 'January 2025', basicSalary: 14000000, allowances: 2000000, deductions: 2100000, netSalary: 13900000, status: 'Paid' },
];

export const mockAttendance = [
  { id: '1', employee: 'Ahmad Fauzi', date: '2025-01-20', checkIn: '08:02', checkOut: '17:05', workHours: 9.05, status: 'Present' },
  { id: '2', employee: 'Rina Handayani', date: '2025-01-20', checkIn: '08:15', checkOut: '17:00', workHours: 8.75, status: 'Present' },
  { id: '3', employee: 'Toni Susanto', date: '2025-01-20', checkIn: '-', checkOut: '-', workHours: 0, status: 'Absent' },
  { id: '4', employee: 'Dewi Sari', date: '2025-01-20', checkIn: '08:00', checkOut: '12:00', workHours: 4, status: 'Half Day' },
  { id: '5', employee: 'Budi Santoso', date: '2025-01-20', checkIn: '09:05', checkOut: '18:00', workHours: 8.92, status: 'Late' },
  { id: '6', employee: 'Hendra Eko', date: '2025-01-20', checkIn: '08:00', checkOut: '17:00', workHours: 9, status: 'Present' },
];

export const mockLeave = [
  { id: '1', employee: 'Toni Susanto', leaveType: 'Annual Leave', fromDate: '2025-01-20', toDate: '2025-01-22', days: 3, reason: 'Family vacation', status: 'Approved' },
  { id: '2', employee: 'Nurul Hida', leaveType: 'Sick Leave', fromDate: '2025-01-18', toDate: '2025-01-19', days: 2, reason: 'Fever and rest', status: 'Approved' },
  { id: '3', employee: 'Fajar Nugroho', leaveType: 'Annual Leave', fromDate: '2025-02-10', toDate: '2025-02-12', days: 3, reason: 'Personal matter', status: 'Pending' },
  { id: '4', employee: 'Dewi Sari', leaveType: 'Permission', fromDate: '2025-01-20', toDate: '2025-01-20', days: 0.5, reason: 'Medical checkup', status: 'Approved' },
  { id: '5', employee: 'Hendra Eko', leaveType: 'Annual Leave', fromDate: '2025-02-17', toDate: '2025-02-21', days: 5, reason: 'Holiday trip', status: 'Rejected' },
];

export const mockRecruitment = [
  { id: '1', requisitionId: 'REC-2025-001', position: 'Senior Frontend Developer', department: 'IT & Technology', openDate: '2025-01-05', applications: 28, shortlisted: 6, status: 'In Progress' },
  { id: '2', requisitionId: 'REC-2025-002', position: 'Finance Analyst', department: 'Finance & Accounting', openDate: '2025-01-10', applications: 45, shortlisted: 8, status: 'In Progress' },
  { id: '3', requisitionId: 'REC-2025-003', position: 'Warehouse Operator', department: 'Operations', openDate: '2025-01-15', applications: 60, shortlisted: 10, status: 'In Progress' },
  { id: '4', requisitionId: 'REC-2025-004', position: 'Marketing Executive', department: 'Sales & Marketing', openDate: '2024-12-01', applications: 38, shortlisted: 5, status: 'Closed' },
  { id: '5', requisitionId: 'REC-2025-005', position: 'Production Supervisor', department: 'Production', openDate: '2025-01-20', applications: 12, shortlisted: 3, status: 'Open' },
];

// ─── CRM ──────────────────────────────────────────────────────

export const mockLeads = [
  { id: '1', leadName: 'PT Konstruksi Nusa', contactPerson: 'Wendi Pratama', email: 'wendi@konstrnusa.co.id', phone: '021-7701001', source: 'Website', status: 'Qualified', createdDate: '2025-01-08' },
  { id: '2', leadName: 'CV Furniture Prima', contactPerson: 'Susi Kurnia', email: 'susi@furnprime.com', phone: '021-7701002', source: 'Referral', status: 'New', createdDate: '2025-01-12' },
  { id: '3', leadName: 'PT Otomotif Jaya', contactPerson: 'Dino Haryono', email: 'dino@otojaya.co.id', phone: '021-7701003', source: 'Exhibition', status: 'Contacted', createdDate: '2025-01-15' },
  { id: '4', leadName: 'Klinik Medika Sejahtera', contactPerson: 'dr. Maya Susilo', email: 'maya@klinikms.com', phone: '021-7701004', source: 'Cold Call', status: 'Unqualified', createdDate: '2025-01-18' },
  { id: '5', leadName: 'PT Hotel Bintang Lima', contactPerson: 'Rico Santoso', email: 'rico@hotelbintang.co.id', phone: '021-7701005', source: 'Social Media', status: 'Qualified', createdDate: '2025-01-22' },
];

export const mockOpportunities = [
  { id: '1', opportunityName: 'Annual Laptop Supply', customer: 'PT Konstruksi Nusa', value: 380000000, stage: 'Proposal', probability: 60, expectedClose: '2025-03-31', owner: 'Hendra Eko' },
  { id: '2', opportunityName: 'Office Furniture Bulk Order', customer: 'CV Furniture Prima', value: 120000000, stage: 'Negotiation', probability: 75, expectedClose: '2025-02-28', owner: 'Hendra Eko' },
  { id: '3', opportunityName: 'Maintenance Equipment', customer: 'PT Otomotif Jaya', value: 55000000, stage: 'Qualification', probability: 40, expectedClose: '2025-04-30', owner: 'Nurul Hida' },
  { id: '4', opportunityName: 'Medical Equipment Upgrade', customer: 'Klinik Medika Sejahtera', value: 90000000, stage: 'Closed Won', probability: 100, expectedClose: '2025-01-31', owner: 'Hendra Eko' },
  { id: '5', opportunityName: 'Hotel Supplies 2025', customer: 'PT Hotel Bintang Lima', value: 200000000, stage: 'Prospecting', probability: 25, expectedClose: '2025-05-31', owner: 'Nurul Hida' },
];

export const mockActivities = [
  { id: '1', type: 'Call', subject: 'Follow up product demo', relatedTo: 'PT Konstruksi Nusa', assignedTo: 'Hendra Eko', date: '2025-01-20', status: 'Completed' },
  { id: '2', type: 'Meeting', subject: 'Price negotiation meeting', relatedTo: 'CV Furniture Prima', assignedTo: 'Hendra Eko', date: '2025-01-22', status: 'Completed' },
  { id: '3', type: 'Email', subject: 'Send quotation proposal', relatedTo: 'PT Hotel Bintang Lima', assignedTo: 'Nurul Hida', date: '2025-01-25', status: 'Completed' },
  { id: '4', type: 'Call', subject: 'Initial discovery call', relatedTo: 'PT Otomotif Jaya', assignedTo: 'Nurul Hida', date: '2025-02-03', status: 'Planned' },
  { id: '5', type: 'Demo', subject: 'Product demonstration', relatedTo: 'PT Konstruksi Nusa', assignedTo: 'Hendra Eko', date: '2025-02-05', status: 'Planned' },
];

export const mockCampaigns = [
  { id: '1', campaignName: 'Promo Awal Tahun 2025', type: 'Email Marketing', status: 'Active', startDate: '2025-01-01', endDate: '2025-01-31', budget: 15000000, spent: 9500000, leadsGenerated: 42 },
  { id: '2', campaignName: 'Pameran Industri Jakarta', type: 'Event', status: 'Completed', startDate: '2025-01-15', endDate: '2025-01-17', budget: 50000000, spent: 48000000, leadsGenerated: 85 },
  { id: '3', campaignName: 'Social Media Campaign Q1', type: 'Social Media', status: 'Active', startDate: '2025-01-01', endDate: '2025-03-31', budget: 20000000, spent: 7000000, leadsGenerated: 63 },
  { id: '4', campaignName: 'Webinar Solusi ERP', type: 'Webinar', status: 'Planned', startDate: '2025-02-15', endDate: '2025-02-15', budget: 5000000, spent: 0, leadsGenerated: 0 },
];

// ─── ASSETS ───────────────────────────────────────────────────

export const mockAssets = [
  { id: '1', assetCode: 'AST-001', assetName: 'Server Dell PowerEdge R740', category: 'IT Equipment', location: 'Server Room Lt.3', purchaseDate: '2023-03-15', purchaseValue: 120000000, currentValue: 96000000, status: 'Active' },
  { id: '2', assetCode: 'AST-002', assetName: 'Forklift Toyota 2.5T', category: 'Heavy Equipment', location: 'Gudang Utama Jakarta', purchaseDate: '2022-07-01', purchaseValue: 350000000, currentValue: 245000000, status: 'Active' },
  { id: '3', assetCode: 'AST-003', assetName: 'AC Daikin 2PK Inverter', category: 'Office Equipment', location: 'Ruang Rapat Lt.2', purchaseDate: '2023-09-10', purchaseValue: 8500000, currentValue: 7225000, status: 'Active' },
  { id: '4', assetCode: 'AST-004', assetName: 'Mobil Operasional Toyota Innova', category: 'Vehicle', location: 'Pool Kendaraan', purchaseDate: '2021-05-20', purchaseValue: 350000000, currentValue: 210000000, status: 'Active' },
  { id: '5', assetCode: 'AST-005', assetName: 'Mesin Produksi CNC Router', category: 'Production Machine', location: 'Lantai Produksi', purchaseDate: '2020-11-15', purchaseValue: 800000000, currentValue: 440000000, status: 'Maintenance' },
  { id: '6', assetCode: 'AST-006', assetName: 'Laptop Dell Latitude 5530', category: 'IT Equipment', location: 'Storeroom', purchaseDate: '2020-01-10', purchaseValue: 15000000, currentValue: 0, status: 'Disposed' },
];

export const mockMaintenance = [
  { id: '1', maintenanceNumber: 'MNT-2025-001', asset: 'Mesin Produksi CNC Router', type: 'Corrective', scheduledDate: '2025-01-25', completedDate: '2025-01-28', cost: 12000000, technician: 'Fajar Nugroho', status: 'Completed' },
  { id: '2', maintenanceNumber: 'MNT-2025-002', asset: 'Forklift Toyota 2.5T', type: 'Preventive', scheduledDate: '2025-02-10', completedDate: null, cost: 3500000, technician: 'Fajar Nugroho', status: 'Scheduled' },
  { id: '3', maintenanceNumber: 'MNT-2025-003', asset: 'Server Dell PowerEdge R740', type: 'Preventive', scheduledDate: '2025-02-15', completedDate: null, cost: 5000000, technician: 'Budi Santoso', status: 'Scheduled' },
  { id: '4', maintenanceNumber: 'MNT-2025-004', asset: 'AC Daikin 2PK Inverter', type: 'Preventive', scheduledDate: '2025-02-20', completedDate: null, cost: 500000, technician: 'External Vendor', status: 'Scheduled' },
];

export const mockAssetTransfers = [
  { id: '1', transferNumber: 'AST-TR-001', asset: 'Laptop Dell Latitude (AST-007)', fromLocation: 'IT & Technology Dept', toLocation: 'Finance & Accounting Dept', transferDate: '2025-01-10', reason: 'Department reallocation', requestedBy: 'Rina Handayani', status: 'Completed' },
  { id: '2', transferNumber: 'AST-TR-002', asset: 'Mobil Operasional Toyota Innova', fromLocation: 'Pool Kendaraan', toLocation: 'Sales & Marketing Dept', transferDate: '2025-01-15', reason: 'Sales team support', requestedBy: 'Hendra Eko', status: 'Completed' },
  { id: '3', transferNumber: 'AST-TR-003', asset: 'AC Daikin 2PK Inverter', fromLocation: 'Ruang Rapat Lt.2', toLocation: 'Ruang Direktur Lt.4', transferDate: '2025-02-01', reason: 'Office upgrade', requestedBy: 'Ahmad Fauzi', status: 'Pending' },
];

export const mockDepreciation = [
  { id: '1', asset: 'Server Dell PowerEdge R740', method: 'Straight-Line', purchaseValue: 120000000, usefulLife: 5, annualRate: '20%', annualDepreciation: 24000000, accumulated: 24000000, netBookValue: 96000000 },
  { id: '2', asset: 'Forklift Toyota 2.5T', method: 'Straight-Line', purchaseValue: 350000000, usefulLife: 5, annualRate: '20%', annualDepreciation: 70000000, accumulated: 105000000, netBookValue: 245000000 },
  { id: '3', asset: 'AC Daikin 2PK Inverter', method: 'Straight-Line', purchaseValue: 8500000, usefulLife: 8, annualRate: '12.5%', annualDepreciation: 1062500, accumulated: 1275000, netBookValue: 7225000 },
  { id: '4', asset: 'Mobil Operasional Toyota Innova', method: 'Straight-Line', purchaseValue: 350000000, usefulLife: 5, annualRate: '20%', annualDepreciation: 70000000, accumulated: 140000000, netBookValue: 210000000 },
  { id: '5', asset: 'Mesin Produksi CNC Router', method: 'Double-Declining', purchaseValue: 800000000, usefulLife: 10, annualRate: '20%', annualDepreciation: 72000000, accumulated: 360000000, netBookValue: 440000000 },
];

// ─── SYSTEM ───────────────────────────────────────────────────

export const mockUsers = [
  { id: '1', username: 'ahmad.fauzi', email: 'ahmad.fauzi@erp.co.id', fullName: 'Ahmad Fauzi', role: 'Finance Manager', department: 'Finance & Accounting', isActive: true, lastLogin: '2025-01-30 09:15' },
  { id: '2', username: 'rina.handayani', email: 'rina.handayani@erp.co.id', fullName: 'Rina Handayani', role: 'HR Manager', department: 'Human Resources', isActive: true, lastLogin: '2025-01-30 08:45' },
  { id: '3', username: 'toni.susanto', email: 'toni.susanto@erp.co.id', fullName: 'Toni Susanto', role: 'Operations Manager', department: 'Operations', isActive: true, lastLogin: '2025-01-29 14:20' },
  { id: '4', username: 'agus.wijaya', email: 'agus.wijaya@erp.co.id', fullName: 'Agus Wijaya', role: 'IT Manager', department: 'IT & Technology', isActive: true, lastLogin: '2025-01-30 10:00' },
  { id: '5', username: 'budi.santoso', email: 'budi.santoso@erp.co.id', fullName: 'Budi Santoso', role: 'Developer', department: 'IT & Technology', isActive: true, lastLogin: '2025-01-30 08:30' },
  { id: '6', username: 'hendra.eko', email: 'hendra.eko@erp.co.id', fullName: 'Hendra Eko', role: 'Sales Executive', department: 'Sales & Marketing', isActive: true, lastLogin: '2025-01-28 16:00' },
  { id: '7', username: 'old.user', email: 'old.user@erp.co.id', fullName: 'User Lama', role: 'Basic User', department: 'Operations', isActive: false, lastLogin: '2024-09-15 10:00' },
];

export const mockRoles = [
  { id: '1', name: 'Super Admin', description: 'Full system access', permissionsCount: 100, usersCount: 1, createdAt: '2024-01-01' },
  { id: '2', name: 'Finance Manager', description: 'Full access to Finance module', permissionsCount: 45, usersCount: 2, createdAt: '2024-01-01' },
  { id: '3', name: 'HR Manager', description: 'Full access to HR module', permissionsCount: 40, usersCount: 1, createdAt: '2024-01-01' },
  { id: '4', name: 'Operations Manager', description: 'Access to Operations, Inventory, Warehouse', permissionsCount: 55, usersCount: 2, createdAt: '2024-01-01' },
  { id: '5', name: 'IT Manager', description: 'Full system and IT access', permissionsCount: 90, usersCount: 1, createdAt: '2024-01-01' },
  { id: '6', name: 'Sales Executive', description: 'Access to CRM and Sales module', permissionsCount: 30, usersCount: 5, createdAt: '2024-01-01' },
  { id: '7', name: 'Developer', description: 'Read access to all modules + dev tools', permissionsCount: 60, usersCount: 3, createdAt: '2024-01-01' },
  { id: '8', name: 'Basic User', description: 'Read-only access to assigned modules', permissionsCount: 10, usersCount: 8, createdAt: '2024-01-01' },
];

export const mockAuditLogs = [
  { id: '1', user: 'ahmad.fauzi', action: 'CREATE', module: 'Finance', resource: 'JournalEntry', resourceId: 'JE-2025-006', ipAddress: '192.168.1.101', timestamp: '2025-01-30 09:15:32' },
  { id: '2', user: 'rina.handayani', action: 'UPDATE', module: 'HR', resource: 'Employee', resourceId: 'EMP-005', ipAddress: '192.168.1.102', timestamp: '2025-01-30 08:47:15' },
  { id: '3', user: 'toni.susanto', action: 'LOGIN', module: 'System', resource: 'Auth', resourceId: '-', ipAddress: '192.168.1.103', timestamp: '2025-01-29 14:20:05' },
  { id: '4', user: 'budi.santoso', action: 'UPDATE', module: 'Inventory', resource: 'StockLevel', resourceId: 'PRD-006', ipAddress: '192.168.1.105', timestamp: '2025-01-30 08:31:44' },
  { id: '5', user: 'hendra.eko', action: 'CREATE', module: 'CRM', resource: 'Opportunity', resourceId: 'OPP-005', ipAddress: '192.168.1.106', timestamp: '2025-01-29 11:10:22' },
  { id: '6', user: 'agus.wijaya', action: 'DELETE', module: 'System', resource: 'User', resourceId: 'old.user', ipAddress: '192.168.1.104', timestamp: '2025-01-28 15:05:58' },
];

export const mockSettings = [
  { id: '1', category: 'Company', key: 'company_name', value: 'PT ERP Nusantara', dataType: 'string', description: 'Company legal name' },
  { id: '2', category: 'Company', key: 'company_address', value: 'Jl. Sudirman No.1, Jakarta Pusat', dataType: 'string', description: 'Company main address' },
  { id: '3', category: 'Finance', key: 'default_currency', value: 'IDR', dataType: 'string', description: 'Default currency code' },
  { id: '4', category: 'Finance', key: 'fiscal_year_start', value: '01-01', dataType: 'string', description: 'Fiscal year start (MM-DD)' },
  { id: '5', category: 'System', key: 'session_timeout_minutes', value: '60', dataType: 'number', description: 'User session timeout in minutes' },
  { id: '6', category: 'System', key: 'max_login_attempts', value: '5', dataType: 'number', description: 'Maximum failed login attempts' },
  { id: '7', category: 'Email', key: 'smtp_host', value: 'smtp.erp.co.id', dataType: 'string', description: 'SMTP server host' },
  { id: '8', category: 'Email', key: 'email_from', value: 'noreply@erp.co.id', dataType: 'string', description: 'Default sender email' },
];
