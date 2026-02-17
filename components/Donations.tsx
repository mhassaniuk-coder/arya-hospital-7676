import React, { useState, useMemo } from 'react';
import { Donation } from '../types';
import { Heart, Plus, Search, X, ChevronDown, DollarSign, Users, TrendingUp, Award, Trash2, Receipt, User, Calendar, Building } from 'lucide-react';

const INITIAL_DONATIONS: Donation[] = [
    { id: 'D-001', donor: 'Rajesh Sharma Foundation', amount: 50000, cause: 'Cancer Research', date: '2026-02-15' },
    { id: 'D-002', donor: 'Priya Patel', amount: 10000, cause: 'Pediatric Ward', date: '2026-02-14' },
    { id: 'D-003', donor: 'Tech Corp India', amount: 100000, cause: 'Equipment Fund', date: '2026-02-12' },
    { id: 'D-004', donor: 'Anonymous', amount: 5000, cause: 'General Fund', date: '2026-02-10' },
    { id: 'D-005', donor: 'Dr. Meera Gupta', amount: 25000, cause: 'Cancer Research', date: '2026-02-08' },
    { id: 'D-006', donor: 'Wellness Trust', amount: 75000, cause: 'Maternity Care', date: '2026-02-05' },
    { id: 'D-007', donor: 'Amit Verma', amount: 15000, cause: 'General Fund', date: '2026-02-03' },
    { id: 'D-008', donor: 'Global Health Partners', amount: 200000, cause: 'Equipment Fund', date: '2026-01-28' },
];

const CAUSES = ['General Fund', 'Cancer Research', 'Pediatric Ward', 'Equipment Fund', 'Maternity Care', 'Emergency Fund', 'Staff Welfare', 'Infrastructure'];
const DONOR_TYPES = ['Individual', 'Corporate', 'Trust', 'Anonymous'];
const PAYMENT_METHODS = ['Bank Transfer', 'Check', 'Cash', 'Online', 'UPI'];

