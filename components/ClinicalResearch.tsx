import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { ResearchTrial } from '../types';
import { Microscope, Users, FileText, Plus, X } from 'lucide-react';

const ClinicalResearch: React.FC = () => {
    const { researchTrials, addResearchTrial } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        phase: 'Phase I',
        participants: 0,
        status: 'Recruiting',
        leadResearcher: 'Dr. Chen'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTrial: ResearchTrial = {
            id: Math.random().toString(36).substr(2, 9),
            title: formData.title,
            phase: formData.phase,
            participants: Number(formData.participants),
            status: formData.status as 'Recruiting' | 'Active' | 'Completed',
            leadResearcher: formData.leadResearcher
        };
        addResearchTrial(newTrial);
        setIsModalOpen(false);
        setFormData({ title: '', phase: 'Phase I', participants: 0, status: 'Recruiting', leadResearcher: 'Dr. Chen' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Clinical Research</h1>
                  <p className="text-slate-500">Manage trials and study participants.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2"
                >
                    <Plus size={16} /> New Trial
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {researchTrials.map(trial => (
                    <div key={trial.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                                <Microscope size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg">{trial.title}</h3>
                                <p className="text-sm text-slate-500 mb-2">Lead: {trial.leadResearcher}</p>
                                <div className="flex gap-2 mb-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{trial.phase}</span>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${trial.status === 'Recruiting' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {trial.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Users size={16} />
                                    <span>{trial.participants} Participants</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">New Clinical Trial</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Trial Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lead Researcher</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.leadResearcher}
                                    onChange={e => setFormData({...formData, leadResearcher: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phase</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.phase}
                                        onChange={e => setFormData({...formData, phase: e.target.value})}
                                    >
                                        <option>Phase I</option>
                                        <option>Phase II</option>
                                        <option>Phase III</option>
                                        <option>Phase IV</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Participants</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.participants}
                                        onChange={e => setFormData({...formData, participants: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="Recruiting">Recruiting</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2"
                            >
                                Launch Trial
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClinicalResearch;