import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Search, Plus, X, CheckCircle, Clock, AlertCircle, Send, User, Building2, FileText } from 'lucide-react';

interface Referral {
    id: string; patientName: string; fromDept: string; toDept: string; doctor: string;
    reason: string; priority: 'Routine' | 'Urgent' | 'Emergency'; date: string;
    status: 'Pending' | 'Accepted' | 'Completed' | 'Declined'; notes?: string;
}

const MOCK: Referral[] = [
    { id: 'REF-001', patientName: 'Aisha Khan', fromDept: 'General Medicine', toDept: 'Cardiology', doctor: 'Dr. Faisal Malik', reason: 'Abnormal ECG findings', priority: 'Urgent', date: '2024-01-17', status: 'Pending' },
    { id: 'REF-002', patientName: 'Bilal Hussain', fromDept: 'Emergency', toDept: 'Orthopedics', doctor: 'Dr. Kamran Shah', reason: 'Suspected fracture', priority: 'Emergency', date: '2024-01-16', status: 'Accepted' },
    { id: 'REF-003', patientName: 'Fatima Noor', fromDept: 'OPD', toDept: 'Dermatology', doctor: 'Dr. Hina Raza', reason: 'Chronic skin condition', priority: 'Routine', date: '2024-01-15', status: 'Completed', notes: 'Treated successfully' },
    { id: 'REF-004', patientName: 'Omar Siddiqui', fromDept: 'Surgery', toDept: 'Physiotherapy', doctor: 'Dr. Sarah Ahmed', reason: 'Post-op rehabilitation', priority: 'Routine', date: '2024-01-14', status: 'Accepted' },
    { id: 'REF-005', patientName: 'Zainab Ali', fromDept: 'Pediatrics', toDept: 'ENT', doctor: 'Dr. Noman Iqbal', reason: 'Recurrent ear infections', priority: 'Urgent', date: '2024-01-13', status: 'Declined', notes: 'Referred externally' },
];

const DEPTS = ['General Medicine', 'Cardiology', 'Orthopedics', 'Dermatology', 'ENT', 'Surgery', 'Physiotherapy', 'Pediatrics', 'Emergency', 'OPD', 'Neurology', 'Oncology'];
const STATUSES = ['All', 'Pending', 'Accepted', 'Completed', 'Declined'];

const Referrals: React.FC = () => {
    const [referrals, setReferrals] = useState<Referral[]>(MOCK);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [formData, setFormData] = useState({ patientName: '', fromDept: 'General Medicine', toDept: 'Cardiology', doctor: '', reason: '', priority: 'Routine' as Referral['priority'] });

    const stats = useMemo(() => ({
        total: referrals.length, pending: referrals.filter(r => r.status === 'Pending').length,
        accepted: referrals.filter(r => r.status === 'Accepted').length, completed: referrals.filter(r => r.status === 'Completed').length,
    }), [referrals]);

    const filtered = useMemo(() => referrals.filter(r => {
        const ms = !searchTerm.trim() || r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || r.toDept.toLowerCase().includes(searchTerm.toLowerCase()) || r.doctor.toLowerCase().includes(searchTerm.toLowerCase());
        const mf = filterStatus === 'All' || r.status === filterStatus;
        return ms && mf;
    }), [referrals, searchTerm, filterStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setReferrals(prev => [{ id: `REF-${Date.now().toString().slice(-3)}`, ...formData, date: new Date().toISOString().slice(0, 10), status: 'Pending' as const }, ...prev]);
        setIsModalOpen(false);
        setFormData({ patientName: '', fromDept: 'General Medicine', toDept: 'Cardiology', doctor: '', reason: '', priority: 'Routine' });
    };

    const updateStatus = (id: string, status: Referral['status']) => setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    const getStatusColor = (s: string) => {
        if (s === 'Pending') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        if (s === 'Accepted') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        if (s === 'Completed') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    };

    const getPriorityColor = (p: string) => {
        if (p === 'Emergency') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
        if (p === 'Urgent') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
    };

    const getNextAction = (s: string): { label: string; next: Referral['status'] } | null => {
        if (s === 'Pending') return { label: 'Accept', next: 'Accepted' };
        if (s === 'Accepted') return { label: 'Complete', next: 'Completed' };
        return null;
    };

    const inp = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-violet-500 dark:bg-slate-700 dark:text-white";

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Referral Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track inter-departmental and external referrals.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet-700 shadow-lg shadow-violet-600/20 flex items-center gap-2"><Send size={18} /> Create Referral</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ l: 'Total', v: stats.total, I: ArrowRightLeft }, { l: 'Pending', v: stats.pending, I: Clock }, { l: 'Accepted', v: stats.accepted, I: CheckCircle }, { l: 'Completed', v: stats.completed, I: FileText }].map(s => (
                    <div key={s.l} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{s.l}</p><h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{s.v}</h3></div>
                            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg"><s.I className="text-slate-500 dark:text-slate-400" size={20} /></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search patient, department, doctor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">
                    {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                            <th className="px-5 py-4">ID</th><th className="px-5 py-4">Patient</th><th className="px-5 py-4">From → To</th><th className="px-5 py-4">Doctor</th><th className="px-5 py-4">Reason</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filtered.map(r => {
                                const act = getNextAction(r.status); return (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{r.id}</td>
                                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white text-sm">{r.patientName}</td>
                                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300"><span className="text-slate-500 dark:text-slate-400">{r.fromDept}</span> <span className="text-violet-500">→</span> <span className="font-medium text-slate-700 dark:text-white">{r.toDept}</span></td>
                                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{r.doctor}</td>
                                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{r.reason}</td>
                                        <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(r.priority)}`}>{r.priority}</span></td>
                                        <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)}`}>{r.status}</span></td>
                                        <td className="px-5 py-4 text-right">{act && <button onClick={() => updateStatus(r.id, act.next)} className="text-violet-600 dark:text-violet-400 text-xs font-semibold hover:underline">{act.label}</button>}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Referral</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label><input type="text" required value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className={inp} placeholder="Patient name" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From Dept</label><select value={formData.fromDept} onChange={e => setFormData(p => ({ ...p, fromDept: e.target.value }))} className={inp}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To Dept</label><select value={formData.toDept} onChange={e => setFormData(p => ({ ...p, toDept: e.target.value }))} className={inp}>{DEPTS.map(d => <option key={d}>{d}</option>)}</select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Doctor</label><input type="text" required value={formData.doctor} onChange={e => setFormData(p => ({ ...p, doctor: e.target.value }))} className={inp} placeholder="Referring doctor" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label><select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value as any }))} className={inp}><option>Routine</option><option>Urgent</option><option>Emergency</option></select></div>
                            </div>
                            <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason</label><textarea required value={formData.reason} onChange={e => setFormData(p => ({ ...p, reason: e.target.value }))} className={inp + ' resize-none'} rows={3} placeholder="Reason for referral" /></div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700">Create Referral</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Referrals;
