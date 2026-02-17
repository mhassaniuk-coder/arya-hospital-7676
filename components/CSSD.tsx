import React, { useState } from 'react';
import { SterilizationBatch } from '../types';
import {
    Flame, CheckCircle, AlertTriangle, Clock, Search, Filter,
    Plus, X, Box, Thermometer, User, History, ArrowRight
} from 'lucide-react';

const MOCK_BATCHES: SterilizationBatch[] = [
    { id: '1', setName: 'General Surgery Set A', cycleNumber: 'CYC-1024', sterilizationDate: '2023-10-26', expiryDate: '2023-11-26', status: 'Sterile', method: 'Autoclave', technician: 'Sarah Jones', items: ['Scalpel Handle', 'Forceps', 'Scissors'], startTime: '08:00', endTime: '09:30' },
    { id: '2', setName: 'Dental Kit B', cycleNumber: 'CYC-1025', sterilizationDate: '2023-10-26', expiryDate: '2023-11-26', status: 'Processing', method: 'Autoclave', technician: 'Mike Ross', items: ['Mirror', 'Probe', 'Excavator'], startTime: '10:00' },
    { id: '3', setName: 'Ortho Drill Set', cycleNumber: 'CYC-0998', sterilizationDate: '2023-09-20', expiryDate: '2023-10-20', status: 'Expired', method: 'ETO', technician: 'David Kim', items: ['Bone Drill', 'Bits', 'Wrench'], startTime: '09:00', endTime: '14:00' },
    { id: '4', setName: 'Endoscopy Set', cycleNumber: 'CYC-1026', sterilizationDate: '2023-10-27', expiryDate: '2023-11-27', status: 'Cleaning', method: 'Plasma', technician: 'Sarah Jones', items: ['Endoscope', 'Light Source'], startTime: '11:00' },
];

const METHODS = ['Autoclave', 'ETO', 'Plasma'];

