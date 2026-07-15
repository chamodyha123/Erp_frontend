import { useMemo, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router';
import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Boxes,
  Building2,
  Calendar,
  CalendarClock,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  Cog,
  CreditCard,
  DollarSign,
  Factory,
  FileBox,
  FileCheck,
  FileText,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Megaphone,
  Milestone,
  Package,
  Phone,
  Receipt,
  Settings,
  ShoppingCart,
  Target,
  TrendingDown,
  TrendingUp,
  UserCircle,
  UserPlus,
  Users,
  Wallet,
  Warehouse,
  Wrench,
  X,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import {
  hasAllowedRole,
  moduleRoles,
  type AppRole,
} from '@/config/roleAccess';

interface SubMenuItem {
  path: string;
  label: string;
  icon: ReactNode;
  allowedRoles: AppRole[];
}

interface MenuItem {
  path: string;
  label: string;
  icon: ReactNode;
  allowedRoles: AppRole[];
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    allowedRoles: moduleRoles.dashboard,
  },
  {
    path: '/finance',
    label: 'Finance',
    icon: <DollarSign className="h-5 w-5" />,
    allowedRoles: moduleRoles.finance,
    subItems: [
      { path: '/finance/chart-of-accounts', label: 'Chart of Accounts', icon: <BookOpen className="h-4 w-4" />, allowedRoles: moduleRoles.finance },
      { path: '/finance/journal-entries', label: 'Journal Entries', icon: <FileText className="h-4 w-4" />, allowedRoles: moduleRoles.finance },
      { path: '/finance/accounts-payable', label: 'Accounts Payable', icon: <CreditCard className="h-4 w-4" />, allowedRoles: moduleRoles.finance },
      { path: '/finance/accounts-receivable', label: 'Accounts Receivable', icon: <Receipt className="h-4 w-4" />, allowedRoles: moduleRoles.finance },
      { path: '/finance/budgets', label: 'Budgets', icon: <Wallet className="h-4 w-4" />, allowedRoles: moduleRoles.finance },
    ],
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: <ShoppingCart className="h-5 w-5" />,
    allowedRoles: moduleRoles.sales,
    subItems: [
      { path: '/sales/customers', label: 'Customers', icon: <Users className="h-4 w-4" />, allowedRoles: moduleRoles.sales },
      { path: '/sales/quotations', label: 'Quotations', icon: <FileCheck className="h-4 w-4" />, allowedRoles: moduleRoles.sales },
      { path: '/sales/orders', label: 'Sales Orders', icon: <ClipboardList className="h-4 w-4" />, allowedRoles: moduleRoles.sales },
      { path: '/sales/invoices', label: 'Invoices', icon: <Receipt className="h-4 w-4" />, allowedRoles: moduleRoles.sales },
    ],
  },
  {
    path: '/purchasing',
    label: 'Purchasing',
    icon: <Package className="h-5 w-5" />,
    allowedRoles: moduleRoles.purchasing,
    subItems: [
      { path: '/purchasing/vendors', label: 'Vendors', icon: <Building2 className="h-4 w-4" />, allowedRoles: moduleRoles.purchasing },
      { path: '/purchasing/requisitions', label: 'Requisitions', icon: <ListChecks className="h-4 w-4" />, allowedRoles: moduleRoles.purchasing },
      { path: '/purchasing/orders', label: 'Purchase Orders', icon: <ClipboardList className="h-4 w-4" />, allowedRoles: moduleRoles.purchasing },
      { path: '/purchasing/invoices', label: 'Purchase Invoices', icon: <Receipt className="h-4 w-4" />, allowedRoles: moduleRoles.purchasing },
    ],
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: <Warehouse className="h-5 w-5" />,
    allowedRoles: moduleRoles.inventory,
    subItems: [
      { path: '/inventory/products', label: 'Products', icon: <Package className="h-4 w-4" />, allowedRoles: moduleRoles.inventory },
      { path: '/inventory/warehouses', label: 'Warehouses', icon: <Warehouse className="h-4 w-4" />, allowedRoles: moduleRoles.inventory },
      { path: '/inventory/stock-levels', label: 'Stock Levels', icon: <Boxes className="h-4 w-4" />, allowedRoles: moduleRoles.inventory },
      { path: '/inventory/stock-movements', label: 'Stock Movements', icon: <ArrowLeftRight className="h-4 w-4" />, allowedRoles: moduleRoles.inventory },
    ],
  },
  {
    path: '/manufacturing',
    label: 'Manufacturing',
    icon: <Factory className="h-5 w-5" />,
    allowedRoles: moduleRoles.manufacturing,
    subItems: [
      { path: '/manufacturing/bill-of-materials', label: 'Bill of Materials', icon: <FileText className="h-4 w-4" />, allowedRoles: moduleRoles.manufacturing },
      { path: '/manufacturing/work-orders', label: 'Work Orders', icon: <ClipboardList className="h-4 w-4" />, allowedRoles: moduleRoles.manufacturing },
      { path: '/manufacturing/production-orders', label: 'Production Orders', icon: <Cog className="h-4 w-4" />, allowedRoles: moduleRoles.manufacturing },
      { path: '/manufacturing/quality-control', label: 'Quality Control', icon: <CheckSquare className="h-4 w-4" />, allowedRoles: moduleRoles.manufacturing },
    ],
  },
  {
    path: '/hr',
    label: 'Human Resources',
    icon: <Users className="h-5 w-5" />,
    allowedRoles: [...moduleRoles.hr, 'EMPLOYEE'],
    subItems: [
      { path: '/hr/employees', label: 'Employees', icon: <UserCircle className="h-4 w-4" />, allowedRoles: moduleRoles.hr },
      { path: '/hr/departments', label: 'Departments', icon: <Building2 className="h-4 w-4" />, allowedRoles: moduleRoles.hr },
      { path: '/hr/attendance', label: 'Attendance', icon: <Calendar className="h-4 w-4" />, allowedRoles: moduleRoles.hr },
      { path: '/hr/clock-in', label: 'Clock In / Out', icon: <LogIn className="h-4 w-4" />, allowedRoles: moduleRoles.employeeSelfService },
      { path: '/hr/leave', label: 'Leave Management', icon: <CalendarClock className="h-4 w-4" />, allowedRoles: moduleRoles.employeeSelfService },
      { path: '/hr/payroll', label: 'Payroll', icon: <Banknote className="h-4 w-4" />, allowedRoles: moduleRoles.hr },
      { path: '/hr/recruitment', label: 'Recruitment', icon: <UserPlus className="h-4 w-4" />, allowedRoles: moduleRoles.hr },
    ],
  },
  {
    path: '/crm',
    label: 'CRM',
    icon: <UserCircle className="h-5 w-5" />,
    allowedRoles: moduleRoles.crm,
    subItems: [
      { path: '/crm/leads', label: 'Leads', icon: <TrendingUp className="h-4 w-4" />, allowedRoles: moduleRoles.crm },
      { path: '/crm/opportunities', label: 'Opportunities', icon: <Target className="h-4 w-4" />, allowedRoles: moduleRoles.crm },
      { path: '/crm/activities', label: 'Activities', icon: <Phone className="h-4 w-4" />, allowedRoles: moduleRoles.crm },
      { path: '/crm/campaigns', label: 'Campaigns', icon: <Megaphone className="h-4 w-4" />, allowedRoles: moduleRoles.crm },
    ],
  },
  {
    path: '/projects',
    label: 'Project Management',
    icon: <FolderKanban className="h-5 w-5" />,
    allowedRoles: moduleRoles.projects,
    subItems: [
      { path: '/projects/all', label: 'Projects', icon: <FolderKanban className="h-4 w-4" />, allowedRoles: moduleRoles.projects },
      { path: '/projects/tasks', label: 'Tasks', icon: <CheckSquare className="h-4 w-4" />, allowedRoles: moduleRoles.projects },
      { path: '/projects/time-tracking', label: 'Time Tracking', icon: <Clock className="h-4 w-4" />, allowedRoles: moduleRoles.projects },
      { path: '/projects/milestones', label: 'Milestones', icon: <Milestone className="h-4 w-4" />, allowedRoles: moduleRoles.projects },
    ],
  },
  {
    path: '/assets',
    label: 'Asset Management',
    icon: <FileBox className="h-5 w-5" />,
    allowedRoles: moduleRoles.assets,
    subItems: [
      { path: '/assets/all', label: 'Assets', icon: <FileBox className="h-4 w-4" />, allowedRoles: moduleRoles.assets },
      { path: '/assets/depreciation', label: 'Depreciation', icon: <TrendingDown className="h-4 w-4" />, allowedRoles: moduleRoles.assets },
      { path: '/assets/maintenance', label: 'Maintenance', icon: <Wrench className="h-4 w-4" />, allowedRoles: moduleRoles.assets },
      { path: '/assets/transfers', label: 'Asset Transfers', icon: <GitBranch className="h-4 w-4" />, allowedRoles: moduleRoles.assets },
    ],
  },
  {
    path: '/system',
    label: 'System',
    icon: <Settings className="h-5 w-5" />,
    allowedRoles: moduleRoles.systemOverview,
    subItems: [
      { path: '/system/users', label: 'Users', icon: <Users className="h-4 w-4" />, allowedRoles: moduleRoles.systemUsers },
      { path: '/system/roles', label: 'Roles & Permissions', icon: <FileCheck className="h-4 w-4" />, allowedRoles: moduleRoles.systemRoles },
      { path: '/system/audit-logs', label: 'Audit Logs', icon: <FileText className="h-4 w-4" />, allowedRoles: moduleRoles.systemAuditLogs },
      { path: '/system/settings', label: 'Settings', icon: <Settings className="h-4 w-4" />, allowedRoles: moduleRoles.systemSettings },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const visibleMenuItems = useMemo(
    () =>
      menuItems
        .filter((item) =>
          hasAllowedRole(user?.roles, item.allowedRoles),
        )
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((subItem) =>
            hasAllowedRole(user?.roles, subItem.allowedRoles),
          ),
        }))
        .filter(
          (item) =>
            !item.subItems || item.subItems.length > 0,
        ),
    [user?.roles],
  );

  const toggleExpanded = (path: string) => {
    setExpandedItems((current) =>
      current.includes(path)
        ? current.filter((item) => item !== path)
        : [...current, path],
    );
  };

  return (
    <div className="h-screen w-64 overflow-y-auto border-r border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            NexaERP
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enterprise Resource Planning
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="p-4">
        {visibleMenuItems.map((item) => (
          <div key={item.path} className="mb-1">
            {item.subItems ? (
              <>
                <button
                  type="button"
                  onClick={() => toggleExpanded(item.path)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </div>

                  {expandedItems.includes(item.path) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedItems.includes(item.path) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-50 font-medium text-blue-600'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`
                        }
                      >
                        {subItem.icon}
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-blue-50 font-medium text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
