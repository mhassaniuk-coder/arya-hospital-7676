import React from 'react';
import { VitalRecord } from '../types';
import { FileHeart, Search, Plus } from 'lucide-react';

const MOCK_RECORDS: VitalRecord[] = [
    { id: 'R-1', type: 'Birth', name: 'Baby Boy Johnson', date: '2023-10-26', time: '04:30 AM', doctor: 'Dr. John Doe' },
    { id: 'R-2', type: 'Death', name: 'Richard Roe', date: '2023-10-25', time: '11:15 PM', doctor: 'Dr. Michael Ross' },
];

const VitalRecords: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vital Records</h1>
          <p className="text-slate-500">Registry of births and deaths.</p>
        </div>
        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md flex items-center gap-2">
          <Plus size={18} /> Add Record
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
               <div className="relative w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm" />
               </div>
          </div>
          <table className="w-full text-left">
              <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Attending Doctor</th>
                      <th className="px-6 py-4 text-right">Certificate</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {MOCK_RECORDS.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{rec.id}</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.type === 'Birth' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                  {rec.type}
                              </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">{rec.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{rec.date} <span className="text-slate-400 text-xs ml-1">{rec.time}</span></td>
                          <td className="px-6 py-4 text-sm text-slate-600">{rec.doctor}</td>
                          <td className="px-6 py-4 text-right">
                              <button className="text-teal-600 text-sm font-medium hover:underline">View</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default VitalRecords;