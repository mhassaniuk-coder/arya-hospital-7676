import React, { useState } from 'react';
import { KitchenOrder } from '../types';
import {
    UtensilsCrossed, Clock, CheckCircle2, ChefHat,
    Search, Filter, Plus, X, AlertTriangle, User,
    Calendar, Soup, ArrowRight, Sparkles, Loader2
} from 'lucide-react';

const MOCK_ORDERS: KitchenOrder[] = [
    { id: '1', patientName: 'Sarah Johnson', room: '304-A', dietType: 'Low Sodium', status: 'Cooking', allergies: ['Peanuts'], instructions: 'No salt on veggies', timestamp: '10:30 AM' },
    { id: '2', patientName: 'Michael Chen', room: 'ICU-02', dietType: 'Liquid Only', status: 'Pending', allergies: [], instructions: 'Serve warm', timestamp: '11:15 AM' },
    { id: '3', patientName: 'Anita Patel', room: '104-A', dietType: 'Diabetic', status: 'Delivered', allergies: ['Gluten'], instructions: 'Sugar-free dessert', timestamp: '09:00 AM' },
    { id: '4', patientName: 'John Doe', room: '201-B', dietType: 'Regular', status: 'Pending', allergies: [], timestamp: '11:45 AM' },
];

const DIET_TYPES = ['Regular', 'Low Sodium', 'Diabetic', 'Liquid Only', 'Vegan', 'Gluten-Free', 'Renal', 'Soft Food'];
const ALLERGIES = ['Peanuts', 'Gluten', 'Dairy', 'Soy', 'Shellfish', 'Eggs'];

