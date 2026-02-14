import React from 'react';
import { KitchenOrder } from '../types';
import { UtensilsCrossed, Clock, CheckCircle2 } from 'lucide-react';

const MOCK_ORDERS: KitchenOrder[] = [
    { id: '1', patientName: 'Sarah Johnson', room: '304-A', dietType: 'Low Sodium', status: 'Cooking' },
    { id: '2', patientName: 'Michael Chen', room: 'ICU-02', dietType: 'Liquid Only', status: 'Pending' },
    { id: '3', patientName: 'Anita Patel', room: '104-A', dietType: 'Diabetic', status: 'Delivered' },
];

const DietaryKitchen: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dietary Kitchen</h1>
                  <p className="text-slate-500">Manage patient meal preparation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_ORDERS.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-50 p-3 rounded-full text-orange-600">
                                <UtensilsCrossed size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{order.patientName}</h3>
                        <p className="text-sm text-slate-500 mb-4">Room: {order.room}</p>
                        
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                            <p className="text-xs text-slate-400 uppercase font-bold">Diet Requirement</p>
                            <p className="font-medium text-slate-700">{order.dietType}</p>
                        </div>

                        {order.status !== 'Delivered' && (
                            <button className="w-full py-2 bg-teal-600 text-white rounded-lg font-medium text-sm hover:bg-teal-700 transition-colors">
                                Mark as Delivered
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DietaryKitchen;