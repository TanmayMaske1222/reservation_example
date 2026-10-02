import React, { useState } from 'react';
import { DatabaseStorage } from '../../db/storage';
import { BarChart3, Download, Printer, FileSpreadsheet, Calendar, TrendingUp, CheckCircle2, Train, Plane, Bus } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState<string>('REVENUE_REPORT');
  const [dateRange, setDateRange] = useState('OCT_2026');

  const bookings = DatabaseStorage.getBookings();
  const users = DatabaseStorage.getUsers();
  const trains = DatabaseStorage.getTrains();
  const flights = DatabaseStorage.getFlights();
  const buses = DatabaseStorage.getBuses();

  const handleExportCSV = () => {
    let csvHeader = '';
    let csvRows = '';

    if (reportType === 'REVENUE_REPORT' || reportType === 'DAILY_REPORT' || reportType === 'CANCELLATION_REPORT') {
      csvHeader = 'BookingID,PNR,User,TransportType,TransportName,Source,Destination,JourneyDate,Amount,BookingStatus,PaymentStatus,PaymentMethod,TransactionID\n';
      csvRows = bookings.map(b =>
        `"${b.id}","${b.pnr}","${b.userName}","${b.transportType}","${b.transportName}","${b.source}","${b.destination}","${b.journeyDate}",${b.amount},"${b.bookingStatus}","${b.paymentStatus}","${b.paymentMethod}","${b.transactionId}"`
      ).join('\n');
    } else if (reportType === 'USER_REGISTRATION_REPORT') {
      csvHeader = 'UserID,Name,Email,Phone,Role,Status,DOB,Address,CreatedAt\n';
      csvRows = users.map(u =>
        `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role}","${u.status}","${u.dob || ''}","${u.address || ''}","${u.createdAt}"`
      ).join('\n');
    } else {
      csvHeader = 'TransportType,ID,ServiceNumber,Name,Source,Destination,Departure,Arrival,Fare\n';
      const trn = trains.map(t => `"TRAIN","${t.id}","${t.trainNumber}","${t.trainName}","${t.source}","${t.destination}","${t.departureTime}","${t.arrivalTime}",${t.classes[0]?.fare}`).join('\n');
      const flt = flights.map(f => `"FLIGHT","${f.id}","${f.flightNumber}","${f.airline}","${f.sourceAirport}","${f.destinationAirport}","${f.departureTime}","${f.arrivalTime}",${f.classes[0]?.fare}`).join('\n');
      const bus = buses.map(b => `"BUS","${b.id}","${b.busNumber}","${b.operator}","${b.source}","${b.destination}","${b.departureTime}","${b.arrivalTime}",${b.fare}`).join('\n');
      csvRows = `${trn}\n${flt}\n${bus}`;
    }

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TS_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const reportsList = [
    { id: 'DAILY_REPORT', name: 'Daily Booking Report', desc: 'Real-time 24h intake across rail, air, and roadway passenger manifests.' },
    { id: 'WEEKLY_REPORT', name: 'Weekly Booking Report', desc: '7-day aggregated volume trends and passenger seat occupancy rates.' },
    { id: 'MONTHLY_REPORT', name: 'Monthly Booking Report', desc: 'Comprehensive monthly passenger movement and fleet utilization metrics.' },
    { id: 'REVENUE_REPORT', name: 'Revenue & Audit Report', desc: 'Total gross booking receipts, GST collections, and net payout statements.' },
    { id: 'TRAIN_REPORT', name: 'Train Booking Report', desc: 'IRCTC railway rake load factor, Vande Bharat EC/CC ratios, and waitlist ratios.' },
    { id: 'FLIGHT_REPORT', name: 'Flight Booking Report', desc: 'Domestic airline sector performance, load factors, and fare class splits.' },
    { id: 'BUS_REPORT', name: 'Bus Booking Report', desc: 'Intercity Volvo sleeper berth demand and highway route occupancy logs.' },
    { id: 'CANCELLATION_REPORT', name: 'Cancellation & Refund Report', desc: 'Automatic refund disbursements, cancellation reasons, and settlement audits.' },
    { id: 'USER_REGISTRATION_REPORT', name: 'User Registration Report', desc: 'New traveler onboarding growth, verification status, and geographical distribution.' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
            <BarChart3 className="w-4 h-4 text-[#213d77]" />
            <span>Operational Audits & Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
            Institutional Transit Reports
          </h1>
          <p className="text-xs text-slate-500">
            Export comprehensive institutional data, financial balance sheets, and travel telemetry in PDF & CSV formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {reportsList.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setReportType(r.id)}
            className={`p-4 rounded-xl border text-left transition ${
              reportType === r.id
                ? 'bg-blue-50 border-[#213d77] text-slate-900 shadow-xs ring-1 ring-[#213d77]/20'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#213d77]">{r.name}</span>
              {reportType === r.id && (
                <span className="w-2 h-2 rounded-full bg-[#fb792b]" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
          </button>
        ))}
      </div>

      {/* Active Report Data Preview Container */}
      <div id="printable-report" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="text-[10px] text-[#fb792b] font-mono font-bold uppercase tracking-widest">
              OFFICIAL SYSTEM REPORT AUDIT
            </div>
            <h3 className="text-xl font-black text-[#213d77] mt-0.5">
              {reportsList.find(r => r.id === reportType)?.name}
            </h3>
            <p className="text-xs text-slate-500">Generated on {new Date().toLocaleString()} for TS train_sys Administration</p>
          </div>

          <div className="bg-[#f8f9fc] px-4 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
            Dataset: <strong className="text-[#213d77]">{bookings.length} Bookings</strong> • <strong className="text-[#213d77]">{users.length} Users</strong>
          </div>
        </div>

        {/* Dynamic preview rows based on report */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#f8f9fc] text-slate-600 border-b border-slate-200">
                <th className="py-3 px-3 font-bold">Ref ID</th>
                <th className="py-3 px-3 font-bold">Entity / Service</th>
                <th className="py-3 px-3 font-bold">Category</th>
                <th className="py-3 px-3 font-bold">Route / Details</th>
                <th className="py-3 px-3 font-bold">Financial Value</th>
                <th className="py-3 px-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3 text-[#213d77] font-bold">{b.pnr}</td>
                  <td className="py-3 px-3 text-slate-900 font-sans font-bold">{b.transportName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-sans font-semibold">
                      {b.transportType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-600">{b.source} ➔ {b.destination}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{b.amount}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                      b.bookingStatus === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
