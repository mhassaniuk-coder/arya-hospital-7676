import React, { useState } from 'react';
import { LaundryBatch } from '../types';
import {
    Shirt, RefreshCw, CheckCircle2, Truck, Plus, X,
    Search, Filter, Thermometer, Scale, Clock, ArrowRight
} from 'lucide-react';

const MOCK_BATCHES: LaundryBatch[] = [
    { id: 'B-101', type: 'Bed Sheets', weight: 45, status: 'Washing', department: 'ICU', temperature: 60, cycleType: 'Heavy Duty', startTime: '09:00 AM' },
    { id: 'B-102', type: 'Gowns', weight: 20, status: 'Drying', department: 'OT', temperature: 40, cycleType: 'Normal', startTime: '10:15 AM' },
    { id: 'B-103', type: 'Towels', weight: 15, status: 'Folded', department: 'General Ward', cycleType: 'Normal', startTime: '08:30 AM', completedTime: '11:00 AM' },
    { id: 'B-104', type: 'Uniforms', weight: 12, status: 'Collected', department: 'ER', startTime: '11:45 AM' },
];

const ITEM_TYPES = ['Bed Sheets', 'Gowns', 'Towels', 'Uniforms', 'Blankets'];
const DEPARTMENTS = ['ICU', 'OT', 'General Ward', 'ER', 'Pediatrics', 'Maternity'];

