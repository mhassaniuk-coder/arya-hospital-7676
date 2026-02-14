import React from 'react';
import { Invoice } from '../types';
import { Download, Eye, DollarSign } from 'lucide-react';
import { useData } from '../src/contexts/DataContext';

const Billing: React.FC = () => {
    const { invoices, addInvoice, getStats } = useData();
    const stats = getStats();

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
                <p className="text-slate-500">Manage patient payments and financial records.</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20">
                 Create New Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-slate-500 text-sm font-medium">Total Revenue (Monthly)</p>
                     <p className="text-3xl font-bold text-slate-800 mt-2">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-slate-500 text-sm font-medium">Pending Payments</p>
                     <p className="text-3xl font-bold text-orange-600 mt-2">${stats.pendingRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                     <p className="text-slate-500 text-sm font-medium">Overdue Invoices</p>
                     <p className="text-3xl font-bold text-red-600 mt-2">{invoices.filter(i => i.status === 'Overdue').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{inv.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{inv.patientName}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{inv.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${inv.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        inv.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                        inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                        'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-teal-600 p-2"><Eye size={18} /></button>
                                    <button className="text-slate-400 hover:text-slate-600 p-2"><Download size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Billing;