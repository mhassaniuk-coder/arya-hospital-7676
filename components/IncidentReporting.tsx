import React, { useState, useMemo } from 'react';
import { Incident } from '../types';
import { AlertTriangle, Plus, Search, X, ChevronDown, Shield, Clock, CheckCircle, FileText, MapPin, User, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';

const INITIAL_INCIDENTS: Incident[] = [
    { id: 'INC-001', type: 'Patient Fall', location: 'Ward 3, Room 302', reportedBy: 'Nurse Joy', date: '2026-02-15', severity: 'High', status: 'Investigating' },
    { id: 'INC-002', type: 'Medication Error', location: 'Pharmacy', reportedBy: 'Pharmacist Lee', date: '2026-02-14', severity: 'Medium', status: 'Investigating' },
    { id: 'INC-003', type: 'Equipment Failure', location: 'ICU Bay 4', reportedBy: 'Dr. Chen', date: '2026-02-13', severity: 'High', status: 'Closed' },
    { id: 'INC-004', type: 'Needle Stick Injury', location: 'OT 2', reportedBy: 'Nurse Smith', date: '2026-02-13', severity: 'Medium', status: 'Closed' },
    { id: 'INC-005', type: 'Security Breach', location: 'Main Entrance', reportedBy: 'Security Guard', date: '2026-02-12', severity: 'Low', status: 'Closed' },
    { id: 'INC-006', type: 'Fire Alarm - False', location: 'Kitchen', reportedBy: 'Kitchen Staff', date: '2026-02-11', severity: 'Low', status: 'Closed' },
    { id: 'INC-007', type: 'Slip & Fall - Staff', location: 'Corridor B, Floor 2', reportedBy: 'HR Dept', date: '2026-02-16', severity: 'Medium', status: 'Investigating' },
];

const INCIDENT_TYPES = ['Patient Fall', 'Medication Error', 'Equipment Failure', 'Needle Stick Injury', 'Security Breach', 'Fire Alarm - False', 'Slip & Fall - Staff', 'Violence/Aggressive Behavior', 'Infection Control', 'Other'];
const SEVERITIES: Incident['severity'][] = ['High', 'Medium', 'Low'];

const IncidentReporting: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ type: 'Patient Fall', location: '', reportedBy: '', severity: 'Medium' as Incident['severity'], description: '', witnesses: '', actionTaken: '' });

    const filtered = useMemo(() => incidents.filter(i => {
        const matchesSearch = i.type.toLowerCase().includes(searchQuery.toLowerCase()) || i.location.toLowerCase().includes(searchQuery.toLowerCase()) || i.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSeverity = severityFilter === 'All' || i.severity === severityFilter;
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesSearch && matchesSeverity && matchesStatus;
    }), [incidents, searchQuery, severityFilter, statusFilter]);

    const stats = useMemo(() => ({
        total: incidents.length,
        investigating: incidents.filter(i => i.status === 'Investigating').length,
        closed: incidents.filter(i => i.status === 'Closed').length,
        critical: incidents.filter(i => i.severity === 'High').length,
    }), [incidents]);

    const handleReport = () => {
        if (!formData.type || !formData.location.trim() || !formData.reportedBy.trim()) return;
        const newIncident: Incident = {
            id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
            type: formData.type,
            location: formData.location,
            reportedBy: formData.reportedBy,
            date: new Date().toISOString().split('T')[0],
            severity: formData.severity,
            status: 'Investigating',
        };
        setIncidents(prev => [newIncident, ...prev]);
        setShowModal(false);
        setFormData({ type: 'Patient Fall', location: '', reportedBy: '', severity: 'Medium', description: '', witnesses: '', actionTaken: '' });
    };

    const closeIncident = (id: string) => {
        setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Closed' as const } : i));
        if (detailIncident?.id === id) setDetailIncident(prev => prev ? { ...prev, status: 'Closed' as const } : null);
    };

    const handleDelete = (id: string) => { setIncidents(prev => prev.filter(i => i.id !== id)); setDeleteConfirm(null); };

    const severityColor = (s: string) => s === 'High' ? 'bg-danger-light text-danger-dark' : s === 'Medium' ? 'bg-warning-light text-warning-dark' : 'bg-success-light text-success-dark';
    const severityDot = (s: string) => s === 'High' ? 'bg-danger' : s === 'Medium' ? 'bg-warning' : 'bg-success';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Incident Reporting</h1>
                    <p className="text-foreground-secondary">Report and track hospital incidents.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-600/20 flex items-center gap-2 theme-transition">
                    <Plus size={18} /> Report Incident
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Incidents', value: stats.total, icon: <AlertTriangle size={22} />, color: 'bg-background-secondary text-foreground-muted' },
                    { label: 'Investigating', value: stats.investigating, icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
                    { label: 'Closed', value: stats.closed, icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
                    { label: 'High Severity', value: stats.critical, icon: <Shield size={22} />, color: 'bg-danger-light text-danger-dark' },
                ].map((s, i) => (
                    <div key={i} className="bg-background-primary p-5 rounded-2xl shadow-sm border border-border theme-transition">
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
                    <input type="text" placeholder="Search incidents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-red-500 theme-transition" />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-red-500 cursor-pointer theme-transition">
                            <option value="All">All Severity</option>{SEVERITIES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-red-500 cursor-pointer theme-transition">
                            <option value="All">All Status</option><option>Investigating</option><option>Closed</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Incident Table */}
            <div className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Reported By</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(inc => (
                                <tr key={inc.id} className="hover:bg-background-secondary transition-colors cursor-pointer theme-transition" onClick={() => setDetailIncident(inc)}>
                                    <td className="px-6 py-4 font-mono text-xs text-foreground-muted">{inc.id}</td>
                                    <td className="px-6 py-4 font-medium text-foreground-primary">{inc.type}</td>
                                    <td className="px-6 py-4 text-foreground-secondary flex items-center gap-1.5"><MapPin size={13} className="text-foreground-muted" />{inc.location}</td>
                                    <td className="px-6 py-4 text-foreground-secondary">{inc.reportedBy}</td>
                                    <td className="px-6 py-4 text-foreground-muted text-xs">{new Date(inc.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${severityDot(inc.severity)}`} />
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${severityColor(inc.severity)}`}>{inc.severity}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className={`text-xs font-bold ${inc.status === 'Investigating' ? 'text-warning-dark' : 'text-success-dark'}`}>{inc.status}</span></td>
                                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex gap-1 justify-end">
                                            {inc.status === 'Investigating' && <button onClick={() => closeIncident(inc.id)} className="text-xs px-3 py-1 bg-success-light text-success-dark rounded-lg font-medium hover:bg-success/20 theme-transition">Close</button>}
                                            <button onClick={() => setDeleteConfirm(inc.id)} className="p-1.5 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg theme-transition"><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-foreground-muted">
                        <AlertTriangle size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No incidents found</p>
                    </div>
                )}
            </div>

            {/* Detail Panel */}
            {detailIncident && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end" onClick={() => setDetailIncident(null)}>
                    <div className="bg-background-primary w-full max-w-md h-full shadow-2xl overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div>
                                <p className="text-xs font-mono text-foreground-muted">{detailIncident.id}</p>
                                <h3 className="text-lg font-bold text-foreground-primary">{detailIncident.type}</h3>
                            </div>
                            <button onClick={() => setDetailIncident(null)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColor(detailIncident.severity)}`}>{detailIncident.severity} Severity</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${detailIncident.status === 'Investigating' ? 'bg-warning-light text-warning-dark' : 'bg-success-light text-success-dark'}`}>{detailIncident.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-xs text-foreground-muted mb-1 flex items-center gap-1"><MapPin size={12} />Location</p><p className="font-medium text-foreground-primary">{detailIncident.location}</p></div>
                                <div><p className="text-xs text-foreground-muted mb-1 flex items-center gap-1"><User size={12} />Reported By</p><p className="font-medium text-foreground-primary">{detailIncident.reportedBy}</p></div>
                                <div><p className="text-xs text-foreground-muted mb-1 flex items-center gap-1"><Calendar size={12} />Date</p><p className="font-medium text-foreground-primary">{new Date(detailIncident.date).toLocaleDateString()}</p></div>
                            </div>
                            <div>
                                <p className="text-xs text-foreground-muted mb-2 font-semibold uppercase">Investigation Timeline</p>
                                <div className="space-y-3 border-l-2 border-border-muted pl-4">
                                    <div><p className="text-xs text-foreground-muted">{detailIncident.date}, 08:00 AM</p><p className="text-sm text-foreground-secondary">Incident reported by {detailIncident.reportedBy}</p></div>
                                    <div><p className="text-xs text-foreground-muted">{detailIncident.date}, 08:30 AM</p><p className="text-sm text-foreground-secondary">Investigation team assigned</p></div>
                                    <div><p className="text-xs text-foreground-muted">{detailIncident.date}, 09:00 AM</p><p className="text-sm text-foreground-secondary">Scene inspection completed</p></div>
                                    {detailIncident.status === 'Closed' && <div><p className="text-xs text-success">Resolved</p><p className="text-sm text-success-dark font-medium">Root cause identified and corrective action taken</p></div>}
                                </div>
                            </div>
                            {detailIncident.status === 'Investigating' && (
                                <button onClick={() => closeIncident(detailIncident.id)} className="w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 theme-transition"><CheckCircle size={16} /> Close Incident</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-background-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-foreground-primary mb-2">Delete Incident Record?</h3>
                        <p className="text-sm text-foreground-secondary mb-6">This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 theme-transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">Report Incident</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Incident Type *</label>
                                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none theme-transition">
                                    {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Location *</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Where it occurred"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Severity</label>
                                    <select value={formData.severity} onChange={e => setFormData(p => ({ ...p, severity: e.target.value as Incident['severity'] }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none theme-transition">
                                        {SEVERITIES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Reported By *</label>
                                <input type="text" value={formData.reportedBy} onChange={e => setFormData(p => ({ ...p, reportedBy: e.target.value }))} placeholder="Your name"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Detailed description..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none resize-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Witnesses</label>
                                <input type="text" value={formData.witnesses} onChange={e => setFormData(p => ({ ...p, witnesses: e.target.value }))} placeholder="Names of witnesses"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-primary mb-1.5">Immediate Action Taken</label>
                                <textarea value={formData.actionTaken} onChange={e => setFormData(p => ({ ...p, actionTaken: e.target.value }))} rows={2} placeholder="What was done immediately..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-red-500 outline-none resize-none theme-transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
                            <button onClick={handleReport} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-600/20 theme-transition">Submit Report</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncidentReporting;
