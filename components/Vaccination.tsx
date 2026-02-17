import React, { useState, useMemo } from 'react';
import { Syringe, Search, Plus, X, CheckCircle, Clock, AlertTriangle, Calendar, Shield } from 'lucide-react';

interface VaccinationRecord {
    id: string; patientName: string; age: number; vaccine: string; dose: string;
    scheduledDate: string; administeredDate?: string; status: 'Due' | 'Administered' | 'Overdue' | 'Missed';
    nurse: string; batchNo: string;
}

const MOCK: VaccinationRecord[] = [
    { id: 'V-001', patientName: 'Baby Ahmad', age: 1, vaccine: 'BCG', dose: '1st', scheduledDate: '2024-01-20', status: 'Due', nurse: 'Nurse Fatima', batchNo: 'BCG-2024-001' },
    { id: 'V-002', patientName: 'Sara Malik', age: 25, vaccine: 'COVID-19 Booster', dose: '3rd', scheduledDate: '2024-01-15', administeredDate: '2024-01-15', status: 'Administered', nurse: 'Nurse Ayesha', batchNo: 'COV-2024-112' },
    { id: 'V-003', patientName: 'Baby Zara', age: 0, vaccine: 'Hepatitis B', dose: '1st', scheduledDate: '2024-01-10', status: 'Overdue', nurse: 'Nurse Fatima', batchNo: 'HBV-2024-045' },
    { id: 'V-004', patientName: 'Ali Hassan', age: 5, vaccine: 'Polio (OPV)', dose: '2nd', scheduledDate: '2024-01-18', administeredDate: '2024-01-18', status: 'Administered', nurse: 'Nurse Sadia', batchNo: 'OPV-2024-078' },
    { id: 'V-005', patientName: 'Hira Bibi', age: 30, vaccine: 'Tetanus', dose: '1st', scheduledDate: '2024-01-22', status: 'Due', nurse: 'Nurse Ayesha', batchNo: 'TET-2024-033' },
    { id: 'V-006', patientName: 'Baby Imran', age: 2, vaccine: 'Measles', dose: '1st', scheduledDate: '2024-01-05', status: 'Missed', nurse: 'Nurse Sadia', batchNo: 'MEA-2024-019' },
];

const VACCINES = ['All', 'BCG', 'Hepatitis B', 'Polio (OPV)', 'COVID-19 Booster', 'Measles', 'Tetanus'];
const STATUSES = ['All', 'Due', 'Administered', 'Overdue', 'Missed'];

const Vaccination: React.FC = () => {
    const [records, setRecords] = useState<VaccinationRecord[]>(MOCK);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [formData, setFormData] = useState({ patientName: '', age: '', vaccine: 'BCG', dose: '1st', scheduledDate: '', nurse: '', batchNo: '' });

    const stats = useMemo(() => ({
        total: records.length, due: records.filter(r => r.status === 'Due').length,
        administered: records.filter(r => r.status === 'Administered').length,
        overdue: records.filter(r => r.status === 'Overdue' || r.status === 'Missed').length,
    }), [records]);

    const filtered = useMemo(() => records.filter(r => {
        const ms = !searchTerm.trim() || r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || r.vaccine.toLowerCase().includes(searchTerm.toLowerCase());
        const mf = filterStatus === 'All' || r.status === filterStatus;
        return ms && mf;
    }), [records, searchTerm, filterStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRecords(prev => [{ id: `V-${Date.now().toString().slice(-3)}`, patientName: formData.patientName, age: parseInt(formData.age) || 0, vaccine: formData.vaccine, dose: formData.dose, scheduledDate: formData.scheduledDate || new Date().toISOString().slice(0, 10), status: 'Due', nurse: formData.nurse, batchNo: formData.batchNo }, ...prev]);
        setIsModalOpen(false);
        setFormData({ patientName: '', age: '', vaccine: 'BCG', dose: '1st', scheduledDate: '', nurse: '', batchNo: '' });
    };

    const markAdministered = (id: string) => setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Administered' as const, administeredDate: new Date().toISOString().slice(0, 10) } : r));

    const getStatusColor = (s: string) => {
        if (s === 'Due') return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
        if (s === 'Administered') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
        if (s === 'Overdue') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    };

    const inp = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:text-white";

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vaccination Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track immunizations, schedules, and administration.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 flex items-center gap-2"><Plus size={18} /> Schedule Vaccination</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ l: 'Total', v: stats.total, I: Shield, c: 'blue' }, { l: 'Due', v: stats.due, I: Clock, c: 'indigo' }, { l: 'Administered', v: stats.administered, I: CheckCircle, c: 'emerald' }, { l: 'Overdue/Missed', v: stats.overdue, I: AlertTriangle, c: 'amber' }].map(s => (
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
                    <input type="text" placeholder="Search patient or vaccine..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">
                    {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                            <th className="px-5 py-4">ID</th><th className="px-5 py-4">Patient</th><th className="px-5 py-4">Vaccine</th><th className="px-5 py-4">Dose</th><th className="px-5 py-4">Scheduled</th><th className="px-5 py-4">Batch</th><th className="px-5 py-4">Nurse</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Action</th>
                        </tr></thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filtered.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{r.id}</td>
                                    <td className="px-5 py-4"><p className="font-medium text-slate-900 dark:text-white text-sm">{r.patientName}</p><p className="text-xs text-slate-500 dark:text-slate-400">Age: {r.age}</p></td>
                                    <td className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{r.vaccine}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{r.dose}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{r.scheduledDate}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{r.batchNo}</td>
                                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{r.nurse}</td>
                                    <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(r.status)}`}>{r.status}</span></td>
                                    <td className="px-5 py-4 text-right">{(r.status === 'Due' || r.status === 'Overdue') && <button onClick={() => markAdministered(r.id)} className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:underline">✓ Administer</button>}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Vaccination</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label><input type="text" required value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} className={inp} placeholder="Patient name" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label><input type="number" required value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} className={inp} placeholder="Age" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vaccine</label><select value={formData.vaccine} onChange={e => setFormData(p => ({ ...p, vaccine: e.target.value }))} className={inp}>{VACCINES.filter(v => v !== 'All').map(v => <option key={v}>{v}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dose</label><select value={formData.dose} onChange={e => setFormData(p => ({ ...p, dose: e.target.value }))} className={inp}>{['1st', '2nd', '3rd', 'Booster'].map(d => <option key={d}>{d}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label><input type="date" value={formData.scheduledDate} onChange={e => setFormData(p => ({ ...p, scheduledDate: e.target.value }))} className={inp} /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nurse</label><input type="text" required value={formData.nurse} onChange={e => setFormData(p => ({ ...p, nurse: e.target.value }))} className={inp} placeholder="Nurse name" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batch No.</label><input type="text" required value={formData.batchNo} onChange={e => setFormData(p => ({ ...p, batchNo: e.target.value }))} className={inp} placeholder="VAX-2024-XXX" /></div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700">Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vaccination;
