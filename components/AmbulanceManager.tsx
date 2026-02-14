import React from 'react';
import { Ambulance } from '../types';
import { Truck, MapPin, Phone, ShieldAlert } from 'lucide-react';
import { useData } from '../src/contexts/DataContext';

const AmbulanceManager: React.FC = () => {
  const { ambulances } = useData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'On Route': return 'bg-orange-100 text-orange-700';
      case 'Maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ambulance Fleet</h1>
          <p className="text-slate-500">Track vehicle location and status.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ambulances.map((amb) => (
          <div key={amb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                <Truck size={24} />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(amb.status)}`}>
                {amb.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{amb.vehicleNumber}</h3>
            <p className="text-sm text-slate-500 mb-4">{amb.type} Unit</p>

            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon />
                  <span>{amb.driverName}</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} />
                  <span>{amb.location}</span>
               </div>
            </div>
            
            <div className="mt-6 flex gap-2">
               <button className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100">
                 Details
               </button>
               <button className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100">
                 <Phone size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

export default AmbulanceManager;