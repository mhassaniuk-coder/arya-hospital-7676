import React, { useState, useMemo } from 'react';
import { SupportTicket } from '../types';
import { LifeBuoy, Plus, Search, X, Clock, CheckCircle, AlertCircle, Filter, MessageSquare, Monitor, Wrench, Users as UsersIcon, ChevronDown, Edit2 } from 'lucide-react';

const INITIAL_TICKETS: SupportTicket[] = [
    { id: 'T-101', subject: 'Printer Jam in Ward 3', department: 'IT', requester: 'Nurse Joy', priority: 'Medium', status: 'Open' },
    { id: 'T-102', subject: 'AC Leaking in OT 2', department: 'Facility', requester: 'Dr. House', priority: 'High', status: 'In Progress' },
    { id: 'T-103', subject: 'Email Not Working', department: 'IT', requester: 'Dr. Chen', priority: 'Low', status: 'Resolved' },
    { id: 'T-104', subject: 'Broken Window Lock - ICU', department: 'Facility', requester: 'Nurse Smith', priority: 'High', status: 'Open' },
    { id: 'T-105', subject: 'Software Update Required', department: 'IT', requester: 'Admin', priority: 'Medium', status: 'In Progress' },
    { id: 'T-106', subject: 'Elevator Malfunction', department: 'Facility', requester: 'Security', priority: 'High', status: 'Open' },
    { id: 'T-107', subject: 'New Employee Setup', department: 'IT', requester: 'HR Team', priority: 'Low', status: 'Resolved' },
    { id: 'T-108', subject: 'Payroll System Error', department: 'IT', requester: 'Finance Dept', priority: 'High', status: 'Open' },
];

const CATEGORIES = ['IT', 'Facility', 'HR', 'Other'];
const PRIORITIES: SupportTicket['priority'][] = ['High', 'Medium', 'Low'];
const STATUSES: SupportTicket['status'][] = ['Open', 'In Progress', 'Resolved'];

