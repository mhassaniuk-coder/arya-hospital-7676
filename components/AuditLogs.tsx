import React from 'react';
import { AuditLog } from '../types';
import { ScrollText, ShieldAlert, CheckCircle } from 'lucide-react';

const MOCK_LOGS: AuditLog[] = [
    { id: 'LOG-001', user: 'Dr. Chen', action: 'Viewed Patient Record', resource: 'P-101', timestamp: '10:30:45 AM', status: 'Success' },
    { id: 'LOG-002', user: 'Admin', action: 'Deleted Appointment', resource: 'APT-443', timestamp: '10:15:20 AM', status: 'Success' },
    { id: 'LOG-003', user: 'Nurse Joy', action: 'Dispensed Medication', resource: 'MED-221', timestamp: '09:45:00 AM', status: 'Failed' },
];

const AuditLogs: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                  <p className="text-slate-500">System activity and compliance tracking.</p>
                </div>
                <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Resource</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                        {MOCK_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">{log.user}</td>
                                <td className="px-6 py-4 text-slate-800">{log.action}</td>
                                <td className="px-6 py-4 text-slate-500">{log.resource}</td>
                                <td className="px-6 py-4">
                                    {log.status === 'Success' ? (
                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Success</span>
                                    ) : (
                                        <span className="text-red-600 flex items-center gap-1"><ShieldAlert size={12} /> Failed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;