import React, { useState, useMemo } from 'react';
import { Visitor } from '../types';
import { Ticket, Clock, LogOut, Plus, Search, X, Users, CheckCircle, UserCheck, Eye, ChevronDown, Shield } from 'lucide-react';

const INITIAL_VISITORS: Visitor[] = [
    { id: 'V-001', visitorName: 'John Smith', patientName: 'Sarah Johnson', checkInTime: '10:30 AM', status: 'Active' },
    { id: 'V-002', visitorName: 'Alice Brown', patientName: 'Michael Chen', checkInTime: '09:15 AM', status: 'Checked Out' },
    { id: 'V-003', visitorName: 'Robert Taylor', patientName: 'Emily Davis', checkInTime: '11:00 AM', status: 'Active' },
    { id: 'V-004', visitorName: 'Maria Garcia', patientName: 'James Wilson', checkInTime: '08:45 AM', status: 'Checked Out' },
    { id: 'V-005', visitorName: 'David Lee', patientName: 'Lisa Anderson', checkInTime: '12:15 PM', status: 'Active' },
    { id: 'V-006', visitorName: 'Sarah Williams', patientName: 'Robert Martin', checkInTime: '02:00 PM', status: 'Active' },
];

const VisitorPass: React.FC = () => {
    const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showLog, setShowLog] = useState(false);
    const [formData, setFormData] = useState({ visitorName: '', phone: '', idType: 'Aadhaar', idNumber: '', patientName: '', purpose: 'Visit', ward: '' });

    const filtered = useMemo(() => visitors.filter(v => {
        const matchesSearch = v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || v.patientName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [visitors, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        active: visitors.filter(v => v.status === 'Active').length,
        checkedOut: visitors.filter(v => v.status === 'Checked Out').length,
        total: visitors.length,
    }), [visitors]);

    const handleIssuePass = () => {
        if (!formData.visitorName.trim() || !formData.patientName.trim()) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const newVisitor: Visitor = {
            id: `V-${String(visitors.length + 1).padStart(3, '0')}`,
            visitorName: formData.visitorName,
            patientName: formData.patientName,
            checkInTime: timeStr,
            status: 'Active',
        };
        setVisitors(prev => [newVisitor, ...prev]);
        setShowModal(false);
        setFormData({ visitorName: '', phone: '', idType: 'Aadhaar', idNumber: '', patientName: '', purpose: 'Visit', ward: '' });
    };

    const handleCheckout = (id: string) => {
        setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'Checked Out' as const } : v));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Visitor Management</h1>
                    <p className="text-foreground-muted">Issue passes and track visitors.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowLog(!showLog)} className="border border-border text-foreground-secondary px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-background-secondary flex items-center gap-2 theme-transition">
                        <Eye size={16} /> {showLog ? 'Card View' : 'Log View'}
                    </button>
                    <button onClick={() => setShowModal(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
                        <Plus size={18} /> Issue Pass
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Active Visitors', value: stats.active, icon: <UserCheck size={22} />, color: 'bg-success-light text-success-dark' },
                    { label: 'Checked Out', value: stats.checkedOut, icon: <LogOut size={22} />, color: 'bg-background-secondary text-foreground-muted' },
                    { label: 'Total Passes', value: stats.total, icon: <Ticket size={22} />, color: 'bg-info-light text-info-dark' },
                ].map((s, i) => (
                    <div key={i} className="bg-background-primary p-5 rounded-2xl shadow-sm border border-border-muted">
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

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input type="text" placeholder="Search visitor or patient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
                        <option>All</option><option>Active</option><option>Checked Out</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
            </div>

            {/* Card View or Log View */}
            {!showLog ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(visitor => (
                        <div key={visitor.id} className="bg-background-primary rounded-2xl shadow-sm border border-border-muted overflow-hidden hover:shadow-lg transition-all theme-transition">
                            <div className={`h-1.5 ${visitor.status === 'Active' ? 'bg-success' : 'bg-border'}`} />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-info-light flex items-center justify-center text-info-dark font-bold text-lg">
                                            {visitor.visitorName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground-primary">{visitor.visitorName}</h3>
                                            <p className="text-xs text-foreground-muted">Pass: {visitor.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${visitor.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-background-secondary text-foreground-muted'}`}>
                                        {visitor.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-foreground-muted">Visiting</span>
                                        <span className="font-medium text-foreground-primary">{visitor.patientName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground-secondary bg-background-secondary p-2.5 rounded-lg">
                                        <Clock size={14} />
                                        <span className="text-xs">Checked In: {visitor.checkInTime}</span>
                                    </div>
                                </div>

                                {visitor.status === 'Active' && (
                                    <button onClick={() => handleCheckout(visitor.id)}
                                        className="w-full py-2.5 border border-danger-light text-danger-dark rounded-xl font-semibold text-sm hover:bg-danger-light theme-transition flex items-center justify-center gap-2">
                                        <LogOut size={16} /> Check Out
                                    </button>
                                )}
                                {visitor.status === 'Checked Out' && (
                                    <div className="flex items-center justify-center gap-2 text-success text-sm font-medium py-2">
                                        <CheckCircle size={16} /> Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-background-primary rounded-2xl shadow-sm border border-border-muted overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                                <th className="px-6 py-4">Pass ID</th>
                                <th className="px-6 py-4">Visitor</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Check In</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(v => (
                                <tr key={v.id} className="hover:bg-background-secondary theme-transition">
                                    <td className="px-6 py-4 font-mono text-xs text-foreground-muted">{v.id}</td>
                                    <td className="px-6 py-4 font-medium text-foreground-primary">{v.visitorName}</td>
                                    <td className="px-6 py-4 text-foreground-secondary">{v.patientName}</td>
                                    <td className="px-6 py-4 text-foreground-secondary">{v.checkInTime}</td>
                                    <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${v.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-background-secondary text-foreground-muted'}`}>{v.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {v.status === 'Active' && <button onClick={() => handleCheckout(v.id)} className="text-danger text-sm font-medium hover:underline">Check Out</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-12 text-foreground-muted">
                    <Ticket size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No visitors found</p>
                </div>
            )}

            {/* Issue Pass Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">Issue Visitor Pass</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Visitor Name *</label>
                                    <input type="text" value={formData.visitorName} onChange={e => setFormData(p => ({ ...p, visitorName: e.target.value }))} placeholder="Full name"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Phone</label>
                                    <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">ID Type</label>
                                    <select value={formData.idType} onChange={e => setFormData(p => ({ ...p, idType: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                                        <option>Aadhaar</option><option>Passport</option><option>Driver License</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">ID Number</label>
                                    <input type="text" value={formData.idNumber} onChange={e => setFormData(p => ({ ...p, idNumber: e.target.value }))} placeholder="ID number"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Purpose</label>
                                    <select value={formData.purpose} onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                                        <option>Visit</option><option>Delivery</option><option>Meeting</option><option>Emergency</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Patient Being Visited *</label>
                                    <input type="text" value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} placeholder="Patient name"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
                            <button onClick={handleIssuePass} className="flex-1 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 theme-transition">Issue Pass</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisitorPass;
