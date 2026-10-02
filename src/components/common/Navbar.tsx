import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Train, Plane, Bus, Shield, User as UserIcon, LogOut, ChevronDown, Menu, X, Code2, Phone, Clock } from 'lucide-react';
import { DjangoCodeModal } from './DjangoCodeModal';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentUser, currentAdmin, activeRole, logout, switchDemoUser, switchDemoAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' | ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const publicNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Train Booking', path: '/user/trains' },
    { label: 'Flight Booking', path: '/user/flights' },
    { label: 'Bus Booking', path: '/user/buses' },
    { label: 'PNR Status', path: '/user/bookings' },
    { label: 'Departments', path: '/departments' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
        {/* IRCTC-style Government / Official Utility Top Bar */}
        <div className="bg-[#f8fafc] border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#213d77] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#fb792b]"></span>
                TS train_sys
              </span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span className="text-slate-500 hidden sm:inline font-medium">
                National Multi-Modal Transit Portal • “One Platform. Every Journey.”
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#213d77]" />
                <span>{currentTime}</span>
              </div>

              <div className="flex items-center gap-1 text-[#213d77] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                <Phone className="w-3 h-3 text-[#fb792b]" />
                <span>Helpline: <strong>139</strong> / <strong>1800-425-9999</strong></span>
              </div>

              <button
                onClick={() => setCodeModalOpen(true)}
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Django Codebase</span>
              </button>

              {/* Quick switch */}
              <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-300">
                <button
                  onClick={() => {
                    switchDemoUser('usr_101');
                    onNavigate('/user/dashboard');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    activeRole === 'USER'
                      ? 'bg-[#213d77] text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  User Portal
                </button>
                <button
                  onClick={() => {
                    switchDemoAdmin();
                    onNavigate('/admin/dashboard');
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                    activeRole === 'ADMIN'
                      ? 'bg-[#fb792b] text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Clean Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <div className="w-11 h-11 rounded-xl bg-[#213d77] flex items-center justify-center shadow-xs text-white font-black text-xl border-2 border-[#fb792b]/40">
                TS
              </div>
              <div>
                <div className="font-black text-xl tracking-tight text-[#213d77] flex items-center gap-1.5">
                  <span>train_sys</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#fb792b] border border-orange-200 uppercase">
                    IRCTC-PRO
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                  Indian Railways & Multi-Modal E-Ticketing
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {publicNavLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition ${
                    currentPath === link.path
                      ? 'text-[#213d77] bg-blue-50 border-b-2 border-[#213d77]'
                      : 'text-slate-600 hover:text-[#213d77] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* User / Admin Controls */}
            <div className="hidden md:flex items-center gap-2.5">
              {activeRole === 'USER' && currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 transition shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#213d77] text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">Traveler Dashboard</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
                        Logged in as <strong className="text-slate-900 block truncate">{currentUser.email}</strong>
                      </div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/user/dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#213d77] font-semibold flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-[#213d77]" />
                        <span>My Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/user/bookings');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#213d77] font-semibold flex items-center gap-2"
                      >
                        <Train className="w-4 h-4 text-[#fb792b]" />
                        <span>My Booked Tickets</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('/user/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#213d77] font-semibold flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Traveler Profile</span>
                      </button>
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          onNavigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : activeRole === 'ADMIN' && currentAdmin ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('/admin/dashboard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-[#fb792b] text-xs font-bold hover:bg-orange-100 transition shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Desk</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('/');
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Log Out Admin"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('/login')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#213d77] hover:bg-blue-50 border border-slate-300 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('/register')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#fb792b] hover:bg-[#e6681b] text-white shadow-sm transition"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => onNavigate('/admin/login')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#fb792b]" />
                    <span>Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2">
            {publicNavLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentPath === link.path ? 'bg-blue-50 text-[#213d77]' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              {activeRole === 'USER' ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/user/dashboard');
                    }}
                    className="w-full py-2 text-center rounded-xl bg-[#213d77] text-white text-xs font-bold"
                  >
                    User Dashboard ({currentUser?.name})
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      onNavigate('/');
                    }}
                    className="w-full py-2 text-center rounded-xl bg-slate-100 text-rose-600 text-xs font-bold"
                  >
                    Log Out
                  </button>
                </>
              ) : activeRole === 'ADMIN' ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/admin/dashboard');
                  }}
                  className="w-full py-2 text-center rounded-xl bg-[#fb792b] text-white text-xs font-bold"
                >
                  Admin Operations Console
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/login');
                    }}
                    className="py-2 text-center rounded-xl border border-slate-300 text-slate-800 text-xs font-bold"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('/admin/login');
                    }}
                    className="py-2 text-center rounded-xl bg-orange-50 text-[#fb792b] border border-orange-200 text-xs font-bold"
                  >
                    Admin Desk
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <DjangoCodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} />
    </>
  );
};
