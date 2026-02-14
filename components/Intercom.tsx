import React from 'react';
import { IntercomLog } from '../types';
import { Radio, Send, Bell } from 'lucide-react';

const MOCK_LOGS: IntercomLog[] = [
    { id: '1', sender: 'ER Desk', recipient: 'All Staff', message: 'Code Blue in Room 204', time: '10:00 AM', priority: 'Emergency' },
    { id: '2', sender: 'Admin', recipient: 'Dr. House', message: 'Please report to Admin Office', time: '09:30 AM', priority: 'Normal' },
];

const Intercom: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Intercom / Paging</h1>
                  <p className="text-slate-500">Hospital-wide announcements.</p>
                </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 text-white mb-6 flex items-center gap-4">
                <input type="text" placeholder="Type announcement..." className="flex-1 bg-slate-700 border-none rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-teal-500" />
                <button className="bg-teal-600 p-3 rounded-lg hover:bg-teal-700 transition-colors">
                    <Send size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_LOGS.map(log => (
                    <div key={log.id} className={`p-4 rounded-xl border-l-4 shadow-sm bg-white ${log.priority === 'Emergency' ? 'border-l-red-500' : 'border-l-blue-500'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800 flex items-center gap-2">
                                {log.priority === 'Emergency' && <Bell size={16} className="text-red-500 animate-pulse" />}
                                From: {log.sender}
                            </span>
                            <span className="text-xs text-slate-400">{log.time}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">To: <span className="font-medium text-slate-800">{log.recipient}</span></p>
                        <div className={`p-3 rounded-lg text-sm ${log.priority === 'Emergency' ? 'bg-red-50 text-red-800' : 'bg-slate-50 text-slate-700'}`}>
                            "{log.message}"
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Intercom;