import React from 'react';
import { TransportRequest } from '../types';
import { Move, User, MapPin } from 'lucide-react';

const MOCK_TRANSPORT: TransportRequest[] = [
    { id: '1', patientName: 'John Doe', from: 'ER', to: 'Radiology', priority: 'Urgent', status: 'In Transit', porter: 'Sam' },
    { id: '2', patientName: 'Alice Smith', from: 'Ward A', to: 'Discharge', priority: 'Routine', status: 'Pending', porter: 'Unassigned' },
];

const InternalTransport: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Internal Transport</h1>
                  <p className="text-slate-500">Porter requests for patient movement.</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md">
                    Request Porter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_TRANSPORT.map(req => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${req.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                {req.priority}
                            </span>
                            <span className={`text-sm font-bold ${req.status === 'In Transit' ? 'text-green-600 animate-pulse' : 'text-slate-500'}`}>
                                {req.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-4">{req.patientName}</h3>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-1"><MapPin size={16} /> {req.from}</div>
                            <Move size={16} className="text-slate-300" />
                            <div className="flex items-center gap-1"><MapPin size={16} /> {req.to}</div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <User size={16} /> Porter: {req.porter}
                            </div>
                            {req.status === 'Pending' && (
                                <button className="text-teal-600 text-sm font-bold hover:underline">Assign</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InternalTransport;