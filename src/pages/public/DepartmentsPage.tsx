import React from 'react';
import { Train, Plane, Bus, ShieldAlert, Cpu, Headset, CheckCircle2 } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const departments = [
    {
      name: 'Department of Railway Operations & Signalling',
      code: 'DEP-RAIL-01',
      icon: Train,
      description: 'Oversees timetable scheduling, rake allocation, coach tier allocations (1A, 2A, 3A, SL, 3E), dynamic pricing, and station stop synchronizations.',
      stats: '500+ Daily Express Runs • 98.8% Punctuality',
      services: ['Real-time PNR Tracking', 'Tatkal/Instant Quota Management', 'Platform Berth Mapping', 'Rolling Stock Monitoring']
    },
    {
      name: 'Department of Civil Aviation & Airport Transit',
      code: 'DEP-AIR-02',
      icon: Plane,
      description: 'Coordinates airline carrier schedules, airport gate slots, electronic baggage tags, and cabin seat inventories (Economy, Business).',
      stats: '120+ Domestic Routes • Instant Web Check-In',
      services: ['Flight Gate Allocation', 'Baggage Allowance Verification', 'Direct Boarding Passes', 'Flight Delay Compensation']
    },
    {
      name: 'Department of Interstate Surface Roadways',
      code: 'DEP-BUS-03',
      icon: Bus,
      description: 'Regulates certified intercity Volvo AC sleeper and luxury coach operators, GPS fleet telematics, highway rest-stop inspections, and driver rotations.',
      stats: '1,400+ Fleet Coaches • 24x7 Highway SOS',
      services: ['Live Telematics Tracking', 'Upper/Lower Berth Layouts', 'Rest Stop Amenities Audit', 'City Boarding Point Network']
    },
    {
      name: 'Central Ticketing, Security & Revenue Audit',
      code: 'DEP-SEC-04',
      icon: ShieldAlert,
      description: 'Administers the relational transaction database, fraud detection algorithms, simulated payment settlement gateways, and automated refund disbursements.',
      stats: 'Zero-Wait Refunds • Encrypted PNR Records',
      services: ['Role-Based Access Verification', 'GST Invoice Settlement', 'Automatic Cancellation Refund', 'Audit Log Trail']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#213d77] text-xs font-bold">
          <Train className="w-3.5 h-3.5 text-[#fb792b]" />
          <span>Operational Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#213d77] tracking-tight">
          Operational Departments & Divisions
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm">
          TS train_sys operates through specialized technical divisions ensuring reliable operations across passenger safety, transport capacity, and ticket settlements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dep, idx) => {
          const Icon = dep.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-sm transition space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#213d77]">
                  <Icon className="w-6 h-6 text-[#fb792b]" />
                </div>
                <span className="font-mono text-xs font-bold text-[#213d77] bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                  {dep.code}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{dep.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{dep.description}</p>
              </div>

              <div className="p-3 bg-[#f8f9fc] rounded-xl border border-slate-200 font-mono text-xs font-semibold text-[#213d77]">
                {dep.stats}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Key Responsibilities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {dep.services.map((svc, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{svc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