const Donations: React.FC = () => {
    const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [causeFilter, setCauseFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ donor: '', donorType: 'Individual', amount: 0, cause: 'General Fund', paymentMethod: 'Bank Transfer', anonymous: false, recurring: false, notes: '' });

    const filtered = useMemo(() => donations.filter(d => {
        const matchesSearch = d.donor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCause = causeFilter === 'All' || d.cause === causeFilter;
        return matchesSearch && matchesCause;
    }), [donations, searchQuery, causeFilter]);

    const stats = useMemo(() => {
        const now = new Date();
        const thisMonth = donations.filter(d => { const dd = new Date(d.date); return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear(); });
        return {
            totalRaised: donations.reduce((s, d) => s + d.amount, 0),
            monthlyRaised: thisMonth.reduce((s, d) => s + d.amount, 0),
            donorCount: new Set(donations.map(d => d.donor)).size,
            avgDonation: Math.round(donations.reduce((s, d) => s + d.amount, 0) / donations.length),
        };
    }, [donations]);

    const causeBreakdown = useMemo(() => {
        const map: Record<string, number> = {};
        donations.forEach(d => { map[d.cause] = (map[d.cause] || 0) + d.amount; });
        const max = Math.max(...Object.values(map));
        return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([cause, amount]) => ({ cause, amount, pct: Math.round((amount / max) * 100) }));
    }, [donations]);

    const topDonors = useMemo(() => {
        const map: Record<string, number> = {};
        donations.forEach(d => { map[d.donor] = (map[d.donor] || 0) + d.amount; });
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, total]) => ({ name, total }));
    }, [donations]);

    const handleRecord = () => {
        if ((!formData.anonymous && !formData.donor.trim()) || formData.amount <= 0) return;
        const newDonation: Donation = {
            id: `D-${String(donations.length + 1).padStart(3, '0')}`,
            donor: formData.anonymous ? 'Anonymous' : formData.donor,
            amount: formData.amount,
            cause: formData.cause,
            date: new Date().toISOString().split('T')[0],
        };
        setDonations(prev => [newDonation, ...prev]);
        setShowModal(false);
        setFormData({ donor: '', donorType: 'Individual', amount: 0, cause: 'General Fund', paymentMethod: 'Bank Transfer', anonymous: false, recurring: false, notes: '' });
    };

    const handleDelete = (id: string) => { setDonations(prev => prev.filter(d => d.id !== id)); setDeleteConfirm(null); };

    const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

    const causeColors: Record<string, string> = {
        'Cancer Research': 'bg-pink-500', 'Pediatric Ward': 'bg-blue-500', 'Equipment Fund': 'bg-purple-500',
        'General Fund': 'bg-teal-500', 'Maternity Care': 'bg-rose-500', 'Emergency Fund': 'bg-red-500',
        'Staff Welfare': 'bg-amber-500', 'Infrastructure': 'bg-indigo-500',
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Donations</h1>
                    <p className="text-foreground-secondary">Track contributions and manage donors.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-pink-600/20 flex items-center gap-2 theme-transition">
                    <Plus size={18} /> Record Donation
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Raised', value: formatCurrency(stats.totalRaised), icon: <DollarSign size={22} />, color: 'bg-success-light text-success-dark' },
                    { label: 'This Month', value: formatCurrency(stats.monthlyRaised), icon: <TrendingUp size={22} />, color: 'bg-info-light text-info-dark' },
                    { label: 'Donors', value: stats.donorCount, icon: <Users size={22} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
                    { label: 'Avg Donation', value: formatCurrency(stats.avgDonation), icon: <Heart size={22} />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
                ].map((s, i) => (
                    <div key={i} className="bg-background-primary p-5 rounded-2xl shadow-sm border border-border theme-transition">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                                <p className="text-xl font-bold text-foreground-primary">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cause Breakdown & Top Donors Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-background-primary rounded-2xl shadow-sm border border-border p-6 theme-transition">
                    <h3 className="font-bold text-foreground-primary mb-4">Cause Breakdown</h3>
                    <div className="space-y-3">
                        {causeBreakdown.map(({ cause, amount, pct }) => (
                            <div key={cause}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-foreground-secondary">{cause}</span>
                                    <span className="font-bold text-foreground-primary">{formatCurrency(amount)}</span>
                                </div>
                                <div className="w-full h-2.5 bg-background-tertiary rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${causeColors[cause] || 'bg-slate-400'} transition-all duration-500`} style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-background-primary rounded-2xl shadow-sm border border-border p-6 theme-transition">
                    <h3 className="font-bold text-foreground-primary mb-4 flex items-center gap-2"><Award size={18} className="text-amber-500" /> Top Donors</h3>
                    <div className="space-y-3">
                        {topDonors.map((donor, i) => (
                            <div key={donor.name} className="flex items-center gap-3 p-3 bg-background-tertiary rounded-xl theme-transition">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-700' : 'bg-slate-300 dark:bg-slate-600'}`}>{i + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground-primary text-sm truncate">{donor.name}</p>
                                </div>
                                <p className="font-bold text-success-dark text-sm">{formatCurrency(donor.total)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input type="text" placeholder="Search donors..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-pink-500 theme-transition" />
                </div>
                <div className="relative">
                    <select value={causeFilter} onChange={e => setCauseFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer theme-transition">
                        <option value="All">All Causes</option>{CAUSES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
            </div>

            {/* Donations Table */}
            <div className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-background-tertiary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                                <th className="px-6 py-4">Receipt</th>
                                <th className="px-6 py-4">Donor</th>
                                <th className="px-6 py-4">Cause</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(donation => (
                                <tr key={donation.id} className="hover:bg-background-tertiary theme-transition">
                                    <td className="px-6 py-4 font-mono text-xs text-foreground-muted">{donation.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-xs">{donation.donor.charAt(0)}</div>
                                            <span className="font-medium text-foreground-primary">{donation.donor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5">
                                            <span className={`w-2 h-2 rounded-full ${causeColors[donation.cause] || 'bg-slate-400'}`} />
                                            <span className="text-foreground-secondary">{donation.cause}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-success-dark">{formatCurrency(donation.amount)}</td>
                                    <td className="px-6 py-4 text-foreground-muted text-xs">{new Date(donation.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => setDeleteConfirm(donation.id)} className="p-1.5 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-lg theme-transition"><Trash2 size={14} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-foreground-muted">
                        <Heart size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No donations found</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-background-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-foreground-primary mb-2">Remove Record?</h3>
                        <p className="text-sm text-foreground-secondary mb-6">This donation record will be permanently removed.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-xl font-medium hover:opacity-90 theme-transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Donation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">Record Donation</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                                <input type="checkbox" id="anon" checked={formData.anonymous} onChange={e => setFormData(p => ({ ...p, anonymous: e.target.checked }))} className="w-4 h-4 rounded accent-pink-600" />
                                <label htmlFor="anon" className="text-sm font-medium text-pink-700 dark:text-pink-400 cursor-pointer">Anonymous donation</label>
                            </div>
                            {!formData.anonymous && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Donor Name *</label>
                                        <input type="text" value={formData.donor} onChange={e => setFormData(p => ({ ...p, donor: e.target.value }))} placeholder="Full name or org"
                                            className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none theme-transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Donor Type</label>
                                        <select value={formData.donorType} onChange={e => setFormData(p => ({ ...p, donorType: e.target.value }))}
                                            className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none theme-transition">
                                            {DONOR_TYPES.map(t => <option key={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Payment Method</label>
                                        <select value={formData.paymentMethod} onChange={e => setFormData(p => ({ ...p, paymentMethod: e.target.value }))}
                                            className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none theme-transition">
                                            {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Amount (¥) *</label>
                                    <input type="number" value={formData.amount || ''} onChange={e => setFormData(p => ({ ...p, amount: parseInt(e.target.value) || 0 }))} min="1" placeholder="0"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Cause / Fund</label>
                                    <select value={formData.cause} onChange={e => setFormData(p => ({ ...p, cause: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none theme-transition">
                                        {CAUSES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-xl">
                                <input type="checkbox" id="recurring" checked={formData.recurring} onChange={e => setFormData(p => ({ ...p, recurring: e.target.checked }))} className="w-4 h-4 rounded accent-pink-600" />
                                <label htmlFor="recurring" className="text-sm font-medium text-foreground-secondary cursor-pointer">Mark as recurring donation</label>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Notes</label>
                                <textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Additional notes..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-pink-500 outline-none resize-none theme-transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={handleRecord} className="flex-1 py-2.5 bg-pink-600 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-pink-600/20 theme-transition">Record</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donations;