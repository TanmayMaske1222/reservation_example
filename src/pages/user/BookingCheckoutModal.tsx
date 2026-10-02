import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DatabaseStorage } from '../../db/storage';
import { TransportType, Passenger, Booking } from '../../types';
import { X, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, UserCheck, AlertTriangle, Train, Plane, Bus, Zap } from 'lucide-react';

interface BookingCheckoutModalProps {
  transportType: TransportType;
  transportId: string;
  transportNumber: string;
  transportName: string;
  source: string;
  destination: string;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  selectedSeats: string[];
  baseFarePerSeat: number;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  transportType,
  transportId,
  transportNumber,
  transportName,
  source,
  destination,
  journeyDate,
  departureTime,
  arrivalTime,
  travelClass,
  selectedSeats,
  baseFarePerSeat,
  onClose,
  onBookingSuccess
}) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<'PASSENGERS' | 'PAYMENT' | 'PROCESSING'>('PASSENGERS');

  // Initialize passenger list matching selected seats
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    return selectedSeats.map((seat, idx) => ({
      name: idx === 0 && currentUser ? currentUser.name : '',
      age: idx === 0 ? 28 : 25,
      gender: 'MALE',
      seatNumber: seat,
      berthPreference: 'Lower Berth'
    }));
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING'>('UPI');
  const [upiId, setUpiId] = useState('traveler@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [error, setError] = useState('');

  const totalBaseFare = baseFarePerSeat * selectedSeats.length;
  const gstAmount = Math.round(totalBaseFare * 0.05);
  const totalPayable = totalBaseFare + gstAmount;

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validation
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setError(`Please enter full name for Passenger #${i + 1} (Allocated: ${passengers[i].seatNumber})`);
        return;
      }
      if (!passengers[i].age || passengers[i].age <= 0 || passengers[i].age > 110) {
        setError(`Please enter valid age for Passenger #${i + 1}`);
        return;
      }
    }
    setStep('PAYMENT');
  };

  const handleExecutePayment = () => {
    if (!currentUser) return;
    setStep('PROCESSING');

    setTimeout(() => {
      try {
        const newBooking = DatabaseStorage.createBooking(
          currentUser.id,
          transportType,
          transportId,
          transportNumber,
          transportName,
          source,
          destination,
          journeyDate,
          departureTime,
          arrivalTime,
          travelClass,
          selectedSeats,
          passengers,
          totalBaseFare,
          paymentMethod
        );

        onBookingSuccess(newBooking);
      } catch (err) {
        console.error(err);
        setError('Booking processing failed. Please try again.');
        setStep('PAYMENT');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all my-6 text-slate-800">
        
        {/* Header - Clean Light Theme */}
        <div className="bg-[#f8f9fc] px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#213d77] flex items-center justify-center text-white shadow-xs">
              {transportType === 'TRAIN' && <Train className="w-5 h-5 text-[#fb792b]" />}
              {transportType === 'FLIGHT' && <Plane className="w-5 h-5 text-[#fb792b]" />}
              {transportType === 'BUS' && <Bus className="w-5 h-5 text-[#fb792b]" />}
            </div>
            <div>
              <div className="text-[10px] text-[#fb792b] font-bold uppercase tracking-wider">
                IRCTC Reservation Checkout
              </div>
              <h3 className="text-base font-black text-[#213d77]">
                Confirm {transportType === 'TRAIN' ? 'Railway' : transportType === 'FLIGHT' ? 'Flight' : 'Bus'} Booking
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'PASSENGERS' ? 'bg-[#213d77] text-white' : 'bg-emerald-600 text-white'
            }`}>
              1
            </span>
            <span className={step === 'PASSENGERS' ? 'font-bold text-[#213d77]' : 'text-slate-500'}>
              Passenger Details
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step === 'PAYMENT' || step === 'PROCESSING' ? 'bg-[#fb792b] text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span className={step === 'PAYMENT' || step === 'PROCESSING' ? 'font-bold text-[#fb792b]' : 'text-slate-500'}>
              Payment Mode
            </span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            <span className="text-slate-400">Confirmation</span>
          </div>
        </div>

        {/* Journey Summary Strip */}
        <div className="px-6 py-3 bg-[#eef2f8] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-[#213d77]">{transportName} ({transportNumber})</div>
            <div className="text-slate-600 font-medium">{source} → {destination}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">{journeyDate} at {departureTime}</div>
            <div className="text-[11px] text-slate-600">
              Class: <strong className="text-[#213d77]">{travelClass}</strong> • Berths: <strong className="text-slate-900">{selectedSeats.join(', ')}</strong>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 'PASSENGERS' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Passenger Information ({passengers.length} Person{passengers.length > 1 ? 's' : ''})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Allocated: <strong className="text-[#213d77]">{selectedSeats.join(', ')}</strong>
                </span>
              </div>

              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {passengers.map((passenger, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#213d77] flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#fb792b]" />
                        Passenger #{idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                        Berth: {passenger.seatNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Full Name (As on ID)</label>
                        <input
                          type="text"
                          required
                          value={passenger.name}
                          onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Age</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="110"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#213d77]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Gender</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Berth</label>
                        <select
                          value={passenger.berthPreference}
                          onChange={(e) => handlePassengerChange(idx, 'berthPreference', e.target.value)}
                          className="w-full px-1.5 py-2 rounded-lg border border-slate-300 text-[11px] font-semibold text-slate-900 bg-white focus:outline-none"
                        >
                          <option value="Lower">Lower</option>
                          <option value="Middle">Middle</option>
                          <option value="Upper">Upper</option>
                          <option value="Side Lower">Side Low</option>
                          <option value="Side Upper">Side Up</option>
                          <option value="Window">Window</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown Footer */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Fare: <strong>₹{totalBaseFare}</strong> + GST & Fee: <strong>₹{gstAmount}</strong> = <span className="text-base font-black text-[#213d77]">₹{totalPayable}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#e6681b] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 'PAYMENT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Payment Method (Simulation)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  IRCTC Secure Gateway
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'UPI'
                      ? 'border-[#fb792b] bg-orange-50/70 text-[#fb792b] ring-1 ring-[#fb792b]'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>BHIM / UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('DEBIT_CARD')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'DEBIT_CARD'
                      ? 'border-[#fb792b] bg-orange-50/70 text-[#fb792b] ring-1 ring-[#fb792b]'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-[#fb792b] bg-orange-50/70 text-[#fb792b] ring-1 ring-[#fb792b]'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                    paymentMethod === 'NET_BANKING'
                      ? 'border-[#fb792b] bg-orange-50/70 text-[#fb792b] ring-1 ring-[#fb792b]'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* Payment Details Container */}
              <div className="p-4 rounded-xl border border-slate-200 bg-[#f8fafc] space-y-3">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-700">Enter UPI ID / VPA</label>
                      <span className="text-[11px] text-emerald-700 font-semibold">Zero Gateway Charges</span>
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                    />
                    <div className="flex gap-2 text-[11px] text-slate-500 pt-1">
                      <span>Supported:</span>
                      <strong className="text-slate-700">Google Pay</strong> • 
                      <strong className="text-slate-700">PhonePe</strong> • 
                      <strong className="text-slate-700">Paytm</strong> • 
                      <strong className="text-slate-700">BHIM UPI</strong>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'DEBIT_CARD' || paymentMethod === 'CREDIT_CARD') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold font-mono text-slate-900 bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NET_BANKING' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                    >
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                      <option value="Axis Bank">Axis Bank</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Total & Pay Action */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-500">Amount to Pay</div>
                  <div className="text-xl font-black text-[#213d77]">₹{totalPayable}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('PASSENGERS')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePayment}
                    className="px-6 py-2.5 rounded-xl bg-[#fb792b] hover:bg-[#e6681b] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Pay ₹{totalPayable} & Confirm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'PROCESSING' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full border-4 border-[#213d77] border-t-transparent animate-spin mx-auto"></div>
              <div>
                <h4 className="text-base font-bold text-[#213d77]">Processing Your Reservation...</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Connecting with Indian Railways Passenger Reservation System (PRS). Please do not press back or refresh.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