const CSSD: React.FC = () => {
    const [batches, setBatches] = useState<SterilizationBatch[]>(MOCK_BATCHES);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Processing' | 'Sterile' | 'Expired'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [newBatch, setNewBatch] = useState<Partial<SterilizationBatch>>({
        setName: '',
        method: 'Autoclave',
        technician: '',
        items: [],
        status: 'Cleaning'
    });
    const [itemsText, setItemsText] = useState('');

    const stats = {
        total: batches.length,
        active: batches.filter(b => ['Processing', 'Cleaning'].includes(b.status)).length,
        sterile: batches.filter(b => b.status === 'Sterile').length,
        expired: batches.filter(b => b.status === 'Expired').length
    };

    const handleLogBatch = () => {
        if (!newBatch.setName || !newBatch.technician) return;

        const batch: SterilizationBatch = {
            id: Math.random().toString(36).substr(2, 9),
            setName: newBatch.setName,
            cycleNumber: `CYC-${Math.floor(1000 + Math.random() * 9000)}`,
            sterilizationDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
            status: 'Cleaning',
            method: newBatch.method as any,
            technician: newBatch.technician,
            items: itemsText.split(',').map(i => i.trim()).filter(i => i),
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setBatches([batch, ...batches]);
        setIsLogModalOpen(false);
        setNewBatch({ setName: '', method: 'Autoclave', technician: '', items: [], status: 'Cleaning' });
        setItemsText('');
    };

    const handleAdvanceStatus = (id: string, currentStatus: string) => {
        let nextStatus: any = currentStatus;
        if (currentStatus === 'Cleaning') nextStatus = 'Processing';
        else if (currentStatus === 'Processing') nextStatus = 'Sterile';

        if (nextStatus !== currentStatus) {
            setBatches(batches.map(b =>
                b.id === id ? {
                    ...b,
                    status: nextStatus,
                    endTime: nextStatus === 'Sterile' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.endTime
                } : b
            ));
        }
    };

    const filteredBatches = batches.filter(batch => {
        const matchesStatus = filterStatus === 'All' ||
            (filterStatus === 'Processing' ? ['Processing', 'Cleaning'].includes(batch.status) : batch.status === filterStatus);
        const matchesSearch = batch.setName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            batch.cycleNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Sterile': return 'bg-success-light text-success-dark border-success/30';
            case 'Processing': return 'bg-info-light text-info-dark border-info/30';
            case 'Cleaning': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
            case 'Expired': return 'bg-danger-light text-danger-dark border-danger/30';
            default: return 'bg-background-secondary text-foreground-secondary border-border';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">CSSD Sterilization</h1>
                    <p className="text-foreground-secondary">Track sterilization cycles and inventory.</p>
                </div>
                <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 theme-transition"
                >
                    <Plus size={18} /> Log New Batch
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Batches</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-background-secondary rounded-lg">
                            <Box className="text-foreground-muted" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Active Cycles</p>
                            <h3 className="text-2xl font-bold text-info-dark mt-1">{stats.active}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <Flame className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Sterile Inventory</p>
                            <h3 className="text-2xl font-bold text-success-dark mt-1">{stats.sterile}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <CheckCircle className="text-success-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Expired</p>
                            <h3 className="text-2xl font-bold text-danger-dark mt-1">{stats.expired}</h3>
                        </div>
                        <div className="p-2 bg-danger-light rounded-lg">
                            <AlertTriangle className="text-danger-dark" size={20} />
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
                        placeholder="Search batch or cycle number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {(['All', 'Processing', 'Sterile', 'Expired'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterStatus === status
                                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Batches Table/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBatches.map(batch => (
                    <div key={batch.id} className="bg-background-primary p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow theme-transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border flex items-center gap-1 ${getStatusColor(batch.status)}`}>
                                {batch.status === 'Processing' && <Flame size={12} className="animate-pulse" />}
                                {batch.status === 'Cleaning' && <Clock size={12} className="animate-spin-slow" />}
                                {batch.status}
                            </span>
                            <span className="font-mono text-xs text-foreground-muted bg-background-secondary px-2 py-1 rounded">
                                {batch.cycleNumber}
                            </span>
                        </div>

                        <h3 className="font-bold text-foreground-primary text-lg mb-2">{batch.setName}</h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground-muted flex items-center gap-1"><Thermometer size={14} /> Method</span>
                                <span className="font-medium text-foreground-primary">{batch.method}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground-muted flex items-center gap-1"><User size={14} /> Technician</span>
                                <span className="font-medium text-foreground-primary">{batch.technician}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground-muted flex items-center gap-1"><Clock size={14} /> Start Time</span>
                                <span className="font-medium text-foreground-primary">{batch.startTime}</span>
                            </div>
                        </div>

                        <div className="bg-background-secondary p-3 rounded-lg mb-4">
                            <p className="text-xs font-semibold text-foreground-muted mb-1 uppercase">Items</p>
                            <div className="flex flex-wrap gap-1">
                                {batch.items.map((item, i) => (
                                    <span key={i} className="text-xs bg-background-primary px-2 py-1 rounded border border-border-muted text-foreground-secondary">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-between items-center">
                            <div className="text-xs text-foreground-muted">
                                Exp: {batch.expiryDate}
                            </div>

                            {['Cleaning', 'Processing'].includes(batch.status) && (
                                <button
                                    onClick={() => handleAdvanceStatus(batch.id, batch.status)}
                                    className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-sm font-bold hover:bg-teal-50 dark:hover:bg-teal-900/30 px-3 py-1 rounded theme-transition"
                                >
                                    Next Stage <ArrowRight size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Log Batch Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground-primary">Log New Batch</h2>
                            <button
                                onClick={() => setIsLogModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Set Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="e.g. Surgical Tray A"
                                    value={newBatch.setName}
                                    onChange={e => setNewBatch({ ...newBatch, setName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Method</label>
                                <div className="flex gap-2">
                                    {METHODS.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setNewBatch({ ...newBatch, method: m as any })}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border theme-transition ${newBatch.method === m
                                                ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 text-teal-700 dark:text-teal-300'
                                                : 'border-border text-foreground-secondary hover:bg-background-secondary'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Technician</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="Technician Name"
                                    value={newBatch.technician}
                                    onChange={e => setNewBatch({ ...newBatch, technician: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Items (Comma separated)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-secondary text-foreground-primary theme-transition"
                                    rows={3}
                                    placeholder="Item 1, Item 2, Item 3"
                                    value={itemsText}
                                    onChange={e => setItemsText(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsLogModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogBatch}
                                disabled={!newBatch.setName || !newBatch.technician}
                                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
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

export default CSSD;