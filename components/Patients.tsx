import React, { useState, useMemo } from 'react';
import {
    Users, Search, Plus, X, Filter, UserPlus, Activity, Heart,
    AlertCircle, CheckCircle, Clock, Phone, MapPin, Droplets
} from 'lucide-react';

interface PatientRecord {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    contact: string;
    bloodGroup: string;
    condition: string;
    admitDate: string;
    status: 'Admitted' | 'Discharged' | 'Critical' | 'OPD';
    doctor: string;
    ward: string;
}

const MOCK_PATIENTS: PatientRecord[] = [
    { id: 'P-1001', name: 'Aisha Khan', age: 34, gender: 'Female', contact: '+92-300-1234567', bloodGroup: 'O+', condition: 'Post-Surgery Recovery', admitDate: '2024-01-15', status: 'Admitted', doctor: 'Dr. Sarah Ahmed', ward: 'General' },
    { id: 'P-1002', name: 'Bilal Hussain', age: 58, gender: 'Male', contact: '+92-321-9876543', bloodGroup: 'A-', condition: 'Cardiac Monitoring', admitDate: '2024-01-14', status: 'Critical', doctor: 'Dr. Faisal Malik', ward: 'ICU' },
    { id: 'P-1003', name: 'Fatima Noor', age: 27, gender: 'Female', contact: '+92-333-5556667', bloodGroup: 'B+', condition: 'Maternity', admitDate: '2024-01-16', status: 'Admitted', doctor: 'Dr. Hina Raza', ward: 'Maternity' },
    { id: 'P-1004', name: 'Omar Siddiqui', age: 45, gender: 'Male', contact: '+92-345-1112223', bloodGroup: 'AB+', condition: 'Fracture', admitDate: '2024-01-10', status: 'Discharged', doctor: 'Dr. Kamran Shah', ward: 'Orthopedics' },
    { id: 'P-1005', name: 'Zainab Ali', age: 12, gender: 'Female', contact: '+92-312-4443332', bloodGroup: 'O-', condition: 'Viral Fever', admitDate: '2024-01-17', status: 'OPD', doctor: 'Dr. Noman Iqbal', ward: 'Pediatrics' },
    { id: 'P-1006', name: 'Tariq Mehmood', age: 67, gender: 'Male', contact: '+92-301-7778889', bloodGroup: 'A+', condition: 'Pneumonia', admitDate: '2024-01-13', status: 'Critical', doctor: 'Dr. Sarah Ahmed', ward: 'ICU' },
];

const WARDS = ['All', 'General', 'ICU', 'Maternity', 'Orthopedics', 'Pediatrics', 'Emergency'];
const STATUSES = ['All', 'Admitted', 'Discharged', 'Critical', 'OPD'];

