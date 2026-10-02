import React from 'react';
import { Train, Plane, Bus, Shield, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1c3564] text-slate-200 text-sm border-t border-slate-700">
      {/* Top Value Strip */}
      <div className="bg-[#152a50] border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#fb792b] text-white flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">National Railway Network</div>
              <div className="text-[11px] text-slate-300">IRCTC Next-Gen e-Ticketing, Vande Bharat & Tatkal quotas.</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#213d77] border border-blue-400 text-white flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5 text-[#fb792b]" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Domestic Aviation Wings</div>
              <div className="text-[11px] text-slate-300">IndiGo, Air India & SpiceJet electronic boarding passes.</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#213d77] border border-blue-400 text-white flex items-center justify-center shrink-0">
              <Bus className="w-5 h-5 text-[#fb792b]" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Intercity Volvo Roadways</div>
              <div className="text-[11px] text-slate-300">AC Sleeper berths with live GPS telemetry tracking.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#213d77] border border-[#fb792b] text-white font-black text-lg flex items-center justify-center shadow-xs">
                TS
              </div>
              <span className="text-xl font-black text-white tracking-tight">TS train_sys</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 max-w-sm">
              <strong className="text-white">“One Platform. Every Journey.”</strong> — Next-generation multi-modal transit reservation platform uniting Indian Railways trains, domestic flights, and luxury intercity buses.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#fb792b]" />
                <span>Railway Emergency / Inquiry: <strong>Dial 139</strong> (24x7 Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#fb792b]" />
                <span>support@tstrains.sys</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#fb792b]" />
                <span>TS Transit Tower, Barakhamba Road, New Delhi 110001</span>
              </div>
            </div>
          </div>

          {/* E-Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-[#fb792b] pl-2">
              E-Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('/user/trains')} className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#fb792b]" />
                  <span>Train Booking & PNR</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/user/flights')} className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#fb792b]" />
                  <span>Flight Booking</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/user/buses')} className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#fb792b]" />
                  <span>Intercity Bus Booking</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/user/bookings')} className="hover:text-white transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#fb792b]" />
                  <span>Cancel Ticket & Refund</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-blue-400 pl-2">
              General Info
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition">About TS train_sys</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/departments')} className="hover:text-white transition">Operational Divisions</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition">Passenger Amenities</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition">Customer Support</button>
              </li>
            </ul>
          </div>

          {/* Administration */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-emerald-400 pl-2">
              Security & Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/admin/login')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition"
                >
                  <Shield className="w-3.5 h-3.5 text-[#fb792b]" />
                  <span>Admin Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/user/dashboard')}
                  className="text-slate-300 hover:text-white transition"
                >
                  Passenger Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-slate-300 hover:text-white transition"
                >
                  Traveler Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/register')}
                  className="text-slate-300 hover:text-white transition"
                >
                  Register Account
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} TS train_sys. Designed inspired by Indian Railways & IRCTC Next-Gen e-Ticketing.
          </div>
          <div className="flex gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Passenger Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
