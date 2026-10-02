import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Booking } from '../../types';
import { Ticket, Search, Filter, Eye, Ban, CheckCircle2, X, CreditCard, Shield, Clock, Users, Train, Plane, Bus } from 'lucide-react';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => DatabaseStorage.getBookings());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'TRAIN' | 'FLIGHT' | 'BUS'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'>('ALL');

  // Modals
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [inspectBooking, setInspectBooking] = useState<Booking | null>(null);

  const refreshData = () => {
    setBookings(DatabaseStorage.getBookings());
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (typeFilter !== 'ALL' && b.transportType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const m1 = b.pnr.toLowerCase().includes(q);
        const m2 = b.id.toLowerCase().includes(q);
        const m3 = b.userName.toLowerCase().includes(q);
        const m4 = b.userEmail.toLowerCase().includes(q);
        const m5 = b.transportName.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3 && !m4 && !m5) return false;
      }
      return true;
    });
  }, [bookings, typeFilter, statusFilter, searchQuery]);

  const handleUpdateStatus = (id: string, status: Booking['bookingStatus']) => {
    DatabaseStorage.updateBookingStatus(id, status);
    refreshData();
    if (inspectBooking && inspectBooking.id === id) {
      setInspectBooking(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <Ticket className="w-4 h-4 text-[#213d77]" />
            <span>Central Passenger Reservation Manifest</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            System Reservations Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit reservations across rail, flight, and bus networks, override seat status, and monitor payment settlements.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-700 bg-white border border-slate-300 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-xs">
          Total Manifest Count: <strong className="text-[#213d77]">{bookings.length}</strong>
        </div>
      </div>

      {/* Filter Toolbar - Clean Light */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by PNR, passenger, email, service..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Transport filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['ALL', 'TRAIN', 'FLIGHT', 'BUS'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  typeFilter === t ? 'bg-[#213d77] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Reservations Table - Crisp White */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9fc] text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-4 font-bold">Booking ID / PNR</th>
                <th className="py-3.5 px-4 font-bold">Passenger</th>
                <th className="py-3.5 px-4 font-bold">Service / Mode</th>
                <th className="py-3.5 px-4 font-bold">Route</th>
                <th className="py-3.5 px-4 font-bold">Journey Date</th>
                <th className="py-3.5 px-4 font-bold">Allocated Berths</th>
                <th className="py-3.5 px-4 font-bold">Fare (₹)</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-bold text-[#213d77] block">{b.pnr}</span>
                    <span className="text-[10px] text-slate-400">{b.id}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.userName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{b.userEmail}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.transportType === 'TRAIN'
                        ? 'bg-blue-50 text-[#213d77] border border-blue-200'
                        : b.transportType === 'FLIGHT'
                        ? 'bg-blue-50 text-[#213d77] border border-blue-200'
                        : 'bg-blue-50 text-[#213d77] border border-blue-200'
                    }`}>
                      {b.transportType}
                    </span>
                    <div className="font-semibold text-slate-900 mt-1">{b.transportName} ({b.transportNumber})</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-slate-900 font-medium">{b.source}</div>
                    <div className="text-[10px] text-slate-500">to {b.destination}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    <div>{b.journeyDate}</div>
                    <div className="text-[10px] text-slate-400">{b.departureTime}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#213d77]">
                    {b.seats.join(', ')}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : b.bookingStatus === 'CANCELLED'
                        ? 'bg-rose-50 text-rose-800 border border-rose-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setInspectBooking(b)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Inspect Details & Passengers"
                    >
                      <Users className="w-3.5 h-3.5 text-[#213d77]" />
                    </button>
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="View E-Ticket"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#fb792b]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Booking & Passenger Details Modal */}
      {inspectBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider font-mono">
                  Administrative Booking Dossier
                </span>
                <h3 className="text-base font-black text-[#213d77]">
                  Reservation {inspectBooking.pnr} ({inspectBooking.transportName})
                </h3>
              </div>
              <button onClick={() => setInspectBooking(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Traveler & Route */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f8f9fc] p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Booked By:</span>
                <div className="font-bold text-slate-900 mt-0.5">{inspectBooking.userName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{inspectBooking.userEmail} • {inspectBooking.userPhone}</div>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Service Route:</span>
                <div className="font-bold text-slate-900 mt-0.5">{inspectBooking.source} → {inspectBooking.destination}</div>
                <div className="text-[#213d77] font-semibold text-[11px]">{inspectBooking.journeyDate} at {inspectBooking.departureTime}</div>
              </div>
            </div>

            {/* Passenger Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Passenger Allocation ({inspectBooking.passengers.length})
              </h4>
              <div className="space-y-2">
                {inspectBooking.passengers.map((p, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{i + 1}. {p.name}</span>
                      <span className="text-slate-500 ml-2">({p.age} yrs, {p.gender})</span>
                    </div>
                    <span className="font-mono font-bold text-[#213d77] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      Berth: {p.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Record */}
            <div className="p-3.5 bg-[#f8f9fc] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Payment Status: </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{inspectBooking.paymentStatus}</span>
                <span className="text-slate-500 font-mono ml-2">Txn: {inspectBooking.transactionId}</span>
              </div>
              <div className="font-mono font-bold text-slate-900">
                Total Paid: ₹{inspectBooking.amount}
              </div>
            </div>

            {/* Admin Override Actions */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {inspectBooking.bookingStatus !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleUpdateStatus(inspectBooking.id, 'CONFIRMED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Booking</span>
                  </button>
                )}
                {inspectBooking.bookingStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(inspectBooking.id, 'CANCELLED')}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel & Refund</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setInspectBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      <DigitalTicketModal
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};
