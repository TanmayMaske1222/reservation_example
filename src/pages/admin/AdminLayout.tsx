import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Train,
  Plane,
  Bus,
  Ticket,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ExternalLink,
  Code2,
  Phone
} from 'lucide-react';
import { DjangoCodeModal } from '../../components/common/DjangoCodeModal';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const { currentAdmin, activeRole, logout, switchDemoUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  // Security Guard: Prevent non-admins from viewing Admin Portal
  if (activeRole !== 'ADMIN' || !currentAdmin) {
    return (
      <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex items-center justify-center p-4">
        <div className="bg-white border border-rose-200 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Administrative Access Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are attempting to access restricted operations modules. Normal traveler accounts do not possess administrative clearance.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => onNavigate('/admin/login')}
              className="w-full py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-md transition"
            >
              Sign In to Admin Portal
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Back to Public Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Trains', path: '/admin/trains', icon: Train },
    { label: 'Flights', path: '/admin/flights', icon: Plane },
    { label: 'Buses', path: '/admin/buses', icon: Bus },
    { label: 'Bookings', path: '/admin/bookings', icon: Ticket },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col md:flex-row">
      {/* Desktop Admin Sidebar - Clean Light Theme */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 shadow-sm">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 bg-[#f8fafc]">
          <div
            onClick={() => onNavigate('/admin/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#213d77] text-white flex items-center justify-center font-black shadow-sm border-2 border-[#fb792b]/30">
              <Shield className="w-5 h-5 text-[#fb792b]" />
            </div>
            <div>
              <div className="font-black text-base text-[#213d77] tracking-tight">
                TS train_sys
              </div>
              <div className="text-[10px] text-[#fb792b] font-mono uppercase tracking-widest font-bold">
                Admin Console 🛡️
              </div>
            </div>
          </div>
        </div>

        {/* Admin Operator Badge */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">{currentAdmin.name}</div>
              <div className="text-[10px] text-slate-500 font-mono truncate">{currentAdmin.badgeTitle}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#213d77] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#213d77] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#fb792b]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 my-2 space-y-1">
            <button
              onClick={() => setCodeModalOpen(true)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition font-mono"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Django ORM Code</span>
            </button>

            <button
              onClick={() => {
                switchDemoUser('usr_101');
                onNavigate('/user/dashboard');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Switch to User Portal</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc]">
          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#213d77] text-white flex items-center justify-center font-bold text-xs">
            <Shield className="w-4 h-4 text-[#fb792b]" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#213d77] leading-none">TS train_sys</div>
            <div className="text-[10px] text-[#fb792b] font-mono">Admin Portal</div>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-100 text-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setMobileOpen(false);
                onNavigate(item.path);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                currentPath === item.path ? 'bg-[#213d77] text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileOpen(false);
                logout();
                onNavigate('/');
              }}
              className="text-xs text-rose-600 font-bold py-1"
            >
              Log Out Admin
            </button>
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Top Operations Header Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              CORE DISPATCH ENGINE: ONLINE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-mono hidden sm:inline">DATABASE: SQLite3 Relational</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('/')}
              className="text-slate-600 hover:text-[#213d77] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 transition text-[11px] font-semibold"
            >
              Public Site ↗
            </button>
            <button
              onClick={() => {
                switchDemoUser('usr_101');
                onNavigate('/user/dashboard');
              }}
              className="text-[#213d77] hover:text-[#182e5b] px-2.5 py-1 rounded bg-blue-50 border border-blue-200 transition text-[11px] font-bold"
            >
              Traveler View 👤
            </button>
          </div>
        </div>

        {children}
      </main>

      <DjangoCodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} />
    </div>
  );
};
