import React from 'react';
import { Incident } from '../types';
import { FileWarning, AlertTriangle } from 'lucide-react';

const MOCK_INCIDENTS: Incident[] = [
    { id: 'INC-001', type: 'Patient Fall', location: 'Ward A Corridor', reportedBy: 'Staff B', date: '2023-10-26', severity: 'Medium', status: 'Investigating' },
    { id: 'INC-002', type: 'Medication Error', location: 'ICU', reportedBy: 'Dr. Ross', date: '2023-10-25', severity: 'High', status: 'Closed' },
];

const IncidentReporting: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Incident Reporting</h1>
                  <p className="text-slate-500">Safety incident logging and tracking.</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-md">
                    Report Incident
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Severity</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_INCIDENTS.map(inc => (
                            <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <FileWarning size={16} className="text-slate-400" />
                                    {inc.type}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{inc.location}</td>
                                <td className="px-6 py-4 text-slate-600">{inc.date}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${inc.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {inc.severity}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-700">{inc.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IncidentReporting;