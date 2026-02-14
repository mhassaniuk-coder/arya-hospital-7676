import React from 'react';
import { Visitor } from '../types';
import { Ticket, Clock, LogOut } from 'lucide-react';

const MOCK_VISITORS: Visitor[] = [
    { id: 'V-001', visitorName: 'John Smith', patientName: 'Sarah Johnson', checkInTime: '10:30 AM', status: 'Active' },
    { id: 'V-002', visitorName: 'Alice Brown', patientName: 'Michael Chen', checkInTime: '09:15 AM', status: 'Checked Out' },
];

const VisitorPass: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Visitor Management</h1>
                  <p className="text-slate-500">Issue passes and track visitors.</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
                    + Issue Pass
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_VISITORS.map(visitor => (
                    <div key={visitor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                                <Ticket size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${visitor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                {visitor.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{visitor.visitorName}</h3>
                        <p className="text-sm text-slate-500 mb-2">Visiting: {visitor.patientName}</p>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg mb-4">
                            <Clock size={16} />
                            Checked In: {visitor.checkInTime}
                        </div>

                        {visitor.status === 'Active' && (
                            <button className="w-full py-2 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <LogOut size={16} /> Check Out
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorPass;