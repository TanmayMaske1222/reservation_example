import React, { useState } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Settings, Save, Shield, Globe, Mail, Phone, CreditCard, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState(() => DatabaseStorage.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DatabaseStorage.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <Settings className="w-4 h-4 text-[#213d77]" />
            <span>Master System Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Portal Settings & Policies
          </h1>
          <p className="text-xs text-slate-500">
            Configure system brand identity, transit contact hotlines, refund percentage rates, and security enforcement.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration parameters saved and applied successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Branding & Identity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-[#213d77]">
            <Globe className="w-4 h-4 text-[#fb792b]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Branding & Portal Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Portal Name</label>
              <input
                type="text"
                required
                value={settings.websiteName}
                onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Support Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-[#213d77]">
            <Mail className="w-4 h-4 text-[#fb792b]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Official Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                required
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Toll-Free Support Hotline</label>
              <input
                type="text"
                required
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Booking & Financial Policies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-[#213d77]">
            <CreditCard className="w-4 h-4 text-[#fb792b]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Booking & Cancellation Policies</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cancellation Refund Rate (% credited back)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.cancellationRefundRate}
                onChange={(e) => setSettings({ ...settings, cancellationRefundRate: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Advance Booking Window (Days)</label>
              <input
                type="number"
                min="7"
                max="120"
                value={settings.advanceBookingDays}
                onChange={(e) => setSettings({ ...settings, advanceBookingDays: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-[#213d77] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & System Guardrails */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-[#213d77]">
            <Shield className="w-4 h-4 text-[#fb792b]" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Security & System Guardrails</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.roleIsolationEnforced}
                onChange={(e) => setSettings({ ...settings, roleIsolationEnforced: e.target.checked })}
                className="w-4 h-4 accent-[#fb792b] rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Enforce Strict Role Isolation</div>
                <div className="text-[11px] text-slate-500">Prevent travelers from accessing admin endpoints without explicit administrator credentials.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSimulatedPayment}
                onChange={(e) => setSettings({ ...settings, enableSimulatedPayment: e.target.checked })}
                className="w-4 h-4 accent-[#fb792b] rounded"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">Allow Simulated Instant Payment Gateways</div>
                <div className="text-[11px] text-slate-500">Enable test travelers and evaluators to complete realistic simulated bookings via UPI, cards, and net banking.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-black text-xs shadow-xs transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