const DietaryKitchen: React.FC = () => {
    const [orders, setOrders] = useState<KitchenOrder[]>(MOCK_ORDERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Cooking' | 'Delivered'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [newOrder, setNewOrder] = useState<Partial<KitchenOrder>>({
        patientName: '',
        room: '',
        dietType: 'Regular',
        allergies: [],
        instructions: '',
        status: 'Pending'
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const generateNutritionPlan = async () => {
        if (!newOrder.patientName) return;
        setIsGenerating(true);
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock AI response
        const mockPlans: Record<string, any> = {
            'default': {
                dietType: 'Balanced',
                instructions: 'Ensure balanced macronutrients: 50% carbs, 20% protein, 30% fat. Include fresh fruits and vegetables with every meal.',
                allergies: []
            },
            'diabetes': {
                dietType: 'Diabetic',
                instructions: 'Strictly control carbohydrate intake. Prioritize whole grains and low-glycemic index foods. No added sugars.',
                allergies: []
            },
            'hypertension': {
                dietType: 'Low Sodium',
                instructions: 'Limit sodium intake to <1500mg/day. Avoid processed foods and added salt. Increase potassium-rich foods.',
                allergies: []
            }
        };

        // Simple keyword matching for demo purposes
        const name = newOrder.patientName.toLowerCase();
        let plan = mockPlans['default'];
        if (name.includes('diabet') || name.includes('sugar')) plan = mockPlans['diabetes'];
        else if (name.includes('pressure') || name.includes('hyper')) plan = mockPlans['hypertension'];

        setNewOrder(prev => ({
            ...prev,
            dietType: plan.dietType,
            instructions: plan.instructions,
            allergies: plan.allergies
        }));
        setIsGenerating(false);
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        cooking: orders.filter(o => o.status === 'Cooking').length,
        delivered: orders.filter(o => o.status === 'Delivered').length
    };

    const handleCreateOrder = () => {
        if (!newOrder.patientName || !newOrder.room) return;

        const order: KitchenOrder = {
            id: Math.random().toString(36).substr(2, 9),
            patientName: newOrder.patientName,
            room: newOrder.room,
            dietType: newOrder.dietType || 'Regular',
            status: 'Pending',
            allergies: newOrder.allergies || [],
            instructions: newOrder.instructions,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setOrders([order, ...orders]);
        setIsModalOpen(false);
        setNewOrder({ patientName: '', room: '', dietType: 'Regular', allergies: [], instructions: '', status: 'Pending' });
    };

    const handleStatusUpdate = (id: string, newStatus: 'Pending' | 'Cooking' | 'Delivered') => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const toggleAllergy = (allergy: string) => {
        const current = newOrder.allergies || [];
        if (current.includes(allergy)) {
            setNewOrder({ ...newOrder, allergies: current.filter(a => a !== allergy) });
        } else {
            setNewOrder({ ...newOrder, allergies: [...current, allergy] });
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesSearch = order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.room.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getDietColor = (type: string) => {
        if (['Liquid Only', 'Renal'].includes(type)) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
        if (['Diabetic', 'Low Sodium'].includes(type)) return 'bg-info-light text-info-dark border-info/30';
        if (['Vegan', 'Gluten-Free'].includes(type)) return 'bg-success-light text-success-dark border-success/30';
        return 'bg-background-secondary text-foreground-secondary border-border';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Dietary Kitchen</h1>
                    <p className="text-foreground-secondary">Manage patient meal preparation and delivery.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 theme-transition"
                >
                    <Plus size={18} /> Create Meal Plan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Orders</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <UtensilsCrossed className="text-orange-600 dark:text-orange-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Pending</p>
                            <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</h3>
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Cooking</p>
                            <h3 className="text-2xl font-bold text-info-dark mt-1">{stats.cooking}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <ChefHat className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Delivered</p>
                            <h3 className="text-2xl font-bold text-success-dark mt-1">{stats.delivered}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <CheckCircle2 className="text-success-dark" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search patient or room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-orange-500 theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {(['All', 'Pending', 'Cooking', 'Delivered'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterStatus === status
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-background-primary p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden group hover:shadow-md transition-shadow theme-transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full text-orange-600 dark:text-orange-400">
                                <UtensilsCrossed size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${order.status === 'Delivered' ? 'bg-success-light text-success-dark border-success/30' :
                                order.status === 'Cooking' ? 'bg-info-light text-info-dark border-info/30' :
                                    'bg-warning-light text-warning-dark border-warning/30'
                                }`}>
                                {order.status}
                            </span>
                        </div>

                        <h3 className="font-bold text-foreground-primary text-lg">{order.patientName}</h3>
                        <p className="text-sm text-foreground-muted mb-4 flex items-center gap-1">
                            <User size={14} /> Room: {order.room} · <Clock size={14} /> {order.timestamp}
                        </p>

                        <div className={`p-3 rounded-xl border mb-4 ${getDietColor(order.dietType)}`}>
                            <p className="text-xs uppercase font-bold opacity-70 mb-1 flex items-center gap-1">
                                <Soup size={12} /> Diet Requirement
                            </p>
                            <p className="font-medium">{order.dietType}</p>
                        </div>

                        {(order.allergies && order.allergies.length > 0) && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-danger-dark mb-2 flex items-center gap-1">
                                    <AlertTriangle size={12} /> Allergies
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {order.allergies.map(allergy => (
                                        <span key={allergy} className="text-xs bg-danger-light text-danger-dark px-2 py-1 rounded border border-danger/30">
                                            {allergy}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {order.instructions && (
                            <p className="text-xs text-foreground-secondary italic bg-background-secondary p-2 rounded mb-4">
                                "{order.instructions}"
                            </p>
                        )}

                        <div className="pt-4 border-t border-border flex gap-2">
                            {order.status === 'Pending' && (
                                <button
                                    onClick={() => handleStatusUpdate(order.id, 'Cooking')}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 theme-transition"
                                >
                                    Start Cooking
                                </button>
                            )}
                            {order.status === 'Cooking' && (
                                <button
                                    onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 theme-transition"
                                >
                                    Mark Delivered
                                </button>
                            )}
                            {order.status === 'Delivered' && (
                                <button disabled className="flex-1 py-2 bg-background-secondary text-foreground-muted rounded-lg font-medium text-sm cursor-not-allowed">
                                    Completed
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground-primary">Create Meal Plan</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Patient Name</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-secondary text-foreground-primary theme-transition"
                                            placeholder="e.g. John Doe (Diabetes)"
                                            value={newOrder.patientName}
                                            onChange={e => setNewOrder({ ...newOrder, patientName: e.target.value })}
                                        />
                                        <button
                                            onClick={generateNutritionPlan}
                                            disabled={isGenerating || !newOrder.patientName}
                                            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px] theme-transition"
                                            title="Auto-generate nutrition plan"
                                        >
                                            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-foreground-muted mt-1">Tip: Add condition (e.g. "Diabetes") to name for AI suggestions.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Room Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-secondary text-foreground-primary theme-transition"
                                        placeholder="e.g. 304-A"
                                        value={newOrder.room}
                                        onChange={e => setNewOrder({ ...newOrder, room: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Diet Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-secondary text-foreground-primary theme-transition"
                                    value={newOrder.dietType}
                                    onChange={e => setNewOrder({ ...newOrder, dietType: e.target.value })}
                                >
                                    {DIET_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-2">Allergies</label>
                                <div className="flex flex-wrap gap-2">
                                    {ALLERGIES.map(allergy => (
                                        <button
                                            key={allergy}
                                            onClick={() => toggleAllergy(allergy)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border theme-transition ${(newOrder.allergies || []).includes(allergy)
                                                ? 'bg-danger-light text-danger-dark border-danger/30'
                                                : 'bg-background-secondary text-foreground-secondary border-border hover:bg-danger-light hover:text-danger-dark'
                                                }`}
                                        >
                                            {allergy}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Special Instructions</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-secondary text-foreground-primary theme-transition"
                                    rows={3}
                                    placeholder="e.g. No salt, serve warm..."
                                    value={newOrder.instructions}
                                    onChange={e => setNewOrder({ ...newOrder, instructions: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateOrder}
                                disabled={!newOrder.patientName || !newOrder.room}
                                className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                            >
                                Create Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DietaryKitchen;