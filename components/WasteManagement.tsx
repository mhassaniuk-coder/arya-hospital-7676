import React, { useState } from 'react';
import { WasteRecord } from '../types';
import {
    Trash2, Scale, Brain, RefreshCw, TrendingUp, TrendingDown,
    AlertTriangle, DollarSign, Leaf, Clock, Plus, X, Search,
    Filter, CheckCircle, ArrowRight, FileText
} from 'lucide-react';
import { useWasteManagement } from '../hooks/useAI';
import { WasteManagementInput } from '../types';

const WasteManagement: React.FC = () => {
    // Local State for Demo
    const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([
        { id: 'W-001', type: 'Infectious', weight: 12.5, unit: 'kg', source: 'ICU', handler: 'John Doe', collectionTime: '08:00 AM', disposalStatus: 'Collected' },
        { id: 'W-002', type: 'Sharps', weight: 3.2, unit: 'kg', source: 'Emergency', handler: 'Jane Smith', collectionTime: '08:15 AM', disposalStatus: 'Incinerated' },
        { id: 'W-003', type: 'General', weight: 45.0, unit: 'kg', source: 'Ward 3', handler: 'Mike Johnson', collectionTime: '09:00 AM', disposalStatus: 'Pending' },
    ]);

    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newLog, setNewLog] = useState<Partial<WasteRecord>>({
        type: 'General',
        weight: 0,
        unit: 'kg',
        source: '',
        handler: '',
        disposalStatus: 'Pending'
    });

    // AI Hooks
    const [showAIPanel, setShowAIPanel] = useState(false);
    const { data: aiResult, loading: aiLoading, error: aiError, execute: executeAI } = useWasteManagement();

    const handleLogWaste = () => {
        if (!newLog.source || !newLog.weight) return;

        const record: WasteRecord = {
            id: `W-${Date.now().toString().slice(-3)}`,
            type: newLog.type as any,
            weight: Number(newLog.weight),
            unit: newLog.unit || 'kg',
            source: newLog.source,
            handler: newLog.handler || 'Current User',
            collectionTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            disposalStatus: 'Pending'
        };

        setWasteRecords([record, ...wasteRecords]);
        setIsLogModalOpen(false);
        setNewLog({ type: 'General', weight: 0, unit: 'kg', source: '', handler: '', disposalStatus: 'Pending' });
    };

    const updateStatus = (id: string, status: WasteRecord['disposalStatus']) => {
        setWasteRecords(wasteRecords.map(record =>
            record.id === id ? { ...record, disposalStatus: status } : record
        ));
    };

    const runAIAnalysis = () => {
        const input: WasteManagementInput = {
            wasteRecords: wasteRecords,
            historicalGeneration: [
                { date: '2024-03-01', type: 'Infectious', weight: 15.2, department: 'ICU' },
                { date: '2024-03-01', type: 'Sharps', weight: 4.1, department: 'Emergency' },
                { date: '2024-03-02', type: 'General', weight: 52.0, department: 'Ward 3' },
                { date: '2024-03-03', type: 'Chemical', weight: 2.5, department: 'Laboratory' },
                { date: '2024-03-04', type: 'Infectious', weight: 18.3, department: 'Surgery' },
                { date: '2024-03-05', type: 'Sharps', weight: 5.2, department: 'ICU' },
            ],
            collectionSchedule: [
                { day: 'Monday', time: '08:00', type: 'Infectious' },
                { day: 'Wednesday', time: '08:00', type: 'Sharps' },
                { day: 'Daily', time: '09:00', type: 'General' },
            ],
            storageCapacity: [
                { type: 'Infectious', currentLevel: 75, maxCapacity: 100 },
                { type: 'Sharps', currentLevel: 40, maxCapacity: 50 },
                { type: 'General', currentLevel: 120, maxCapacity: 200 },
                { type: 'Chemical', currentLevel: 15, maxCapacity: 50 },
            ]
        };
        executeAI(input);
        setShowAIPanel(true);
    };

    const filteredRecords = wasteRecords.filter(r =>
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Collected': return 'bg-info-light text-info-dark border-info/30';
            case 'Incinerated': return 'bg-danger-light text-danger-dark border-danger/30';
            case 'Disposed': return 'bg-success-light text-success-dark border-success/30';
            default: return 'bg-background-secondary text-foreground-secondary border-border';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Infectious': return 'border-l-yellow-400';
            case 'Sharps': return 'border-l-red-500';
            case 'Chemical': return 'border-l-orange-500';
            case 'Radioactive': return 'border-l-purple-500';
            default: return 'border-l-blue-400';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Bio-Medical Waste Management</h1>
                    <p className="text-foreground-secondary">Track waste disposal, compliance, and environmental impact.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setIsLogModalOpen(true)}
                        className="bg-background-elevated text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 shadow-md flex items-center gap-2 theme-transition"
                    >
                        <Plus size={16} /> Log Waste
                    </button>
                    <button
                        onClick={runAIAnalysis}
                        disabled={aiLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50 theme-transition"
                    >
                        <Brain size={16} />
                        {aiLoading ? 'Analyzing...' : 'AI Analysis'}
                    </button>
                </div>
            </div>

            {/* AI Waste Management Panel */}
            {showAIPanel && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 shadow-lg overflow-hidden animate-scale-up">
                    <div className="p-4 bg-green-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Waste Management Analysis</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white theme-transition">✕</button>
                    </div>

                    {aiLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-green-600 dark:text-green-400" size={32} />
                            <p className="text-foreground-secondary">Analyzing waste generation patterns and optimizing collection schedules...</p>
                        </div>
                    )}

                    {aiError && (
                        <div className="p-4 bg-danger-light text-danger-dark">
                            <p>Error: {aiError}</p>
                        </div>
                    )}

                    {aiResult && (
                        <div className="p-6 space-y-6">
                            {/* Generation Predictions */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <TrendingUp size={18} />
                                    Waste Generation Predictions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {aiResult.generationPredictions?.map((pred, idx) => (
                                        <div key={idx} className="bg-background-primary p-4 rounded-lg border border-green-200 dark:border-green-800/50 theme-transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-foreground-primary">{pred.wasteType}</p>
                                                <span className={`flex items-center gap-1 text-xs ${pred.trend === 'increasing' ? 'text-danger-dark' :
                                                    pred.trend === 'decreasing' ? 'text-success-dark' :
                                                        'text-info-dark'
                                                    }`}>
                                                    {pred.trend === 'increasing' ? <TrendingUp size={12} /> :
                                                        pred.trend === 'decreasing' ? <TrendingDown size={12} /> :
                                                            <span>→</span>}
                                                    {pred.trend}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{pred.predictedWeight} kg</p>
                                            <p className="text-xs text-foreground-muted">{pred.timeframe}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* ... (Other AI sections can be kept concise for now, focusing on core functionality) ... */}
                            {/* Cost Analysis */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <DollarSign size={18} />
                                    Cost Optimization
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.costAnalysis?.slice(0, 3).map((cost, idx) => (
                                        <div key={idx} className="bg-background-primary p-4 rounded-lg border border-green-200 dark:border-green-800/50 theme-transition">
                                            <div className="flex justify-between font-medium text-lg mb-2">
                                                <span className="text-foreground-secondary">Potential Savings:</span>
                                                <span className="text-success-dark">${cost.savings.toLocaleString()}</span>
                                            </div>
                                            <p className="text-xs text-foreground-muted">{cost.recommendations?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Waste Logs Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-3">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs by type or source..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-border bg-background-primary text-foreground-primary rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm placeholder:text-foreground-muted theme-transition"
                        />
                    </div>
                </div>

                {filteredRecords.map(record => (
                    <div key={record.id} className={`p-6 rounded-2xl border-l-4 shadow-sm bg-background-primary transition-all hover:shadow-md theme-transition ${getTypeColor(record.type)}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-foreground-primary text-lg">{record.type} Waste</h3>
                                <p className="text-xs text-foreground-muted">{record.source} • {record.handler}</p>
                            </div>
                            <Trash2 size={20} className="text-foreground-muted" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <Scale size={16} className="text-foreground-muted" />
                            <span className="font-bold text-2xl text-foreground-primary">{record.weight} <span className="text-sm font-normal text-foreground-muted">{record.unit}</span></span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-4 border-t border-border">
                            <span className="text-foreground-muted flex items-center gap-1"><Clock size={12} /> {record.collectionTime}</span>

                            {record.disposalStatus === 'Pending' ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(record.id, 'Collected')}
                                        className="px-2 py-1 bg-info-light text-info-dark text-xs rounded hover:bg-info/20 font-medium theme-transition"
                                    >
                                        Collect
                                    </button>
                                </div>
                            ) : record.disposalStatus === 'Collected' ? (
                                <button
                                    onClick={() => updateStatus(record.id, 'Incinerated')}
                                    className="px-2 py-1 bg-warning-light text-warning-dark text-xs rounded hover:bg-warning/20 font-medium theme-transition"
                                >
                                    Incinerate
                                </button>
                            ) : (
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(record.disposalStatus)}`}>
                                    {record.disposalStatus}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Log Waste Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary">
                            <h2 className="text-xl font-bold text-foreground-primary">Log Waste Collection</h2>
                            <button
                                onClick={() => setIsLogModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Waste Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background-secondary text-foreground-primary theme-transition"
                                    value={newLog.type}
                                    onChange={e => setNewLog({ ...newLog, type: e.target.value as any })}
                                >
                                    <option value="General">General</option>
                                    <option value="Infectious">Infectious (Yellow)</option>
                                    <option value="Sharps">Sharps (Red)</option>
                                    <option value="Chemical">Chemical/Glass (Blue)</option>
                                    <option value="Radioactive">Radioactive</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Weight</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background-secondary text-foreground-primary theme-transition"
                                        placeholder="0.00"
                                        value={newLog.weight}
                                        onChange={e => setNewLog({ ...newLog, weight: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Unit</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background-secondary text-foreground-primary theme-transition"
                                        value={newLog.unit}
                                        onChange={e => setNewLog({ ...newLog, unit: e.target.value })}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                        <option value="tons">tons</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Source (Dept/Ward)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="e.g. ICU, OT-1"
                                    value={newLog.source}
                                    onChange={e => setNewLog({ ...newLog, source: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-primary mb-1">Handler Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="Staff Name"
                                    value={newLog.handler}
                                    onChange={e => setNewLog({ ...newLog, handler: e.target.value })}
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
                                onClick={handleLogWaste}
                                disabled={!newLog.weight || !newLog.source}
                                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition shadow-lg shadow-green-500/30"
                            >
                                Log Collection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WasteManagement;
