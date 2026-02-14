import React from 'react';
import { LostItem } from '../types';
import { HelpCircle, Search, CheckCircle } from 'lucide-react';

const MOCK_ITEMS: LostItem[] = [
    { id: 'L-001', item: 'Black Leather Wallet', foundLocation: 'Cafeteria', dateFound: '2023-10-25', status: 'Unclaimed', finder: 'Staff A' },
    { id: 'L-002', item: 'iPhone 13', foundLocation: 'Lobby Waiting Area', dateFound: '2023-10-24', status: 'Returned', finder: 'Security' },
];

const LostAndFound: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
                  <p className="text-slate-500">Registry of items found in the hospital.</p>
                </div>
                <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md">
                    Report Found Item
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Item Description</th>
                            <th className="px-6 py-4">Location Found</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ITEMS.map(item => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                    <HelpCircle size={16} className="text-slate-400" />
                                    {item.item}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{item.foundLocation}</td>
                                <td className="px-6 py-4 text-slate-600">{item.dateFound}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Returned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {item.status}
                                     </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 text-sm font-medium hover:underline">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LostAndFound;