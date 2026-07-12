import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

// Finance Module
import { FinanceOverview } from './pages/finance/FinanceOverview';
import { ChartOfAccounts } from './pages/finance/ChartOfAccounts';
import { JournalEntries } from './pages/finance/JournalEntries';
import { AccountsPayable } from './pages/finance/AccountsPayable';
import { AccountsReceivable } from './pages/finance/AccountsReceivable';
import { Budgets } from './pages/finance/Budgets';

// Sales Module
import { SalesOverview } from './pages/sales/SalesOverview';
import { Customers } from './pages/sales/Customers';
import { SalesQuotations } from './pages/sales/SalesQuotations';
import { SalesOrders } from './pages/sales/SalesOrders';
import { SalesInvoices } from './pages/sales/SalesInvoices';

// Purchasing Module
import { PurchasingOverview } from './pages/purchasing/PurchasingOverview';
import { Vendors } from './pages/purchasing/Vendors';
import { PurchaseRequisitions } from './pages/purchasing/PurchaseRequisitions';
import { PurchaseOrders } from './pages/purchasing/PurchaseOrders';
import { PurchaseInvoices } from './pages/purchasing/PurchaseInvoices';

// Inventory Module
import { InventoryOverview } from './pages/inventory/InventoryOverview';
import { Products } from './pages/inventory/Products';
import { Warehouses } from './pages/inventory/Warehouses';
import { StockLevels } from './pages/inventory/StockLevels';
import { StockMovements } from './pages/inventory/StockMovements';

// Manufacturing Module
import { ManufacturingOverview } from './pages/manufacturing/ManufacturingOverview';
import { BillOfMaterials } from './pages/manufacturing/BillOfMaterials';
import { WorkOrders } from './pages/manufacturing/WorkOrders';
import { ProductionOrders } from './pages/manufacturing/ProductionOrders';
import { QualityControl } from './pages/manufacturing/QualityControl';

// HR Module
import { HROverview } from './pages/hr/HROverview';
import { ClockIn } from './pages/hr/ClockIn';
import { Employees } from './pages/hr/Employees';
import { Departments } from './pages/hr/Departments';
import { Attendance } from './pages/hr/Attendance';
import { Leave } from './pages/hr/Leave';
import { Payroll } from './pages/hr/Payroll';
import { Recruitment } from './pages/hr/Recruitment';

// CRM Module
import { CRMOverview } from './pages/crm/CRMOverview';
import { Leads } from './pages/crm/Leads';
import { Opportunities } from './pages/crm/Opportunities';
import { Activities } from './pages/crm/Activities';
import { Campaigns } from './pages/crm/Campaigns';

// Project Management Module
import { ProjectsOverview } from './pages/projects/ProjectsOverview';
import { Projects } from './pages/projects/Projects';
import { Tasks } from './pages/projects/Tasks';
import { TimeTracking } from './pages/projects/TimeTracking';
import { Milestones } from './pages/projects/Milestones';

// Asset Management Module
import { AssetsOverview } from './pages/assets/AssetsOverview';
import { Assets } from './pages/assets/Assets';
import { Depreciation } from './pages/assets/Depreciation';
import { Maintenance } from './pages/assets/Maintenance';
import { AssetTransfers } from './pages/assets/AssetTransfers';

// Core System Module
import { SystemOverview } from './pages/system/SystemOverview';
import { Users } from './pages/system/Users';
import { Roles } from './pages/system/Roles';
import { AuditLogs } from './pages/system/AuditLogs';
import { Settings } from './pages/system/Settings';

import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      
      // Finance Routes
      { path: 'finance', Component: FinanceOverview },
      { path: 'finance/chart-of-accounts', Component: ChartOfAccounts },
      { path: 'finance/journal-entries', Component: JournalEntries },
      { path: 'finance/accounts-payable', Component: AccountsPayable },
      { path: 'finance/accounts-receivable', Component: AccountsReceivable },
      { path: 'finance/budgets', Component: Budgets },
      
      // Sales Routes
      { path: 'sales', Component: SalesOverview },
      { path: 'sales/customers', Component: Customers },
      { path: 'sales/quotations', Component: SalesQuotations },
      { path: 'sales/orders', Component: SalesOrders },
      { path: 'sales/invoices', Component: SalesInvoices },
      
      // Purchasing Routes
      { path: 'purchasing', Component: PurchasingOverview },
      { path: 'purchasing/vendors', Component: Vendors },
      { path: 'purchasing/requisitions', Component: PurchaseRequisitions },
      { path: 'purchasing/orders', Component: PurchaseOrders },
      { path: 'purchasing/invoices', Component: PurchaseInvoices },
      
      // Inventory Routes
      { path: 'inventory', Component: InventoryOverview },
      { path: 'inventory/products', Component: Products },
      { path: 'inventory/warehouses', Component: Warehouses },
      { path: 'inventory/stock-levels', Component: StockLevels },
      { path: 'inventory/stock-movements', Component: StockMovements },
      
      // Manufacturing Routes
      { path: 'manufacturing', Component: ManufacturingOverview },
      { path: 'manufacturing/bill-of-materials', Component: BillOfMaterials },
      { path: 'manufacturing/work-orders', Component: WorkOrders },
      { path: 'manufacturing/production-orders', Component: ProductionOrders },
      { path: 'manufacturing/quality-control', Component: QualityControl },
      
      // HR Routes
      { path: 'hr', Component: HROverview },
      { path: 'hr/employees', Component: Employees },
      { path: 'hr/departments', Component: Departments },
      { path: 'hr/attendance', Component: Attendance },
      { path: 'hr/clock-in', Component: ClockIn },
      { path: 'hr/leave', Component: Leave },
      { path: 'hr/payroll', Component: Payroll },
      { path: 'hr/recruitment', Component: Recruitment },
      
      // CRM Routes
      { path: 'crm', Component: CRMOverview },
      { path: 'crm/leads', Component: Leads },
      { path: 'crm/opportunities', Component: Opportunities },
      { path: 'crm/activities', Component: Activities },
      { path: 'crm/campaigns', Component: Campaigns },
      
      // Project Management Routes
      { path: 'projects', Component: ProjectsOverview },
      { path: 'projects/all', Component: Projects },
      { path: 'projects/tasks', Component: Tasks },
      { path: 'projects/time-tracking', Component: TimeTracking },
      { path: 'projects/milestones', Component: Milestones },
      
      // Asset Management Routes
      { path: 'assets', Component: AssetsOverview },
      { path: 'assets/all', Component: Assets },
      { path: 'assets/depreciation', Component: Depreciation },
      { path: 'assets/maintenance', Component: Maintenance },
      { path: 'assets/transfers', Component: AssetTransfers },
      
      // Core System Routes
      { path: 'system', Component: SystemOverview },
      { path: 'system/users', Component: Users },
      { path: 'system/roles', Component: Roles },
      { path: 'system/audit-logs', Component: AuditLogs },
      { path: 'system/settings', Component: Settings },
      
      { path: '*', Component: NotFound },
    ],
  },
]);