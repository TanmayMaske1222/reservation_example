import React, { useState, useMemo } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { User, Booking } from '../../types';
import { Users, Search, UserPlus, Edit2, Trash2, Ban, CheckCircle2, Ticket, X, Save, ArrowRight } from 'lucide-react';
import { DigitalTicketModal } from '../../components/common/DigitalTicketModal';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => DatabaseStorage.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL');

  // Modal states
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingHistoryUser, setViewingHistoryUser] = useState<User | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const allBookings = DatabaseStorage.getBookings();

  const refreshUsers = () => {
    setUsers(DatabaseStorage.getUsers());
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesPhone = u.phone.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      return true;
    });
  }, [users, statusFilter, searchQuery]);

  const handleToggleBlock = (user: User) => {
    const updatedStatus: User['status'] = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updatedUser: User = { ...user, status: updatedStatus };
    DatabaseStorage.saveUser(updatedUser);
    refreshUsers();
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to permanently delete user "${userName}"?`)) {
      DatabaseStorage.deleteUser(userId);
      refreshUsers();
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: formName,
        phone: formPhone,
        dob: formDob,
        address: formAddress
      };
      DatabaseStorage.saveUser(updated);
      setEditingUser(null);
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: formName,
        email: formEmail,
        phone: formPhone,
        dob: formDob,
        address: formAddress,
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      DatabaseStorage.saveUser(newUser);
      setAddUserModalOpen(false);
    }
    refreshUsers();
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormDob(user.dob || '');
    setFormAddress(user.address || '');
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormDob('');
    setFormAddress('');
    setAddUserModalOpen(true);
  };

  const userBookings = viewingHistoryUser
    ? allBookings.filter(b => b.userId === viewingHistoryUser.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <Users className="w-4 h-4 text-[#213d77]" />
            <span>Passenger Registry & Role Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            User Account Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit registered traveler accounts, modify credentials, restrict access, and inspect individual booking histories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-[#fb792b]" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search & Filter Toolbar - Clean White */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          {(['ALL', 'ACTIVE', 'BLOCKED'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === s
                  ? 'bg-[#213d77] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table - Clean Light */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => {
                const bCount = allBookings.filter(b => b.userId === u.id).length;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#213d77] text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setViewingHistoryUser(u)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#213d77] font-mono font-bold flex items-center gap-1 border border-blue-200"
                        title="View user booking history"
                      >
                        <Ticket className="w-3 h-3 text-[#fb792b]" />
                        <span>{bCount} {bCount === 1 ? 'Trip' : 'Trips'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-[#213d77] transition"
                        title="Edit User Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleBlock(u)}
                        className={`p-1.5 rounded-lg text-xs font-semibold ${
                          u.status === 'ACTIVE'
                            ? 'bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {(addUserModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#213d77]">
                {editingUser ? 'Edit Traveler Information' : 'Add New Traveler to System'}
              </h3>
              <button
                onClick={() => {
                  setAddUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 disabled:opacity-70 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setAddUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white font-bold text-xs shadow transition"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Booking History Modal */}
      {viewingHistoryUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider font-mono">
                  Travel History Audit
                </span>
                <h3 className="text-base font-bold text-[#213d77]">
                  Booking Records for {viewingHistoryUser.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingHistoryUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto space-y-3">
              {userBookings.length > 0 ? (
                userBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-[#213d77]">{b.pnr}</div>
                      <div className="font-semibold text-slate-900">{b.transportName} ({b.transportNumber})</div>
                      <div className="text-slate-500">{b.source} → {b.destination} on {b.journeyDate}</div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-bold text-slate-900">₹{b.amount}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {b.bookingStatus}
                      </span>
                      <div>
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="text-[11px] text-[#fb792b] hover:underline font-bold inline-block pt-1"
                        >
                          Inspect Pass →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">No bookings on record for this user.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingHistoryUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close History
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
