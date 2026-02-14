import React from 'react';
import { WasteRecord } from '../types';
import { Trash2, Scale } from 'lucide-react';

const MOCK_WASTE: WasteRecord[] = [
    { id: 'W-001', type: 'Infectious', weight: 12.5, collectionTime: '08:00 AM', disposalStatus: 'Collected' },
    { id: 'W-002', type: 'Sharps', weight: 3.2, collectionTime: '08:15 AM', disposalStatus: 'Incinerated' },
    { id: 'W-003', type: 'General', weight: 45.0, collectionTime: '09:00 AM', disposalStatus: 'Pending' },
];

const WasteManagement: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Bio-Medical Waste</h1>
                  <p className="text-slate-500">Track waste disposal categories and weight.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_WASTE.map(record => (
                    <div key={record.id} className={`p-6 rounded-2xl border-l-4 shadow-sm bg-white ${
                        record.type === 'Infectious' ? 'border-l-yellow-400' :
                        record.type === 'Sharps' ? 'border-l-red-500' :
                        'border-l-blue-400'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">{record.type} Waste</h3>
                            <Trash2 size={20} className="text-slate-400" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Scale size={16} className="text-slate-500" />
                            <span className="font-bold text-2xl text-slate-900">{record.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{record.collectionTime}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                record.disposalStatus === 'Incinerated' ? 'bg-red-100 text-red-700' :
                                record.disposalStatus === 'Collected' ? 'bg-green-100 text-green-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {record.disposalStatus}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WasteManagement;