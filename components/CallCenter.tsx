import React from 'react';
import { CallLog } from '../types';
import { Headphones, PhoneIncoming, Clock } from 'lucide-react';

const MOCK_CALLS: CallLog[] = [
    { id: '1', caller: '+1 555-0123', type: 'Appointment', agent: 'Alice', duration: '3m 12s', time: '10:05 AM' },
    { id: '2', caller: '+1 555-0987', type: 'Emergency', agent: 'Bob', duration: '1m 45s', time: '10:15 AM' },
];

const CallCenter: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Call Center</h1>
                  <p className="text-slate-500">Inbound call logs and inquiries.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Caller</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Agent</th>
                            <th className="px-6 py-4">Duration</th>
                            <th className="px-6 py-4">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CALLS.map(call => (
                            <tr key={call.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <PhoneIncoming size={16} className="text-slate-400" />
                                    {call.caller}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${call.type === 'Emergency' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {call.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{call.agent}</td>
                                <td className="px-6 py-4 text-slate-600">{call.duration}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm flex items-center gap-1">
                                    <Clock size={14} /> {call.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallCenter;