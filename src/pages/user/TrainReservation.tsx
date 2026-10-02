import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Train as TrainType, Booking } from '../../types';
import { Train, Search, Filter, Calendar, Clock, MapPin, ArrowRight, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import { BookingCheckoutModal } from './BookingCheckoutModal';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

interface TrainReservationProps {
  initialSearch?: any;
}

export const TrainReservation: React.FC<TrainReservationProps> = ({ initialSearch }) => {
  const [sourceQuery, setSourceQuery] = useState(initialSearch?.source || 'New Delhi (NDLS)');
  const [destQuery, setDestQuery] = useState(initialSearch?.destination || 'Varanasi Jn (BSB)');
  const [journeyDate, setJourneyDate] = useState(initialSearch?.journeyDate || '2026-10-15');
  const [quota, setQuota] = useState(initialSearch?.quota || 'GENERAL');
  const [passengerCount, setPassengerCount] = useState(initialSearch?.passengers || 1);
  const [classFilter, setClassFilter] = useState(initialSearch?.travelClass || 'ALL');

  // Additional Filters
  const [selectedTrainType, setSelectedTrainType] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [departureTimeFilter, setDepartureTimeFilter] = useState('ALL');

  // Selection state
  const [selectedTrain, setSelectedTrain] = useState<TrainType | null>(null);
  const [selectedClassCode, setSelectedClassCode] = useState<string>('2A');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const allTrains = DatabaseStorage.getTrains();

  const swapStations = () => {
    const temp = sourceQuery;
    setSourceQuery(destQuery);
    setDestQuery(temp);
  };

  // Filtered trains
  const filteredTrains = useMemo(() => {
    return allTrains.filter(train => {
      if (sourceQuery && !train.source.toLowerCase().includes(sourceQuery.toLowerCase())) {
        // Also check partial matching
        const q = sourceQuery.split(' ')[0].toLowerCase();
        if (!train.source.toLowerCase().includes(q)) return false;
      }
      if (destQuery && !train.destination.toLowerCase().includes(destQuery.toLowerCase())) {
        const q = destQuery.split(' ')[0].toLowerCase();
        if (!train.destination.toLowerCase().includes(q)) return false;
      }
      if (selectedTrainType !== 'ALL' && train.trainType !== selectedTrainType) return false;

      const lowestFare = Math.min(...train.classes.map(c => c.fare));
      if (lowestFare > maxPrice) return false;

      const hour = parseInt(train.departureTime.split(':')[0], 10);
      if (departureTimeFilter === 'MORNING' && (hour < 6 || hour >= 12)) return false;
      if (departureTimeFilter === 'AFTERNOON' && (hour < 12 || hour >= 17)) return false;
      if (departureTimeFilter === 'EVENING' && (hour < 17 || hour >= 24)) return false;

      return true;
    });
  }, [allTrains, sourceQuery, destQuery, selectedTrainType, maxPrice, departureTimeFilter]);

  // Deterministic coach seat map
  const coachSeats = useMemo(() => {
    if (!selectedTrain) return [];
    const seats = [];
    const prefix = selectedClassCode === '1A' ? 'H1' : selectedClassCode === '2A' ? 'A1' : selectedClassCode === '3A' ? 'B1' : 'S1';
    for (let i = 1; i <= 24; i++) {
      const seatNo = `${prefix}-${i < 10 ? '0' + i : i}`;
      const isBooked = [3, 7, 8, 12, 15, 19, 21].includes(i);
      seats.push({
        seatNumber: seatNo,
        isBooked,
        tier: selectedClassCode,
        category: i % 4 === 1 || i % 4 === 0 ? 'WINDOW' : 'AISLE'
      });
    }
    return seats;
  }, [selectedTrain, selectedClassCode]);

  const handleSeatClick = (seatNo: string, isBooked: boolean) => {
    if (isBooked) return;
    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      if (selectedSeats.length >= passengerCount) {
        setSelectedSeats([...selectedSeats.slice(1), seatNo]);
      } else {
        setSelectedSeats([...selectedSeats, seatNo]);
      }
    }
  };

  const handleOpenTrainModal = (train: TrainType) => {
    setSelectedTrain(train);
    setSelectedClassCode(train.classes[0].code);
    setSelectedSeats([]);
  };

  const currentClassObj = selectedTrain?.classes.find(c => c.code === selectedClassCode);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
          <Train className="w-4 h-4 text-[#213d77]" />
          <span>IRCTC Indian Railways e-Ticketing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
          Train Ticket Reservation
        </h1>
        <p className="text-xs text-slate-500">
          Book confirmed train berths with real-time seat availability status across Vande Bharat, Rajdhani, and Superfast express trains.
        </p>
      </div>

      {/* IRCTC Style Search Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">From Station</label>
            <input
              type="text"
              value={sourceQuery}
              onChange={(e) => setSourceQuery(e.target.value)}
              placeholder="e.g. New Delhi (NDLS)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-1 flex justify-center pt-4">
            <button
              type="button"
              onClick={swapStations}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-[#213d77] transition shadow-sm"
              title="Swap Stations"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">To Station</label>
            <input
              type="text"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              placeholder="e.g. Varanasi Jn (BSB)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Date</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quota & Passengers</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={quota}
                onChange={(e) => setQuota(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50"
              >
                <option value="GENERAL">GENERAL</option>
                <option value="TATKAL">TATKAL</option>
                <option value="PREMIUM_TATKAL">PREM TATKAL</option>
                <option value="LADIES">LADIES</option>
              </select>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-slate-50"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <select
              value={selectedTrainType}
              onChange={(e) => setSelectedTrainType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white"
            >
              <option value="ALL">All Train Categories</option>
              <option value="Vande Bharat">Vande Bharat Express</option>
              <option value="Rajdhani Express">Rajdhani Express</option>
              <option value="Superfast">Superfast / Shatabdi</option>
              <option value="Express">Mail / Express</option>
              <option value="Duronto">Duronto Express</option>
            </select>

            <select
              value={departureTimeFilter}
              onChange={(e) => setDepartureTimeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white"
            >
              <option value="ALL">Any Departure Time</option>
              <option value="MORNING">Early Morning (06:00 - 12:00)</option>
              <option value="AFTERNOON">Afternoon (12:00 - 17:00)</option>
              <option value="EVENING">Evening / Night (17:00 - 24:00)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>Max Fare: <strong>₹{maxPrice}</strong></span>
            <input
              type="range"
              min="500"
              max="6000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-[#fb792b]"
            />
          </div>
        </div>
      </div>

      {/* Train Results List in Authentic IRCTC Card Style */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Found <strong>{filteredTrains.length}</strong> scheduled trains between stations</span>
          <span>Date: <strong>{journeyDate}</strong> • Quota: <strong>{quota}</strong></span>
        </div>

        {filteredTrains.length > 0 ? (
          filteredTrains.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm bg-blue-50 text-[#213d77] px-2.5 py-1 rounded-lg border border-blue-100">
                    #{train.trainNumber}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-[#213d77]">
                    {train.trainName.toUpperCase()}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {train.trainType}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">
                    Runs On: <strong className="text-slate-800">{train.runsOn.join(' ')}</strong>
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    • {train.status === 'ON_TIME' ? 'On Time' : 'Delayed'}
                  </span>
                </div>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <div className="text-xl font-bold text-slate-900">{train.departureTime}</div>
                  <div className="text-xs font-semibold text-slate-700">{train.source}</div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-semibold text-slate-500">{train.duration}</span>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#fb792b]" />
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <div className="w-2 h-2 rounded-full bg-[#213d77]" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Daily Service</span>
                </div>

                <div className="md:text-right">
                  <div className="text-xl font-bold text-slate-900">{train.arrivalTime}</div>
                  <div className="text-xs font-semibold text-slate-700">{train.destination}</div>
                </div>
              </div>

              {/* Class Boxes & Availability (IRCTC Signature Style) */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {train.classes.map((cls) => (
                    <button
                      key={cls.code}
                      type="button"
                      onClick={() => {
                        setSelectedTrain(train);
                        setSelectedClassCode(cls.code);
                        setSelectedSeats([]);
                      }}
                      className={`p-3 rounded-2xl border text-left transition ${
                        selectedTrain?.id === train.id && selectedClassCode === cls.code
                          ? 'border-[#213d77] bg-blue-50/70 shadow-sm ring-2 ring-[#213d77]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-[#213d77]">{cls.code}</span>
                        <span className="font-bold text-slate-900">₹{cls.fare}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{cls.name}</div>
                      <div className="text-[11px] font-bold text-emerald-700 mt-1 bg-emerald-100/60 px-1.5 py-0.5 rounded inline-block">
                        AVAILABLE-{cls.availableSeats < 10 ? '000' + cls.availableSeats : '00' + cls.availableSeats}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Book CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleOpenTrainModal(train)}
                  className="px-6 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#e6681b] text-white font-black text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Select Coach Seat & Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Train className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No trains found for this route</h4>
            <p className="text-xs text-slate-500">Try searching New Delhi to Varanasi, or reset filters.</p>
            <button
              onClick={() => {
                setSourceQuery('New Delhi');
                setDestQuery('Varanasi');
                setSelectedTrainType('ALL');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Reset to Popular Route
            </button>
          </div>
        )}
      </div>

      {/* Visual Coach Seat Map Modal - Clean Light IRCTC Theme */}
      {selectedTrain && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#213d77] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">
                  IRCTC Visual Coach Seat Selection
                </div>
                <h3 className="text-base font-bold text-white">
                  {selectedTrain.trainName} (#{selectedTrain.trainNumber})
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrain(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                ✕
              </button>
            </div>

            {/* Coach Tier Tabs */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-700 shrink-0">Select Tier:</span>
              {selectedTrain.classes.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedClassCode(c.code);
                    setSelectedSeats([]);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedClassCode === c.code
                      ? 'bg-[#213d77] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.code} ({c.name}) - ₹{c.fare}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-500"></div>
                  <span className="text-slate-600 font-medium">🟢 Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-[#213d77] text-white flex items-center justify-center text-[9px] font-bold">
                    ✓
                  </div>
                  <span className="text-slate-600 font-medium">🔵 Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded bg-rose-50 border border-rose-300 text-rose-500 flex items-center justify-center text-[9px] font-bold">
                    ✕
                  </div>
                  <span className="text-slate-600 font-medium">🔴 Booked</span>
                </div>
              </div>

              <div className="text-slate-700 font-semibold">
                Required Seats: <strong>{passengerCount}</strong> | Selected: <strong className="text-[#fb792b]">{selectedSeats.length}</strong>
              </div>
            </div>

            {/* Visual Coach Grid */}
            <div className="p-6 bg-slate-100/70 max-h-[50vh] overflow-y-auto">
              <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                <div className="text-center font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4 font-bold">
                  --- 🚆 ENGINE DIRECTION (COACH {selectedClassCode}-1) ---
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {coachSeats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    return (
                      <button
                        key={seat.seatNumber}
                        disabled={seat.isBooked}
                        onClick={() => handleSeatClick(seat.seatNumber, seat.isBooked)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center font-mono relative ${
                          seat.isBooked
                            ? 'bg-rose-50 border-rose-200 text-rose-300 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-[#213d77] text-white border-[#213d77] shadow-md ring-2 ring-blue-300 scale-105'
                            : 'bg-emerald-50/50 border-emerald-300 hover:border-[#213d77] text-slate-800 hover:bg-emerald-100/60'
                        }`}
                      >
                        <span className="text-xs font-bold">{seat.seatNumber}</span>
                        <span className="text-[9px] text-slate-500 block mt-0.5">{seat.category}</span>
                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#fb792b] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="text-center font-mono text-[10px] text-slate-400 uppercase tracking-widest mt-4">
                  --- COACH VESTIBULE & WASHROOMS ---
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">
                  Fare per Seat: <strong>₹{currentClassObj?.fare || 0}</strong>
                </div>
                <div className="text-sm font-black text-slate-900">
                  Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTrain(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setCheckoutOpen(true)}
                  className="px-6 py-2 rounded-xl bg-[#fb792b] hover:bg-[#e6681b] disabled:opacity-50 text-white font-bold text-xs shadow transition"
                >
                  Proceed to Checkout ({selectedSeats.length} Seats)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && selectedTrain && currentClassObj && (
        <BookingCheckoutModal
          transportType="TRAIN"
          transportId={selectedTrain.id}
          transportNumber={selectedTrain.trainNumber}
          transportName={selectedTrain.trainName}
          source={selectedTrain.source}
          destination={selectedTrain.destination}
          journeyDate={journeyDate}
          departureTime={selectedTrain.departureTime}
          arrivalTime={selectedTrain.arrivalTime}
          travelClass={`${selectedClassCode} - ${currentClassObj.name}`}
          selectedSeats={selectedSeats}
          baseFarePerSeat={currentClassObj.fare}
          onClose={() => setCheckoutOpen(false)}
          onBookingSuccess={(booking) => {
            setCheckoutOpen(false);
            setSelectedTrain(null);
            setConfirmedBooking(booking);
          }}
        />
      )}

      <DigitalTicketModal
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </div>
  );
};