const HelpDesk: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);
    const [formData, setFormData] = useState({ subject: '', department: 'IT', requester: '', priority: 'Medium' as SupportTicket['priority'], description: '' });

    const filtered = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.requester.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tickets, searchQuery, statusFilter, priorityFilter]);

    const stats = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length,
    }), [tickets]);

    const handleCreate = () => {
        if (!formData.subject.trim() || !formData.requester.trim()) return;
        const newTicket: SupportTicket = {
            id: `T-${200 + tickets.length}`,
            subject: formData.subject,
            department: formData.department,
            requester: formData.requester,
            priority: formData.priority,
            status: 'Open',
        };
        setTickets(prev => [newTicket, ...prev]);
        setShowModal(false);
        setFormData({ subject: '', department: 'IT', requester: '', priority: 'Medium', description: '' });
    };

    const updateStatus = (id: string, newStatus: SupportTicket['status']) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (detailTicket?.id === id) setDetailTicket(prev => prev ? { ...prev, status: newStatus } : null);
    };

    const priorityColor = (p: string) => p === 'High' ? 'bg-danger-light text-danger-dark' : p === 'Medium' ? 'bg-warning-light text-warning-dark' : 'bg-background-tertiary text-foreground-secondary';
    const statusColor = (s: string) => s === 'Open' ? 'bg-info-light text-info-dark' : s === 'In Progress' ? 'bg-warning-light text-warning-dark' : 'bg-success-light text-success-dark';
    const statusIcon = (s: string) => s === 'Open' ? <AlertCircle size={14} /> : s === 'In Progress' ? <Clock size={14} /> : <CheckCircle size={14} />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Help Desk</h1>
                    <p className="text-foreground-muted">Internal IT and facility support tickets.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
                    <Plus size={18} /> New Ticket
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tickets', value: stats.total, icon: <LifeBuoy size={22} />, color: 'bg-info-light text-info-dark' },
                    { label: 'Open', value: stats.open, icon: <AlertCircle size={22} />, color: 'bg-danger-light text-danger-dark' },
                    { label: 'In Progress', value: stats.inProgress, icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
                    { label: 'Resolved', value: stats.resolved, icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
                ].map((s, i) => (
                    <div key={i} className="bg-background-elevated p-5 rounded-2xl shadow-sm border border-border theme-transition">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-foreground-primary">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
                            <option value="All">All Status</option>{STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
                            <option value="All">All Priority</option>{PRIORITIES.map(p => <option key={p}>{p}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                                <th className="px-6 py-4">Ticket</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Requester</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-background-tertiary theme-transition cursor-pointer" onClick={() => setDetailTicket(ticket)}>
                                    <td className="px-6 py-4 font-mono text-xs text-foreground-muted">{ticket.id}</td>
                                    <td className="px-6 py-4 font-medium text-foreground-primary">{ticket.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-foreground-secondary">
                                            {ticket.department === 'IT' ? <Monitor size={14} /> : <Wrench size={14} />}
                                            {ticket.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-foreground-secondary">{ticket.requester}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityColor(ticket.priority)}`}>{ticket.priority}</span></td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${statusColor(ticket.status)}`}>{statusIcon(ticket.status)}{ticket.status}</span></td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <select value={ticket.status} onChange={e => updateStatus(ticket.id, e.target.value as SupportTicket['status'])}
                                            className="text-xs bg-transparent border border-border rounded-lg px-2 py-1 text-foreground-secondary outline-none cursor-pointer theme-transition">
                                            {STATUSES.map(st => <option key={st}>{st}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-foreground-muted">
                        <LifeBuoy size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No tickets found</p>
                    </div>
                )}
            </div>

            {/* Detail Side Panel */}
            {detailTicket && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end" onClick={() => setDetailTicket(null)}>
                    <div className="bg-background-elevated w-full max-w-md h-full shadow-2xl overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono text-foreground-muted">{detailTicket.id}</p>
                                <h3 className="text-lg font-bold text-foreground-primary">{detailTicket.subject}</h3>
                            </div>
                            <button onClick={() => setDetailTicket(null)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs text-foreground-muted mb-1">Priority</p><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${priorityColor(detailTicket.priority)}`}>{detailTicket.priority}</span></div>
                                <div><p className="text-xs text-foreground-muted mb-1">Status</p><span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${statusColor(detailTicket.status)}`}>{statusIcon(detailTicket.status)}{detailTicket.status}</span></div>
                                <div><p className="text-xs text-foreground-muted mb-1">Category</p><p className="text-sm font-medium text-foreground-secondary">{detailTicket.department}</p></div>
                                <div><p className="text-xs text-foreground-muted mb-1">Requester</p><p className="text-sm font-medium text-foreground-secondary">{detailTicket.requester}</p></div>
                            </div>
                            <div>
                                <p className="text-xs text-foreground-muted mb-2 font-semibold uppercase">Update Status</p>
                                <div className="flex gap-2">
                                    {STATUSES.map(st => (
                                        <button key={st} onClick={() => updateStatus(detailTicket.id, st)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-semibold theme-transition ${detailTicket.status === st ? 'bg-accent text-white shadow-md' : 'bg-background-tertiary text-foreground-secondary hover:bg-background-secondary'}`}>
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-foreground-muted mb-2 font-semibold uppercase">Activity Timeline</p>
                                <div className="space-y-3 border-l-2 border-border-muted pl-4">
                                    <div><p className="text-xs text-foreground-muted">Today, 10:30 AM</p><p className="text-sm text-foreground-secondary">Ticket created by {detailTicket.requester}</p></div>
                                    {detailTicket.status !== 'Open' && <div><p className="text-xs text-foreground-muted">Today, 11:00 AM</p><p className="text-sm text-foreground-secondary">Assigned to IT support team</p></div>}
                                    {detailTicket.status === 'Resolved' && <div><p className="text-xs text-success-dark">Today, 2:00 PM</p><p className="text-sm text-success-dark font-medium">Resolved</p></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">New Support Ticket</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Subject *</label>
                                <input type="text" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} placeholder="Brief ticket subject"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Detailed description..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Category</label>
                                    <select value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Priority</label>
                                    <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as SupportTicket['priority'] }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                                        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Requester *</label>
                                <input type="text" value={formData.requester} onChange={e => setFormData(p => ({ ...p, requester: e.target.value }))} placeholder="Your name"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={handleCreate} className="flex-1 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 theme-transition">Submit Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpDesk;