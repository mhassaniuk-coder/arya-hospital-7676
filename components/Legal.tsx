import React from 'react';
import { LegalCase } from '../types';
import { Scale, FileText } from 'lucide-react';

const MOCK_CASES: LegalCase[] = [
    { id: '1', caseNumber: 'MLC-2023-045', patientName: 'John Doe', type: 'Accident', policeStation: 'Central Station', status: 'Active' },
    { id: '2', caseNumber: 'MLC-2023-042', patientName: 'Jane Smith', type: 'Assault', policeStation: 'North Precinct', status: 'Closed' },
];

const Legal: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Legal / MLC</h1>
                  <p className="text-slate-500">Medico-Legal Cases and documentation.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Case No.</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Police Station</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CASES.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{c.caseNumber}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{c.patientName}</td>
                                <td className="px-6 py-4 text-slate-600">{c.type}</td>
                                <td className="px-6 py-4 text-slate-600">{c.policeStation}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Active' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {c.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 hover:underline"><FileText size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Legal;