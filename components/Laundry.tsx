import React from 'react';
import { LaundryBatch } from '../types';
import { Shirt, RefreshCw } from 'lucide-react';

const MOCK_BATCHES: LaundryBatch[] = [
    { id: 'B-101', type: 'Bed Sheets', weight: '45 kg', status: 'Washing', department: 'ICU' },
    { id: 'B-102', type: 'Gowns', weight: '20 kg', status: 'Drying', department: 'OT' },
    { id: 'B-103', type: 'Towels', weight: '15 kg', status: 'Folded', department: 'General Ward' },
];

const Laundry: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Laundry Management</h1>
                  <p className="text-slate-500">Track linen cleaning cycles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_BATCHES.map(batch => (
                    <div key={batch.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                                <Shirt size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                batch.status === 'Folded' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                                {batch.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{batch.type}</h3>
                        <p className="text-sm text-slate-500 mb-4">From: {batch.department}</p>
                        
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                            <RefreshCw size={16} className={batch.status === 'Washing' ? 'animate-spin text-blue-500' : 'text-slate-400'} />
                            <span className="font-bold text-slate-700">{batch.weight}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Laundry;