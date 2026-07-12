import { useState } from 'react';
import { useNavigate } from 'react-router';
import authService from '../../services/authService';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Factory, 
  UserCircle,
  FolderKanban,
  Boxes,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Grid3x3,
  CalendarCheck
} from 'lucide-react';

interface Module {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  description: string;
}

export function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'module' | 'login'>('module');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modules: Module[] = [
    { 
      id: 'finance', 
      name: 'Financial Management', 
      icon: <DollarSign className="w-full h-full" />, 
      color: 'bg-green-500',
      description: 'Accounting, GL, AP/AR, Cash Management'
    },
    { 
      id: 'procurement', 
      name: 'Procurement', 
      icon: <ShoppingCart className="w-full h-full" />, 
      color: 'bg-purple-500',
      description: 'Purchase Orders, Vendor Management'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Management', 
      icon: <Package className="w-full h-full" />, 
      color: 'bg-orange-500',
      description: 'Stock Control, Warehousing, Tracking'
    },
    { 
      id: 'sales', 
      name: 'Sales & Distribution', 
      icon: <TrendingUp className="w-full h-full" />, 
      color: 'bg-red-500',
      description: 'Orders, Invoicing, Delivery Management'
    },
    { 
      id: 'manufacturing', 
      name: 'Manufacturing / Production (MRP)', 
      icon: <Factory className="w-full h-full" />, 
      color: 'bg-blue-600',
      description: 'Work Orders, BOM, Production Planning'
    },
    { 
      id: 'hr', 
      name: 'Human Resource', 
      icon: <Users className="w-full h-full" />, 
      color: 'bg-teal-500',
      description: 'Payroll, Attendance, Recruitment'
    },
    { 
      id: 'crm', 
      name: 'Customer Relationship Management', 
      icon: <UserCircle className="w-full h-full" />, 
      color: 'bg-pink-500',
      description: 'Leads, Opportunities, Activities'
    },
    { 
      id: 'projects', 
      name: 'Project Management', 
      icon: <FolderKanban className="w-full h-full" />, 
      color: 'bg-indigo-500',
      description: 'Tasks, Timesheets, Budgeting'
    },
    { 
      id: 'assets', 
      name: 'Asset Management', 
      icon: <Boxes className="w-full h-full" />, 
      color: 'bg-cyan-500',
      description: 'Fixed Assets, Maintenance, Depreciation'
    },
    { 
      id: 'attendance', 
      name: 'Attendance', 
      icon: <CalendarCheck className="w-full h-full" />, 
      color: 'bg-emerald-500',
      description: 'Clock In / Clock Out Staff'
    },
  ];

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setStep('login');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) return;
    setIsLoading(true);
    setError(null);
    try {
      await authService.login({ username: credentials.username, password: credentials.password });
      localStorage.setItem('selectedModule', selectedModule?.id || 'all');
      navigate(selectedModule?.id === 'attendance' ? '/hr/clock-in' : '/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllServices = () => {
    setSelectedModule({
      id: 'all',
      name: 'All Services',
      icon: <Grid3x3 className="w-full h-full" />,
      color: 'bg-slate-700',
      description: 'Access all ERP modules'
    });
    setStep('login');
  };

  const handleBack = () => {
    setStep('module');
    setSelectedModule(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            ERP System
          </h1>
          <p className="text-lg md:text-xl text-blue-200">
            Enterprise Resource Planning Platform
          </p>
          <p className="text-sm md:text-base text-blue-300 mt-2">
            {step === 'module' ? 'Select Your Module to Begin' : `Logging into ${selectedModule?.name}`}
          </p>
        </div>

        {step === 'module' ? (
          /* Module Selection Screen */
          <div className="w-full max-w-6xl">
            {/* Desktop Circular Orbit */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full max-w-[700px] aspect-square flex items-center justify-center p-8">
                {/* Outer Orbit Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-blue-400/40 animate-[spin_60s_linear_infinite]"></div>
                </div>

                {/* Inner Orbit Ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[90%] h-[90%] rounded-full border border-blue-400/20"></div>
                </div>

                {/* Module Icons in Orbit */}
                {modules.map((module, index) => {
                  const totalModules = modules.length;
                  const angle = (index * 360) / totalModules - 90; // Start from top
                  const angleRad = (angle * Math.PI) / 180;
                  const orbitRadius = 45; // percentage from center
                  
                  const x = 50 + orbitRadius * Math.cos(angleRad);
                  const y = 50 + orbitRadius * Math.sin(angleRad);
                  const isHovered = hoveredModule === module.id;
                  
                  return (
                    <button
                      key={module.id}
                      onClick={() => handleModuleSelect(module)}
                      onMouseEnter={() => setHoveredModule(module.id)}
                      onMouseLeave={() => setHoveredModule(null)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                      style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                      }}
                    >
                      <div className={`
                        relative w-20 h-20 rounded-full ${module.color} 
                        border-4 border-white flex items-center justify-center text-white p-4 
                        shadow-xl transition-all duration-300 cursor-pointer
                        ${isHovered ? 'scale-150 shadow-2xl ring-4 ring-white/60 z-50' : 'hover:scale-110 hover:shadow-2xl'}
                      `}>
                        <div className="relative z-10">
                          {module.icon}
                        </div>
                        
                        {/* Pulse effect on hover */}
                        {isHovered && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                          </>
                        )}
                      </div>
                      
                      {/* Module Name Tooltip */}
                      <div className={`
                        absolute top-full mt-4 left-1/2 transform -translate-x-1/2 
                        transition-all duration-300 whitespace-nowrap z-50
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                      `}>
                        <div className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-2xl text-sm font-semibold">
                          {module.name}
                          <div className="text-xs text-gray-600 font-normal mt-1 max-w-xs">
                            {module.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Center "All Services" Button */}
                <button
                  onClick={handleAllServices}
                  onMouseEnter={() => setHoveredModule('all')}
                  onMouseLeave={() => setHoveredModule(null)}
                  className="relative z-40"
                >
                  <div className={`
                    w-40 h-40 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
                    border-4 border-white flex flex-col items-center justify-center 
                    text-white shadow-2xl transition-all duration-300 cursor-pointer
                    ${hoveredModule === 'all' ? 'scale-110 ring-4 ring-white/60 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'hover:scale-105'}
                  `}>
                    <Grid3x3 className="w-12 h-12 mb-2" />
                    <p className="font-bold text-base">ALL</p>
                    <p className="font-bold text-base">SERVICES</p>
                    
                    {hoveredModule === 'all' && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
                      </>
                    )}
                  </div>
                </button>

                {/* Connection Lines from center to modules */}
                {modules.map((module, index) => {
                  const totalModules = modules.length;
                  const angle = (index * 360) / totalModules - 90;
                  
                  const isHovered = hoveredModule === module.id;
                  
                  return (
                    <div
                      key={`line-${index}`}
                      className={`absolute transition-all duration-300 ${
                        isHovered ? 'bg-blue-400/60' : 'bg-blue-400/15'
                      }`}
                      style={{
                        left: 'calc(50% - 0.5px)',
                        top: 'calc(50% - 0.5px)',
                        width: '1px',
                        height: '45%',
                        transformOrigin: 'top center',
                        transform: `rotate(${angle + 90}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Mobile Grid View */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:hidden max-w-2xl mx-auto">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => handleModuleSelect(module)}
                  className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                >
                  <div className={`w-16 h-16 rounded-full ${module.color} border-4 border-white flex items-center justify-center text-white p-3 shadow-lg mb-3`}>
                    {module.icon}
                  </div>
                  <p className="text-white text-xs font-semibold text-center leading-tight">
                    {module.name}
                  </p>
                </button>
              ))}
              
              <button
                onClick={handleAllServices}
                className="flex flex-col items-center p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105 col-span-2 sm:col-span-1"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-4 border-white flex items-center justify-center text-white shadow-lg mb-3">
                  <Grid3x3 className="w-8 h-8" />
                </div>
                <p className="text-white text-xs font-semibold text-center">
                  All Services
                </p>
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center mt-8">
              <p className="text-blue-200 text-sm">
                Click on any module icon to access the login screen
              </p>
            </div>
          </div>
        ) : (
          /* Login Form Screen */
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Change Module</span>
              </button>

              {/* Selected Module Display */}
              <div className="flex items-center gap-4 mb-8 p-4 bg-white/10 rounded-xl border border-white/20">
                <div className={`w-12 h-12 rounded-full ${selectedModule?.color} border-2 border-white flex items-center justify-center text-white p-2 shadow-lg flex-shrink-0`}>
                  {selectedModule?.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedModule?.name}</h3>
                  <p className="text-blue-200 text-xs">{selectedModule?.description}</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-blue-200">Sign in to access your module</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-blue-200">
                    <input type="checkbox" className="mr-2 rounded" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-300 hover:text-blue-100 transition-colors">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoading ? 'Signing in...' : `Sign In to ${selectedModule?.name}`}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-blue-200 text-sm">
                  Default admin: <span className="text-white font-medium">admin</span> / <span className="text-white font-medium">Admin1234!</span>
                </p>
              </div>

              {/* Features List */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-white font-semibold mb-4 text-center">Module Features</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                    Real-time Data
                  </div>
                  <div className="flex items-center text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                    Analytics
                  </div>
                  <div className="flex items-center text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                    Workflows
                  </div>
                  <div className="flex items-center text-blue-200">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                    Reports
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-blue-200 text-sm">
              <p>© 2026 ERP System. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}