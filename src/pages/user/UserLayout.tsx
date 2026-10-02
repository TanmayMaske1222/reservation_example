import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import {
  LayoutDashboard,
  Train,
  Plane,
  Bus,
  Ticket,
  User as UserIcon,
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Phone
} from 'lucide-react';
import { DjangoCodeModal } from '../../components/common/DjangoCodeModal';

interface UserLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const UserLayout: React.FC<UserLayoutProps> = ({
  currentPath,
  onNavigate,
  children
}) => {
  const { currentUser, logout, switchDemoAdmin } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  const notifications = currentUser
    ? DatabaseStorage.getNotifications().filter(n => n.userId === currentUser.id && !n.isRead)
    : [];

  const navItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Train Booking', path: '/user/trains', icon: Train },
    { label: 'Flight Booking', path: '/user/flights', icon: Plane },
    { label: 'Bus Booking', path: '/user/buses', icon: Bus },
    { label: 'My Bookings', path: '/user/bookings', icon: Ticket },
    { label: 'My Profile', path: '/user/profile', icon: UserIcon },
    {
      label: 'Notifications',
      path: '/user/notifications',
      icon: Bell,
      badge: notifications.length > 0 ? notifications.length : undefined
    },
    { label: 'Help & Support (139)', path: '/user/support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fa] flex flex-col md:flex-row text-slate-800">
      {/* Sidebar for Desktop - Clean White IRCTC Style */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 bg-[#f8fafc]">
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#213d77] flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform border-2 border-[#fb792b]/30">
              TS
            </div>
            <div>
              <div className="font-black text-base text-[#213d77] tracking-tight">TS train_sys</div>
              <div className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider">
                Passenger Portal 👤
              </div>
            </div>
          </div>
        </div>

        {/* User Mini Profile Card */}
        {currentUser && (
          <div className="px-5 py-4 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#213d77] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#213d77] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#213d77] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#fb792b]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fb792b] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 my-2 space-y-1">
            <button
              onClick={() => onNavigate('/')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#213d77] hover:bg-slate-50 transition"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Public Website</span>
            </button>

            <button
              onClick={() => setCodeModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition"
            >
              <span className="font-mono text-xs">Django Architecture</span>
            </button>
          </div>
        </nav>

        {/* Switch Portal & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-[#f8fafc] space-y-2">
          <button
            onClick={() => {
              switchDemoAdmin();
              onNavigate('/admin/dashboard');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#fb792b] border border-orange-200 text-[11px] font-bold transition"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#fb792b]" />
              <span>Switch to Admin Portal</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#213d77] text-white flex items-center justify-center font-bold text-xs">
            TS
          </div>
          <div>
            <div className="font-bold text-sm text-[#213d77] leading-none">TS train_sys</div>
            <div className="text-[10px] text-[#fb792b] font-semibold">User Portal</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/user/notifications')}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 relative"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fb792b] text-white text-[9px] font-bold flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-700"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onNavigate(item.path);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-[#213d77] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#fb792b] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                logout();
                onNavigate('/');
              }}
              className="text-xs text-rose-600 font-bold py-1"
            >
              Sign Out
            </button>
            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                onNavigate('/');
              }}
              className="text-xs text-slate-600 font-bold py-1"
            >
              Public Home
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>

      <DjangoCodeModal isOpen={codeModalOpen} onClose={() => setCodeModalOpen(false)} />
    </div>
  );
};
