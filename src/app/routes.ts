import {
  createElement,
  type ComponentType,
} from 'react';

import { createBrowserRouter } from 'react-router';


import { Layout } from './components/Layout';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';

import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Unauthorized } from './pages/Unauthorized';

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

import {
  moduleRoles,
  type AppRole,
} from '@/config/roleAccess';

function protectedElement(
  PageComponent: ComponentType,
  allowedRoles: AppRole[],
) {
  return createElement(
    RoleProtectedRoute,
    {
      allowedRoles,
    },
    createElement(PageComponent),
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '/unauthorized',
    Component: Unauthorized,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        element: protectedElement(
          Dashboard,
          moduleRoles.dashboard,
        ),
      },

      // Finance Routes
      {
        path: 'finance',
        element: protectedElement(
          FinanceOverview,
          moduleRoles.finance,
        ),
      },
      {
        path: 'finance/chart-of-accounts',
        element: protectedElement(
          ChartOfAccounts,
          moduleRoles.finance,
        ),
      },
      {
        path: 'finance/journal-entries',
        element: protectedElement(
          JournalEntries,
          moduleRoles.finance,
        ),
      },
      {
        path: 'finance/accounts-payable',
        element: protectedElement(
          AccountsPayable,
          moduleRoles.finance,
        ),
      },
      {
        path: 'finance/accounts-receivable',
        element: protectedElement(
          AccountsReceivable,
          moduleRoles.finance,
        ),
      },
      {
        path: 'finance/budgets',
        element: protectedElement(
          Budgets,
          moduleRoles.finance,
        ),
      },

      // Sales Routes
      {
        path: 'sales',
        element: protectedElement(
          SalesOverview,
          moduleRoles.sales,
        ),
      },
      {
        path: 'sales/customers',
        element: protectedElement(
          Customers,
          moduleRoles.sales,
        ),
      },
      {
        path: 'sales/quotations',
        element: protectedElement(
          SalesQuotations,
          moduleRoles.sales,
        ),
      },
      {
        path: 'sales/orders',
        element: protectedElement(
          SalesOrders,
          moduleRoles.sales,
        ),
      },
      {
        path: 'sales/invoices',
        element: protectedElement(
          SalesInvoices,
          moduleRoles.sales,
        ),
      },

      // Purchasing Routes
      {
        path: 'purchasing',
        element: protectedElement(
          PurchasingOverview,
          moduleRoles.purchasing,
        ),
      },
      {
        path: 'purchasing/vendors',
        element: protectedElement(
          Vendors,
          moduleRoles.purchasing,
        ),
      },
      {
        path: 'purchasing/requisitions',
        element: protectedElement(
          PurchaseRequisitions,
          moduleRoles.purchasing,
        ),
      },
      {
        path: 'purchasing/orders',
        element: protectedElement(
          PurchaseOrders,
          moduleRoles.purchasing,
        ),
      },
      {
        path: 'purchasing/invoices',
        element: protectedElement(
          PurchaseInvoices,
          moduleRoles.purchasing,
        ),
      },

      // Inventory Routes
      {
        path: 'inventory',
        element: protectedElement(
          InventoryOverview,
          moduleRoles.inventory,
        ),
      },
      {
        path: 'inventory/products',
        element: protectedElement(
          Products,
          moduleRoles.inventory,
        ),
      },
      {
        path: 'inventory/warehouses',
        element: protectedElement(
          Warehouses,
          moduleRoles.inventory,
        ),
      },
      {
        path: 'inventory/stock-levels',
        element: protectedElement(
          StockLevels,
          moduleRoles.inventory,
        ),
      },
      {
        path: 'inventory/stock-movements',
        element: protectedElement(
          StockMovements,
          moduleRoles.inventory,
        ),
      },

      // Manufacturing Routes
      {
        path: 'manufacturing',
        element: protectedElement(
          ManufacturingOverview,
          moduleRoles.manufacturing,
        ),
      },
      {
        path: 'manufacturing/bill-of-materials',
        element: protectedElement(
          BillOfMaterials,
          moduleRoles.manufacturing,
        ),
      },
      {
        path: 'manufacturing/work-orders',
        element: protectedElement(
          WorkOrders,
          moduleRoles.manufacturing,
        ),
      },
      {
        path: 'manufacturing/production-orders',
        element: protectedElement(
          ProductionOrders,
          moduleRoles.manufacturing,
        ),
      },
      {
        path: 'manufacturing/quality-control',
        element: protectedElement(
          QualityControl,
          moduleRoles.manufacturing,
        ),
      },

      // HR Management Routes
      {
        path: 'hr',
        element: protectedElement(
          HROverview,
          moduleRoles.hr,
        ),
      },
      {
        path: 'hr/employees',
        element: protectedElement(
          Employees,
          moduleRoles.hr,
        ),
      },
      {
        path: 'hr/departments',
        element: protectedElement(
          Departments,
          moduleRoles.hr,
        ),
      },
      {
        path: 'hr/attendance',
        element: protectedElement(
          Attendance,
          moduleRoles.hr,
        ),
      },
      {
        path: 'hr/payroll',
        element: protectedElement(
          Payroll,
          moduleRoles.hr,
        ),
      },
      {
        path: 'hr/recruitment',
        element: protectedElement(
          Recruitment,
          moduleRoles.hr,
        ),
      },

      // Employee Self-Service Routes
      {
        path: 'hr/clock-in',
        element: protectedElement(
          ClockIn,
          moduleRoles.employeeSelfService,
        ),
      },
      {
        path: 'hr/leave',
        element: protectedElement(
          Leave,
          moduleRoles.employeeSelfService,
        ),
      },

      // CRM Routes
      {
        path: 'crm',
        element: protectedElement(
          CRMOverview,
          moduleRoles.crm,
        ),
      },
      {
        path: 'crm/leads',
        element: protectedElement(
          Leads,
          moduleRoles.crm,
        ),
      },
      {
        path: 'crm/opportunities',
        element: protectedElement(
          Opportunities,
          moduleRoles.crm,
        ),
      },
      {
        path: 'crm/activities',
        element: protectedElement(
          Activities,
          moduleRoles.crm,
        ),
      },
      {
        path: 'crm/campaigns',
        element: protectedElement(
          Campaigns,
          moduleRoles.crm,
        ),
      },

      // Project Management Routes
      {
        path: 'projects',
        element: protectedElement(
          ProjectsOverview,
          moduleRoles.projects,
        ),
      },
      {
        path: 'projects/all',
        element: protectedElement(
          Projects,
          moduleRoles.projects,
        ),
      },
      {
        path: 'projects/tasks',
        element: protectedElement(
          Tasks,
          moduleRoles.projects,
        ),
      },
      {
        path: 'projects/time-tracking',
        element: protectedElement(
          TimeTracking,
          moduleRoles.projects,
        ),
      },
      {
        path: 'projects/milestones',
        element: protectedElement(
          Milestones,
          moduleRoles.projects,
        ),
      },

      // Asset Management Routes
      {
        path: 'assets',
        element: protectedElement(
          AssetsOverview,
          moduleRoles.assets,
        ),
      },
      {
        path: 'assets/all',
        element: protectedElement(
          Assets,
          moduleRoles.assets,
        ),
      },
      {
        path: 'assets/depreciation',
        element: protectedElement(
          Depreciation,
          moduleRoles.assets,
        ),
      },
      {
        path: 'assets/maintenance',
        element: protectedElement(
          Maintenance,
          moduleRoles.assets,
        ),
      },
      {
        path: 'assets/transfers',
        element: protectedElement(
          AssetTransfers,
          moduleRoles.assets,
        ),
      },

      // Core System Routes
      {
        path: 'system',
        element: protectedElement(
          SystemOverview,
          moduleRoles.systemOverview,
        ),
      },
      {
        path: 'system/users',
        element: protectedElement(
          Users,
          moduleRoles.systemUsers,
        ),
      },
      {
        path: 'system/roles',
        element: protectedElement(
          Roles,
          moduleRoles.systemRoles,
        ),
      },
      {
        path: 'system/audit-logs',
        element: protectedElement(
          AuditLogs,
          moduleRoles.systemAuditLogs,
        ),
      },
      {
        path: 'system/settings',
        element: protectedElement(
          Settings,
          moduleRoles.systemSettings,
        ),
      },

      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);