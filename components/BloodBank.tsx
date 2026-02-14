import React from 'react';
import { BloodUnit } from '../types';
import { Droplet, AlertTriangle, Plus } from 'lucide-react';

const MOCK_BLOOD: BloodUnit[] = [
  { id: '1', group: 'A+', bags: 12, status: 'Adequate' },
  { id: '2', group: 'A-', bags: 3, status: 'Low' },
  { id: '3', group: 'B+', bags: 15, status: 'Adequate' },
  { id: '4', group: 'B-', bags: 2, status: 'Critical' },
  { id: '5', group: 'O+', bags: 20, status: 'Adequate' },
  { id: '6', group: 'O-', bags: 4, status: 'Low' },
  { id: '7', group: 'AB+', bags: 8, status: 'Adequate' },
  { id: '8', group: 'AB-', bags: 1, status: 'Critical' },
];

const BloodBank: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Adequate': return 'bg-green-100 text-green-700';
      case 'Low': return 'bg-orange-100 text-orange-700';
      case 'Critical': return 'bg-red-100 text-red-700 animate-pulse';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blood Bank</h1>
          <p className="text-slate-500">Manage blood inventory and donations.</p>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-md flex items-center gap-2">
          <Plus size={18} /> Record Donation
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_BLOOD.map((unit) => (
          <div key={unit.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-red-100 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-black text-lg shadow-sm">
                      {unit.group}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(unit.status)}`}>
                      {unit.status}
                  </span>
               </div>
               
               <div className="flex items-end gap-2">
                   <span className="text-3xl font-bold text-slate-800">{unit.bags}</span>
                   <span className="text-slate-500 mb-1 text-sm font-medium">Units</span>
               </div>
               <p className="text-xs text-slate-400 mt-2">Last updated: 2h ago</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
               <AlertTriangle size={24} />
            </div>
            <div>
               <h3 className="font-bold text-slate-800">Urgent Request: B- Negative</h3>
               <p className="text-sm text-slate-500">ICU Ward • Patient ID: P-102</p>
            </div>
         </div>
         <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
            Dispatch Units
         </button>
      </div>
    </div>
  );
};

export default BloodBank;