import React, { useState, useMemo } from 'react';
import { TherapySession } from '../types';
import { Accessibility, Calendar, User, Plus, X, Search, Activity, CheckCircle, Clock, PlayCircle } from 'lucide-react';

const INITIAL_SESSIONS: TherapySession[] = [
  { id: '1', patientName: 'Emily Davis', therapyType: 'Post-Op Knee Rehab', therapist: 'Dr. John', date: 'Today, 10:00 AM', status: 'Scheduled' },
  { id: '2', patientName: 'Robert Wilson', therapyType: 'Stroke Recovery', therapist: 'Dr. Lisa', date: 'Yesterday, 02:00 PM', status: 'Completed' },
  { id: '3', patientName: 'Sarah Mitchell', therapyType: 'Spinal Cord Therapy', therapist: 'Dr. Maria', date: 'Today, 11:30 AM', status: 'In Progress' },
  { id: '4', patientName: 'James Patel', therapyType: 'Shoulder Dislocation Rehab', therapist: 'Dr. John', date: 'Tomorrow, 09:00 AM', status: 'Scheduled' },
  { id: '5', patientName: 'Linda Brown', therapyType: 'ACL Reconstruction Rehab', therapist: 'Dr. Lisa', date: 'Today, 03:00 PM', status: 'Scheduled' },
];

const STATUSES = ['All', 'Scheduled', 'In Progress', 'Completed'];

const Physiotherapy: React.FC = () => {
  const [sessions, setSessions] = useState<TherapySession[]>(INITIAL_SESSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({ patientName: '', therapyType: '', therapist: 'Dr. John', date: '' });

  const stats = useMemo(() => ({
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'Scheduled').length,
    inProgress: sessions.filter(s => s.status === 'In Progress').length,
    completed: sessions.filter(s => s.status === 'Completed').length,
  }), [sessions]);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const ms = !searchTerm.trim() || s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || s.therapyType.toLowerCase().includes(searchTerm.toLowerCase()) || s.therapist.toLowerCase().includes(searchTerm.toLowerCase());
      const mf = filterStatus === 'All' || s.status === filterStatus;
      return ms && mf;
    });
  }, [sessions, searchTerm, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ns: TherapySession = { id: `PHY-${Date.now()}`, patientName: formData.patientName, therapyType: formData.therapyType, therapist: formData.therapist, date: formData.date || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }), status: 'Scheduled' };
    setSessions(prev => [ns, ...prev]);
    setIsModalOpen(false);
    setFormData({ patientName: '', therapyType: '', therapist: 'Dr. John', date: '' });
  };

  const updateStatus = (id: string, status: string) => setSessions(prev => prev.map(s => s.id === id ? { ...s, status: status as any } : s));

  const getNextAction = (status: string): { label: string; next: string; icon: React.ReactNode } | null => {
    if (status === 'Scheduled') return { label: 'Start', next: 'In Progress', icon: <PlayCircle size={14} /> };
    if (status === 'In Progress') return { label: 'Complete', next: 'Completed', icon: <CheckCircle size={14} /> };
    return null;
  };

  const getStatusColor = (s: string) => {
    if (s === 'Scheduled') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    if (s === 'In Progress') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  };

  const inp = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Physiotherapy</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage rehab schedules and therapy sessions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center gap-2"><Plus size={18} /> Add Session</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ l: 'Total', v: stats.total, I: Accessibility, c: 'teal' }, { l: 'Scheduled', v: stats.scheduled, I: Clock, c: 'blue' }, { l: 'In Progress', v: stats.inProgress, I: Activity, c: 'amber' }, { l: 'Completed', v: stats.completed, I: CheckCircle, c: 'green' }].map(s => (
          <div key={s.l} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{s.l}</p><h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{s.v}</h3></div>
              <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg"><s.I className="text-slate-500 dark:text-slate-400" size={20} /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search by patient or therapy..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">
          {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(session => {
          const act = getNextAction(session.status); return (
            <div key={session.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start gap-4">
              <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-full text-teal-600 dark:text-teal-400 shrink-0"><Accessibility size={24} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-white">{session.patientName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0 ${getStatusColor(session.status)}`}>{session.status}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">{session.therapyType}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><User size={12} /> {session.therapist}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                </div>
                {act && (
                  <button onClick={() => updateStatus(session.id, act.next)} className="mt-3 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">{act.icon} {act.label}</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Session</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label><input type="text" required value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className={inp} placeholder="Patient name" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Therapy Type</label><input type="text" required value={formData.therapyType} onChange={e => setFormData(p => ({ ...p, therapyType: e.target.value }))} className={inp} placeholder="e.g. Post-Op Knee Rehab" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Therapist</label><input type="text" value={formData.therapist} onChange={e => setFormData(p => ({ ...p, therapist: e.target.value }))} className={inp} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time</label><input type="text" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className={inp} placeholder="e.g. Today, 10:00 AM" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Add Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Physiotherapy;
