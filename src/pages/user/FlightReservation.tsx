import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Flight as FlightType, Booking } from '../../types';
import { Plane, Search, Filter, Calendar, Clock, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { BookingCheckoutModal } from './BookingCheckoutModal';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

interface FlightReservationProps {
  initialSearch?: any;
}

export const FlightReservation: React.FC<FlightReservationProps> = ({ initialSearch }) => {
  const [sourceAirport, setSourceAirport] = useState(initialSearch?.source || '');
  const [destAirport, setDestAirport] = useState(initialSearch?.destination || '');
  const [journeyDate, setJourneyDate] = useState(initialSearch?.journeyDate || '2026-10-18');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(initialSearch?.passengers || 1);
  const [travelClass, setTravelClass] = useState<string>('ECONOMY');

  // Filter
  const [airlineFilter, setAirlineFilter] = useState('ALL');

  // Selection
  const [selectedFlight, setSelectedFlight] = useState<FlightType | null>(null);
  const [selectedCabinSeats, setSelectedCabinSeats] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const allFlights = DatabaseStorage.getFlights();

  const filteredFlights = useMemo(() => {
    return allFlights.filter(f => {
      if (sourceAirport && !f.source.toLowerCase().includes(sourceAirport.toLowerCase()) && !f.sourceAirport.toLowerCase().includes(sourceAirport.toLowerCase())) return false;
      if (destAirport && !f.destination.toLowerCase().includes(destAirport.toLowerCase()) && !f.destinationAirport.toLowerCase().includes(destAirport.toLowerCase())) return false;
      if (airlineFilter !== 'ALL' && f.airlineCode !== airlineFilter) return false;
      return true;
    });
  }, [allFlights, sourceAirport, destAirport, airlineFilter]);

  // Cabin seat map generation
  const cabinRows = [10, 11, 12, 14, 15, 16];
  const cabinColumns = ['A', 'B', 'C', 'D', 'E', 'F'];

  const handleSeatClick = (seatNo: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedCabinSeats.includes(seatNo)) {
      setSelectedCabinSeats(selectedCabinSeats.filter(s => s !== seatNo));
    } else {
      if (selectedCabinSeats.length >= passengers) {
        setSelectedCabinSeats([...selectedCabinSeats.slice(1), seatNo]);
      } else {
        setSelectedCabinSeats([...selectedCabinSeats, seatNo]);
      }
    }
  };

  const currentClassObj = selectedFlight?.classes.find(c => c.code === travelClass) || selectedFlight?.classes[0];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
          <Plane className="w-4 h-4 text-[#213d77]" />
          <span>IRCTC Air • Civil Aviation Reservation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
          Domestic & Express Flight Booking
        </h1>
        <p className="text-xs text-slate-500">
          Book verified flight tickets with zero convenience fee on defense and government quotas via IRCTC Air.
        </p>
      </div>

      {/* Flight Search Widget */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">From Airport</label>
            <input
              type="text"
              value={sourceAirport}
              onChange={(e) => setSourceAirport(e.target.value)}
              placeholder="e.g. Delhi (DEL)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">To Airport</label>
            <input
              type="text"
              value={destAirport}
              onChange={(e) => setDestAirport(e.target.value)}
              placeholder="e.g. Mumbai (BOM)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Departure Date</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Passengers & Class</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Pax</option>)}
              </select>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Prem Econ</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
          </div>
        </div>

        {/* Airline Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Airline:
          </span>
          {[
            { code: 'ALL', name: 'All Airlines' },
            { code: '6E', name: 'IndiGo' },
            { code: 'AI', name: 'Air India' },
            { code: 'UK', name: 'Vistara' },
            { code: 'SG', name: 'SpiceJet' }
          ].map(a => (
            <button
              key={a.code}
              onClick={() => setAirlineFilter(a.code)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                airlineFilter === a.code ? 'bg-[#213d77] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Flight Results */}
      <div className="space-y-4">
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredFlights.length}</strong> available flights for <strong>{journeyDate}</strong>
        </div>

        {filteredFlights.map((flight) => {
          const classObj = flight.classes.find(c => c.code === travelClass) || flight.classes[0];
          return (
            <div
              key={flight.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#213d77] font-bold flex items-center justify-center text-xs">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{flight.airline}</h3>
                    <div className="text-[11px] text-slate-500 font-mono">Flight No: {flight.flightNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Refundable Fares
                  </span>
                  <span className="text-slate-500">• {flight.status === 'ON_TIME' ? 'On-Time' : 'Boarding'}</span>
                </div>
              </div>

              {/* Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-xl font-bold text-slate-900">{flight.departureTime}</div>
                  <div className="text-xs font-bold text-slate-700">{flight.sourceAirport}</div>
                  <div className="text-[10px] text-slate-500">{flight.source}</div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-500">{flight.duration}</span>
                  <div className="w-full flex items-center gap-1 my-1">
                    <div className="w-2 h-2 rounded-full bg-[#fb792b]" />
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-[#213d77]" />
                  </div>
                  <span className="text-[10px] text-[#213d77] font-semibold">{flight.stops}</span>
                </div>

                <div className="sm:text-right">
                  <div className="text-xl font-bold text-slate-900">{flight.arrivalTime}</div>
                  <div className="text-xs font-bold text-slate-700">{flight.destinationAirport}</div>
                  <div className="text-[10px] text-slate-500">{flight.destination}</div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 gap-3">
                <div className="text-xs text-slate-600">
                  Fare ({classObj.name}): <strong className="text-lg font-black text-[#213d77]">₹{classObj.fare}</strong> / pax
                  <span className="ml-2 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                    {classObj.seatsLeft} Seats Left
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelectedFlight(flight);
                    setSelectedCabinSeats([]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Select Cabin Seat & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cabin Seat Selection Drawer Modal */}
      {selectedFlight && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#f8f9fc] px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <div>
                <div className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider">
                  Select Cabin Seats
                </div>
                <h3 className="text-base font-black text-[#213d77]">
                  {selectedFlight.airline} {selectedFlight.flightNumber} ({selectedFlight.sourceAirport} → {selectedFlight.destinationAirport})
                </h3>
              </div>
              <button
                onClick={() => setSelectedFlight(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                <span className="text-slate-600">
                  Select <strong>{passengers}</strong> seat(s). Selected: <strong>{selectedCabinSeats.join(', ') || 'None'}</strong>
                </span>
                <div className="text-[#213d77] font-bold">
                  Class: {travelClass} (₹{currentClassObj?.fare}/seat)
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#fb792b] text-white"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-slate-300 text-slate-500"></div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Aircraft Cabin Grid */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-center font-bold text-xs text-slate-500 uppercase tracking-widest pb-2">
                  Front of Aircraft (Cockpit)
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  {cabinRows.map(row => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      <div className="flex gap-1.5">
                        {['A', 'B', 'C'].map(col => {
                          const seatNo = `${row}${col}`;
                          const isBooked = [ '10A', '10C', '12B', '15F', '16A' ].includes(seatNo);
                          const isSelected = selectedCabinSeats.includes(seatNo);
                          return (
                            <button
                              key={seatNo}
                              disabled={isBooked}
                              onClick={() => handleSeatClick(seatNo, isBooked)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                                isBooked
                                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#fb792b] text-white border-orange-600 shadow-xs'
                                  : 'bg-white border-slate-300 hover:border-[#213d77] text-slate-800'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>

                      <div className="w-6 text-center font-mono text-xs font-bold text-slate-500">
                        {row}
                      </div>

                      <div className="flex gap-1.5">
                        {['D', 'E', 'F'].map(col => {
                          const seatNo = `${row}${col}`;
                          const isBooked = [ '10D', '11E', '14D', '15C' ].includes(seatNo);
                          const isSelected = selectedCabinSeats.includes(seatNo);
                          return (
                            <button
                              key={seatNo}
                              disabled={isBooked}
                              onClick={() => handleSeatClick(seatNo, isBooked)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center border ${
                                isBooked
                                  ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#fb792b] text-white border-orange-600 shadow-xs'
                                  : 'bg-white border-slate-300 hover:border-[#213d77] text-slate-800'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Estimated Total</div>
                  <div className="text-lg font-black text-[#213d77]">
                    ₹{(currentClassObj?.fare || 4500) * (selectedCabinSeats.length || passengers)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFlight(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={selectedCabinSeats.length === 0}
                    onClick={() => {
                      setCheckoutOpen(true);
                    }}
                    className="px-6 py-2 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
                  >
                    Continue to Passenger Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && selectedFlight && currentClassObj && (
        <BookingCheckoutModal
          transportType="FLIGHT"
          transportId={selectedFlight.id}
          transportNumber={selectedFlight.flightNumber}
          transportName={selectedFlight.airline}
          source={selectedFlight.sourceAirport}
          destination={selectedFlight.destinationAirport}
          journeyDate={journeyDate}
          departureTime={selectedFlight.departureTime}
          arrivalTime={selectedFlight.arrivalTime}
          travelClass={travelClass}
          selectedSeats={selectedCabinSeats}
          baseFarePerSeat={currentClassObj.fare}
          onClose={() => setCheckoutOpen(false)}
          onBookingSuccess={(booking) => {
            setCheckoutOpen(false);
            setSelectedFlight(null);
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
