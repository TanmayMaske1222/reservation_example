import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Flight } from '../../types';
import { Plane, Search, Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export const AdminFlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>(() => DatabaseStorage.getFlights());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);

  // Form
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('IndiGo Airlines');
  const [airlineCode, setAirlineCode] = useState('6E');
  const [source, setSource] = useState('');
  const [sourceAirport, setSourceAirport] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationAirport, setDestinationAirport] = useState('');
  const [departureTime, setDepartureTime] = useState('09:00');
  const [arrivalTime, setArrivalTime] = useState('11:15');
  const [duration, setDuration] = useState('2h 15m');
  const [stops, setStops] = useState<'Non-stop' | '1 Stop'>('Non-stop');
  const [fare, setFare] = useState(4500);

  const refreshData = () => {
    setFlights(DatabaseStorage.getFlights());
  };

  const filtered = useMemo(() => {
    return flights.filter(f => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const m1 = f.flightNumber.toLowerCase().includes(q);
        const m2 = f.airline.toLowerCase().includes(q);
        const m3 = `${f.source} ${f.destination}`.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }
      return true;
    });
  }, [flights, searchQuery]);

  const openAdd = () => {
    setEditingFlight(null);
    setFlightNumber('AI-502');
    setAirline('Air India');
    setAirlineCode('AI');
    setSource('Mumbai');
    setSourceAirport('Chhatrapati Shivaji Maharaj Airport (BOM)');
    setDestination('Goa');
    setDestinationAirport('Manohar International Airport (GOX)');
    setDepartureTime('10:30');
    setArrivalTime('11:45');
    setDuration('1h 15m');
    setStops('Non-stop');
    setFare(3800);
    setModalOpen(true);
  };

  const openEdit = (f: Flight) => {
    setEditingFlight(f);
    setFlightNumber(f.flightNumber);
    setAirline(f.airline);
    setAirlineCode(f.airlineCode);
    setSource(f.source);
    setSourceAirport(f.sourceAirport);
    setDestination(f.destination);
    setDestinationAirport(f.destinationAirport);
    setDepartureTime(f.departureTime);
    setArrivalTime(f.arrivalTime);
    setDuration(f.duration);
    setStops(f.stops as any);
    setFare(f.classes[0]?.fare || 4000);
    setModalOpen(true);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Delete flight sector ${code}?`)) {
      DatabaseStorage.deleteFlight(id);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFlight) {
      const updated: Flight = {
        ...editingFlight,
        flightNumber,
        airline,
        airlineCode,
        source,
        sourceAirport,
        destination,
        destinationAirport,
        departureTime,
        arrivalTime,
        duration,
        stops,
        classes: [
          { code: 'ECONOMY', name: 'Economy', fare, seatsLeft: 45 },
          { code: 'BUSINESS', name: 'Business', fare: Math.round(fare * 2.8), seatsLeft: 8 }
        ]
      };
      DatabaseStorage.saveFlight(updated);
    } else {
      const newFlt: Flight = {
        id: `flt_${Date.now()}`,
        flightNumber,
        airline,
        airlineCode,
        source,
        sourceAirport,
        destination,
        destinationAirport,
        departureTime,
        arrivalTime,
        duration,
        stops,
        classes: [
          { code: 'ECONOMY', name: 'Economy', fare, seatsLeft: 60 },
          { code: 'BUSINESS', name: 'Business', fare: Math.round(fare * 2.8), seatsLeft: 12 }
        ],
        status: 'ON_TIME'
      };
      DatabaseStorage.saveFlight(newFlt);
    }
    setModalOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <Plane className="w-4 h-4 text-[#213d77]" />
            <span>Aviation Sector Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Flight Schedule & Air Carrier Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit domestic flight schedules, terminal gates, fare classes, and baggage policies.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#fb792b]" />
          <span>Add New Flight</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flights by carrier, number, airport..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Total Flights: <strong className="text-slate-900">{flights.length}</strong>
        </div>
      </div>

      {/* Flight Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4">Flight & Carrier</th>
                <th className="py-3.5 px-4">Sector Airports</th>
                <th className="py-3.5 px-4">Timings & Duration</th>
                <th className="py-3.5 px-4">Stops</th>
                <th className="py-3.5 px-4">Economy Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-blue-700 text-xs">{f.flightNumber}</span>
                    <div className="font-bold text-slate-900 text-sm">{f.airline}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{f.sourceAirport}</div>
                    <div className="text-[11px] text-slate-500">to {f.destinationAirport}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[#213d77] font-bold">{f.departureTime} → {f.arrivalTime}</div>
                    <div className="text-[10px] text-slate-400">{f.duration}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {f.stops}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{f.classes[0]?.fare}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEdit(f)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#213d77] transition"
                      title="Edit Flight"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id, f.flightNumber)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                      title="Delete Flight"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Flight Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#213d77]">
                {editingFlight ? `Edit Flight ${editingFlight.flightNumber}` : 'Add New Commercial Flight'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    required
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g. 6E-442"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Airline Name</label>
                  <input
                    type="text"
                    required
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    placeholder="e.g. IndiGo"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carrier Code</label>
                  <input
                    type="text"
                    required
                    value={airlineCode}
                    onChange={(e) => setAirlineCode(e.target.value)}
                    placeholder="e.g. 6E"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Airport</label>
                  <input
                    type="text"
                    required
                    value={sourceAirport}
                    onChange={(e) => setSourceAirport(e.target.value)}
                    placeholder="Delhi (DEL)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination Airport</label>
                  <input
                    type="text"
                    required
                    value={destinationAirport}
                    onChange={(e) => setDestinationAirport(e.target.value)}
                    placeholder="Bengaluru (BLR)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure</label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival</label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="2h 15m"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Economy Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={fare}
                    onChange={(e) => setFare(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow transition"
                >
                  {editingFlight ? 'Save Flight' : 'Schedule Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
