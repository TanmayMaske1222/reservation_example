import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { Booking } from '../../types';
import { Train, Plane, Bus, Search, Calendar, Clock, MapPin, Ticket, Eye, Download, Printer, Ban, CheckCircle2, AlertCircle } from 'lucide-react';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

export const MyBookingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const loadData = () => {
    if (currentUser) {
      const list = DatabaseStorage.getBookings().filter(b => b.userId === currentUser.id);
      setBookings(list);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Tab filter
      if (activeTab === 'UPCOMING' && b.bookingStatus !== 'CONFIRMED') return false;
      if (activeTab === 'COMPLETED' && b.bookingStatus !== 'COMPLETED') return false;
      if (activeTab === 'CANCELLED' && b.bookingStatus !== 'CANCELLED') return false;

      // Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesPnr = b.pnr.toLowerCase().includes(q);
        const matchesName = b.transportName.toLowerCase().includes(q);
        const matchesRoute = `${b.source} ${b.destination}`.toLowerCase().includes(q);
        if (!matchesPnr && !matchesName && !matchesRoute) return false;
      }

      return true;
    });
  }, [bookings, activeTab, searchQuery]);

  const handleCancel = (bookingId: string) => {
    DatabaseStorage.updateBookingStatus(bookingId, 'CANCELLED');
    loadData();
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
          <Ticket className="w-4 h-4 text-[#213d77]" />
          <span>IRCTC Passenger Reservation History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
          My Bookings & PNR Enquiry
        </h1>
        <p className="text-xs text-slate-500">
          Access confirmed Electronic Reservation Slips (ERS), view boarding passes, or initiate ticket cancellations.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Trips' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-white text-[#213d77] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by PNR, train/flight name..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>
      </div>

      {/* Bookings Cards List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4"
            >
              {/* Card Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0">
                    {b.transportType === 'TRAIN' && <Train className="w-5 h-5 text-[#fb792b]" />}
                    {b.transportType === 'FLIGHT' && <Plane className="w-5 h-5 text-[#fb792b]" />}
                    {b.transportType === 'BUS' && <Bus className="w-5 h-5 text-[#fb792b]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{b.transportName}</h3>
                      <span className="font-mono text-xs font-bold text-[#213d77] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {b.transportNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Class: <strong className="text-slate-800">{b.travelClass}</strong> • Booked on: {new Date(b.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">PNR NUMBER</span>
                    <span className="font-mono font-black text-sm text-[#213d77]">{b.pnr}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    b.bookingStatus === 'CONFIRMED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : b.bookingStatus === 'CANCELLED'
                      ? 'bg-rose-50 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {b.bookingStatus}
                  </span>
                </div>
              </div>

              {/* Route & Timings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{b.source}</div>
                  <div className="text-xs text-[#213d77] font-semibold mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departs: {b.departureTime}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-slate-500 flex items-center gap-1 font-medium mb-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.journeyDate}</span>
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#fb792b]" />
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-[#213d77]" />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Allocated: <strong className="text-[#213d77] font-mono">{b.seats.join(', ')}</strong></div>
                </div>

                <div className="md:text-right">
                  <div className="text-sm font-bold text-slate-900">{b.destination}</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1 md:justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Arrival: {b.arrivalTime}</span>
                  </div>
                </div>
              </div>

              {/* Passenger strip & Amount */}
              <div className="p-3 bg-[#f8fafc] rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-600">
                  Passengers ({b.passengers.length}):{' '}
                  <strong className="text-slate-800">
                    {b.passengers.map(p => `${p.name} (${p.seatNumber})`).join(', ')}
                  </strong>
                </div>

                <div className="font-bold text-slate-900">
                  Amount Paid: <span className="text-[#213d77]">₹{b.amount.toLocaleString('en-IN')}</span> ({b.paymentMethod})
                </div>
              </div>

              {/* Action Buttons: View Ticket | Download | Print | Cancel */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="px-4 py-2 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#fb792b]" />
                    <span>View Ticket</span>
                  </button>

                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#213d77]" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#213d77]" />
                    <span>Print</span>
                  </button>
                </div>

                {b.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={() => {
                      if (confirm(`Confirm cancellation of PNR ${b.pnr}? Refund will be processed as per Indian Railways rules.`)) {
                        handleCancel(b.id);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Ticket</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No bookings found</h4>
            <p className="text-xs text-slate-500">You do not have any trips matching the selected criteria.</p>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <DigitalTicketModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onCancelBooking={(id) => handleCancel(id)}
        />
      )}
    </div>
  );
};