const Patients: React.FC = () => {
    const [patients, setPatients] = useState<PatientRecord[]>(MOCK_PATIENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterWard, setFilterWard] = useState('All');
    const [formData, setFormData] = useState({
        name: '', age: '', gender: 'Male' as 'Male' | 'Female' | 'Other',
        contact: '', bloodGroup: 'O+', condition: '', doctor: '', ward: 'General',
    });

    const stats = useMemo(() => ({
        total: patients.length,
        admitted: patients.filter(p => p.status === 'Admitted').length,
        discharged: patients.filter(p => p.status === 'Discharged').length,
        critical: patients.filter(p => p.status === 'Critical').length,
    }), [patients]);

    const filtered = useMemo(() => {
        return patients.filter(p => {
            const matchSearch = !searchTerm.trim() || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()) || p.doctor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'All' || p.status === filterStatus;
            const matchWard = filterWard === 'All' || p.ward === filterWard;
            return matchSearch && matchStatus && matchWard;
        });
    }, [patients, searchTerm, filterStatus, filterWard]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPatient: PatientRecord = {
            id: `P-${Date.now().toString().slice(-4)}`,
            name: formData.name, age: parseInt(formData.age) || 0, gender: formData.gender,
            contact: formData.contact, bloodGroup: formData.bloodGroup, condition: formData.condition,
            admitDate: new Date().toISOString().slice(0, 10), status: 'Admitted',
            doctor: formData.doctor, ward: formData.ward,
        };
        setPatients(prev => [newPatient, ...prev]);
        setIsModalOpen(false);
        setFormData({ name: '', age: '', gender: 'Male', contact: '', bloodGroup: 'O+', condition: '', doctor: '', ward: 'General' });
    };

    const updateStatus = (id: string, status: PatientRecord['status']) => {
        setPatients(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Admitted': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'Discharged': return 'bg-success-light text-success-dark';
            case 'Critical': return 'bg-danger-light text-danger-dark';
            case 'OPD': return 'bg-warning-light text-warning-dark';
            default: return 'bg-background-tertiary text-foreground-secondary';
        }
    };

    const getNextStatus = (status: string): PatientRecord['status'] | null => {
        switch (status) {
            case 'OPD': return 'Admitted';
            case 'Admitted': return 'Discharged';
            case 'Critical': return 'Admitted';
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Patient Registry</h1>
                    <p className="text-foreground-secondary">Manage patient records, admissions, and discharges.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-accent/20 flex items-center gap-2 transition-colors">
                    <UserPlus size={18} /> Register Patient
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Patients', value: stats.total, icon: Users, color: 'blue' },
                    { label: 'Admitted', value: stats.admitted, icon: Activity, color: 'indigo' },
                    { label: 'Discharged', value: stats.discharged, icon: CheckCircle, color: 'green' },
                    { label: 'Critical', value: stats.critical, icon: AlertCircle, color: 'red' },
                ].map(s => (
                    <div key={s.label} className="bg-background-secondary p-4 rounded-xl shadow-sm border border-border theme-transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-foreground-secondary uppercase">{s.label}</p>
                                <h3 className={`text-2xl font-bold mt-1 text-${s.color}-600 dark:text-${s.color}-400`}>{s.value}</h3>
                            </div>
                            <div className={`p-2 bg-${s.color}-50 dark:bg-${s.color}-900/20 rounded-lg`}>
                                <s.icon className={`text-${s.color}-600 dark:text-${s.color}-400`} size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch bg-background-secondary p-4 rounded-xl shadow-sm border border-border theme-transition">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input type="text" placeholder="Search patients, ID, or doctor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-primary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-background-primary text-foreground-primary text-sm focus:ring-2 focus:ring-accent theme-transition">
                    {STATUSES.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
                </select>
                <select value={filterWard} onChange={e => setFilterWard(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-background-primary text-foreground-primary text-sm focus:ring-2 focus:ring-accent theme-transition">
                    {WARDS.map(w => <option key={w} value={w}>{w === 'All' ? 'All Wards' : w}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-background-secondary rounded-xl shadow-sm border border-border overflow-hidden theme-transition">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background-tertiary border-b border-border text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
                                <th className="px-5 py-4">ID</th>
                                <th className="px-5 py-4">Patient</th>
                                <th className="px-5 py-4">Age/Gender</th>
                                <th className="px-5 py-4">Contact</th>
                                <th className="px-5 py-4">Ward</th>
                                <th className="px-5 py-4">Condition</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Doctor</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map(p => {
                                const next = getNextStatus(p.status);
                                return (
                                    <tr key={p.id} className="hover:bg-background-tertiary transition-colors">
                                        <td className="px-5 py-4 font-mono text-xs text-foreground-muted">{p.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                                                    {p.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground-primary text-sm">{p.name}</p>
                                                    <p className="text-xs text-foreground-muted flex items-center gap-1"><Droplets size={10} /> {p.bloodGroup}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-foreground-secondary">{p.age} / {p.gender}</td>
                                        <td className="px-5 py-4 text-sm text-foreground-muted flex items-center gap-1"><Phone size={12} />{p.contact}</td>
                                        <td className="px-5 py-4 text-sm font-medium text-foreground-secondary">{p.ward}</td>
                                        <td className="px-5 py-4 text-sm text-foreground-muted">{p.condition}</td>
                                        <td className="px-5 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(p.status)}`}>{p.status}</span></td>
                                        <td className="px-5 py-4 text-sm text-foreground-muted">{p.doctor}</td>
                                        <td className="px-5 py-4 text-right">
                                            {next && (
                                                <button onClick={() => updateStatus(p.id, next)} className="text-accent text-xs font-semibold hover:underline">
                                                    → {next}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-lg overflow-hidden theme-transition">
                        <div className="flex justify-between items-center p-5 border-b border-border bg-background-tertiary">
                            <h2 className="text-lg font-bold text-foreground-primary">Register New Patient</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-foreground-muted hover:text-foreground-primary"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Full Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" placeholder="Patient full name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Age</label>
                                    <input type="number" required value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" placeholder="Age" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Gender</label>
                                    <select value={formData.gender} onChange={e => setFormData(p => ({ ...p, gender: e.target.value as any }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Contact</label>
                                    <input type="text" required value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" placeholder="Phone number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Blood Group</label>
                                    <select value={formData.bloodGroup} onChange={e => setFormData(p => ({ ...p, bloodGroup: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition">
                                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Condition</label>
                                    <input type="text" required value={formData.condition} onChange={e => setFormData(p => ({ ...p, condition: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" placeholder="Diagnosis / Condition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Doctor</label>
                                    <input type="text" required value={formData.doctor} onChange={e => setFormData(p => ({ ...p, doctor: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" placeholder="Attending doctor" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-primary mb-1">Ward</label>
                                    <select value={formData.ward} onChange={e => setFormData(p => ({ ...p, ward: e.target.value }))}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition">
                                        {WARDS.filter(w => w !== 'All').map(w => <option key={w}>{w}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-accent text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-accent/20">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
