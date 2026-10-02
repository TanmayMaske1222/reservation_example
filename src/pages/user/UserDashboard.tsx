import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { Booking } from '../../types';
import {
  Train,
  Plane,
  Bus,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Eye,
  Download,
  Ban,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

interface UserDashboardProps {
  onNavigate: (path: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  const loadData = () => {
    if (currentUser) {
      const userBookings = DatabaseStorage.getBookings().filter(b => b.userId === currentUser.id);
      setBookings(userBookings);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-600">Please sign in to view dashboard.</p>
        <button onClick={() => onNavigate('/login')} className="mt-4 px-5 py-2.5 bg-[#213d77] text-white rounded-xl font-bold text-xs">
          Sign In
        </button>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED');
  const upcomingJourney = upcomingBookings[0] || null;

  const totalBookingsCount = bookings.length;
  const trainBookingsCount = bookings.filter(b => b.transportType === 'TRAIN').length;
  const flightBookingsCount = bookings.filter(b => b.transportType === 'FLIGHT').length;
  const busBookingsCount = bookings.filter(b => b.transportType === 'BUS').length;
  const cancelledBookingsCount = bookings.filter(b => b.bookingStatus === 'CANCELLED').length;

  const handleCancelBooking = (bookingId: string) => {
    DatabaseStorage.updateBookingStatus(bookingId, 'CANCELLED');
    loadData();
    setSelectedTicket(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner - Clean Light Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#fb792b]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#fb792b]">IRCTC Traveler Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77] tracking-tight">
            Welcome, {currentUser.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your booked railway e-tickets, boarding passes, and schedule new journeys across India.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/user/trains')}
            className="px-4 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Train className="w-3.5 h-3.5 text-[#fb792b]" />
            <span>Book Train</span>
          </button>
          <button
            onClick={() => onNavigate('/user/flights')}
            className="px-4 py-2.5 rounded-xl bg-blue-50 text-[#213d77] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Book Flight</span>
          </button>
          <button
            onClick={() => onNavigate('/user/buses')}
            className="px-4 py-2.5 rounded-xl bg-orange-50 text-[#fb792b] hover:bg-orange-100 border border-orange-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Book Bus</span>
          </button>
        </div>
      </div>

      {/* Dashboard KPI Stat Cards - Crisp White with Subtle Borders */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-[#fb792b] uppercase tracking-wider">Upcoming Trips</div>
          <div className="text-2xl font-black text-slate-900">{upcomingBookings.length}</div>
          <div className="text-[10px] text-slate-500">Confirmed journeys</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bookings</div>
          <div className="text-2xl font-black text-slate-900">{totalBookingsCount}</div>
          <div className="text-[10px] text-slate-500">All-time bookings</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-[#213d77] uppercase tracking-wider flex items-center gap-1">
            <Train className="w-3 h-3 text-[#fb792b]" /> Trains
          </div>
          <div className="text-2xl font-black text-[#213d77]">{trainBookingsCount}</div>
          <div className="text-[10px] text-slate-500">Railway tickets</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <Plane className="w-3 h-3" /> Flights
          </div>
          <div className="text-2xl font-black text-slate-900">{flightBookingsCount}</div>
          <div className="text-[10px] text-slate-500">Air travel passes</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <Bus className="w-3 h-3" /> Buses
          </div>
          <div className="text-2xl font-black text-slate-900">{busBookingsCount}</div>
          <div className="text-[10px] text-slate-500">Volvo sleeper berths</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Cancelled</div>
          <div className="text-2xl font-black text-slate-900">{cancelledBookingsCount}</div>
          <div className="text-[10px] text-slate-500">Refunded passes</div>
        </div>
      </div>

      {/* Main Focus: Upcoming Journey Section - Crisp Light Style */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#213d77] flex items-center gap-2">
            <span>Next Upcoming Journey</span>
            <span className="w-2 h-2 rounded-full bg-[#fb792b]"></span>
          </h2>
          <button
            onClick={() => onNavigate('/user/bookings')}
            className="text-xs font-bold text-[#213d77] hover:text-[#fb792b] flex items-center gap-1 transition"
          >
            <span>View All Bookings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingJourney ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            {/* Badge & PNR */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#fb792b] border border-orange-200">
                  {upcomingJourney.transportType} CONFIRMED
                </span>
                <span className="text-xs text-slate-600 font-semibold">
                  Service: <strong className="text-slate-900">{upcomingJourney.transportNumber} • {upcomingJourney.transportName}</strong>
                </span>
              </div>
              <div className="font-mono text-xs bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 text-[#213d77]">
                PNR: <strong className="text-slate-900 text-sm font-black">{upcomingJourney.pnr}</strong>
              </div>
            </div>

            {/* Journey Route & Timings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Origin Boarding</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{upcomingJourney.source}</div>
                <div className="text-xs text-[#213d77] flex items-center gap-1.5 mt-1 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#fb792b]" />
                  <span>Departs: {upcomingJourney.departureTime}</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="text-xs text-slate-600 mb-1 flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#fb792b]" />
                  <span>{upcomingJourney.journeyDate}</span>
                </div>
                <div className="w-full flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fb792b]" />
                  <div className="h-0.5 flex-1 bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#213d77]" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">{upcomingJourney.transportName}</div>
              </div>

              <div className="md:text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Destination Drop</span>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{upcomingJourney.destination}</div>
                <div className="text-xs text-[#213d77] flex items-center gap-1.5 mt-1 font-bold md:justify-end">
                  <Clock className="w-3.5 h-3.5 text-[#fb792b]" />
                  <span>Arrival: {upcomingJourney.arrivalTime}</span>
                </div>
              </div>
            </div>

            {/* Passenger & Seats bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-600">Class: <strong className="text-slate-900">{upcomingJourney.travelClass}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">Allocated Seat(s): <strong className="text-blue-700 font-mono font-bold">{upcomingJourney.seats.join(', ')}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">Passengers: <strong className="text-slate-900">{upcomingJourney.passengers.length}</strong></span>
              </div>
              <div className="font-bold text-slate-900">
                Paid: <span className="text-[#213d77] font-black text-sm">₹{upcomingJourney.amount.toLocaleString('en-IN')}</span> ({upcomingJourney.paymentMethod})
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTicket(upcomingJourney)}
                  className="px-5 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Eye className="w-3.5 h-3.5 text-[#fb792b]" />
                  <span>View Ticket</span>
                </button>
                <button
                  onClick={() => setSelectedTicket(upcomingJourney)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  <span>Download Boarding Pass</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Cancel reservation ${upcomingJourney.pnr}? An 85% refund will be issued.`)) {
                    handleCancelBooking(upcomingJourney.id);
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-semibold border border-rose-200 transition flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Booking</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#fb792b] mx-auto flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Upcoming Journeys Scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don’t have any confirmed future travels. Search for trains, flights, or luxury buses to get started!
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => onNavigate('/user/trains')}
                className="px-5 py-2.5 rounded-xl bg-[#213d77] text-white text-xs font-bold"
              >
                Book a Train
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Booking History Table - Clean Light Theme */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#213d77]">Recent Booking Records</h3>
            <p className="text-xs text-slate-500">Overview of your most recent transactions across TS train_sys.</p>
          </div>
          <button
            onClick={() => onNavigate('/user/bookings')}
            className="text-xs font-bold text-[#fb792b] hover:underline"
          >
            Open My Bookings →
          </button>
        </div>

        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <th className="py-3 px-3 font-semibold">PNR</th>
                  <th className="py-3 px-3 font-semibold">Transport</th>
                  <th className="py-3 px-3 font-semibold">Route</th>
                  <th className="py-3 px-3 font-semibold">Journey Date</th>
                  <th className="py-3 px-3 font-semibold">Seats</th>
                  <th className="py-3 px-3 font-semibold">Fare</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#213d77]">{b.pnr}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.transportName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{b.transportNumber}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">{b.source} → {b.destination}</td>
                    <td className="py-3 px-3 text-slate-600">{b.journeyDate}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{b.seats.join(', ')}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">₹{b.amount}</td>
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
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#213d77] text-slate-700 transition"
                        title="View Ticket"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No bookings found on this account yet.</p>
        )}
      </div>

      <DigitalTicketModal
        booking={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onCancelBooking={handleCancelBooking}
      />
    </div>
  );
};
