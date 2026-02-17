import React, { useState } from 'react';
import { CallLog } from '../types';
import {
    Headphones, PhoneIncoming, Clock, CheckCircle2,
    AlertTriangle, ArrowRight, Phone, User, Calendar,
    Search, Filter, Plus, X
} from 'lucide-react';

const MOCK_CALLS: CallLog[] = [
    { id: '1', caller: '+1 555-0123', type: 'Appointment', agent: 'Alice', duration: '3m 12s', time: '10:05 AM', priority: 'Normal', status: 'Completed', notes: 'Scheduled for Dr. Smith' },
    { id: '2', caller: '+1 555-0987', type: 'Emergency', agent: 'Bob', duration: '1m 45s', time: '10:15 AM', priority: 'Critical', status: 'Transferred', notes: 'Transferred to ER immediately' },
    { id: '3', caller: '+1 555-4567', type: 'Inquiry', agent: 'Alice', duration: '5m 30s', time: '10:30 AM', priority: 'Normal', status: 'Active', notes: 'Asking about visiting hours' },
];

const CALL_TYPES = ['Inquiry', 'Emergency', 'Appointment', 'Complaint'];

const CallCenter: React.FC = () => {
    const [calls, setCalls] = useState<CallLog[]>(MOCK_CALLS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [newCall, setNewCall] = useState<Partial<CallLog>>({
        caller: '',
        type: 'Inquiry',
        agent: 'Current Agent',
        priority: 'Normal',
        notes: '',
        status: 'Active'
    });

    const stats = {
        total: calls.length,
        active: calls.filter(c => c.status === 'Active').length,
        emergency: calls.filter(c => c.type === 'Emergency').length,
        completed: calls.filter(c => c.status === 'Completed').length
    };

    const handleLogCall = () => {
        if (!newCall.caller) return;

        const call: CallLog = {
            id: Math.random().toString(36).substr(2, 9),
            caller: newCall.caller,
            type: newCall.type as any,
            agent: newCall.agent || 'Current Agent',
            duration: '0m 00s', // Initial duration
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            priority: newCall.priority as any,
            status: 'Active',
            notes: newCall.notes
        };

        setCalls([call, ...calls]);
        setIsModalOpen(false);
        setNewCall({ caller: '', type: 'Inquiry', agent: 'Current Agent', priority: 'Normal', notes: '', status: 'Active' });
    };

    const handleEndCall = (id: string) => {
        setCalls(calls.map(c => c.id === id ? { ...c, status: 'Completed', duration: '5m 20s' } : c));
    };

    const filteredCalls = calls.filter(call => {
        const matchesType = filterType === 'All' || call.type === filterType;
        const matchesSearch = call.caller.includes(searchQuery) ||
            call.agent.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getPriorityColor = (priority: string) => {
        if (priority === 'Critical') return 'bg-danger-light text-danger-dark';
        if (priority === 'High') return 'bg-warning-light text-warning-dark';
        return 'bg-info-light text-info-dark';
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Call Center</h1>
                    <p className="text-foreground-muted">Manage inbound calls, inquiries, and emergency dispatch.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 theme-transition"
                >
                    <Plus size={18} /> Log New Call
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Calls</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <Phone className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Active Now</p>
                            <h3 className="text-2xl font-bold text-success mt-1">{stats.active}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <Headphones className="text-success-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Emergencies</p>
                            <h3 className="text-2xl font-bold text-danger mt-1">{stats.emergency}</h3>
                        </div>
                        <div className="p-2 bg-danger-light rounded-lg">
                            <AlertTriangle className="text-danger-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Completed</p>
                            <h3 className="text-2xl font-bold text-foreground-secondary mt-1">{stats.completed}</h3>
                        </div>
                        <div className="p-2 bg-background-secondary rounded-lg">
                            <CheckCircle2 className="text-foreground-muted" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search caller number or agent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['All', ...CALL_TYPES].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterType === type
                                ? 'bg-accent/10 text-accent'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calls List */}
            <div className="bg-background-primary rounded-2xl shadow-sm border border-border-muted overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                                <th className="px-6 py-4">Caller / Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCalls.map(call => (
                                <tr key={call.id} className="hover:bg-background-secondary theme-transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${call.type === 'Emergency' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'}`}>
                                                <PhoneIncoming size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground-primary">{call.caller}</p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(call.priority)}`}>
                                                    {call.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${call.status === 'Active' ? 'bg-success-light text-success-dark border-success animate-pulse' :
                                            call.status === 'Completed' ? 'bg-background-secondary text-foreground-muted border-border' :
                                                'bg-warning-light text-warning-dark border-warning-dark'
                                            }`}>
                                            {call.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-foreground-secondary text-sm font-medium">{call.type}</td>
                                    <td className="px-6 py-4 text-foreground-secondary text-sm flex items-center gap-2">
                                        <User size={14} className="text-foreground-muted" /> {call.agent}
                                    </td>
                                    <td className="px-6 py-4 text-foreground-secondary text-sm font-mono">{call.duration}</td>
                                    <td className="px-6 py-4 text-foreground-muted text-sm flex items-center gap-1">
                                        <Clock size={14} /> {call.time}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {call.status === 'Active' && (
                                            <button
                                                onClick={() => handleEndCall(call.id)}
                                                className="text-danger hover:text-danger/80 text-xs font-bold uppercase hover:underline"
                                            >
                                                End Call
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Call Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground-primary">Log New Call</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-primary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Caller ID / Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="+1 555-0000"
                                    value={newCall.caller}
                                    onChange={e => setNewCall({ ...newCall, caller: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                        value={newCall.type}
                                        onChange={e => setNewCall({ ...newCall, type: e.target.value as any })}
                                    >
                                        {CALL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1">Priority</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                        value={newCall.priority}
                                        onChange={e => setNewCall({ ...newCall, priority: e.target.value as any })}
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Notes</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                    rows={3}
                                    placeholder="Call details..."
                                    value={newCall.notes}
                                    onChange={e => setNewCall({ ...newCall, notes: e.target.value })}
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
                                onClick={handleLogCall}
                                disabled={!newCall.caller}
                                className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                            >
                                Start Call Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallCenter;