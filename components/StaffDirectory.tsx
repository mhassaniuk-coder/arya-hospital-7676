import React from 'react';
import { Doctor } from '../types';
import { Mail, Phone, MoreHorizontal, Circle } from 'lucide-react';
import { useData } from '../src/contexts/DataContext';

const StaffDirectory: React.FC = () => {
  const { staff } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'text-green-500';
      case 'In Surgery': return 'text-red-500';
      case 'Offline': return 'text-slate-400';
      case 'On Break': return 'text-orange-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Directory</h1>
          <p className="text-slate-500">Manage doctors, nurses, and support staff.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20">
          + Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staff.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-slate-50 border border-slate-100 ${getStatusColor(doc.status)}`}>
                <Circle size={8} fill="currentColor" />
                {doc.status}
              </span>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-4 border-slate-50 group-hover:border-teal-50 transition-colors">
                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{doc.name}</h3>
              <p className="text-teal-600 text-sm font-medium">{doc.specialty}</p>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-slate-100">
               <div className="text-center flex-1 border-r border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Patients</p>
                  <p className="font-bold text-slate-800">{doc.patients}</p>
               </div>
               <div className="text-center flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Rating</p>
                  <p className="font-bold text-slate-800">4.9</p>
               </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                <Mail size={16} />
                Message
              </button>
              <button className="w-10 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors">
                <Phone size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffDirectory;