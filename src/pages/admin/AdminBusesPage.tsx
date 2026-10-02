import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Bus } from '../../types';
import { Bus as BusIcon, Search, Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminBusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(() => DatabaseStorage.getBuses());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // Form
  const [busNumber, setBusNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [busType, setBusType] = useState<Bus['busType']>('Volvo Multi-Axle AC');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('21:00');
  const [arrivalTime, setArrivalTime] = useState('07:00');
  const [duration, setDuration] = useState('10h 00m');
  const [fare, setFare] = useState(1200);
  const [capacity, setCapacity] = useState(40);

  const refreshData = () => {
    setBuses(DatabaseStorage.getBuses());
  };

  const filtered = useMemo(() => {
    return buses.filter(b => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const m1 = b.busNumber.toLowerCase().includes(q);
        const m2 = b.operator.toLowerCase().includes(q);
        const m3 = `${b.source} ${b.destination}`.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }
      return true;
    });
  }, [buses, searchQuery]);

  const openAdd = () => {
    setEditingBus(null);
    setBusNumber('TS-B105');
    setOperator('TS Goldline Express');
    setBusType('Volvo Multi-Axle AC');
    setSource('Chandigarh (Sector 43 ISBT)');
    setDestination('Shimla (ISBT)');
    setDepartureTime('07:30');
    setArrivalTime('11:45');
    setDuration('4h 15m');
    setFare(750);
    setCapacity(40);
    setModalOpen(true);
  };

  const openEdit = (b: Bus) => {
    setEditingBus(b);
    setBusNumber(b.busNumber);
    setOperator(b.operator);
    setBusType(b.busType);
    setSource(b.source);
    setDestination(b.destination);
    setDepartureTime(b.departureTime);
    setArrivalTime(b.arrivalTime);
    setDuration(b.duration);
    setFare(b.fare);
    setCapacity(b.seatCapacity);
    setModalOpen(true);
  };

  const handleDelete = (id: string, busNo: string) => {
    if (confirm(`Delete bus service ${busNo}?`)) {
      DatabaseStorage.deleteBus(id);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBus) {
      const updated: Bus = {
        ...editingBus,
        busNumber,
        operator,
        busType,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        fare,
        seatCapacity: capacity
      };
      DatabaseStorage.saveBus(updated);
    } else {
      const newBus: Bus = {
        id: `bus_${Date.now()}`,
        busNumber,
        operator,
        busType,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        seatCapacity: capacity,
        availableSeats: Math.round(capacity * 0.4),
        fare,
        ratings: 4.8,
        amenities: ['Air Conditioned', 'Live Tracking', 'Charging Port', 'Sanitized'],
        status: 'SCHEDULED'
      };
      DatabaseStorage.saveBus(newBus);
    }
    setModalOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <BusIcon className="w-4 h-4 text-[#213d77]" />
            <span>Interstate Fleet Telematics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Intercity Bus & Fleet Management
          </h1>
          <p className="text-xs text-slate-500">
            Configure multi-axle Volvo sleepers, highway routes, berth allocations, and ticket tariffs.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#fb792b]" />
          <span>Add New Bus</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buses by operator, number, route..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Total Fleet Buses: <strong className="text-slate-900">{buses.length}</strong>
        </div>
      </div>

      {/* Bus Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4">Bus No & Operator</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Route (Origin → Dest)</th>
                <th className="py-3.5 px-4">Timings</th>
                <th className="py-3.5 px-4">Fare (₹)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-indigo-700 text-xs">{b.busNumber}</span>
                    <div className="font-bold text-slate-900 text-sm">{b.operator}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {b.busType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{b.source}</div>
                    <div className="text-[11px] text-slate-500">to {b.destination}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[#213d77] font-bold">{b.departureTime} → {b.arrivalTime}</div>
                    <div className="text-[10px] text-slate-400">{b.duration}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{b.fare}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEdit(b)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#213d77] transition"
                      title="Edit Bus"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.busNumber)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                      title="Delete Bus"
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

      {/* Add / Edit Bus Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#213d77]">
                {editingBus ? `Edit Bus ${editingBus.busNumber}` : 'Add New Intercity Bus'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bus Registration No</label>
                  <input
                    type="text"
                    required
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="TS-B108"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Operator Name</label>
                  <input
                    type="text"
                    required
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="TS Royal Express"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Terminal</label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Delhi (Kashmere Gate)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Dehradun (ISBT)"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={fare}
                    onChange={(e) => setFare(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
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
                  {editingBus ? 'Save Bus Service' : 'Add Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
