'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, isAuthenticated, logout } = useSuperAdminAuth();
  
  // Close sidebar on small screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/super-admin/dashboard' },
    { id: 'students', label: 'Students', icon: '👨‍🎓', href: '/super-admin/students' },
    { id: 'owners', label: 'Owners', icon: '📋', href: '/super-admin/owners' },
    { id: 'payments', label: 'Payments', icon: '📝', href: '/super-admin/payments' },
  ];

  const isActivePath = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getActiveNav = () => {
    const activeItem = navItems.find(item => isActivePath(item.href));
    return activeItem ? activeItem.id : 'dashboard';
  };

  const activeNav = getActiveNav();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-gray-200 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // This will trigger redirect in the hook
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: sidebarOpen ? 240 : 80 }}
        animate={{ width: sidebarOpen ? 240 : 80 }}
        className={`hidden md:flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 z-30 transition-all duration-300`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold"
              >
                EduAdmin
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-5 right-0 translate-x-1/2 w-8 h-8 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
        
        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  whileHover={{ x: 5 }}
                  className={`w-full flex items-center py-3 px-4 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <span className={`text-xl mr-3 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`font-medium ${isActive ? 'text-blue-100' : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.a>
              );
            })}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-gray-700 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3"
            >
              <div className="font-medium">{user?.name || 'Super Admin'}</div>
              <div className="text-sm text-gray-400">{user?.email || 'admin@eduflow.com'}</div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col md:hidden"
          >
            {/* Mobile sidebar header */}
            <div className="p-4 border-b border-gray-700 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📚</span>
                </div>
                <div className="text-xl font-bold">EduAdmin</div>
              </div>
            </div>
            
            {/* Mobile navigation items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {navItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`w-full flex items-center py-3 px-4 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <span className={`text-xl mr-3 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                      <span className={`font-medium ${isActive ? 'text-blue-100' : ''}`}>{item.label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
            
            {/* Mobile sidebar footer */}
            <div className="p-4 border-t border-gray-700 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
              <div className="ml-3">
                <div className="font-medium">{user?.name || 'Super Admin'}</div>
                <div className="text-sm text-gray-400">{user?.email || 'admin@eduflow.com'}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                className="mr-4 text-gray-400 hover:text-white lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold capitalize">
                {activeNav.replace('-', ' ')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-800/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium">{user?.name || 'Super Admin'}</div>
                    <div className="text-xs text-gray-400">Super Administrator</div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-4 border-b border-gray-700">
                        <div className="font-medium">{user?.name || 'Super Admin'}</div>
                        <div className="text-sm text-gray-400">{user?.email || 'admin@eduflow.com'}</div>
                      </div>
                      <div className="py-1">
                        {['Profile', 'Settings', 'Notifications'].map((item) => (
                          <button
                            key={item}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      <div className="py-1 border-t border-gray-700">
                        <button 
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700/50"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;