import React, { useState } from 'react';
import { BedDouble, User, Clock, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';

interface Bed {
  id: string;
  number: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';
  patientName?: string;
  admitDate?: string;
  doctor?: string;
  type: 'General' | 'ICU' | 'Private' | 'Emergency';
}

const BedManagement: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([
    { id: '101', number: 'A-101', ward: 'General Ward A', status: 'Occupied', patientName: 'John Doe', admitDate: '2024-03-10', doctor: 'Dr. Smith', type: 'General' },
    { id: '102', number: 'A-102', ward: 'General Ward A', status: 'Available', type: 'General' },
    { id: '103', number: 'A-103', ward: 'General Ward A', status: 'Cleaning', type: 'General' },
    { id: '104', number: 'A-104', ward: 'General Ward A', status: 'Occupied', patientName: 'Jane Smith', admitDate: '2024-03-12', doctor: 'Dr. Chen', type: 'General' },
    { id: '201', number: 'ICU-1', ward: 'Intensive Care', status: 'Occupied', patientName: 'Robert Brown', admitDate: '2024-03-14', doctor: 'Dr. Wilson', type: 'ICU' },
    { id: '202', number: 'ICU-2', ward: 'Intensive Care', status: 'Available', type: 'ICU' },
    { id: '301', number: 'P-301', ward: 'Private Wing', status: 'Available', type: 'Private' },
    { id: '302', number: 'P-302', ward: 'Private Wing', status: 'Maintenance', type: 'Private' },
  ]);

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Occupied': return 'bg-red-100 text-red-700 border-red-200';
      case 'Cleaning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Maintenance': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredBeds = filter === 'All' ? beds : beds.filter(b => b.ward.includes(filter) || b.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inpatient Bed Management</h1>
          <p className="text-slate-500">Real-time occupancy tracking and admission.</p>
        </div>
        <div className="flex gap-2">
            <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            >
                <option value="All">All Wards</option>
                <option value="General">General Ward</option>
                <option value="ICU">ICU</option>
                <option value="Private">Private Wing</option>
            </select>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                <Plus size={18} /> Admit Patient
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Total Beds</p>
                <p className="text-2xl font-bold text-slate-900">{beds.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><BedDouble size={24} /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Available</p>
                <p className="text-2xl font-bold text-green-600">{beds.filter(b => b.status === 'Available').length}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{beds.filter(b => b.status === 'Occupied').length}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><User size={24} /></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Blocked</p>
                <p className="text-2xl font-bold text-yellow-600">{beds.filter(b => ['Cleaning', 'Maintenance'].includes(b.status)).length}</p>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><AlertCircle size={24} /></div>
        </div>
      </div>

      {/* Visual Bed Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Ward View</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredBeds.map((bed) => (
                <div 
                    key={bed.id}
                    onClick={() => setSelectedBed(bed)}
                    className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md
                        ${selectedBed?.id === bed.id ? 'ring-2 ring-teal-500 ring-offset-2' : ''}
                        ${bed.status === 'Available' ? 'border-green-100 bg-green-50 hover:border-green-300' : 
                          bed.status === 'Occupied' ? 'border-red-100 bg-red-50 hover:border-red-300' :
                          'border-slate-100 bg-slate-50 hover:border-slate-300'}
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-700">{bed.number}</span>
                        <BedDouble size={16} className={`${
                             bed.status === 'Available' ? 'text-green-500' : 
                             bed.status === 'Occupied' ? 'text-red-500' : 'text-slate-400'
                        }`} />
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1">{bed.type}</p>
                    {bed.status === 'Occupied' ? (
                        <div className="mt-2 pt-2 border-t border-red-100">
                            <p className="text-xs font-bold text-slate-800 truncate">{bed.patientName}</p>
                            <p className="text-[10px] text-slate-500 truncate">{bed.doctor}</p>
                        </div>
                    ) : (
                        <div className="mt-2 pt-2 border-t border-transparent">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(bed.status)}`}>
                                {bed.status}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* Bed Detail Drawer (Simulated inline) */}
      {selectedBed && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 animate-scale-up">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BedDouble className="text-teal-600" /> 
                        Bed {selectedBed.number} Details
                    </h2>
                    <p className="text-slate-500">{selectedBed.ward} • {selectedBed.type}</p>
                </div>
                <button onClick={() => setSelectedBed(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-2 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-3">Current Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedBed.status)}`}>
                                    {selectedBed.status}
                                </span>
                            </div>
                            {selectedBed.status === 'Occupied' && (
                                <>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Patient Name</p>
                                        <p className="font-bold text-slate-900">{selectedBed.patientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Admitted On</p>
                                        <p className="font-medium text-slate-800">{selectedBed.admitDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Attending Doctor</p>
                                        <p className="font-medium text-slate-800">{selectedBed.doctor}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-bold text-slate-800 mb-2">Actions</h3>
                    {selectedBed.status === 'Available' ? (
                        <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                            Assign Patient
                        </button>
                    ) : selectedBed.status === 'Occupied' ? (
                        <>
                            <button className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                                View Patient Chart
                            </button>
                            <button className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors">
                                Discharge Patient
                            </button>
                            <button className="w-full bg-blue-50 text-blue-600 border border-blue-100 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors">
                                Transfer Bed
                            </button>
                        </>
                    ) : (
                        <button className="w-full bg-green-50 text-green-600 border border-green-100 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors">
                            Mark as Available
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
