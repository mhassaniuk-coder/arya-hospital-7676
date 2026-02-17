import React, { useState, useMemo } from 'react';
import { LostItem } from '../types';
import { PackageSearch, Plus, Search, X, ChevronDown, MapPin, Calendar, User, Package, Undo2, Trash2, Clock, CheckCircle } from 'lucide-react';

const INITIAL_ITEMS: LostItem[] = [
    { id: 'LF-001', item: 'Gold Necklace', foundLocation: 'Waiting Room A', dateFound: '2026-02-15', status: 'Unclaimed', finder: 'Security Guard' },
    { id: 'LF-002', item: 'Mobile Phone (Samsung)', foundLocation: 'Canteen', dateFound: '2026-02-14', status: 'Returned', finder: 'Kitchen Staff' },
    { id: 'LF-003', item: 'Winter Jacket - Blue', foundLocation: 'Ward 5 Corridor', dateFound: '2026-02-13', status: 'Unclaimed', finder: 'Nurse Smith' },
    { id: 'LF-004', item: 'Prescription Glasses', foundLocation: 'Pharmacy Counter', dateFound: '2026-02-12', status: 'Unclaimed', finder: 'Pharmacist Lee' },
    { id: 'LF-005', item: 'Wallet with Documents', foundLocation: 'Emergency Exit B', dateFound: '2026-02-10', status: 'Returned', finder: 'Dr. Chen' },
    { id: 'LF-006', item: 'Baby Stroller', foundLocation: 'Parking Lot C', dateFound: '2026-02-09', status: 'Unclaimed', finder: 'Security Guard' },
    { id: 'LF-007', item: 'Laptop Bag', foundLocation: 'Conference Room 1', dateFound: '2026-02-08', status: 'Returned', finder: 'Admin Staff' },
];

const CATEGORIES = ['Electronics', 'Jewelry', 'Clothing', 'Documents', 'Medical Supplies', 'Bags', 'Other'];

