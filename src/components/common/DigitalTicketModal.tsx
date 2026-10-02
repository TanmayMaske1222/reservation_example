import React from 'react';
import { Booking } from '../../types';
import { Train, Plane, Bus, QrCode, Printer, Download, X, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface DigitalTicketModalProps {
  booking: Booking | null;
  onClose: () => void;
  onCancelBooking?: (bookingId: string) => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  booking,
  onClose,
  onCancelBooking
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const ticketText = `
=============================================================
TS train_sys - IRCTC ELECTRONIC RESERVATION SLIP (ERS)
"One Platform. Every Journey."
=============================================================
PNR NUMBER       : ${booking.pnr}
BOOKING ID       : ${booking.id}
TRANSPORT TYPE   : ${booking.transportType}
SERVICE NAME     : ${booking.transportName} (${booking.transportNumber})
CLASS            : ${booking.travelClass}
JOURNEY DATE     : ${booking.journeyDate}
ROUTE            : ${booking.source} -> ${booking.destination}
DEPARTURE TIME   : ${booking.departureTime}
ARRIVAL TIME     : ${booking.arrivalTime}
SEATS / BERTHS   : ${booking.seats.join(', ')}

PASSENGER DETAILS:
${booking.passengers.map((p, i) => `  ${i + 1}. ${p.name} (${p.age} Yrs, ${p.gender}) - Berth: ${p.seatNumber} [${p.berthPreference || 'No Preference'}]`).join('\n')}

FARE BREAKUP:
  Base Ticket Fare        : INR ${booking.baseFare}
  IRCTC Convenience & GST : INR ${booking.tax}
  Total Amount Paid       : INR ${booking.amount}
  Payment Mode            : ${booking.paymentMethod}
  Transaction Ref (UTR)   : ${booking.transactionId}
  Reservation Status      : ${booking.bookingStatus}
  Booked Timestamp        : ${new Date(booking.createdAt).toLocaleString('en-IN')}

CRITICAL TRAVEL GUIDELINES:
1. Carry valid original photo identity proof (Aadhaar / Voter ID / Passport / Driving Licence).
2. For medical assistance or rail security, dial Railway Helpline 139.
=============================================================
    `;

    const blob = new Blob([ticketText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IRCTC_ERS_${booking.pnr}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all my-6">
        
        {/* Modal Top Bar - Clean Light Header */}
        <div className="bg-[#f8f9fc] px-5 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#213d77] flex items-center justify-center text-white font-black text-xs">
              TS
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#fb792b] font-bold">
                Electronic Reservation Slip (ERS)
              </div>
              <div className="text-sm font-bold text-[#213d77]">
                TS train_sys IRCTC E-Ticketing
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
              title="Print E-Ticket"
            >
              <Printer className="w-3.5 h-3.5 text-[#213d77]" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fb792b] hover:bg-[#ea6819] text-xs font-bold text-white transition shadow-xs"
              title="Download E-Ticket"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Area - Authentic Clean White IRCTC Document */}
        <div id="printable-ticket" className="p-5 sm:p-7 bg-white space-y-5 text-slate-800 text-xs">
          
          {/* Official Indian Railways Header Banner */}
          <div className="border border-slate-300 rounded-xl p-4 bg-[#f8fafc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#213d77] flex items-center justify-center text-white font-black text-xl shadow-xs border-2 border-[#fb792b]/40">
                TS
              </div>
              <div>
                <div className="text-base font-black text-[#213d77] tracking-tight">
                  INDIAN RAILWAYS & TRANSIT RESERVATION
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  IRCTC e-Ticketing Service • National Passenger Manifest
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PNR NUMBER</div>
              <div className="text-lg font-mono font-black text-[#213d77] tracking-wider">
                {booking.pnr}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Booking ID: {booking.id}
              </div>
            </div>
          </div>

          {/* Service & Route Grid */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#eef2f8] px-4 py-2 font-bold text-[#213d77] flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                {booking.transportType === 'TRAIN' && <Train className="w-4 h-4 text-[#fb792b]" />}
                {booking.transportType === 'FLIGHT' && <Plane className="w-4 h-4 text-[#fb792b]" />}
                {booking.transportType === 'BUS' && <Bus className="w-4 h-4 text-[#fb792b]" />}
                <span>{booking.transportName} ({booking.transportNumber})</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                booking.bookingStatus === 'CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : booking.bookingStatus === 'CANCELLED'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {booking.bookingStatus}
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">From Station / Origin</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{booking.source}</div>
                <div className="text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Departure: {booking.departureTime}
                </div>
              </div>

              <div className="text-center py-2 sm:py-0 border-y sm:border-y-0 sm:border-x border-slate-100 px-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Date of Journey</div>
                <div className="text-sm font-bold text-[#213d77] mt-0.5">{booking.journeyDate}</div>
                <div className="text-slate-500 mt-1">
                  Class: <strong className="text-slate-800">{booking.travelClass}</strong> • Quota: <strong className="text-slate-800">GN</strong>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-[10px] text-slate-500 font-bold uppercase">To Station / Destination</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{booking.destination}</div>
                <div className="text-slate-600 mt-1 flex items-center gap-1 sm:justify-end font-semibold">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Arrival: {booking.arrivalTime}
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-[#eef2f8] px-4 py-2 font-bold text-[#213d77] border-b border-slate-200">
              Passenger Details & Berth Allocation
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Passenger Name</th>
                    <th className="py-2.5 px-4">Age / Gender</th>
                    <th className="py-2.5 px-4">Allocated Berth/Seat</th>
                    <th className="py-2.5 px-4">Berth Type</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium">
                  {booking.passengers.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{p.age} Yrs / {p.gender}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#213d77]">{p.seatNumber}</td>
                      <td className="py-2.5 px-4 text-slate-600">{p.berthPreference || 'Window'}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          CONFIRMED (CNF)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fare & Security Barcode / QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fare Breakdown */}
            <div className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] space-y-2">
              <div className="font-bold text-[#213d77] pb-1 border-b border-slate-200">
                Payment & Fare Details
              </div>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Base Ticket Fare</span>
                  <span className="font-semibold text-slate-800">₹{booking.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>IRCTC Convenience Fee & GST (5%)</span>
                  <span className="font-semibold text-slate-800">₹{booking.tax}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                  <span>Total Amount Paid</span>
                  <span className="text-[#213d77]">₹{booking.amount}</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Payment Mode: <strong className="text-slate-700">{booking.paymentMethod}</strong> • UTR: <span className="font-mono">{booking.transactionId}</span>
                </div>
              </div>
            </div>

            {/* QR Code Validation Box */}
            <div className="border border-slate-200 rounded-xl p-4 bg-[#f8fafc] flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-2 rounded-lg border border-slate-300 shrink-0 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Signed & Validated</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-snug">
                  Scan this QR code during ticket inspection on board. Valid along with original photo ID.
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  VERIFIED: TS-SEC-AUTH-2026
                </div>
              </div>
            </div>
          </div>

          {/* Important Traveler Notice */}
          <div className="border border-orange-200 bg-[#fff8ed] rounded-xl p-3 text-orange-950 space-y-1 text-[11px]">
            <div className="font-bold flex items-center gap-1.5 text-[#fb792b]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Important Passenger Guidelines</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>One passenger in the group must carry original photo ID during travel.</li>
              <li>For any medical, security, or cleanliness complaints, dial <strong>139</strong> (Toll Free).</li>
              <li>Chart is normally prepared 4 hours prior to scheduled train departure.</li>
            </ul>
          </div>

          {/* Cancellation Option (if confirmed) */}
          {booking.bookingStatus === 'CONFIRMED' && onCancelBooking && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-slate-500 text-[11px]">
                Need to cancel this ticket? Cancellation charges apply as per Indian Railways rules.
              </span>
              <button
                type="button"
                onClick={() => onCancelBooking(booking.id)}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 text-xs font-bold transition"
              >
                Cancel Reservation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
