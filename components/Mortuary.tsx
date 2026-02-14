import React from 'react';
import { MortuaryRecord } from '../types';
import { Skull, FileText } from 'lucide-react';

const MOCK_MORTUARY: MortuaryRecord[] = [
    { id: 'M-001', deceasedName: 'Richard Roe', dateOfDeath: '2023-10-25', freezerNo: 'F-04', status: 'Occupied', relativeName: 'Jane Roe' },
    { id: 'M-002', deceasedName: 'John Doe Sr.', dateOfDeath: '2023-10-24', freezerNo: 'F-02', status: 'Released', relativeName: 'Mike Doe' },
];

const Mortuary: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Mortuary</h1>
                  <p className="text-slate-500">Morgue occupancy and release records.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Deceased Name</th>
                            <th className="px-6 py-4">Date of Death</th>
                            <th className="px-6 py-4">Freezer No.</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_MORTUARY.map(record => (
                            <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-slate-500">{record.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <Skull size={14} className="text-slate-400" />
                                    {record.deceasedName}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{record.dateOfDeath}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">{record.freezerNo}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'Released' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'}`}>
                                         {record.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-teal-600"><FileText size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Mortuary;