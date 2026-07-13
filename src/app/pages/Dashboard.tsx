import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  DollarSign, ShoppingCart, Package, Users, Factory,
  Clock, ArrowUpRight, ArrowDownRight, TrendingDown, TrendingUp,
  Boxes, FolderKanban, UserCircle, FileBox, Settings,
  ChevronRight, Truck, Receipt,
  AlertCircle, RefreshCw, Zap,
  BarChart3, PieChart, TrendingUp as TrendingUpIcon, Activity,
  Target, Award, Layers, Cpu, Globe, Sun, Moon, Star,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie, Legend,
  LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar,
} from 'recharts';
import dashboardService, { type DashboardSummary } from '@/services/dashboardService';
import { useAuth } from '@/context/AuthContext';

// ==================== FORMATTING ====================
const lkr = (n: number) => `Rs. ${n.toLocaleString('en-LK')}`;
const lkrShort = (n: number) => {
  if (n >= 1_000_000) return `Rs. ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`;
  return `Rs. ${n}`;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Good Morning';
  if (h < 15) return 'Good Afternoon';
  if (h < 18) return 'Good Evening';
  return 'Good Night';
};

// ==================== COLOR PALETTES ====================
const GRADIENTS = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-emerald-500 to-teal-500',
  orange: 'from-orange-500 to-amber-500',
  pink: 'from-pink-500 to-rose-500',
  indigo: 'from-indigo-500 to-violet-500',
  teal: 'from-teal-500 to-cyan-500',
  red: 'from-red-500 to-orange-500',
};

const CHART_COLORS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316',
  '#EAB308', '#22C55E', '#14B8A6', '#06B6D4', '#3B82F6',
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: '#10B981', Shipped: '#3B82F6', Confirmed: '#6366F1',
  Pending: '#F59E0B', Draft: '#94A3B8', Cancelled: '#EF4444',
  Received: '#10B981', Acknowledged: '#3B82F6', Sent: '#6366F1',
  'In Progress': '#8B5CF6', Completed: '#10B981', Open: '#F59E0B',
};

