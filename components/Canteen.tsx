import React from 'react';
import { CanteenItem } from '../types';
import { Coffee, Plus } from 'lucide-react';

const MOCK_MENU: CanteenItem[] = [
    { id: '1', name: 'Veg Sandwich', category: 'Snack', price: 4.50, available: true },
    { id: '2', name: 'Chicken Salad', category: 'Meal', price: 8.00, available: true },
    { id: '3', name: 'Cappuccino', category: 'Beverage', price: 3.00, available: true },
    { id: '4', name: 'Fresh Juice', category: 'Beverage', price: 3.50, available: false },
];

const Canteen: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Hospital Canteen</h1>
                  <p className="text-slate-500">Staff and visitor cafeteria management.</p>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-md">
                    Manage Orders
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Today's Menu</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {MOCK_MENU.map(item => (
                        <div key={item.id} className={`p-4 rounded-xl border ${item.available ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                    <Coffee size={20} />
                                </div>
                                <span className="font-bold text-slate-800">${item.price.toFixed(2)}</span>
                            </div>
                            <h4 className="font-bold text-slate-700">{item.name}</h4>
                            <p className="text-xs text-slate-500 mb-3">{item.category}</p>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="text-xs font-medium text-slate-600">{item.available ? 'Available' : 'Sold Out'}</span>
                            </div>
                        </div>
                    ))}
                    <button className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-orange-300 hover:text-orange-600 transition-colors">
                        <Plus size={24} className="mb-2" />
                        <span className="text-sm font-medium">Add Item</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Canteen;