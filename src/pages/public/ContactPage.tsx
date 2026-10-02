import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Headphones, Clock, HelpCircle, Train } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pnr: '',
    category: 'Railway Ticket Query',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#213d77] text-xs font-bold">
          <Train className="w-3.5 h-3.5 text-[#fb792b]" />
          <span>24x7 Passenger Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#213d77] tracking-tight">
          Railway & Transit Helpline
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          Have questions regarding train timings, PNR status, flight reschedulings, or refund status? Reach our central support desk immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Channels - Clean Light Theme */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-[#213d77]">Direct Assistance Hotlines</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our central operations team monitors all transit sectors 24 hours a day, 7 days a week.
            </p>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#fb792b] border border-orange-200 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase">All-India Railway Helpline</div>
                  <div className="text-base font-black text-[#213d77] mt-0.5">Dial 139 (Toll-Free)</div>
                  <div className="text-[11px] text-slate-500">For security, medical assistance & PNR enquiry</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase">Official Support Email</div>
                  <div className="text-sm font-bold text-[#213d77] mt-0.5">support@tstrains.sys</div>
                  <div className="text-[11px] text-slate-500">Response guaranteed within 30 minutes</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#213d77] border border-blue-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase">Central Transit Headquarters</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">TS Transit Tower, Barakhamba Road</div>
                  <div className="text-[11px] text-slate-500">New Delhi - 110001, India</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#f8f9fc] border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase">Refund Settlement Processing</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">24 Hours / Automated Processing</div>
                  <div className="text-[11px] text-slate-500">Direct credit to original payment method</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Ticket / Enquiry Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#213d77]">Enquiry Received Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting TS train_sys Support. Ticket reference <strong className="text-[#fb792b] font-mono">TKT-{Math.floor(100000 + Math.random() * 900000)}</strong> has been generated and dispatched to your email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#213d77] hover:bg-[#182e5b] text-white text-xs font-bold transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-[#213d77]">Submit a Service Request</h3>
                <p className="text-xs text-slate-500">Fill in the details below and an operations specialist will connect with you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Booking PNR (Optional)</label>
                  <input
                    type="text"
                    value={formData.pnr}
                    onChange={(e) => setFormData({ ...formData, pnr: e.target.value })}
                    placeholder="TS-PNR-849201"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none font-mono bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Query Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                >
                  <option value="Railway Ticket Query">Railway Ticket & Berth Query</option>
                  <option value="Flight Booking Inquiry">Flight Booking & Baggage Inquiry</option>
                  <option value="Bus Reservation Help">Intercity Bus Boarding Support</option>
                  <option value="Cancellation Refund Status">Cancellation & Refund Assistance</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Explain your request or issue with relevant journey dates..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#213d77] focus:outline-none bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#fb792b] hover:bg-[#ea6819] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
