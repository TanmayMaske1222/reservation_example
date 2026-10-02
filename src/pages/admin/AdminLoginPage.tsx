import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { Shield, KeyRound, AlertTriangle, ArrowRight, Lock, Mail } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAsAdmin, switchDemoAdmin } = useAuth();
  const [email, setEmail] = useState('admin@tstrains.sys');
  const [password, setPassword] = useState('admin@2026');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAsAdmin(email);
    if (success) {
      onNavigate('/admin/dashboard');
    } else {
      setError('Unauthorized access. Admin email not recognized in system administrator registry.');
    }
  };

  const handleInstantDemoAdmin = () => {
    switchDemoAdmin();
    onNavigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#f4f6fa]">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#fb792b] border-2 border-orange-200 mx-auto flex items-center justify-center shadow-sm">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-[#213d77] tracking-tight">TS train_sys Admin Portal</h2>
          <p className="text-xs text-slate-500">
            Internal Operations, Transport Scheduling & Security Command Center
          </p>
        </div>

        {/* Form Container - Crisp White */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-orange-900 text-xs font-medium">
            <KeyRound className="w-4 h-4 shrink-0 text-[#fb792b]" />
            <span>Restricted: Authorized Operations Personnel Only</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tstrains.sys"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Security Password</label>
                <a
                  href="#admin-forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Demo Mode: Click "1-Click SuperAdmin Login" below to enter immediately.');
                  }}
                  className="text-[11px] text-[#fb792b] hover:underline font-semibold"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Authenticate to Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click SuperAdmin Demo Login */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Instant 1-Click Evaluation
            </span>
            <button
              type="button"
              onClick={handleInstantDemoAdmin}
              className="w-full p-3 rounded-xl bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#fb792b] text-white flex items-center justify-center font-bold text-xs">
                  SA
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#fb792b]">
                    SuperAdmin Operations Desk
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">admin@tstrains.sys</div>
                </div>
              </div>
              <span className="text-[11px] text-[#fb792b] font-bold group-hover:underline">
                Enter →
              </span>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-500 hover:text-[#213d77] transition"
            >
              ← Return to TS train_sys Public Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
