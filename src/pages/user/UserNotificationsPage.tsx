import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { Bell, CheckCheck, Clock, Ticket, AlertTriangle, Sparkles, Shield } from 'lucide-react';

export const UserNotificationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState(() => {
    if (!currentUser) return [];
    return DatabaseStorage.getNotifications().filter(n => n.userId === currentUser.id);
  });

  const handleMarkAllRead = () => {
    if (!currentUser) return;
    DatabaseStorage.markAllNotificationsRead(currentUser.id);
    setNotifications(DatabaseStorage.getNotifications().filter(n => n.userId === currentUser.id));
  };

  const handleMarkOneRead = (id: string) => {
    DatabaseStorage.markNotificationRead(id);
    if (currentUser) {
      setNotifications(DatabaseStorage.getNotifications().filter(n => n.userId === currentUser.id));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Bell className="w-4 h-4" />
            <span>Alerts & Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500">
            Stay updated with real-time train departures, gate changes, ticket confirmations, and refund acknowledgments.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkOneRead(notif.id)}
              className={`p-5 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                notif.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-sm ring-1 ring-blue-500/10'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'BOOKING'
                  ? 'bg-blue-100 text-blue-600'
                  : notif.type === 'ALERT'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {notif.type === 'BOOKING' && <Ticket className="w-5 h-5" />}
                {notif.type === 'ALERT' && <AlertTriangle className="w-5 h-5" />}
                {notif.type === 'PROMO' && <Sparkles className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
