import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { MaternityPatient } from '../types';
import { Baby, Heart, Plus, X } from 'lucide-react';

const Maternity: React.FC = () => {
    const { maternityPatients, addMaternityPatient } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        weeksPregnant: 0,
        doctor: 'Dr. Cuddy',
        status: 'Ante-natal',
        room: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMom: MaternityPatient = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            weeksPregnant: Number(formData.weeksPregnant),
            doctor: formData.doctor,
            status: formData.status as 'Ante-natal' | 'Labor' | 'Post-natal',
            room: formData.room
        };
        addMaternityPatient(newMom);
        setIsModalOpen(false);
        setFormData({ name: '', weeksPregnant: 0, doctor: 'Dr. Cuddy', status: 'Ante-natal', room: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Maternity Ward</h1>
                  <p className="text-slate-500">Monitoring ante-natal and labor patients.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-pink-200 flex items-center gap-2"
                >
                    <Plus size={16} /> Admit Patient
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maternityPatients.map(mom => (
                    <div key={mom.id} className={`p-6 rounded-2xl border relative bg-white ${mom.status === 'Labor' ? 'border-pink-300 shadow-md shadow-pink-100' : 'border-slate-100 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-pink-50 p-3 rounded-full text-pink-500">
                                <Baby size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${mom.status === 'Labor' ? 'bg-pink-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                                {mom.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{mom.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">Room: {mom.room}</p>
                        
                        <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Gestation</p>
                                <p className="font-bold text-slate-800">{mom.weeksPregnant} Weeks</p>
                            </div>
                            <Heart size={20} className="text-red-400" fill="currentColor" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Admit Maternity Patient</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Weeks Pregnant</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.weeksPregnant}
                                        onChange={e => setFormData({...formData, weeksPregnant: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Room No.</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.room}
                                        onChange={e => setFormData({...formData, room: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.doctor}
                                    onChange={e => setFormData({...formData, doctor: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="Ante-natal">Ante-natal</option>
                                    <option value="Labor">Labor</option>
                                    <option value="Post-natal">Post-natal</option>
                                </select>
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors mt-2"
                            >
                                Admit Patient
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maternity;