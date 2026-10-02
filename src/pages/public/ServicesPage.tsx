import React from 'react';
import { QrCode, CreditCard, RefreshCw, Smartphone, Headphones, CalendarCheck, ShieldCheck, Check, Train } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Unified Tri-Modal E-Ticketing',
      desc: 'One account, one booking history, and one invoice format across all Indian Railways express routes, domestic flights, and interstate Volvo buses.',
      icon: CalendarCheck
    },
    {
      title: 'Visual Interactive Seat Layouts',
      desc: 'Pick your exact seat in 1A, 2A, 3A, Sleeper coaches, aircraft rows (Window/Middle/Aisle), and bus lower/upper sleeper berths before confirming payment.',
      icon: Smartphone
    },
    {
      title: 'Digital Boarding Passes with QR Verification',
      desc: 'Download high-resolution tickets or print standard boarding cards equipped with tamper-proof QR codes verified at station turnstiles.',
      icon: QrCode
    },
    {
      title: 'Multi-Mode Simulated Payment Gateway',
      desc: 'Safe checkout simulation supporting BHIM UPI with zero gateway fees, Virtual Debit Cards, and Net Banking with immediate transaction receipts.',
      icon: CreditCard
    },
    {
      title: 'Automated Cancellation Refunds',
      desc: 'Instant ticket cancellations with automatic calculation and payment-status updates right from your dashboard as per Indian Railways refund rules.',
      icon: RefreshCw
    },
    {
      title: '24x7 Transit Passenger Helpdesk (139)',
      desc: 'Dedicated helpline, live ticket assistance, delay notifications, and priority senior citizen travel allocations.',
      icon: Headphones
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#213d77] text-xs font-bold">
          <Train className="w-3.5 h-3.5 text-[#fb792b]" />
          <span>IRCTC Passenger Services</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#213d77] tracking-tight">
          Everything You Need for Effortless Transit
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          TS train_sys provides traveler-first services crafted to save time, eliminate station queues, and deliver complete peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fb792b] border border-orange-200 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Service Guarantees - Clean Light White Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb792b]">Our Service Guarantee</span>
            <h2 className="text-2xl font-black text-[#213d77]">Zero-Double-Booking Guarantee</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our relational database locks selected seats the moment you enter checkout, guaranteeing that another traveler cannot book the exact same berth or seat while you complete your transaction.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
            <div className="bg-[#f8f9fc] p-3.5 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Instant PNR Generation</span>
            </div>
            <div className="bg-[#f8f9fc] p-3.5 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official IRCTC ERS Slip</span>
            </div>
            <div className="bg-[#f8f9fc] p-3.5 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Live Delay Notifications</span>
            </div>
            <div className="bg-[#f8f9fc] p-3.5 rounded-xl border border-slate-200 flex items-center gap-2 text-slate-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Strict Data Confidentiality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