const Laundry: React.FC = () => {
    const [batches, setBatches] = useState<LaundryBatch[]>(MOCK_BATCHES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Collected' | 'Washing' | 'Drying' | 'Folded' | 'Delivered'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [newBatch, setNewBatch] = useState<Partial<LaundryBatch>>({
        type: 'Bed Sheets',
        weight: 0,
        department: 'General Ward',
        status: 'Collected',
        cycleType: 'Normal',
        temperature: 40
    });

    const stats = {
        totalWeight: batches.reduce((acc, b) => acc + b.weight, 0),
        active: batches.filter(b => ['Washing', 'Drying'].includes(b.status)).length,
        ready: batches.filter(b => b.status === 'Folded').length,
        delivered: batches.filter(b => b.status === 'Delivered').length
    };

    const handleLogBatch = () => {
        if (!newBatch.weight || !newBatch.department) return;

        const batch: LaundryBatch = {
            id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
            type: newBatch.type as any,
            weight: Number(newBatch.weight),
            department: newBatch.department,
            status: 'Collected',
            cycleType: newBatch.cycleType as any,
            temperature: newBatch.temperature,
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setBatches([batch, ...batches]);
        setIsModalOpen(false);
        setNewBatch({ type: 'Bed Sheets', weight: 0, department: 'General Ward', status: 'Collected', cycleType: 'Normal', temperature: 40 });
    };

    const handleAdvanceStatus = (id: string, currentStatus: string) => {
        let nextStatus: any = currentStatus;
        if (currentStatus === 'Collected') nextStatus = 'Washing';
        else if (currentStatus === 'Washing') nextStatus = 'Drying';
        else if (currentStatus === 'Drying') nextStatus = 'Folded';
        else if (currentStatus === 'Folded') nextStatus = 'Delivered';

        if (nextStatus !== currentStatus) {
            setBatches(batches.map(b =>
                b.id === id ? {
                    ...b,
                    status: nextStatus,
                    completedTime: nextStatus === 'Folded' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.completedTime
                } : b
            ));
        }
    };

    const filteredBatches = batches.filter(batch => {
        const matchesStatus = filterStatus === 'All' || batch.status === filterStatus;
        const matchesSearch = batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.department.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Washing': return 'bg-info-light text-info-dark border-info/30';
            case 'Drying': return 'bg-warning-light text-warning-dark border-warning/30';
            case 'Folded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
            case 'Delivered': return 'bg-success-light text-success-dark border-success/30';
            default: return 'bg-background-secondary text-foreground-secondary border-border';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Laundry Management</h1>
                    <p className="text-foreground-secondary">Track department linens and cleaning cycles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 theme-transition"
                >
                    <Plus size={18} /> Log New Batch
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Volume</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.totalWeight} <span className="text-sm font-normal text-foreground-muted">kg</span></h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <Scale className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Active Loads</p>
                            <h3 className="text-2xl font-bold text-warning-dark mt-1">{stats.active}</h3>
                        </div>
                        <div className="p-2 bg-warning-light rounded-lg">
                            <RefreshCw className="text-warning-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Ready for Delivery</p>
                            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.ready}</h3>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <Shirt className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Delivered Today</p>
                            <h3 className="text-2xl font-bold text-success-dark mt-1">{stats.delivered}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <Truck className="text-success-dark" size={20} />
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
                        placeholder="Search Batch ID or Department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-blue-500 theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {(['All', 'Collected', 'Washing', 'Drying', 'Folded', 'Delivered'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterStatus === status
                                ? 'bg-info-light text-info-dark'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Batches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBatches.map(batch => (
                    <div key={batch.id} className="bg-background-primary p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow theme-transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-info-light p-3 rounded-full text-info-dark">
                                <Shirt size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(batch.status)}`}>
                                {batch.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-foreground-primary text-lg">{batch.type}</h3>
                            <p className="text-sm text-foreground-muted">Batch: {batch.id} · From: {batch.department}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-background-secondary p-2 rounded-lg flex items-center gap-2">
                                <Scale size={16} className="text-foreground-muted" />
                                <span className="text-sm font-medium text-foreground-primary">{batch.weight} kg</span>
                            </div>
                            <div className="bg-background-secondary p-2 rounded-lg flex items-center gap-2">
                                <Thermometer size={16} className="text-foreground-muted" />
                                <span className="text-sm font-medium text-foreground-primary">{batch.temperature}°C</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-foreground-muted mb-4 pt-4 border-t border-border">
                            <span className="flex items-center gap-1"><Clock size={12} /> Started: {batch.startTime}</span>
                            {batch.completedTime && <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Done: {batch.completedTime}</span>}
                        </div>

                        {batch.status !== 'Delivered' && (
                            <button
                                onClick={() => handleAdvanceStatus(batch.id, batch.status)}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 theme-transition"
                            >
                                {batch.status === 'Collected' && 'Start Washing'}
                                {batch.status === 'Washing' && 'Start Drying'}
                                {batch.status === 'Drying' && 'Mark Folded'}
                                {batch.status === 'Folded' && 'Mark Delivered'}
                                <ArrowRight size={16} />
                            </button>
                        )}

                        {batch.status === 'Delivered' && (
                            <button disabled className="w-full py-2 bg-background-secondary text-foreground-muted rounded-lg font-medium text-sm cursor-not-allowed">
                                Process Completed
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Log Batch Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground-primary">Log Laundry Batch</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Item Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background-secondary text-foreground-primary theme-transition"
                                    value={newBatch.type}
                                    onChange={e => setNewBatch({ ...newBatch, type: e.target.value as any })}
                                >
                                    {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Department</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background-secondary text-foreground-primary theme-transition"
                                    value={newBatch.department}
                                    onChange={e => setNewBatch({ ...newBatch, department: e.target.value })}
                                >
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background-secondary text-foreground-primary theme-transition"
                                        placeholder="0"
                                        value={newBatch.weight}
                                        onChange={e => setNewBatch({ ...newBatch, weight: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Temp (°C)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 bg-background-secondary text-foreground-primary theme-transition"
                                        placeholder="40"
                                        value={newBatch.temperature}
                                        onChange={e => setNewBatch({ ...newBatch, temperature: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Cycle Type</label>
                                <div className="flex gap-2">
                                    {['Normal', 'Heavy Duty', 'Delicate'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setNewBatch({ ...newBatch, cycleType: c as any })}
                                            className={`flex-1 py-2 text-xs font-medium rounded-lg border theme-transition ${newBatch.cycleType === c
                                                ? 'bg-info-light border-info text-info-dark'
                                                : 'border-border text-foreground-secondary hover:bg-background-secondary'
                                                }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
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
                                onClick={handleLogBatch}
                                disabled={!newBatch.weight}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                            >
                                Log Batch
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Laundry;