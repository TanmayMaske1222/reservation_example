import React, { useState } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Booking } from '../../types';
import {
  Users,
  Ticket,
  Train,
  Plane,
  Bus,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const users = DatabaseStorage.getUsers();
  const bookings = DatabaseStorage.getBookings();
  const trains = DatabaseStorage.getTrains();
  const flights = DatabaseStorage.getFlights();
  const buses = DatabaseStorage.getBuses();

  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const totalUsers = users.length;
  const totalBookings = bookings.length;
  const trainBookings = bookings.filter(b => b.transportType === 'TRAIN').length;
  const flightBookings = bookings.filter(b => b.transportType === 'FLIGHT').length;
  const busBookings = bookings.filter(b => b.transportType === 'BUS').length;
  const cancelledBookings = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;
  const totalRevenue = bookings
    .filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
    .reduce((acc, b) => acc + b.amount, 0);
  const activeRoutes = trains.length + flights.length + buses.length;

  const trainSharePct = totalBookings > 0 ? Math.round((trainBookings / totalBookings) * 100) : 0;
  const flightSharePct = totalBookings > 0 ? Math.round((flightBookings / totalBookings) * 100) : 0;
  const busSharePct = totalBookings > 0 ? Math.round((busBookings / totalBookings) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#fb792b] mb-1">
            <Activity className="w-4 h-4 text-[#213d77]" />
            <span>Master Operations & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Admin Command Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time fleet utilization, booking volumes, passenger ledgers, and revenue aggregation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/reports')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition shadow-sm"
          >
            Analytics Reports
          </button>
          <button
            onClick={() => onNavigate('/admin/bookings')}
            className="px-4 py-2 rounded-xl bg-[#fb792b] hover:bg-[#e6681b] text-white text-xs font-black shadow-sm transition"
          >
            Manage Bookings
          </button>
        </div>
      </div>

      {/* KPI Stats Grid - Crisp Light Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-[#213d77]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> Active Travelers
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <Ticket className="w-4 h-4 text-[#fb792b]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBookings}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {trainBookings} Train • {flightBookings} Flight • {busBookings} Bus
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#213d77]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500">Net confirmed bookings</div>
        </div>

        {/* Active Routes */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Routes</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeRoutes}</div>
          <div className="text-[11px] text-[#fb792b] font-mono font-semibold">Tri-modal network</div>
        </div>
      </div>

      {/* Analytics Visual Charts Section - Light Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Bookings & Revenue Visual Bar Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#213d77]">Daily Booking Velocity & Revenue Trend</h3>
              <p className="text-xs text-slate-500">Live 7-day transaction frequency across all transport divisions.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-100 text-[10px] font-mono text-slate-700 border border-slate-200 font-semibold">
              Last 7 Days
            </span>
          </div>

          {/* Clean Light Chart Bars */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 px-2">
              {[
                { day: 'Mon', count: 18, rev: '₹42.1K', height: '55%' },
                { day: 'Tue', count: 24, rev: '₹58.4K', height: '70%' },
                { day: 'Wed', count: 21, rev: '₹51.2K', height: '62%' },
                { day: 'Thu', count: 29, rev: '₹68.9K', height: '82%' },
                { day: 'Fri', count: 36, rev: '₹92.4K', height: '95%' },
                { day: 'Sat', count: 32, rev: '₹84.0K', height: '88%' },
                { day: 'Sun', count: 26, rev: '₹64.3K', height: '75%' }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-slate-600 font-bold opacity-0 group-hover:opacity-100 transition">
                    {item.rev}
                  </div>
                  <div className="w-full bg-slate-100 rounded-xl relative overflow-hidden flex items-end h-36 border border-slate-200">
                    <div
                      style={{ height: item.height }}
                      className="w-full bg-[#213d77] group-hover:bg-[#fb792b] rounded-t-lg transition-colors duration-200"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 group-hover:text-[#213d77]">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs">
            <div>
              <span className="text-slate-500 block">Avg Daily Bookings</span>
              <strong className="text-slate-900 text-sm">26.5 / day</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Cancellation Rate</span>
              <strong className="text-rose-600 text-sm">
                {totalBookings > 0 ? Math.round((cancelledBookings / totalBookings) * 100) : 0}%
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Refund Settlement</span>
              <strong className="text-emerald-700 text-sm">Automated 85%</strong>
            </div>
          </div>
        </div>

        {/* Transport-wise Bookings Breakdown */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-base font-bold text-[#213d77]">Transport Modality Distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Booking volume partitioned by carrier type.</p>
          </div>

          <div className="space-y-4">
            {/* Train progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#213d77]">
                  <Train className="w-3.5 h-3.5 text-[#fb792b]" /> Railway Reservations
                </span>
                <span className="font-mono text-slate-900 font-bold">{trainBookings} ({trainSharePct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div style={{ width: `${trainSharePct}%` }} className="h-full bg-[#213d77] rounded-full" />
              </div>
            </div>

            {/* Flight progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <Plane className="w-3.5 h-3.5" /> Domestic Aviation
                </span>
                <span className="font-mono text-slate-900 font-bold">{flightBookings} ({flightSharePct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div style={{ width: `${flightSharePct}%` }} className="h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            {/* Bus progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Bus className="w-3.5 h-3.5" /> Intercity Buses
                </span>
                <span className="font-mono text-slate-900 font-bold">{busBookings} ({busSharePct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div style={{ width: `${busSharePct}%` }} className="h-full bg-indigo-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-[#fb792b] uppercase tracking-wider block">
              Fleet Scheduling Shortcuts
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <button
                onClick={() => onNavigate('/admin/trains')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#213d77] font-bold transition shadow-sm"
              >
                + Train
              </button>
              <button
                onClick={() => onNavigate('/admin/flights')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-blue-700 font-bold transition shadow-sm"
              >
                + Flight
              </button>
              <button
                onClick={() => onNavigate('/admin/buses')}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-indigo-700 font-bold transition shadow-sm"
              >
                + Bus
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Reservations Master Table - Light Theme */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#213d77]">Live Central Reservation Stream</h3>
            <p className="text-xs text-slate-500">All cross-network bookings with real-time audit controls.</p>
          </div>

          <button
            onClick={() => onNavigate('/admin/bookings')}
            className="text-xs font-bold text-[#fb792b] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View Full Bookings Management</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3 font-semibold">Booking ID / PNR</th>
                <th className="py-3 px-3 font-semibold">Traveler</th>
                <th className="py-3 px-3 font-semibold">Transport</th>
                <th className="py-3 px-3 font-semibold">Route</th>
                <th className="py-3 px-3 font-semibold">Journey Date</th>
                <th className="py-3 px-3 font-semibold">Amount</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-[#213d77]">{b.pnr}</span>
                    <div className="text-[10px] text-slate-500 font-mono">{b.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{b.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.userEmail}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{b.transportName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.transportNumber} • {b.travelClass}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    {b.source} → {b.destination}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{b.journeyDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : b.bookingStatus === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition"
                      title="Inspect E-Ticket"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DigitalTicketModal
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};
