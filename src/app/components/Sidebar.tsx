import { NavLink } from 'react-router';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Warehouse,
  Factory,
  Users,
  UserCircle,
  FolderKanban,
  FileBox,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileText,
  BookOpen,
  CreditCard,
  Receipt,
  Wallet,
  Building2,
  FileCheck,
  ClipboardList,
  Boxes,
  ArrowLeftRight,
  ListChecks,
  Cog,
  FileArchive,
  Calendar,
  CalendarClock,
  Banknote,
  UserPlus,
  TrendingUp,
  Target,
  Phone,
  Megaphone,
  CheckSquare,
  Clock,
  Milestone,
  Wrench,
  TrendingDown,
  GitBranch,
  LogIn,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SubMenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    path: '/finance',
    label: 'Finance',
    icon: <DollarSign className="w-5 h-5" />,
    subItems: [
      { path: '/finance/chart-of-accounts', label: 'Chart of Accounts', icon: <BookOpen className="w-4 h-4" /> },
      { path: '/finance/journal-entries', label: 'Journal Entries', icon: <FileText className="w-4 h-4" /> },
      { path: '/finance/accounts-payable', label: 'Accounts Payable', icon: <CreditCard className="w-4 h-4" /> },
      { path: '/finance/accounts-receivable', label: 'Accounts Receivable', icon: <Receipt className="w-4 h-4" /> },
      { path: '/finance/budgets', label: 'Budgets', icon: <Wallet className="w-4 h-4" /> },
    ],
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: <ShoppingCart className="w-5 h-5" />,
    subItems: [
      { path: '/sales/customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
      { path: '/sales/quotations', label: 'Quotations', icon: <FileCheck className="w-4 h-4" /> },
      { path: '/sales/orders', label: 'Sales Orders', icon: <ClipboardList className="w-4 h-4" /> },
      { path: '/sales/invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
    ],
  },
  {
    path: '/purchasing',
    label: 'Purchasing',
    icon: <Package className="w-5 h-5" />,
    subItems: [
      { path: '/purchasing/vendors', label: 'Vendors', icon: <Building2 className="w-4 h-4" /> },
      { path: '/purchasing/requisitions', label: 'Purchase Requisitions', icon: <FileText className="w-4 h-4" /> },
      { path: '/purchasing/orders', label: 'Purchase Orders', icon: <ClipboardList className="w-4 h-4" /> },
      { path: '/purchasing/invoices', label: 'Purchase Invoices', icon: <Receipt className="w-4 h-4" /> },
    ],
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: <Warehouse className="w-5 h-5" />,
    subItems: [
      { path: '/inventory/products', label: 'Products', icon: <Boxes className="w-4 h-4" /> },
      { path: '/inventory/warehouses', label: 'Warehouses', icon: <Warehouse className="w-4 h-4" /> },
      { path: '/inventory/stock-levels', label: 'Stock Levels', icon: <ListChecks className="w-4 h-4" /> },
      { path: '/inventory/stock-movements', label: 'Stock Movements', icon: <ArrowLeftRight className="w-4 h-4" /> },
    ],
  },
  {
    path: '/manufacturing',
    label: 'Manufacturing',
    icon: <Factory className="w-5 h-5" />,
    subItems: [
      { path: '/manufacturing/bill-of-materials', label: 'Bill of Materials', icon: <FileArchive className="w-4 h-4" /> },
      { path: '/manufacturing/work-orders', label: 'Work Orders', icon: <ClipboardList className="w-4 h-4" /> },
      { path: '/manufacturing/production-orders', label: 'Production Orders', icon: <Cog className="w-4 h-4" /> },
      { path: '/manufacturing/quality-control', label: 'Quality Control', icon: <CheckSquare className="w-4 h-4" /> },
    ],
  },
  {
    path: '/hr',
    label: 'Human Resources',
    icon: <Users className="w-5 h-5" />,
    subItems: [
      { path: '/hr/employees', label: 'Employees', icon: <UserCircle className="w-4 h-4" /> },
      { path: '/hr/departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
      { path: '/hr/attendance', label: 'Attendance', icon: <Calendar className="w-4 h-4" /> },
      { path: '/hr/clock-in', label: 'Clock In / Out', icon: <LogIn className="w-4 h-4" /> },
      { path: '/hr/leave', label: 'Leave Management', icon: <CalendarClock className="w-4 h-4" /> },
      { path: '/hr/payroll', label: 'Payroll', icon: <Banknote className="w-4 h-4" /> },
      { path: '/hr/recruitment', label: 'Recruitment', icon: <UserPlus className="w-4 h-4" /> },
    ],
  },
  {
    path: '/crm',
    label: 'CRM',
    icon: <UserCircle className="w-5 h-5" />,
    subItems: [
      { path: '/crm/leads', label: 'Leads', icon: <TrendingUp className="w-4 h-4" /> },
      { path: '/crm/opportunities', label: 'Opportunities', icon: <Target className="w-4 h-4" /> },
      { path: '/crm/activities', label: 'Activities', icon: <Phone className="w-4 h-4" /> },
      { path: '/crm/campaigns', label: 'Campaigns', icon: <Megaphone className="w-4 h-4" /> },
    ],
  },
  {
    path: '/projects',
    label: 'Project Management',
    icon: <FolderKanban className="w-5 h-5" />,
    subItems: [
      { path: '/projects/all', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
      { path: '/projects/tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
      { path: '/projects/time-tracking', label: 'Time Tracking', icon: <Clock className="w-4 h-4" /> },
      { path: '/projects/milestones', label: 'Milestones', icon: <Milestone className="w-4 h-4" /> },
    ],
  },
  {
    path: '/assets',
    label: 'Asset Management',
    icon: <FileBox className="w-5 h-5" />,
    subItems: [
      { path: '/assets/all', label: 'Assets', icon: <FileBox className="w-4 h-4" /> },
      { path: '/assets/depreciation', label: 'Depreciation', icon: <TrendingDown className="w-4 h-4" /> },
      { path: '/assets/maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
      { path: '/assets/transfers', label: 'Asset Transfers', icon: <GitBranch className="w-4 h-4" /> },
    ],
  },
  {
    path: '/system',
    label: 'System',
    icon: <Settings className="w-5 h-5" />,
    subItems: [
      { path: '/system/users', label: 'Users', icon: <Users className="w-4 h-4" /> },
      { path: '/system/roles', label: 'Roles & Permissions', icon: <FileCheck className="w-4 h-4" /> },
      { path: '/system/audit-logs', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
      { path: '/system/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path)
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ERP System</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise Resource Planning</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="p-4">
        {menuItems.map((item) => (
          <div key={item.path} className="mb-1">
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {expandedItems.includes(item.path) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
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
                          `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
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
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}