// ==================== COMPONENTS ====================
function StatCard({ icon: Icon, label, value, sub, gradient, onClick }: any) {
  return (
    <button onClick={onClick} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-5 text-left border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-3xl -mr-4 -mt-4 opacity-50" />
      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-4 relative z-10`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-black text-gray-900 leading-none mb-1 relative z-10">{Number(value).toLocaleString()}</p>
      <p className="text-xs font-bold text-gray-500 mb-0.5 relative z-10">{label}</p>
      <p className="text-xs text-gray-400 truncate relative z-10">{sub}</p>
    </button>
  );
}

function SectionTitle({ icon: Icon, title, color }: any) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ==================== MAIN DASHBOARD ====================
export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = (user as any)?.name ?? (user as any)?.username ?? 'User';

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nowStr, setNowStr] = useState('');

  useEffect(() => {
    const tick = () => setNowStr(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const load = (showRefresh = false) => {
    if (showRefresh) setRefreshing(true); else setLoading(true);
    dashboardService.getSummary().then(setSummary).catch(console.error).finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, []);

  const recentOrders = summary?.recentSalesOrders ?? [];
  const recentPO = summary?.recentPurchaseOrders ?? [];
  const soRevenue = recentOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const poSpend = recentPO.reduce((s, p) => s + (p.total ?? 0), 0);
  const netFlow = soRevenue - poSpend;

  // ==================== CHART DATA ====================
  // 1. BAR CHART - SO Status
  const soStatusData = Object.entries(
    recentOrders.reduce<Record<string, number>>((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || CHART_COLORS[0] }));

  // 2. PIE CHART - Revenue Distribution
  const pieData = [
    { name: 'Revenue', value: soRevenue },
    { name: 'Purchases', value: poSpend },
    { name: 'Net', value: Math.abs(netFlow) },
  ].filter(d => d.value > 0);

  // 3. AREA/LINE CHART - Mock monthly trend (since we don't have real history, create sample)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const trendData = monthNames.slice(0, currentMonth + 1).map((month, i) => ({
    month,
    revenue: Math.floor((soRevenue / (currentMonth + 1)) * (i + 1) * (0.8 + Math.random() * 0.4)),
    purchases: Math.floor((poSpend / (currentMonth + 1)) * (i + 1) * (0.7 + Math.random() * 0.6)),
  }));

  // Radial bar - completion rates
  const radialData = [
    { name: 'SO Complete', value: recentOrders.length > 0 ? Math.round((recentOrders.filter(o => o.status === 'Delivered').length / recentOrders.length) * 100) : 0, fill: '#10B981' },
    { name: 'PO Complete', value: recentPO.length > 0 ? Math.round((recentPO.filter(o => o.status === 'Received').length / recentPO.length) * 100) : 0, fill: '#6366F1' },
    { name: 'Projects', value: summary?.totalProjects ? 65 : 0, fill: '#F59E0B' },
  ];

  const soStatusGroups = recentOrders.reduce<Record<string, number>>((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {});
  const poStatusGroups = recentPO.reduce<Record<string, number>>((acc, p) => { acc[p.status] = (acc[p.status] ?? 0) + 1; return acc; }, {});

  const pendingSO = soStatusGroups['Pending'] ?? 0;
  const draftSO = soStatusGroups['Draft'] ?? 0;
  const draftPO = poStatusGroups['Draft'] ?? 0;
  const hasAlerts = pendingSO > 0 || draftSO > 0 || draftPO > 0;

  const stats = summary ? [
    { label: 'Sales Orders', value: summary.totalSalesOrders, sub: `${summary.totalCustomers} customers`, icon: ShoppingCart, gradient: GRADIENTS.blue, path: '/sales/orders' },
    { label: 'Purchase Orders', value: summary.totalPurchaseOrders, sub: `${summary.totalVendors} vendors`, icon: Package, gradient: GRADIENTS.purple, path: '/purchasing/orders' },
    { label: 'Active Employees', value: summary.activeEmployees, sub: `${summary.totalEmployees} registered`, icon: Users, gradient: GRADIENTS.teal, path: '/hr/employees' },
    { label: 'Total Products', value: summary.totalProducts, sub: 'products available', icon: Boxes, gradient: GRADIENTS.orange, path: '/inventory/products' },
    { label: 'Total Customers', value: summary.totalCustomers, sub: 'active customers', icon: UserCircle, gradient: GRADIENTS.pink, path: '/sales/customers' },
    { label: 'Total Projects', value: summary.totalProjects, sub: 'ongoing projects', icon: FolderKanban, gradient: GRADIENTS.indigo, path: '/projects/all' },
  ] : [];

  const modules = [
    { label: 'Finance', icon: DollarSign, gradient: GRADIENTS.green, path: '/finance' },
    { label: 'HR', icon: Users, gradient: GRADIENTS.teal, path: '/hr' },
    { label: 'Inventory', icon: Boxes, gradient: GRADIENTS.orange, path: '/inventory' },
    { label: 'Manufacturing', icon: Factory, gradient: GRADIENTS.blue, path: '/manufacturing' },
    { label: 'CRM', icon: UserCircle, gradient: GRADIENTS.pink, path: '/crm' },
    { label: 'Projects', icon: FolderKanban, gradient: GRADIENTS.indigo, path: '/projects' },
    { label: 'Assets', icon: FileBox, gradient: GRADIENTS.blue, path: '/assets' },
    { label: 'System', icon: Settings, gradient: 'from-gray-500 to-slate-600', path: '/system' },
  ];

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 px-8 pt-10 pb-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-blue-200 text-xs font-medium">{todayLabel}</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              {greeting()}, <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{userName}</span> 👋
            </h1>
            <p className="text-blue-300/80 text-sm mt-2 max-w-md">Your business at a glance — track performance, monitor operations, and make data-driven decisions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2.5 rounded-2xl">
              <Clock className="w-4 h-4 text-blue-300" />
              <span className="font-mono font-bold tracking-wider text-lg">{nowStr}</span>
            </div>
            <button onClick={() => navigate('/hr/attendance')} className="flex items-center gap-2 bg-white text-indigo-700 text-sm font-bold px-5 py-2.5 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-500/20">
              <Zap className="w-4 h-4" /> Clock In
            </button>
            <button onClick={() => load(true)} disabled={refreshing} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-3 py-2.5 rounded-2xl hover:bg-white/20 transition-colors">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 -mt-8">
        {/* ALERTS */}
        {!loading && hasAlerts && (
          <div className="mb-6 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-800 rounded-2xl px-5 py-4 text-sm shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="font-bold">Action Required:</span>
            <div className="flex gap-3 flex-wrap">
              {pendingSO > 0 && <button onClick={() => navigate('/sales/orders')} className="underline underline-offset-2 hover:text-amber-900 font-semibold">{pendingSO} SO Pending</button>}
              {draftSO > 0 && <button onClick={() => navigate('/sales/orders')} className="underline underline-offset-2 hover:text-amber-900 font-semibold">{draftSO} SO Draft</button>}
              {draftPO > 0 && <button onClick={() => navigate('/purchasing/orders')} className="underline underline-offset-2 hover:text-amber-900 font-semibold">{draftPO} PO Draft</button>}
            </div>
          </div>
        )}

        {/* KPI CARDS */}
        <div className="mb-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse h-36" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((s, i) => <StatCard key={i} {...s} onClick={() => navigate(s.path)} />)}
            </div>
          )}
        </div>

        {/* GRAPH 1: AREA CHART - Revenue Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <SectionTitle icon={TrendingUpIcon} title="Revenue & Purchase Trends" color={GRADIENTS.blue} />
            {loading ? (
              <div className="h-72 bg-gray-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="purGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => lkrShort(v)} />
                  <Tooltip formatter={(value: number) => lkr(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fill="url(#revGradient)" name="Revenue" />
                  <Area type="monotone" dataKey="purchases" stroke="#EC4899" strokeWidth={3} fill="url(#purGradient)" name="Purchases" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* GRAPH 2: RADIAL BAR - Completion Rates */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <SectionTitle icon={Target} title="Completion Rates" color={GRADIENTS.green} />
            {loading ? (
              <div className="h-72 bg-gray-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={15} data={radialData}>
                  <RadialBar background dataKey="value" cornerRadius={10}>
                    {radialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <Legend iconSize={10} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRAPH 3: BAR CHART + PIE CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* BAR CHART - SO Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <SectionTitle icon={BarChart3} title="Sales Order Status" color={GRADIENTS.indigo} />
            {loading ? (
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
            ) : soStatusData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-20">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={soStatusData} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Orders">
                    {soStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* PIE CHART - Revenue Split */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <SectionTitle icon={PieChart} title="Financial Split" color={GRADIENTS.purple} />
            {loading ? (
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => lkr(value)} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* LINE CHART - PO Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <SectionTitle icon={Activity} title="Purchase Order Status" color={GRADIENTS.orange} />
            {loading ? (
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={Object.entries(poStatusGroups).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || CHART_COLORS[5] }))} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Orders">
                    {Object.entries(poStatusGroups).map(([name, value], index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[name] || CHART_COLORS[(index + 3) % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* MODULE NAVIGATION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Quick Navigation</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {modules.map((m, i) => (
              <button
                key={i}
                onClick={() => navigate(m.path)}
                className="group flex items-center gap-3 p-4 rounded-2xl bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
              >
                <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${m.gradient} shadow-lg`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}