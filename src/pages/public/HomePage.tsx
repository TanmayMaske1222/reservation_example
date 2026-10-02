import React, { useState } from 'react';
import {
  Train,
  Plane,
  Bus,
  Search,
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  Clock,
  Calendar,
  Zap,
  CheckCircle2,
  FileText,
  MapPin,
  Utensils,
  Hotel,
  Sparkles,
  PhoneCall,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import vandeBharatImg from '../../assets/images/vande_bharat_scenic_1790962432320.jpg';
import flightImg from '../../assets/images/flight_travel_sky_1790962448638.jpg';
import busImg from '../../assets/images/luxury_intercity_bus_1790962460400.jpg';

interface HomePageProps {
  onNavigate: (path: string, state?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'TRAIN' | 'FLIGHT' | 'BUS' | 'PNR'>('TRAIN');

  // Search fields
  const [source, setSource] = useState('New Delhi (NDLS)');
  const [destination, setDestination] = useState('Varanasi Jn (BSB)');
  const [journeyDate, setJourneyDate] = useState('2026-10-15');
  const [quota, setQuota] = useState('GENERAL');
  const [travelClass, setTravelClass] = useState('ALL');
  const [passengers, setPassengers] = useState(1);
  const [pnrInput, setPnrInput] = useState('');

  // IRCTC Style Checkboxes
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [divyangConcession, setDivyangConcession] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(true);

  const swapStations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const handleStationChipClick = (from: string, to: string) => {
    setSource(from);
    setDestination(to);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'PNR') {
      onNavigate('/user/bookings');
      return;
    }
    if (activeTab === 'TRAIN') {
      onNavigate('/user/trains', { source, destination, journeyDate, quota, travelClass, passengers });
    } else if (activeTab === 'FLIGHT') {
      onNavigate('/user/flights', { source, destination, journeyDate, travelClass, passengers });
    } else {
      onNavigate('/user/buses', { source, destination, journeyDate, passengers });
    }
  };

  return (
    <div className="bg-[#f4f6fa] text-slate-800 space-y-10 pb-16">
      
      {/* IRCTC Official Notice Ticker */}
      <div className="bg-[#fff8ed] border-b border-orange-200 px-4 py-2 text-xs text-orange-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-bold bg-[#fb792b] text-white px-2 py-0.5 rounded text-[10px] tracking-wide shrink-0">
              IRCTC ALERT
            </span>
            <div className="truncate font-semibold text-orange-900">
              Advance Reservation Period (ARP) open up to 120 days. Zero convenience fee on BHIM/UPI bookings. Dial 139 for 24x7 Rail Helpline.
            </div>
          </div>
          <button
            onClick={() => onNavigate('/user/support')}
            className="text-[11px] font-bold text-[#fb792b] hover:underline shrink-0 hidden sm:inline"
          >
            Travel Advisory ↗
          </button>
        </div>
      </div>

      {/* Main Booking Hero Section (Light & Authentic IRCTC Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Banner Image with Light Framing */}
          <div className="relative h-[220px] sm:h-[260px] md:h-[300px] w-full overflow-hidden border-b border-slate-200">
            <img
              src={vandeBharatImg}
              alt="Indian Railways Vande Bharat Express"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Soft, crisp white text backdrop */}
            <div className="absolute inset-0 bg-white/90 sm:w-2/3 backdrop-blur-xs flex flex-col justify-center px-6 sm:px-12 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#213d77] text-xs font-bold w-fit">
                <Train className="w-3.5 h-3.5 text-[#fb792b]" />
                <span>Next Generation e-Ticketing System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#213d77] tracking-tight">
                TS train_sys
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-lg leading-relaxed">
                Official Multi-Modal Travel Portal. Book Vande Bharat express trains, domestic air flights, and interstate Volvo buses with real-time seat availability.
              </p>
            </div>
          </div>

          {/* IRCTC Multi-Modal Booking Widget */}
          <div className="p-5 sm:p-8 bg-white">
            {/* Segmented Mode Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200">
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('TRAIN')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'TRAIN'
                      ? 'bg-[#213d77] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Train className="w-4 h-4 text-[#fb792b]" />
                  <span>Book Train</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('FLIGHT')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'FLIGHT'
                      ? 'bg-[#213d77] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Plane className="w-4 h-4 text-[#fb792b]" />
                  <span>Air Flights</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('BUS')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'BUS'
                      ? 'bg-[#213d77] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Bus className="w-4 h-4 text-[#fb792b]" />
                  <span>Intercity Bus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('PNR')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
                    activeTab === 'PNR'
                      ? 'bg-[#213d77] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#fb792b]" />
                  <span>PNR Status</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-semibold hidden lg:flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized Indian Railways PRS Portal</span>
              </div>
            </div>

            {/* PNR Search Tab */}
            {activeTab === 'PNR' ? (
              <form onSubmit={handleSearch} className="py-8 max-w-xl mx-auto space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-[#213d77]">Check Passenger Current Reservation Status</h3>
                  <p className="text-xs text-slate-500">Enter your 10-digit PNR number to check confirmed coach/seat and waitlist movement.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value)}
                    placeholder="e.g. TS-PNR-849201"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#213d77] bg-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#fb792b] hover:bg-[#e6681b] text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Check Status
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSearch} className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                  {/* Origin */}
                  <div className="lg:col-span-3 space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      From Station / Origin
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="e.g. New Delhi (NDLS)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#213d77] bg-white"
                      />
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="lg:col-span-1 flex justify-center pt-4 sm:pt-5">
                    <button
                      type="button"
                      onClick={swapStations}
                      className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-[#213d77] transition shadow-xs"
                      title="Swap Origin and Destination"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Destination */}
                  <div className="lg:col-span-3 space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      To Station / Destination
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Varanasi Jn (BSB)"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#213d77] bg-white"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="lg:col-span-2 space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Date of Journey
                    </label>
                    <input
                      type="date"
                      required
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#213d77] bg-white"
                    />
                  </div>

                  {/* Class / Quota */}
                  {activeTab === 'TRAIN' ? (
                    <div className="lg:col-span-3 space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Quota & Class
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={quota}
                          onChange={(e) => setQuota(e.target.value)}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        >
                          <option value="GENERAL">GENERAL</option>
                          <option value="TATKAL">TATKAL</option>
                          <option value="PREMIUM_TATKAL">PREMIUM TATKAL</option>
                          <option value="LADIES">LADIES</option>
                          <option value="SENIOR_CITIZEN">SR. CITIZEN</option>
                        </select>
                        <select
                          value={travelClass}
                          onChange={(e) => setTravelClass(e.target.value)}
                          className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        >
                          <option value="ALL">All Classes</option>
                          <option value="1A">AC First (1A)</option>
                          <option value="2A">AC 2 Tier (2A)</option>
                          <option value="3A">AC 3 Tier (3A)</option>
                          <option value="SL">Sleeper (SL)</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="lg:col-span-3 space-y-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Travelers Count
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => setPassengers(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Popular Route Quick Chips */}
                {activeTab === 'TRAIN' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500 font-bold text-[11px]">Popular Routes:</span>
                    <button
                      type="button"
                      onClick={() => handleStationChipClick('New Delhi (NDLS)', 'Varanasi Jn (BSB)')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-[11px]"
                    >
                      NDLS ➔ BSB (Vande Bharat)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStationChipClick('New Delhi (NDLS)', 'Mumbai Central (MMCT)')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-[11px]"
                    >
                      NDLS ➔ MMCT (Rajdhani)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStationChipClick('Howrah Jn (HWH)', 'New Delhi (NDLS)')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-[11px]"
                    >
                      HWH ➔ NDLS (Rajdhani)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStationChipClick('KSR Bengaluru (SBC)', 'MGR Chennai (MAS)')}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition text-[11px]"
                    >
                      SBC ➔ MAS (Shatabdi)
                    </button>
                  </div>
                )}

                {/* Checkboxes & Signature Orange CTA */}
                <div className="pt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flexibleDate}
                        onChange={(e) => setFlexibleDate(e.target.checked)}
                        className="w-4 h-4 accent-[#fb792b] rounded"
                      />
                      <span>Flexible With Date</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={freeCancellation}
                        onChange={(e) => setFreeCancellation(e.target.checked)}
                        className="w-4 h-4 accent-[#fb792b] rounded"
                      />
                      <span className="font-semibold text-emerald-700">Train with Available Berth</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={divyangConcession}
                        onChange={(e) => setDivyangConcession(e.target.checked)}
                        className="w-4 h-4 accent-[#fb792b] rounded"
                      />
                      <span>Divyang Concession</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-black text-sm shadow-sm transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search {activeTab === 'TRAIN' ? 'Trains' : activeTab === 'FLIGHT' ? 'Flights' : 'Buses'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* IRCTC Iconic Daily Services Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate('/user/trains')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#fb792b] shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#fb792b] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Train className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">Train Tickets</span>
          </button>

          <button
            onClick={() => onNavigate('/user/flights')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#213d77] shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#213d77] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">IRCTC Air</span>
          </button>

          <button
            onClick={() => onNavigate('/user/buses')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#213d77] shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#213d77] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">IRCTC Bus</span>
          </button>

          <button
            onClick={() => onNavigate('/user/bookings')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">PNR Enquiry</span>
          </button>

          <button
            onClick={() => onNavigate('/services')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-600 shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">E-Catering Food</span>
          </button>

          <button
            onClick={() => onNavigate('/contact')}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-600 shadow-xs hover:shadow-sm transition flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800">Rail Helpline 139</span>
          </button>
        </div>
      </section>

      {/* Featured Trains in Authentic IRCTC Card Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="text-xs font-bold text-[#fb792b] uppercase tracking-wider">
              Priority Express Trains
            </div>
            <h2 className="text-2xl font-black text-[#213d77]">
              Popular Vande Bharat & Rajdhani Services
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/user/trains')}
            className="text-xs font-bold text-[#213d77] hover:text-[#fb792b] flex items-center gap-1 transition"
          >
            <span>View All Scheduled Trains</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Train Card 1 - Vande Bharat */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#213d77] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  #22436
                </span>
                <h3 className="font-black text-base text-slate-900 mt-1">Vande Bharat Express</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Runs Daily
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center text-center">
              <div className="text-left">
                <div className="text-lg font-bold text-slate-900">06:00</div>
                <div className="text-xs font-bold text-slate-700">NDLS</div>
                <div className="text-[10px] text-slate-500">New Delhi</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono">08h 00m</div>
                <div className="w-full flex items-center gap-1 my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fb792b]" />
                  <div className="h-0.5 flex-1 bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#213d77]" />
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Direct Superfast</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">14:00</div>
                <div className="text-xs font-bold text-slate-700">BSB</div>
                <div className="text-[10px] text-slate-500">Varanasi Jn</div>
              </div>
            </div>

            {/* IRCTC Coach Availability Chips */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Exec Chair (EC)</span>
                  <span className="text-[#213d77]">₹3,200</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0018</div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Chair Car (CC)</span>
                  <span className="text-[#213d77]">₹1,750</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0082</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/user/trains')}
              className="w-full py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Book Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Train Card 2 - Mumbai Rajdhani */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#213d77] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  #12952
                </span>
                <h3 className="font-black text-base text-slate-900 mt-1">Mumbai Rajdhani Exp</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Runs Daily
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center text-center">
              <div className="text-left">
                <div className="text-lg font-bold text-slate-900">16:55</div>
                <div className="text-xs font-bold text-slate-700">NDLS</div>
                <div className="text-[10px] text-slate-500">New Delhi</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono">15h 40m</div>
                <div className="w-full flex items-center gap-1 my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fb792b]" />
                  <div className="h-0.5 flex-1 bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#213d77]" />
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Rajdhani AC</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">08:35</div>
                <div className="text-xs font-bold text-slate-700">MMCT</div>
                <div className="text-[10px] text-slate-500">Mumbai Central</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">AC 2 Tier (2A)</span>
                  <span className="text-[#213d77]">₹2,980</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0034</div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">AC 3 Tier (3A)</span>
                  <span className="text-[#213d77]">₹2,150</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0110</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/user/trains')}
              className="w-full py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Book Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Train Card 3 - Shatabdi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs font-bold text-[#213d77] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  #12004
                </span>
                <h3 className="font-black text-base text-slate-900 mt-1">Lucknow Shatabdi</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Runs Daily
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center text-center">
              <div className="text-left">
                <div className="text-lg font-bold text-slate-900">06:10</div>
                <div className="text-xs font-bold text-slate-700">NDLS</div>
                <div className="text-[10px] text-slate-500">New Delhi</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 font-mono">06h 30m</div>
                <div className="w-full flex items-center gap-1 my-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#fb792b]" />
                  <div className="h-0.5 flex-1 bg-slate-200" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#213d77]" />
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Superfast AC</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">12:40</div>
                <div className="text-xs font-bold text-slate-700">LJN</div>
                <div className="text-[10px] text-slate-500">Lucknow Jn</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Executive (EC)</span>
                  <span className="text-[#213d77]">₹2,100</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0022</div>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200 bg-[#f8fafc]">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-700">Chair Car (CC)</span>
                  <span className="text-[#213d77]">₹1,165</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1">AVAILABLE - 0094</div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/user/trains')}
              className="w-full py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Book Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Flight & Bus Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flight Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <img
              src={flightImg}
              alt="Domestic Flights"
              className="w-full sm:w-44 h-36 object-cover rounded-xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#213d77] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Aviation Wing
              </span>
              <h3 className="text-lg font-bold text-[#213d77]">IRCTC Air Domestic Flights</h3>
              <p className="text-xs text-slate-600">
                Book non-stop flights across IndiGo, Air India, and SpiceJet with zero convenience fee on defense and corporate quotas.
              </p>
              <button
                onClick={() => onNavigate('/user/flights')}
                className="text-xs font-bold text-[#fb792b] hover:underline flex items-center gap-1 pt-1"
              >
                <span>Search Flights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bus Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <img
              src={busImg}
              alt="Luxury Volvo Buses"
              className="w-full sm:w-44 h-36 object-cover rounded-xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#213d77] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Roadways Wing
              </span>
              <h3 className="text-lg font-bold text-[#213d77]">IRCTC Bus Online Booking</h3>
              <p className="text-xs text-slate-600">
                State RTC and private luxury Volvo AC sleeper coaches with live GPS tracking and verified boarding locations.
              </p>
              <button
                onClick={() => onNavigate('/user/buses')}
                className="text-xs font-bold text-[#fb792b] hover:underline flex items-center gap-1 pt-1"
              >
                <span>Search Volvo Buses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* IRCTC Security & Helpline Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Indian Railways 24x7 Customer Care
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#213d77]">
              Need Help With Your Reservation?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer care executives are available round the clock. For railway medical emergencies, security, catering feedback, or ticket cancellations, dial Toll-Free Helpline <strong>139</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('/user/support')}
              className="px-6 py-3 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold shadow-xs transition"
            >
              Passenger Helpdesk
            </button>
            <button
              onClick={() => onNavigate('/user/dashboard')}
              className="px-6 py-3 rounded-xl bg-orange-50 border border-orange-200 text-[#fb792b] text-xs font-bold hover:bg-orange-100 transition"
            >
              Open Traveler Portal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
