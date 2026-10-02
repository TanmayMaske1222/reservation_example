import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { LogIn, UserCheck, Shield, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { loginAsUser, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('rahul.travel@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const availableUsers = DatabaseStorage.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    const success = loginAsUser(email);
    if (success) {
      onNavigate('/user/dashboard');
    } else {
      setError('Invalid credentials or traveler record not found. Please verify your email.');
    }
  };

  const handleQuickDemoUser = (userEmail: string) => {
    setEmail(userEmail);
    const success = loginAsUser(userEmail);
    if (success) {
      onNavigate('/user/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#f4f6fa]">
      <div className="w-full max-w-md space-y-6">
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 mx-auto flex items-center justify-center shadow-xs">
              <LogIn className="w-6 h-6 text-[#fb792b]" />
            </div>
            <h2 className="text-2xl font-black text-[#213d77] tracking-tight">IRCTC Traveler Sign In</h2>
            <p className="text-xs text-slate-500">
              Sign in to manage train, flight & bus reservations and access digital tickets.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#213d77] text-xs flex items-center gap-2">
              <span>{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address / User ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setInfoMsg('Evaluation Mode: Click on any 1-click test traveler below to sign in instantly.')}
                  className="text-[11px] text-[#fb792b] font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <span>Sign In to Traveler Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Instant 1-Click Test Travelers
            </span>
            <div className="space-y-1.5">
              {availableUsers.slice(0, 2).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoUser(user.email)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#213d77]" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-[#213d77]">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{user.email}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#fb792b] font-bold group-hover:underline">Login →</span>
                </button>
              ))}
            </div>
          </div>

          {/* Register Prompt */}
          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="text-[#213d77] font-bold hover:underline"
            >
              Register here
            </button>
          </div>
        </div>

        {/* Admin Link */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('/admin/login')}
            className="text-xs text-slate-500 hover:text-[#fb792b] transition inline-flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-[#fb792b]" />
            <span>Are you a TS Administrator? Go to <strong>Admin Portal Login</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};
