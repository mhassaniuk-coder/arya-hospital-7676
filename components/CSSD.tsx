import React from 'react';
import { SterilizationBatch } from '../types';
import { Flame, CheckCircle, AlertTriangle } from 'lucide-react';

const MOCK_BATCHES: SterilizationBatch[] = [
    { id: '1', setName: 'General Surgery Set A', cycleNumber: 'CYC-1024', sterilizationDate: '2023-10-26', expiryDate: '2023-11-26', status: 'Sterile' },
    { id: '2', setName: 'Dental Kit B', cycleNumber: 'CYC-1025', sterilizationDate: '2023-10-26', expiryDate: '2023-11-26', status: 'Processing' },
    { id: '3', setName: 'Ortho Drill Set', cycleNumber: 'CYC-0998', sterilizationDate: '2023-09-20', expiryDate: '2023-10-20', status: 'Expired' },
];

const CSSD: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">CSSD Sterilization</h1>
                  <p className="text-slate-500">Track instrument sterilization cycles.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Set Name</th>
                            <th className="px-6 py-4">Cycle No.</th>
                            <th className="px-6 py-4">Sterilized Date</th>
                            <th className="px-6 py-4">Expiry Date</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_BATCHES.map(batch => (
                            <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <Flame size={16} className="text-orange-500" />
                                    {batch.setName}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-mono text-xs">{batch.cycleNumber}</td>
                                <td className="px-6 py-4 text-slate-600">{batch.sterilizationDate}</td>
                                <td className="px-6 py-4 text-slate-600">{batch.expiryDate}</td>
                                <td className="px-6 py-4">
                                     <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${
                                        batch.status === 'Sterile' ? 'bg-green-100 text-green-700' :
                                        batch.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {batch.status === 'Sterile' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                        {batch.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CSSD;