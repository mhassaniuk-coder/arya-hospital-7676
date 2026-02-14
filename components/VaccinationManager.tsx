import React from 'react';
import { Vaccine } from '../types';
import { Syringe, Calendar } from 'lucide-react';

const MOCK_VACCINES: Vaccine[] = [
    { id: '1', name: 'COVID-19 (Pfizer)', stock: 150, batchNo: 'BATCH-001', expiry: '2024-05-01' },
    { id: '2', name: 'Influenza', stock: 50, batchNo: 'BATCH-002', expiry: '2023-12-01' },
    { id: '3', name: 'Hepatitis B', stock: 200, batchNo: 'BATCH-003', expiry: '2025-01-01' },
];

const VaccinationManager: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Vaccination Drive</h1>
                  <p className="text-slate-500">Manage vaccine stock and appointments.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Vaccine Name</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Batch No.</th>
                            <th className="px-6 py-4">Expiry Date</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_VACCINES.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <Syringe size={18} />
                                        </div>
                                        <span className="font-semibold text-slate-900">{v.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-800">{v.stock}</td>
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{v.batchNo}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{v.expiry}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 text-sm font-medium hover:underline">Schedule</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VaccinationManager;