const LostAndFound: React.FC = () => {
    const [items, setItems] = useState<LostItem[]>(INITIAL_ITEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [claimModal, setClaimModal] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ item: '', category: 'Other', foundLocation: '', finder: '', storageLocation: '', description: '' });
    const [claimData, setClaimData] = useState({ claimantName: '', idNumber: '', phone: '' });

    const filtered = useMemo(() => items.filter(i => {
        const matchesSearch = i.item.toLowerCase().includes(searchQuery.toLowerCase()) || i.foundLocation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesSearch && matchesStatus;
    }), [items, searchQuery, statusFilter]);

    const stats = useMemo(() => ({
        total: items.length,
        unclaimed: items.filter(i => i.status === 'Unclaimed').length,
        returned: items.filter(i => i.status === 'Returned').length,
    }), [items]);

    const handleReport = () => {
        if (!formData.item.trim() || !formData.foundLocation.trim() || !formData.finder.trim()) return;
        const newItem: LostItem = {
            id: `LF-${String(items.length + 1).padStart(3, '0')}`,
            item: formData.item,
            foundLocation: formData.foundLocation,
            dateFound: new Date().toISOString().split('T')[0],
            status: 'Unclaimed',
            finder: formData.finder,
        };
        setItems(prev => [newItem, ...prev]);
        setShowModal(false);
        setFormData({ item: '', category: 'Other', foundLocation: '', finder: '', storageLocation: '', description: '' });
    };

    const handleClaim = (id: string) => {
        if (!claimData.claimantName.trim()) return;
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Returned' as const } : i));
        setClaimModal(null);
        setClaimData({ claimantName: '', idNumber: '', phone: '' });
    };

    const handleDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); setDeleteConfirm(null); };

    const daysSince = (date: string) => Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Lost & Found</h1>
                    <p className="text-foreground-secondary">Track found items and manage claims.</p>
                </div>
                <button onClick={() => setShowModal(true)} className="bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-amber-600/20 flex items-center gap-2 theme-transition">
                    <Plus size={18} /> Report Found Item
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Items', value: stats.total, icon: <PackageSearch size={22} />, color: 'bg-background-tertiary text-foreground-secondary' },
                    { label: 'Unclaimed', value: stats.unclaimed, icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
                    { label: 'Returned', value: stats.returned, icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
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

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input type="text" placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-amber-500 theme-transition" />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer theme-transition">
                        <option>All</option><option>Unclaimed</option><option>Returned</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(item => (
                    <div key={item.id} className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg theme-transition group">
                        <div className={`h-1.5 ${item.status === 'Unclaimed' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl ${item.status === 'Unclaimed' ? 'bg-warning-light' : 'bg-success-light'}`}>
                                        <Package size={22} className={item.status === 'Unclaimed' ? 'text-warning-dark' : 'text-success-dark'} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground-primary">{item.item}</h3>
                                        <p className="text-xs text-foreground-muted">{item.id}</p>
                                    </div>
                                </div>
                                <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 theme-transition"><Trash2 size={14} /></button>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-center gap-2 text-foreground-secondary"><MapPin size={14} className="text-foreground-muted" /> {item.foundLocation}</div>
                                <div className="flex items-center gap-2 text-foreground-secondary"><Calendar size={14} className="text-foreground-muted" /> {new Date(item.dateFound).toLocaleDateString()}</div>
                                <div className="flex items-center gap-2 text-foreground-secondary"><User size={14} className="text-foreground-muted" /> Found by: {item.finder}</div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Unclaimed' ? 'bg-warning-light text-warning-dark' : 'bg-success-light text-success-dark'}`}>{item.status}</span>
                                {item.status === 'Unclaimed' && <span className="text-xs text-foreground-muted">{daysSince(item.dateFound)} days ago</span>}
                            </div>

                            {item.status === 'Unclaimed' && (
                                <button onClick={() => setClaimModal(item.id)}
                                    className="w-full py-2.5 bg-warning-light text-warning-dark rounded-xl font-semibold text-sm hover:bg-amber-100 dark:hover:bg-amber-900/50 theme-transition flex items-center justify-center gap-2">
                                    <Undo2 size={16} /> Process Claim
                                </button>
                            )}
                            {item.status === 'Returned' && (
                                <div className="flex items-center justify-center gap-2 text-success-dark text-sm font-medium py-2"><CheckCircle size={16} /> Returned to Owner</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-foreground-muted">
                    <PackageSearch size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No items found</p>
                </div>
            )}

            {/* Claim Modal */}
            {claimModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setClaimModal(null)}>
                    <div className="bg-background-primary rounded-2xl max-w-md w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">Process Claim</h3>
                            <button onClick={() => setClaimModal(null)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Claimant Name *</label>
                                <input type="text" value={claimData.claimantName} onChange={e => setClaimData(p => ({ ...p, claimantName: e.target.value }))} placeholder="Full name"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">ID Number</label>
                                <input type="text" value={claimData.idNumber} onChange={e => setClaimData(p => ({ ...p, idNumber: e.target.value }))} placeholder="ID for verification"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Phone</label>
                                <input type="tel" value={claimData.phone} onChange={e => setClaimData(p => ({ ...p, phone: e.target.value }))} placeholder="Contact number"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setClaimModal(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={() => handleClaim(claimModal)} className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-amber-600/20 theme-transition">Confirm Return</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-background-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-foreground-primary mb-2">Remove Item?</h3>
                        <p className="text-sm text-foreground-secondary mb-6">This will remove the item record permanently.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-xl font-medium hover:opacity-90 theme-transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Found Item Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">Report Found Item</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Item Description *</label>
                                <input type="text" value={formData.item} onChange={e => setFormData(p => ({ ...p, item: e.target.value }))} placeholder="e.g. Gold Watch"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Category</label>
                                    <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Found Location *</label>
                                    <input type="text" value={formData.foundLocation} onChange={e => setFormData(p => ({ ...p, foundLocation: e.target.value }))} placeholder="Where found"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Found By *</label>
                                    <input type="text" value={formData.finder} onChange={e => setFormData(p => ({ ...p, finder: e.target.value }))} placeholder="Name"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Storage Location</label>
                                    <input type="text" value={formData.storageLocation} onChange={e => setFormData(p => ({ ...p, storageLocation: e.target.value }))} placeholder="Locker/shelf"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none theme-transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Additional Notes</label>
                                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} placeholder="Any details..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-amber-500 outline-none resize-none theme-transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={handleReport} className="flex-1 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-amber-600/20 theme-transition">Register Item</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LostAndFound;