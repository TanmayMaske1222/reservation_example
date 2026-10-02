import React from 'react';
import { Train, Plane, Bus, ShieldCheck, Target, Globe, Users, Award, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#213d77] text-xs font-bold">
          <Train className="w-3.5 h-3.5 text-[#fb792b]" />
          <span>About TS train_sys</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#213d77] tracking-tight">
          One Platform. Every Journey.
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Inspired by Indian Railways and IRCTC Next Generation e-Ticketing, TS train_sys integrates high-speed railway services, domestic aviation, and interstate luxury bus transit into a single unified technological platform.
        </p>
      </div>

      {/* Vision & Mission Cards - Light Clean */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fb792b] border border-orange-200 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Passenger First Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate booking anxiety by offering verifiable real-time seat availability, instant Tatkal reservations, transparent fares, and prompt refund processing.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pan-India Transit Reach</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Serving over 7,300 railway stations, 120 domestic airports, and 4,000+ interstate luxury bus routes under one digital identity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Security & Isolation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Role-isolated architectures strictly segregating traveler interactions from operational dispatch, fare controls, and administrative management.
          </p>
        </div>
      </div>

      {/* Tri-Modal Capabilities - Clean White / Soft Grey Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb792b]">Transit Architecture</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#213d77]">Integrated Tri-Modal Transit Divisions</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">Government Transit Compliant</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#f8f9fc] p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#213d77] font-bold text-sm">
              <Train className="w-5 h-5 text-[#fb792b]" />
              <span>Railway Division</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full coach matrix support for Vande Bharat Executive Chair (EC), Rajdhani 1A/2A/3A berths, Shatabdi express chairs, and standard Sleeper coaches with quota management.
            </p>
          </div>

          <div className="bg-[#f8f9fc] p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#213d77] font-bold text-sm">
              <Plane className="w-5 h-5 text-[#fb792b]" />
              <span>IRCTC Air Division</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time fare classes across leading carriers including IndiGo, Air India, and SpiceJet with direct electronic boarding pass issuance and LTC claim assistance.
            </p>
          </div>

          <div className="bg-[#f8f9fc] p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#213d77] font-bold text-sm">
              <Bus className="w-5 h-5 text-[#fb792b]" />
              <span>Interstate Surface Roadways</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-axle Volvo and AC sleeper berths with live GPS telematics, confirmed pickup spots, and 24x7 route monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
