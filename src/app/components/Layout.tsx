import { Outlet, useNavigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { Bell, Search, User, LogOut, Menu, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import authService from '../../services/authService';

export function Layout() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userData = authService.getUser();
  const userName = userData?.username || 'Admin User';
  const userEmail = userData?.email || 'admin@erp.com';
  const userRole = userData?.roles?.[0] || 'Administrator';

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleSidebarClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={handleSidebarClose} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 lg:px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl hidden sm:block">
              <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : 'scale-100'}`}>
                <Search className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                <input
                  id="global-search"
                  type="text"
                  placeholder="Search anything..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm transition-all duration-200 outline-none ${
                    searchFocused 
                      ? 'border-blue-400 ring-2 ring-blue-100 bg-white shadow-md' 
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                  }`}
                />
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-2 ml-auto">
              {/* Notifications */}
              <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Help */}
              <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hidden sm:block">
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* User Avatar with Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-semibold text-gray-800 leading-tight">{userName}</div>
                    <div className="text-xs text-gray-500 leading-tight">{userRole}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

              {/* SIGN OUT BUTTON - Always visible in header */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}