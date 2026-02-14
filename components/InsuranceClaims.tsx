import React from 'react';
import { InsuranceClaim } from '../types';
import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';

const MOCK_CLAIMS: InsuranceClaim[] = [
    { id: 'CLM-001', patientName: 'John Doe', provider: 'BlueCross', amount: 5000, status: 'Pending', date: '2023-10-25' },
    { id: 'CLM-002', patientName: 'Sarah Smith', provider: 'Aetna', amount: 1200, status: 'Approved', date: '2023-10-24' },
    { id: 'CLM-003', patientName: 'Mike Jones', provider: 'Cigna', amount: 350, status: 'Rejected', date: '2023-10-20' },
];

const InsuranceClaims: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Insurance Claims</h1>
                  <p className="text-slate-500">Process and track patient insurance claims.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Claim ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_CLAIMS.map(claim => (
                            <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{claim.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{claim.patientName}</td>
                                <td className="px-6 py-4 text-slate-600">{claim.provider}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${claim.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        claim.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        claim.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-orange-100 text-orange-700 border-orange-200'
                                    }`}>
                                        {claim.status === 'Approved' ? <CheckCircle2 size={14} /> : 
                                         claim.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50">
                                        <FileText size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InsuranceClaims;