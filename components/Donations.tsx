import React from 'react';
import { Donation } from '../types';
import { Heart, DollarSign } from 'lucide-react';

const MOCK_DONATIONS: Donation[] = [
    { id: '1', donor: 'Charity Foundation X', amount: 50000, cause: 'Cancer Research', date: '2023-10-20' },
    { id: '2', donor: 'John Doe', amount: 1000, cause: 'Pediatric Ward', date: '2023-10-25' },
];

const Donations: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Donations</h1>
                  <p className="text-slate-500">Hospital charity funds and donors.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
                      <h3 className="font-bold text-lg mb-2">Total Raised</h3>
                      <div className="flex items-center gap-2">
                          <DollarSign size={24} />
                          <span className="text-4xl font-bold">51,000</span>
                      </div>
                      <p className="text-pink-100 text-sm mt-2">This Month</p>
                 </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Donor</th>
                            <th className="px-6 py-4">Cause</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_DONATIONS.map(d => (
                            <tr key={d.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <Heart size={16} className="text-pink-500" />
                                    {d.donor}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{d.cause}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${d.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{d.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Donations;