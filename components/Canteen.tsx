import React, { useState } from 'react';
import { CanteenItem } from '../types';
import {
    Coffee, Plus, Search, Filter, Edit2, Trash2,
    ShoppingBag, DollarSign, Clock, Users, X, Image as ImageIcon
} from 'lucide-react';

const MOCK_MENU: CanteenItem[] = [
    { id: '1', name: 'Veg Sandwich', category: 'Snack', price: 4.50, available: true, image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?auto=format&fit=crop&q=80&w=300' },
    { id: '2', name: 'Chicken Salad', category: 'Meal', price: 8.00, available: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300' },
    { id: '3', name: 'Cappuccino', category: 'Beverage', price: 3.00, available: true, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=300' },
    { id: '4', name: 'Fresh Juice', category: 'Beverage', price: 3.50, available: false, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=300' },
];

const CATEGORIES = ['All', 'Meal', 'Snack', 'Beverage'];

const Canteen: React.FC = () => {
    const [menu, setMenu] = useState<CanteenItem[]>(MOCK_MENU);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [newItem, setNewItem] = useState<Partial<CanteenItem>>({
        name: '',
        category: 'Meal',
        price: 0,
        available: true,
        image: ''
    });

    const stats = {
        totalItems: menu.length,
        activeOrders: 12, // Mock
        totalSales: 450.50, // Mock
        lowStock: menu.filter(i => !i.available).length
    };

    const handleAddItem = () => {
        if (!newItem.name || !newItem.price) return;

        const item: CanteenItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newItem.name,
            category: newItem.category as any,
            price: Number(newItem.price),
            available: newItem.available || true,
            image: newItem.image
        };

        setMenu([...menu, item]);
        setIsModalOpen(false);
        setNewItem({ name: '', category: 'Meal', price: 0, available: true, image: '' });
    };

    const toggleAvailability = (id: string) => {
        setMenu(menu.map(item => item.id === id ? { ...item, available: !item.available } : item));
    };

    const filteredMenu = menu.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Canteen</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage menu items, orders, and cafeteria inventory.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> Add Menu Item
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Active Orders</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stats.activeOrders}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <ShoppingBag className="text-orange-600 dark:text-orange-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total Sales</p>
                            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">${stats.totalSales.toFixed(2)}</h3>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <DollarSign className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Menu Items</p>
                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.totalItems}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Coffee className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Out of Stock</p>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stats.lowStock}</h3>
                        </div>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <Clock className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMenu.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group">
                        <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <Coffee size={40} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${item.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {item.available ? 'Available' : 'Sold Out'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">{item.category}</p>
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.name}</h3>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                                ${item.price.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => toggleAvailability(item.id)}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${item.available
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                                        : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
                                    }`}
                            >
                                {item.available ? 'Mark Sold Out' : 'Mark Available'}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Item Card (Visual) */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-orange-600 hover:border-orange-200 dark:hover:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all h-full min-h-[300px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <Plus size={24} />
                    </div>
                    <span className="font-bold">Add New Item</span>
                </button>
            </div>

            {/* Add Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Menu Item</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                                    placeholder="e.g. Pasta Alfredo"
                                    value={newItem.name}
                                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                                    >
                                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                                        placeholder="0.00"
                                        value={newItem.price}
                                        onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (Optional)</label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                                            placeholder="https://..."
                                            value={newItem.image}
                                            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!newItem.name || !newItem.price}
                                className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Canteen;