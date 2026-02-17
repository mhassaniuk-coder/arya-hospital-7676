import React, { useState, useMemo } from 'react';
import { HospitalEvent } from '../types';
import { PartyPopper, Calendar, MapPin, Users, Plus, Search, X, Clock, Award, ChevronDown, Edit2, Trash2, UserPlus } from 'lucide-react';

const INITIAL_EVENTS: HospitalEvent[] = [
    { id: '1', title: 'Advanced Cardiology Workshop', type: 'Workshop', date: '2026-03-05', location: 'Conference Hall A', attendees: 45 },
    { id: '2', title: 'Nursing Staff Training', type: 'Training', date: '2026-03-08', location: 'Training Room 2', attendees: 20 },
    { id: '3', title: 'Annual Medical Conference', type: 'Conference', date: '2026-04-01', location: 'Main Auditorium', attendees: 150 },
    { id: '4', title: 'Emergency Response Drill', type: 'Training', date: '2026-02-20', location: 'Emergency Dept', attendees: 35 },
    { id: '5', title: 'Oncology CME Seminar', type: 'Workshop', date: '2026-03-15', location: 'Seminar Hall B', attendees: 60 },
    { id: '6', title: 'Quality Improvement Workshop', type: 'Workshop', date: '2026-02-25', location: 'Conference Room 1', attendees: 25 },
];

const EVENT_TYPES: HospitalEvent['type'][] = ['Training', 'Conference', 'Workshop'];
const TYPE_COLORS: Record<string, string> = {
    Training: 'bg-info-light text-info-dark',
    Conference: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400',
    Workshop: 'bg-warning-light text-warning-dark',
};
const TYPE_BG: Record<string, string> = {
    Training: 'from-blue-500 to-blue-600',
    Conference: 'from-purple-500 to-purple-600',
    Workshop: 'from-orange-500 to-orange-600',
};

const EventManagement: React.FC = () => {
    const [events, setEvents] = useState<HospitalEvent[]>(INITIAL_EVENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<HospitalEvent | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', type: 'Workshop' as HospitalEvent['type'], date: '', location: '', attendees: 0, speaker: '', cmeCredits: 0, description: '' });

    const filtered = useMemo(() => events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || e.type === typeFilter;
        return matchesSearch && matchesType;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [events, searchQuery, typeFilter]);

    const stats = useMemo(() => {
        const now = new Date();
        return {
            total: events.length,
            upcoming: events.filter(e => new Date(e.date) >= now).length,
            past: events.filter(e => new Date(e.date) < now).length,
            totalAttendees: events.reduce((s, e) => s + e.attendees, 0),
        };
    }, [events]);

    const openAdd = () => { setEditingEvent(null); setFormData({ title: '', type: 'Workshop', date: '', location: '', attendees: 0, speaker: '', cmeCredits: 0, description: '' }); setShowModal(true); };
    const openEdit = (e: HospitalEvent) => { setEditingEvent(e); setFormData({ title: e.title, type: e.type, date: e.date, location: e.location, attendees: e.attendees, speaker: '', cmeCredits: 0, description: '' }); setShowModal(true); };

    const handleSave = () => {
        if (!formData.title.trim() || !formData.date || !formData.location.trim()) return;
        if (editingEvent) {
            setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, title: formData.title, type: formData.type, date: formData.date, location: formData.location, attendees: formData.attendees } : e));
        } else {
            const newEvent: HospitalEvent = { id: `E-${Date.now()}`, title: formData.title, type: formData.type, date: formData.date, location: formData.location, attendees: formData.attendees };
            setEvents(prev => [...prev, newEvent]);
        }
        setShowModal(false);
    };

    const handleDelete = (id: string) => { setEvents(prev => prev.filter(e => e.id !== id)); setDeleteConfirm(null); };
    const handleRegister = (id: string) => { setEvents(prev => prev.map(e => e.id === id ? { ...e, attendees: e.attendees + 1 } : e)); };

    const getDaysUntil = (date: string) => {
        const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Events & CME</h1>
                    <p className="text-foreground-muted">Workshops, training, and medical conferences.</p>
                </div>
                <button onClick={openAdd} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
                    <Plus size={18} /> Schedule Event
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Events', value: stats.total, icon: <PartyPopper size={22} />, color: 'bg-info-light text-info-dark' },
                    { label: 'Upcoming', value: stats.upcoming, icon: <Calendar size={22} />, color: 'bg-info-light text-info-dark' },
                    { label: 'Past Events', value: stats.past, icon: <Clock size={22} />, color: 'bg-background-tertiary text-foreground-secondary' },
                    { label: 'Total Attendees', value: stats.totalAttendees, icon: <Users size={22} />, color: 'bg-success-light text-success-dark' },
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
                    <input type="text" placeholder="Search events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <div className="relative">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
                        <option>All</option>{EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
                </div>
            </div>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(event => {
                    const daysUntil = getDaysUntil(event.date);
                    const isPast = daysUntil < 0;
                    return (
                        <div key={event.id} className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all group theme-transition">
                            <div className={`bg-gradient-to-r ${TYPE_BG[event.type]} p-4 text-white relative`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">{event.type}</span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(event)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30"><Edit2 size={14} /></button>
                                        <button onClick={() => setDeleteConfirm(event.id)} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                {!isPast && (
                                    <div className="mt-3 text-2xl font-bold">{daysUntil === 0 ? 'Today!' : `${daysUntil} days`}</div>
                                )}
                                {!isPast && <p className="text-white/80 text-xs">{daysUntil === 0 ? 'Happening now' : 'until event'}</p>}
                                {isPast && <div className="mt-3 text-sm font-medium text-white/80">Completed</div>}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-foreground-primary text-lg mb-3 leading-tight">{event.title}</h3>
                                <div className="space-y-2 text-sm text-foreground-secondary mb-4">
                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-foreground-muted" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                    <div className="flex items-center gap-2"><MapPin size={14} className="text-foreground-muted" /> {event.location}</div>
                                    <div className="flex items-center gap-2"><Users size={14} className="text-foreground-muted" /> {event.attendees} Registered</div>
                                </div>
                                {!isPast && (
                                    <button onClick={() => handleRegister(event.id)}
                                        className="w-full py-2.5 bg-info-light text-info-dark rounded-xl font-semibold text-sm hover:bg-info-dark/20 theme-transition flex items-center justify-center gap-2">
                                        <UserPlus size={16} /> Register
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-foreground-muted">
                    <PartyPopper size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No events found</p>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-background-elevated rounded-2xl p-6 max-w-sm w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-foreground-primary mb-2">Cancel Event?</h3>
                        <p className="text-sm text-foreground-muted mb-6">This will permanently remove the event and notify all registered attendees.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Keep</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-danger-dark text-white rounded-xl font-medium hover:bg-danger-dark/90 theme-transition">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground-primary">{editingEvent ? 'Edit Event' : 'Schedule New Event'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Event Title *</label>
                                <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Event name"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Type</label>
                                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as HospitalEvent['type'] }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                                        {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date *</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Location *</label>
                                <input type="text" value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Venue"
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Speaker</label>
                                    <input type="text" value={formData.speaker} onChange={e => setFormData(p => ({ ...p, speaker: e.target.value }))} placeholder="Speaker name"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Max Capacity</label>
                                    <input type="number" value={formData.attendees} onChange={e => setFormData(p => ({ ...p, attendees: parseInt(e.target.value) || 0 }))} min="0"
                                        className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Event details..."
                                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition resize-none" />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 theme-transition">{editingEvent ? 'Update' : 'Schedule'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;