import React, { useState } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Payment } from '../../types';
import { CreditCard, Search, ArrowDownLeft, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(() => DatabaseStorage.getPayments());
  const [searchQuery, setSearchQuery] = useState('');

  const refreshData = () => {
    setPayments(DatabaseStorage.getPayments());
  };

  const filtered = payments.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const m1 = p.transactionId.toLowerCase().includes(q);
      const m2 = p.pnr.toLowerCase().includes(q);
      const m3 = p.userName.toLowerCase().includes(q);
      if (!m1 && !m2 && !m3) return false;
    }
    return true;
  });

  const totalCollected = payments.reduce((acc, p) => p.paymentStatus === 'PAID' ? acc + p.amount : acc, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <CreditCard className="w-4 h-4 text-[#213d77]" />
            <span>Financial Settlement & Gateway Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Payments & Settlement Audit
          </h1>
          <p className="text-xs text-slate-500">
            Reconciliation of UPI VPAs, card settlements, simulated gateway auth tokens, and refund receipts.
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Total Net Settlements</span>
          <div className="text-xl font-mono font-black text-[#213d77]">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by transaction ID, PNR, traveler..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Settlement Records: <strong className="text-slate-800">{payments.length}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9fc] text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">Transaction UTR</th>
                <th className="py-3.5 px-4 font-bold">PNR Ref</th>
                <th className="py-3.5 px-4 font-bold">Traveler</th>
                <th className="py-3.5 px-4 font-bold">Method</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-[#213d77]">{p.transactionId}</span>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {p.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{p.pnr}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.userName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {new Date(p.paymentDate).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      p.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
