import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { Train } from '../../types';
import { Train as TrainIcon, Search, Plus, Edit2, Trash2, Clock, MapPin, X, Save } from 'lucide-react';

export const AdminTrainsPage: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>(() => DatabaseStorage.getTrains());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<Train | null>(null);

  // Form
  const [trainNumber, setTrainNumber] = useState('');
  const [trainName, setTrainName] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [duration, setDuration] = useState('');
  const [trainType, setTrainType] = useState<Train['trainType']>('Vande Bharat');
  const [baseFare, setBaseFare] = useState(1800);
  const [capacity, setCapacity] = useState(480);

  const refreshData = () => {
    setTrains(DatabaseStorage.getTrains());
  };

  const filteredTrains = useMemo(() => {
    return trains.filter(t => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const m1 = t.trainNumber.toLowerCase().includes(q);
        const m2 = t.trainName.toLowerCase().includes(q);
        const m3 = `${t.source} ${t.destination}`.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }
      return true;
    });
  }, [trains, searchQuery]);

  const openAdd = () => {
    setEditingTrain(null);
    setTrainNumber('');
    setTrainName('');
    setSource('');
    setDestination('');
    setDepartureTime('08:00');
    setArrivalTime('16:00');
    setDuration('8h 00m');
    setTrainType('Vande Bharat');
    setBaseFare(1800);
    setCapacity(450);
    setModalOpen(true);
  };

  const openEdit = (t: Train) => {
    setEditingTrain(t);
    setTrainNumber(t.trainNumber);
    setTrainName(t.trainName);
    setSource(t.source);
    setDestination(t.destination);
    setDepartureTime(t.departureTime);
    setArrivalTime(t.arrivalTime);
    setDuration(t.duration);
    setTrainType(t.trainType);
    setBaseFare(t.classes[0]?.fare || 1500);
    setCapacity(t.classes.reduce((sum, c) => sum + c.totalSeats, 0));
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Confirm deletion of train service "${name}"?`)) {
      DatabaseStorage.deleteTrain(id);
      refreshData();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrain) {
      const updated: Train = {
        ...editingTrain,
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        trainType,
        classes: editingTrain.classes.map(c => ({
          ...c,
          fare: c.code === '1A' ? Math.round(baseFare * 1.8) : baseFare
        }))
      };
      DatabaseStorage.saveTrain(updated);
    } else {
      const newTrain: Train = {
        id: `trn_${trainNumber}`,
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        trainType,
        classes: [
          { code: '1A', name: 'AC First Class (1A)', fare: Math.round(baseFare * 1.8), totalSeats: Math.round(capacity * 0.1), availableSeats: 12 },
          { code: '2A', name: 'AC 2 Tier (2A)', fare: baseFare, totalSeats: Math.round(capacity * 0.3), availableSeats: 45 },
          { code: '3A', name: 'AC 3 Tier (3A)', fare: Math.round(baseFare * 0.7), totalSeats: Math.round(capacity * 0.6), availableSeats: 98 }
        ],
        runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        status: 'ON_TIME'
      };
      DatabaseStorage.saveTrain(newTrain);
    }
    setModalOpen(false);
    refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <TrainIcon className="w-4 h-4 text-[#213d77]" />
            <span>Railway Operations Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Train Schedule & Route Management
          </h1>
          <p className="text-xs text-slate-500">
            Define express services, set tier fares, update coach capacities, and configure timetable stops.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="px-4 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#fb792b]" />
          <span>Add New Train</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search train by number, name, station..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Total Trains: <strong className="text-slate-900">{trains.length}</strong>
        </div>
      </div>

      {/* Trains Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4">Train Number & Name</th>
                <th className="py-3.5 px-4">Route (Origin → Dest)</th>
                <th className="py-3.5 px-4">Schedule (Dep - Arr)</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Base Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTrains.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#213d77] text-xs">#{t.trainNumber}</span>
                    <div className="font-bold text-slate-900 text-sm">{t.trainName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{t.source}</div>
                    <div className="text-[11px] text-slate-500">to {t.destination}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[#213d77] font-bold">{t.departureTime} → {t.arrivalTime}</div>
                    <div className="text-[10px] text-slate-500">Duration: {t.duration}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {t.trainType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{t.classes[0]?.fare || 1200}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.status === 'ON_TIME'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#213d77] transition"
                      title="Edit Train"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.trainName)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                      title="Delete Train"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#213d77]">
                {editingTrain ? `Edit Train #${editingTrain.trainNumber}` : 'Add New Railway Train'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Train Number</label>
                  <input
                    type="text"
                    required
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    placeholder="e.g. 12951"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Train Name</label>
                  <input
                    type="text"
                    required
                    value={trainName}
                    onChange={(e) => setTrainName(e.target.value)}
                    placeholder="e.g. Tejas Express"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Origin</label>
                  <input
                    type="text"
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. New Delhi (NDLS)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Lucknow Jn (LJN)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure</label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival</label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 6h 30m"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Train Type</label>
                  <select
                    value={trainType}
                    onChange={(e) => setTrainType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                  >
                    <option value="Vande Bharat">Vande Bharat</option>
                    <option value="Rajdhani Express">Rajdhani Express</option>
                    <option value="Superfast">Superfast</option>
                    <option value="Express">Express</option>
                    <option value="Duronto">Duronto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seat Capacity</label>
                  <input
                    type="number"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono"
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
                  {editingTrain ? 'Save Train Changes' : 'Create Train Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
