import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Bus as BusType, Booking } from '../../types';
import { Bus, Search, Star, Clock, MapPin, ArrowRight, ShieldCheck, Wifi, Zap } from 'lucide-react';
import { BookingCheckoutModal } from './BookingCheckoutModal';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

interface BusReservationProps {
  initialSearch?: any;
}

export const BusReservation: React.FC<BusReservationProps> = ({ initialSearch }) => {
  const [sourceCity, setSourceCity] = useState(initialSearch?.source || '');
  const [destCity, setDestCity] = useState(initialSearch?.destination || '');
  const [journeyDate, setJourneyDate] = useState(initialSearch?.journeyDate || '2026-10-15');
  const [passengers, setPassengers] = useState(initialSearch?.passengers || 1);

  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [deckTab, setDeckTab] = useState<'LOWER' | 'UPPER'>('LOWER');
  const [selectedBerths, setSelectedBerths] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const allBuses = DatabaseStorage.getBuses();

  const filteredBuses = useMemo(() => {
    return allBuses.filter(b => {
      if (sourceCity && !b.source.toLowerCase().includes(sourceCity.toLowerCase())) return false;
      if (destCity && !b.destination.toLowerCase().includes(destCity.toLowerCase())) return false;
      return true;
    });
  }, [allBuses, sourceCity, destCity]);

  // Berth matrix for sleeper buses
  const lowerBerths = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
  const upperBerths = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12'];

  const handleBerthClick = (berthNo: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedBerths.includes(berthNo)) {
      setSelectedBerths(selectedBerths.filter(b => b !== berthNo));
    } else {
      if (selectedBerths.length >= passengers) {
        setSelectedBerths([...selectedBerths.slice(1), berthNo]);
      } else {
        setSelectedBerths([...selectedBerths, berthNo]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
          <Bus className="w-4 h-4 text-[#213d77]" />
          <span>IRCTC Bus • Interstate Roadways</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
          Book Luxury Volvo & AC Sleeper Buses
        </h1>
        <p className="text-xs text-slate-500">
          Book state transport RTC and private Volvo multi-axle sleeper buses with live GPS tracking.
        </p>
      </div>

      {/* Search Widget */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">From City</label>
            <input
              type="text"
              value={sourceCity}
              onChange={(e) => setSourceCity(e.target.value)}
              placeholder="e.g. New Delhi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">To City</label>
            <input
              type="text"
              value={destCity}
              onChange={(e) => setDestCity(e.target.value)}
              placeholder="e.g. Manali"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Journey Date</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Passengers</label>
            <select
              value={passengers}
              onChange={(e) => {
                setPassengers(Number(e.target.value));
                setSelectedBerths([]);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {}}
              className="w-full py-2.5 px-4 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" />
              <span>Search Buses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Available Intercity Buses: <strong>{filteredBuses.length}</strong></span>
          <span>Date: <strong>{journeyDate}</strong></span>
        </div>

        <div className="space-y-4">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{bus.operator}</h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {bus.busNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-[#213d77] border border-blue-200">
                      {bus.busType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {bus.ratings}
                    </span>
                    <span>•</span>
                    <span>Amenities: {bus.amenities.slice(0, 3).join(', ')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-[#213d77]">₹{bus.fare}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">{bus.availableSeats} berths left</div>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-xl font-bold text-slate-900">{bus.departureTime}</div>
                  <div className="text-xs text-slate-600 font-medium">{bus.source}</div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-slate-400">{bus.duration}</span>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#fb792b]" />
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-[#213d77]" />
                  </div>
                  <span className="text-[10px] text-[#213d77] font-semibold">AC Express Coach</span>
                </div>

                <div className="md:text-right">
                  <div className="text-xl font-bold text-slate-900">{bus.arrivalTime}</div>
                  <div className="text-xs text-slate-600 font-medium">{bus.destination}</div>
                </div>
              </div>

              {/* Bottom Trigger */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedBus(bus);
                    setSelectedBerths([]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                >
                  <span>Select Sleeper Berths</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Sleeper Berth Selector Modal */}
      {selectedBus && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#f8f9fc] px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <div>
                <div className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider">
                  Interactive Sleeper Berth Matrix
                </div>
                <h3 className="text-base font-black text-[#213d77]">
                  {selectedBus.operator} ({selectedBus.busNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            {/* Deck Selector Tabs */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <button
                  onClick={() => setDeckTab('LOWER')}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    deckTab === 'LOWER' ? 'bg-[#213d77] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Lower Deck (Berths L1 - L12)
                </button>
                <button
                  onClick={() => setDeckTab('UPPER')}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    deckTab === 'UPPER' ? 'bg-[#213d77] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Upper Deck (Berths U1 - U12)
                </button>
              </div>
              <div className="font-bold text-slate-700">
                Fare: ₹{selectedBus.fare} / berth
              </div>
            </div>

            {/* Matrix Diagram */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="text-slate-600">
                  Select <strong>{passengers}</strong> berth(s). Chosen: <strong>{selectedBerths.join(', ') || 'None'}</strong>
                </span>
                <span className="text-slate-400">Rear ➔ Driver Front</span>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-3 rounded bg-slate-100 border border-slate-300"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-3 rounded bg-[#fb792b] text-white"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-3 rounded bg-slate-300 text-slate-500"></div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Berth Grid */}
              <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-6 gap-2.5">
                  {(deckTab === 'LOWER' ? lowerBerths : upperBerths).map((berth) => {
                    const isBooked = ['L2', 'L5', 'L9', 'U3', 'U7', 'U10'].includes(berth);
                    const isSelected = selectedBerths.includes(berth);

                    return (
                      <button
                        key={berth}
                        disabled={isBooked}
                        onClick={() => handleBerthClick(berth, isBooked)}
                        className={`h-14 rounded-xl border flex flex-col items-center justify-center transition p-1 ${
                          isBooked
                            ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#fb792b] text-white border-orange-600 shadow-xs'
                            : 'bg-white border-slate-300 hover:border-[#213d77] text-slate-800'
                        }`}
                      >
                        <span className="text-xs font-bold">{berth}</span>
                        <span className="text-[9px] uppercase opacity-75">
                          {isBooked ? 'Taken' : isSelected ? 'Yours' : 'Berth'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Total Payable</div>
                  <div className="text-xl font-black text-[#213d77]">
                    ₹{selectedBus.fare * (selectedBerths.length || passengers)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBus(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={selectedBerths.length === 0}
                    onClick={() => {
                      setCheckoutOpen(true);
                    }}
                    className="px-6 py-2 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                  >
                    Proceed to Passenger Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && selectedBus && (
        <BookingCheckoutModal
          transportType="BUS"
          transportId={selectedBus.id}
          transportNumber={selectedBus.busNumber}
          transportName={selectedBus.operator}
          source={selectedBus.source}
          destination={selectedBus.destination}
          journeyDate={journeyDate}
          departureTime={selectedBus.departureTime}
          arrivalTime={selectedBus.arrivalTime}
          travelClass={selectedBus.busType}
          selectedSeats={selectedBerths}
          baseFarePerSeat={selectedBus.fare}
          onClose={() => setCheckoutOpen(false)}
          onBookingSuccess={(booking) => {
            setCheckoutOpen(false);
            setSelectedBus(null);
            setConfirmedBooking(booking);
          }}
        />
      )}

      {/* Ticket Success Modal */}
      {confirmedBooking && (
        <DigitalTicketModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
};
