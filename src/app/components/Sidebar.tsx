import { NavLink, useLocation } from 'react-router';
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
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
  badge?: string;
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
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent when a child is active
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems?.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'))) {
        setExpandedItems(prev => prev.includes(item.path) ? prev : [...prev, item.path]);
      }
    });
  }, [location.pathname]);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(item => item !== path) : [...prev, path]
    );
  };

  const isParentActive = (item: MenuItem) => {
    if (item.subItems) {
      return item.subItems.some(sub => location.pathname === sub.path || location.pathname.startsWith(sub.path + '/'));
    }
    return location.pathname === item.path;
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">Nexa ERP</h1>
            </div>
            <p className="text-blue-200 text-xs mt-1 font-medium">Enterprise Resource Planning</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.path}>
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    isParentActive(item)
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isParentActive(item) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isParentActive(item) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                    {expandedItems.includes(item.path) ? (
                      <ChevronDown className={`w-4 h-4 ${isParentActive(item) ? 'text-blue-500' : 'text-gray-400'}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isParentActive(item) ? 'text-blue-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                </button>

                {/* Sub-items with smooth expand */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedItems.includes(item.path) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-3 mt-1 mb-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border-l-2 border-blue-500 -ml-[10px] pl-[18px]'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <span className="w-4 h-4 flex-shrink-0">{subItem.icon}</span>
                        <span className="truncate">{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <span className={location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                <span>{item.label}</span>
                {location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>ERP v1.0 • Powered by Spring Boot</span>
        </div>
      </div>
    </div>
  );
}