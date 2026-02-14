import React from 'react';
import { SupportTicket } from '../types';
import { LifeBuoy, MoreHorizontal } from 'lucide-react';

const MOCK_TICKETS: SupportTicket[] = [
    { id: 'T-101', subject: 'Printer Jam in Ward 3', department: 'IT', requester: 'Nurse Joy', priority: 'Medium', status: 'Open' },
    { id: 'T-102', subject: 'AC Leaking in OT 2', department: 'Facility', requester: 'Dr. House', priority: 'High', status: 'In Progress' },
];

const HelpDesk: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Help Desk</h1>
                  <p className="text-slate-500">Internal IT and facility support tickets.</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md">
                    + New Ticket
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_TICKETS.map(ticket => (
                    <div key={ticket.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ticket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                {ticket.priority} Priority
                            </span>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={20} /></button>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-slate-500 mb-4">Reported by: {ticket.requester}</p>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <LifeBuoy size={16} />
                                {ticket.department}
                            </div>
                            <span className="text-sm font-medium text-blue-600">{ticket.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpDesk;