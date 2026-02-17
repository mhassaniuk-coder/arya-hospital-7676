import React, { useState } from 'react';
import { TransportRequest } from '../types';
import {
    Move, User, MapPin, Clock, AlertCircle, CheckCircle,
    Search, Filter, Plus, X, Ambulance, Timer
} from 'lucide-react';

const MOCK_TRANSPORT: TransportRequest[] = [
    { id: '1', patientName: 'John Doe', from: 'ER', to: 'Radiology', priority: 'Urgent', status: 'In Transit', porter: 'Sam Wilson', timestamp: '10:30 AM', notes: 'Patient on oxygen support' },
    { id: '2', patientName: 'Alice Smith', from: 'Ward A', to: 'Discharge', priority: 'Routine', status: 'Pending', porter: 'Unassigned', timestamp: '11:15 AM' },
    { id: '3', patientName: 'Robert Brown', from: 'ICU', to: 'Surgery', priority: 'Emergency', status: 'Pending', porter: 'Unassigned', timestamp: '11:45 AM', notes: 'Prepare operational theater immediately' },
    { id: '4', patientName: 'Emily Davis', from: 'Radiology', to: 'Ward B', priority: 'Routine', status: 'Completed', porter: 'Mike Johnson', timestamp: '09:00 AM' },
];

const LOCATIONS = ['ER', 'ICU', 'Radiology', 'Surgery', 'Ward A', 'Ward B', 'Discharge', 'Labor & Delivery', 'Pharmacy', 'Lab'];
const PRIORITIES = ['Routine', 'Urgent', 'Emergency'];
const PORTERS = ['Sam Wilson', 'Mike Johnson', 'Sarah Davis', 'Chris Evans', 'Jessica Jones'];

const InternalTransport: React.FC = () => {
    const [requests, setRequests] = useState<TransportRequest[]>(MOCK_TRANSPORT);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In Transit' | 'Completed'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // New Request Form State
    const [newRequest, setNewRequest] = useState<Partial<TransportRequest>>({
        patientName: '',
        from: '',
        to: '',
        priority: 'Routine',
        notes: ''
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        inTransit: requests.filter(r => r.status === 'In Transit').length,
        completed: requests.filter(r => r.status === 'Completed').length
    };

    const handleCreateRequest = () => {
        if (!newRequest.patientName || !newRequest.from || !newRequest.to) return;

        const request: TransportRequest = {
            id: Math.random().toString(36).substr(2, 9),
            patientName: newRequest.patientName,
            from: newRequest.from,
            to: newRequest.to,
            priority: newRequest.priority as any,
            status: 'Pending',
            porter: 'Unassigned',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            notes: newRequest.notes
        };

        setRequests([request, ...requests]);
        setIsRequestModalOpen(false);
        setNewRequest({ patientName: '', from: '', to: '', priority: 'Routine', notes: '' });
    };

    const handleAssignPorter = (porterName: string) => {
        if (!selectedRequest) return;
        const updatedRequests = requests.map(req =>
            req.id === selectedRequest.id ? { ...req, porter: porterName, status: 'In Transit' as const } : req
        );
        setRequests(updatedRequests);
        setIsAssignModalOpen(false);
        setSelectedRequest(null);
    };

    const handleStatusUpdate = (id: string, newStatus: 'Pending' | 'In Transit' | 'Completed') => {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
        const matchesSearch = req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.porter.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Emergency': return 'bg-danger-light text-danger-dark border-danger-dark';
            case 'Urgent': return 'bg-warning-light text-warning-dark border-warning-dark';
            default: return 'bg-info-light text-info-dark border-info-dark';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'text-warning-dark';
            case 'In Transit': return 'text-info-dark animate-pulse';
            case 'Completed': return 'text-success';
            default: return 'text-foreground-muted';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Internal Transport</h1>
                    <p className="text-foreground-muted">Manage patient movement and porter assignments.</p>
                </div>
                <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 theme-transition"
                >
                    <Plus size={18} /> Request Porter
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Total Requests</p>
                            <h3 className="text-2xl font-bold text-foreground-primary mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <Move className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Pending</p>
                            <h3 className="text-2xl font-bold text-warning-dark mt-1">{stats.pending}</h3>
                        </div>
                        <div className="p-2 bg-warning-light rounded-lg">
                            <Clock className="text-warning-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">In Transit</p>
                            <h3 className="text-2xl font-bold text-info-dark mt-1">{stats.inTransit}</h3>
                        </div>
                        <div className="p-2 bg-info-light rounded-lg">
                            <Ambulance className="text-info-dark" size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-background-primary p-4 rounded-xl shadow-sm border border-border-muted">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-medium text-foreground-muted uppercase">Completed</p>
                            <h3 className="text-2xl font-bold text-success mt-1">{stats.completed}</h3>
                        </div>
                        <div className="p-2 bg-success-light rounded-lg">
                            <CheckCircle className="text-success-dark" size={20} />
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
                        placeholder="Search patient or porter..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-secondary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent theme-transition"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {(['All', 'Pending', 'In Transit', 'Completed'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap theme-transition ${filterStatus === status
                                ? 'bg-accent/10 text-accent'
                                : 'text-foreground-secondary hover:bg-background-secondary'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Request Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map(req => (
                    <div key={req.id} className="bg-background-primary p-6 rounded-2xl shadow-sm border border-border-muted hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${req.status === 'Completed' ? 'bg-success' :
                            req.status === 'In Transit' ? 'bg-info-dark' : 'bg-warning-dark'
                            }`} />

                        <div className="flex justify-between items-start mb-4 pl-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getPriorityColor(req.priority)}`}>
                                {req.priority}
                            </span>
                            <span className={`text-sm font-bold flex items-center gap-1 ${getStatusColor(req.status)}`}>
                                {req.status === 'In Transit' && <Timer size={14} className="animate-spin-slow" />}
                                {req.status}
                            </span>
                        </div>

                        <h3 className="font-bold text-foreground-primary text-lg mb-1 pl-2">{req.patientName}</h3>
                        <p className="text-xs text-foreground-muted pl-2 mb-4 flex items-center gap-1">
                            <Clock size={12} /> Requested at {req.timestamp}
                        </p>

                        <div className="flex items-center gap-3 text-sm text-foreground-secondary mb-4 bg-background-secondary p-3 rounded-lg mx-2">
                            <div className="flex items-center gap-1 font-medium"><MapPin size={16} className="text-accent" /> {req.from}</div>
                            <Move size={16} className="text-border" />
                            <div className="flex items-center gap-1 font-medium"><MapPin size={16} className="text-success" /> {req.to}</div>
                        </div>

                        {req.notes && (
                            <div className="mx-2 mb-4 p-2 bg-warning-light border border-warning-dark/30 rounded text-xs text-warning-dark flex items-start gap-2">
                                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                {req.notes}
                            </div>
                        )}

                        <div className="pt-4 border-t border-border flex items-center justify-between pl-2">
                            <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                <User size={16} />
                                <span className={req.porter === 'Unassigned' ? 'italic' : 'font-medium text-foreground-secondary'}>
                                    {req.porter}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {req.status === 'Pending' && (
                                    <button
                                        onClick={() => { setSelectedRequest(req); setIsAssignModalOpen(true); }}
                                        className="text-accent text-sm font-bold hover:bg-accent/10 px-3 py-1 rounded theme-transition"
                                    >
                                        Assign
                                    </button>
                                )}
                                {req.status === 'In Transit' && (
                                    <button
                                        onClick={() => handleStatusUpdate(req.id, 'Completed')}
                                        className="text-success text-sm font-bold hover:bg-success-light px-3 py-1 rounded theme-transition"
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Request Modal */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground-primary">New Transport Request</h2>
                            <button
                                onClick={() => setIsRequestModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-primary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Patient Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                    placeholder="e.g. John Doe"
                                    value={newRequest.patientName}
                                    onChange={e => setNewRequest({ ...newRequest, patientName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1">From</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                        value={newRequest.from}
                                        onChange={e => setNewRequest({ ...newRequest, from: e.target.value })}
                                    >
                                        <option value="">Select Location</option>
                                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1">To</label>
                                    <select
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                        value={newRequest.to}
                                        onChange={e => setNewRequest({ ...newRequest, to: e.target.value })}
                                    >
                                        <option value="">Select Location</option>
                                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Priority</label>
                                <div className="flex gap-2">
                                    {PRIORITIES.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setNewRequest({ ...newRequest, priority: p as any })}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg border theme-transition ${newRequest.priority === p
                                                ? 'bg-accent/10 border-accent text-accent'
                                                : 'border-border text-foreground-muted hover:bg-background-secondary'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-secondary text-foreground-primary theme-transition"
                                    rows={3}
                                    placeholder="e.g. Needs oxygen, Wheelchair required"
                                    value={newRequest.notes}
                                    onChange={e => setNewRequest({ ...newRequest, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsRequestModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateRequest}
                                disabled={!newRequest.patientName || !newRequest.from || !newRequest.to}
                                className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                            >
                                Create Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {isAssignModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-primary rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground-primary">Assign Porter</h2>
                            <p className="text-sm text-foreground-muted mt-1">
                                For request #{selectedRequest.id} - {selectedRequest.patientName}
                            </p>
                        </div>

                        <div className="p-4 space-y-2">
                            {PORTERS.map(porter => (
                                <button
                                    key={porter}
                                    onClick={() => handleAssignPorter(porter)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-background-secondary rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-foreground-secondary font-bold text-xs">
                                            {porter.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-foreground-secondary font-medium">{porter}</span>
                                    </div>
                                    <Plus size={16} className="text-foreground-muted group-hover:text-accent transition-colors opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>

                        <div className="p-4 border-t border-border bg-background-secondary flex justify-end">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalTransport;