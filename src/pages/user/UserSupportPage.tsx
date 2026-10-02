import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const UserSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I cancel my train, flight, or bus ticket?',
      a: 'Go to "My Bookings" in your User Portal sidebar, click on "Cancel Ticket" on the confirmed booking card. The system instantly processes cancellation and credits back 85% of your total fare to the original simulated payment method as per Indian Railways rules.'
    },
    {
      q: 'Where do I find my PNR or Digital Boarding Pass?',
      a: 'Every confirmed booking generates a unique PNR (e.g., TS-PNR-849201). You can view, download, or print your official high-resolution ticket with verified QR code directly from "My Bookings" or the Dashboard Upcoming Journey card.'
    },
    {
      q: 'Can two people book the exact same seat simultaneously?',
      a: 'No. TS train_sys employs relational locking. Once a seat is selected and submitted to checkout, it is flagged as reserved to prevent double bookings.'
    },
    {
      q: 'How does payment simulation work on TS train_sys?',
      a: 'All payment flows (UPI, Credit/Debit Card, Net Banking) are secure simulated sandbox gateways. They mimic the real transaction process, generate unique transaction IDs, and update the booking ledger without real card deductions.'
    },
    {
      q: 'Can normal travelers view administrator controls?',
      a: 'Never. The User Portal and Admin Portal are isolated with strict role-based access control. Admin operations require administrative credentials and cannot be accessed by travelers.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketDetails('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#fb792b] mb-1">
          <HelpCircle className="w-4 h-4 text-[#213d77]" />
          <span>IRCTC Support & Assistance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#213d77]">
          Help & Support Center
        </h1>
        <p className="text-xs text-slate-500">
          Find instant answers to frequent booking queries or connect with our 24x7 passenger grievance officers.
        </p>
      </div>

      {/* Quick Helpline Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#fb792b] border border-orange-200 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">All-India Railway Helpline</div>
            <div className="text-base font-black text-[#213d77]">Dial 139 (Toll-Free)</div>
            <div className="text-[10px] text-slate-500">Medical emergency, rail security & PNR</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Dedicated Passenger Email</div>
            <div className="text-base font-black text-[#213d77]">support@tstrains.sys</div>
            <div className="text-[10px] text-slate-500">Average response in 15 minutes</div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-[#213d77]">Frequently Asked Questions</h3>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-[#213d77] transition gap-4"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#fb792b] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed pl-2 border-l-2 border-[#fb792b]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Grievance Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <MessageSquare className="w-5 h-5 text-[#fb792b]" />
          <div>
            <h3 className="text-base font-bold text-[#213d77]">Raise an Escalation / Support Ticket</h3>
            <p className="text-xs text-slate-500">Need specific help with a booking? Submit a formal service ticket.</p>
          </div>
        </div>

        {ticketSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Grievance Ticket Registered</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your issue reference <strong className="text-[#213d77] font-mono">TKT-{Math.floor(100000 + Math.random() * 900000)}</strong> has been lodged.
            </p>
            <button
              onClick={() => setTicketSubmitted(false)}
              className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Submit Another Query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Issue Summary</label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Need assistance with berth preference on train #22436"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                required
                rows={4}
                value={ticketDetails}
                onChange={(e) => setTicketDetails(e.target.value)}
                placeholder="Provide details of your journey, PNR number (if any), and issue..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
