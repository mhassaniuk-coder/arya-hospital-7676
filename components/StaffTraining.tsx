import React, { useState, useMemo } from 'react';
import { TrainingModule } from '../types';
import { GraduationCap, CheckCircle, PlayCircle, Clock, BarChart3, Users, Search, Filter, Award, Plus, X, BookOpen, AlertCircle, FileText } from 'lucide-react';

const INITIAL_TRAINING: TrainingModule[] = [
    { id: 'TM-001', title: 'HIPAA Compliance 2024', assignedTo: 'All Staff', dueDate: '2024-03-31', status: 'In Progress', score: 45, duration: '2 hours', description: 'Annual training on patient privacy and data security regulations.', type: 'Compliance', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 'TM-002', title: 'Infection Control Basics', assignedTo: 'Nurses', dueDate: '2024-03-15', status: 'Completed', score: 100, duration: '1.5 hours', description: 'Standard precautions for preventing hospital-acquired infections.', type: 'Safety', image: 'https://images.unsplash.com/photo-1584036561566-b938f49a79cd?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 'TM-003', title: 'Advanced Cardiac Life Support', assignedTo: 'Doctors', dueDate: '2024-04-10', status: 'Not Started', score: 0, duration: '4 hours', description: 'Updated protocols for cardiac emergencies and resuscitation.', type: 'Clinical', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 'TM-004', title: 'Workplace Safety Guidelines', assignedTo: 'All Staff', dueDate: '2024-03-20', status: 'In Progress', score: 75, duration: '1 hour', description: 'General safety rules, fire protocols, and ergonomics.', type: 'Safety', image: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?auto=format&fit=crop&q=80&w=300&h=200' },
    { id: 'TM-005', title: 'Electronic Health Records', assignedTo: 'Admin', dueDate: '2024-03-25', status: 'Completed', score: 95, duration: '3 hours', description: 'Mastering the new EHR system features and shortcuts.', type: 'Skill', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=300&h=200' },
];

const StaffTraining: React.FC = () => {
    const [modules, setModules] = useState<TrainingModule[]>(INITIAL_TRAINING);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showCertificate, setShowCertificate] = useState<TrainingModule | null>(null);

    const filtered = useMemo(() => modules.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'All' || m.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    }), [modules, searchQuery, typeFilter, statusFilter]);

    const stats = useMemo(() => ({
        total: modules.length,
        completed: modules.filter(m => m.status === 'Completed').length,
        inProgress: modules.filter(m => m.status === 'In Progress').length,
        avgScore: Math.round(modules.filter(m => m.score !== undefined).reduce((acc, m) => acc + (m.score || 0), 0) / modules.length) || 0,
    }), [modules]);

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        // Add logic to assign module
        setShowAssignModal(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff Training (LMS)</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage compliance courses and professional development.</p>
                </div>
                <button onClick={() => setShowAssignModal(true)} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all">
                    <Plus size={18} /> Assign Module
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Courses', value: stats.total, icon: <BookOpen size={22} />, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
                    { label: 'Completed', value: stats.completed, icon: <CheckCircle size={22} />, color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
                    { label: 'In Progress', value: stats.inProgress, icon: <Clock size={22} />, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
                    { label: 'Avg Score', value: `${stats.avgScore}%`, icon: <BarChart3 size={22} />, color: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search courses or staff..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="relative">
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="All">All Types</option><option>Compliance</option><option>Safety</option><option>Clinical</option><option>Skill</option>
                    </select>
                    <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="All">All Status</option><option>Not Started</option><option>In Progress</option><option>Completed</option>
                    </select>
                    <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(module => (
                    <div key={module.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                        <div className="h-40 overflow-hidden relative">
                            <img src={module.image} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${module.type === 'Compliance' ? 'bg-indigo-500/90 text-white' :
                                        module.type === 'Safety' ? 'bg-orange-500/90 text-white' :
                                            module.type === 'Clinical' ? 'bg-blue-500/90 text-white' : 'bg-teal-500/90 text-white'
                                    }`}>
                                    {module.type}
                                </span>
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${module.status === 'Completed' ? 'bg-green-500/90 text-white' :
                                        module.status === 'In Progress' ? 'bg-amber-500/90 text-white' : 'bg-slate-500/90 text-white'
                                    }`}>
                                    {module.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">{module.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 flex-1">{module.description}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="flex items-center gap-1"><Clock size={14} /> {module.duration}</span>
                                <span className="flex items-center gap-1"><Users size={14} /> {module.assignedTo}</span>
                                <span className="flex items-center gap-1"><AlertCircle size={14} /> Due {new Date(module.dueDate).toLocaleDateString()}</span>
                            </div>

                            {module.status !== 'Not Started' && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{module.score}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${module.status === 'Completed' ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${module.score}%` }} />
                                    </div>
                                </div>
                            )}

                            {module.status === 'Completed' ? (
                                <button onClick={() => setShowCertificate(module)} className="w-full py-2.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl font-semibold text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2">
                                    <Award size={16} /> View Certificate
                                </button>
                            ) : (
                                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2">
                                    <PlayCircle size={16} /> {module.status === 'In Progress' ? 'Continue' : 'Start course'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No training modules found</p>
                </div>
            )}

            {/* Assign Modal */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign Training Module</h3>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAssign} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Module Title</label>
                                <select className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>Select a module...</option>
                                    <option>New Hire Orientation</option>
                                    <option>Data Privacy Advanced</option>
                                    <option>Emergency Response Drill</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Assign To</label>
                                <select className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                    <option>All Staff</option>
                                    <option>Doctors Only</option>
                                    <option>Nurses Only</option>
                                    <option>Admin Staff</option>
                                    <option>Specific Individual...</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
                                    <input type="date" className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
                                    <select className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Notes</label>
                                <textarea rows={3} placeholder="Additional instructions..." className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">Assign Training</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Certificate Modal */}
            {showCertificate && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCertificate(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border-8 border-slate-200 relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowCertificate(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 z-10"><X size={20} /></button>

                        <div className="p-12 text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                            <div className="mb-6 flex justify-center">
                                <div className="p-4 bg-indigo-50 rounded-full border-4 border-indigo-100">
                                    <Award size={48} className="text-indigo-600" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Certificate of Completion</h2>
                            <p className="text-slate-500 italic mb-8">This is to certify that</p>

                            <div className="text-2xl font-bold text-indigo-700 mb-2 border-b-2 border-slate-200 inline-block px-12 pb-2">Dr. Sarah Chen</div>

                            <p className="text-slate-600 mt-6 mb-2">has successfully completed the training module</p>
                            <h3 className="text-xl font-bold text-slate-800 mb-8">{showCertificate.title}</h3>

                            <div className="flex justify-center gap-12 text-left max-w-md mx-auto">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Date Completed</p>
                                    <p className="font-semibold text-slate-900">{new Date(showCertificate.dueDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Score Achieved</p>
                                    <p className="font-semibold text-slate-900">{showCertificate.score}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                                    <p className="font-semibold text-slate-900">{showCertificate.duration}</p>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center">
                                <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                                    <FileText size={18} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffTraining;