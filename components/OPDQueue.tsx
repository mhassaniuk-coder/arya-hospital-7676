import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { QueueItem } from '../types';
import { ListOrdered, Clock, User, Plus, X, Activity, Thermometer, Heart, AlertCircle, Stethoscope, ChevronRight } from 'lucide-react';

const OPDQueue: React.FC = () => {
    const { opdQueue, addToQueue } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<QueueItem | null>(null);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: 'Dr. Sarah Chen',
        department: 'General Medicine',
        waitTime: '15m',
        priority: 'Routine',
        symptoms: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: QueueItem = {
            id: Math.random().toString(36).substr(2, 9),
            tokenNumber: opdQueue.length > 0 ? Math.max(...opdQueue.map(i => i.tokenNumber)) + 1 : 101,
            patientName: formData.patientName,
            doctorName: formData.doctorName,
            department: formData.department,
            status: 'Waiting',
            waitTime: formData.waitTime,
            priority: formData.priority as 'Routine' | 'Urgent' | 'Emergency',
            symptoms: formData.symptoms
        };
        addToQueue(newItem);
        setIsModalOpen(false);
        setFormData({ 
            patientName: '', 
            doctorName: 'Dr. Sarah Chen', 
            department: 'General Medicine', 
            waitTime: '15m',
            priority: 'Routine',
            symptoms: ''
        });
    };

    const getPriorityColor = (priority?: string) => {
        switch(priority) {
            case 'Emergency': return 'bg-red-100 text-red-700 border-red-200';
            case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">OPD Triage & Queue</h1>
                  <p className="text-slate-500">Live outpatient management system.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2"
                >
                    <Plus size={16} /> Add Patient
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Queue List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                <ListOrdered size={18} /> Current Queue
                            </span>
                            <span className="text-sm text-slate-500">
                                {opdQueue.length} Patients Waiting
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                            {opdQueue.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">No patients in queue.</div>
                            ) : (
                                opdQueue.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => setSelectedPatient(item)}
                                        className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group ${selectedPatient?.id === item.id ? 'bg-teal-50/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${getPriorityColor(item.priority)}`}>
                                                {item.tokenNumber}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{item.patientName}</h4>
                                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                                    <span>{item.department}</span>
                                                    <span>•</span>
                                                    <span>{item.doctorName}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${getPriorityColor(item.priority)}`}>
                                                    {item.priority || 'Routine'}
                                                </div>
                                                <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                                                    <Clock size={12} /> {item.waitTime} wait
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Patient Details / Vitals Entry */}
                <div className="space-y-6">
                    {selectedPatient ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token #{selectedPatient.tokenNumber}</span>
                                    <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedPatient.patientName}</h2>
                                    <p className="text-sm text-slate-500">{selectedPatient.department}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedPatient.priority)}`}>
                                    {selectedPatient.priority || 'Routine'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1 font-medium">Reported Symptoms</p>
                                    <p className="text-sm text-slate-800">{selectedPatient.symptoms || "No specific symptoms recorded."}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">BP</span>
                                        </div>
                                        <p className="font-bold text-slate-800">120/80</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Heart size={14} /> <span className="text-xs font-medium">HR</span>
                                        </div>
                                        <p className="font-bold text-slate-800">72 bpm</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Thermometer size={14} /> <span className="text-xs font-medium">Temp</span>
                                        </div>
                                        <p className="font-bold text-slate-800">98.6°F</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-400 mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">SpO2</span>
                                        </div>
                                        <p className="font-bold text-slate-800">98%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                                    Call Patient
                                </button>
                                <button className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                                    Update Vitals
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center h-full flex flex-col items-center justify-center text-slate-400">
                            <Stethoscope size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Select a patient to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Triage New Patient</h2>
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
                                    value={formData.patientName}
                                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.priority}
                                        onChange={e => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option>Routine</option>
                                        <option>Urgent</option>
                                        <option>Emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                        value={formData.department}
                                        onChange={e => setFormData({...formData, department: e.target.value})}
                                    >
                                        <option>General Medicine</option>
                                        <option>Cardiology</option>
                                        <option>Orthopedics</option>
                                        <option>Pediatrics</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Symptoms / Notes</label>
                                <textarea 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none"
                                    value={formData.symptoms}
                                    onChange={e => setFormData({...formData, symptoms: e.target.value})}
                                    placeholder="Brief description of complaint..."
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2"
                            >
                                Add to Triage
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OPDQueue;
