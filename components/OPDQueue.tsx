import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { QueueItem, TriageResult } from '../types';
import { useTriageAssistant } from '../hooks/useAI';
import { 
    ListOrdered, Clock, User, Plus, X, Activity, Thermometer, Heart, 
    AlertCircle, Stethoscope, ChevronRight, Sparkles, Brain, 
    Loader2, AlertTriangle, CheckCircle, Zap 
} from 'lucide-react';

const OPDQueue: React.FC = () => {
    const { opdQueue, addToQueue } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<QueueItem | null>(null);
    const [showAITriage, setShowAITriage] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        doctorName: 'Dr. Sarah Chen',
        department: 'General Medicine',
        waitTime: '15m',
        priority: 'Routine',
        symptoms: '',
        age: '',
        gender: 'Male',
        heartRate: '',
        bloodPressure: '',
        temperature: '',
        oxygenSaturation: ''
    });

    // AI Triage hook
    const { data: triageResult, loading: triageLoading, execute: executeTriage, reset: resetTriage } = useTriageAssistant();

    const handleAITriage = async () => {
        if (!formData.symptoms) return;
        
        await executeTriage({
            symptoms: formData.symptoms,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender,
            vitalSigns: {
                heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
                bloodPressure: formData.bloodPressure || undefined,
                temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
                oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
            }
        });
    };

    const applyTriageRecommendation = () => {
        if (triageResult) {
            setFormData(prev => ({
                ...prev,
                priority: triageResult.urgencyLevel === 'Emergency' ? 'Emergency' :
                         triageResult.urgencyLevel === 'Urgent' ? 'Urgent' : 'Routine',
                department: triageResult.recommendedDepartment
            }));
            setShowAITriage(false);
        }
    };

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
        resetTriage();
        setFormData({ 
            patientName: '', 
            doctorName: 'Dr. Sarah Chen', 
            department: 'General Medicine', 
            waitTime: '15m',
            priority: 'Routine',
            symptoms: '',
            age: '',
            gender: 'Male',
            heartRate: '',
            bloodPressure: '',
            temperature: '',
            oxygenSaturation: ''
        });
    };

    const getPriorityColor = (priority?: string) => {
        switch(priority) {
            case 'Emergency': return 'bg-red-100 text-red-700 border-red-200';
            case 'Urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-green-100 text-green-700 border-green-200';
        }
    };

    const getUrgencyIcon = (level: string) => {
        switch(level) {
            case 'Emergency': return <AlertTriangle className="text-red-500" size={20} />;
            case 'Urgent': return <Zap className="text-orange-500" size={20} />;
            default: return <CheckCircle className="text-green-500" size={20} />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">OPD Triage & Queue</h1>
                  <p className="text-slate-500 dark:text-slate-400">AI-powered triage and outpatient management system.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} /> Add Patient
                </button>
            </div>

            {/* AI Feature Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                    <Brain className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-purple-900 dark:text-purple-200">AI-Powered Triage Assistant</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Get intelligent priority recommendations based on symptoms and vital signs</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                        <Sparkles size={12} /> AI-Assisted
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Queue List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <ListOrdered size={18} /> Current Queue
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                {opdQueue.length} Patients Waiting
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
                            {opdQueue.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400">No patients in queue.</div>
                            ) : (
                                opdQueue.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => setSelectedPatient(item)}
                                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex items-center justify-between group ${selectedPatient?.id === item.id ? 'bg-teal-50/50 dark:bg-teal-900/20' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${getPriorityColor(item.priority)}`}>
                                                {item.tokenNumber}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white">{item.patientName}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
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
                                                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1">
                                                    <Clock size={12} /> {item.waitTime} wait
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-teal-500 dark:group-hover:text-teal-400" />
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
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-fade-in">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Token #{selectedPatient.tokenNumber}</span>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedPatient.patientName}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPatient.department}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedPatient.priority)}`}>
                                    {selectedPatient.priority || 'Routine'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-600">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Reported Symptoms</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200">{selectedPatient.symptoms || "No specific symptoms recorded."}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">BP</span>
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">120/80</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                            <Heart size={14} /> <span className="text-xs font-medium">HR</span>
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">72 bpm</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                            <Thermometer size={14} /> <span className="text-xs font-medium">Temp</span>
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">98.6°F</p>
                                    </div>
                                    <div className="p-3 border border-slate-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">SpO2</span>
                                        </div>
                                        <p className="font-bold text-slate-800 dark:text-white">98%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                                    Call Patient
                                </button>
                                <button className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                                    Update Vitals
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                            <Stethoscope size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Select a patient to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 animate-scale-up max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Triage New Patient</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Enter patient information for AI-assisted triage</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); resetTriage(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Patient Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Patient Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.patientName}
                                            onChange={e => setFormData({...formData, patientName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.age}
                                            onChange={e => setFormData({...formData, age: e.target.value})}
                                            placeholder="Years"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.gender}
                                            onChange={e => setFormData({...formData, gender: e.target.value})}
                                        >
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Symptoms Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Symptoms & Vitals</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Symptoms / Chief Complaint *</label>
                                    <textarea 
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none"
                                        value={formData.symptoms}
                                        onChange={e => setFormData({...formData, symptoms: e.target.value})}
                                        placeholder="Describe the patient's symptoms in detail..."
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Heart Rate (bpm)</label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.heartRate}
                                            onChange={e => setFormData({...formData, heartRate: e.target.value})}
                                            placeholder="e.g., 72"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Pressure</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.bloodPressure}
                                            onChange={e => setFormData({...formData, bloodPressure: e.target.value})}
                                            placeholder="e.g., 120/80"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°F)</label>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.temperature}
                                            onChange={e => setFormData({...formData, temperature: e.target.value})}
                                            placeholder="e.g., 98.6"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">SpO2 (%)</label>
                                        <input 
                                            type="number" 
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.oxygenSaturation}
                                            onChange={e => setFormData({...formData, oxygenSaturation: e.target.value})}
                                            placeholder="e.g., 98"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* AI Triage Button */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="text-purple-600" size={20} />
                                        <span className="font-semibold text-purple-900">AI Triage Analysis</span>
                                    </div>
                                    <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles size={10} /> AI-Assisted
                                    </span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={handleAITriage}
                                    disabled={!formData.symptoms || triageLoading}
                                    className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {triageLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={18} />
                                            Get AI Triage Recommendation
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* AI Triage Results */}
                            {triageResult && (
                                <div className="bg-white border-2 border-purple-200 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                            {getUrgencyIcon(triageResult.urgencyLevel)}
                                            AI Triage Result
                                        </h4>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(triageResult.urgencyLevel)}`}>
                                            {triageResult.urgencyLevel}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-500">Priority Score</p>
                                            <p className="font-bold text-slate-800">{triageResult.priorityScore}/10</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Recommended Dept</p>
                                            <p className="font-bold text-slate-800">{triageResult.recommendedDepartment}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500">Est. Wait Time</p>
                                            <p className="font-bold text-slate-800">{triageResult.estimatedWaitTime}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm">
                                        <p className="text-slate-500 mb-1">Clinical Reasoning</p>
                                        <p className="text-slate-700">{triageResult.reasoning}</p>
                                    </div>
                                    
                                    {triageResult.redFlags.length > 0 && (
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                                <AlertTriangle size={14} /> Red Flags
                                            </p>
                                            <ul className="text-xs text-red-600 list-disc list-inside">
                                                {triageResult.redFlags.map((flag, i) => (
                                                    <li key={i}>{flag}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {triageResult.recommendedActions.length > 0 && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-blue-700 mb-1">Recommended Actions</p>
                                            <ul className="text-xs text-blue-600 list-disc list-inside">
                                                {triageResult.recommendedActions.map((action, i) => (
                                                    <li key={i}>{action}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="button"
                                        onClick={applyTriageRecommendation}
                                        className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                                    >
                                        Apply AI Recommendation
                                    </button>
                                </div>
                            )}

                            {/* Assignment Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Assignment</h3>
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
                                            <option>Emergency Department</option>
                                            <option>Cardiology</option>
                                            <option>Orthopedics</option>
                                            <option>Pediatrics</option>
                                            <option>Neurology</option>
                                            <option>Dermatology</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Doctor</label>
                                        <select 
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                            value={formData.doctorName}
                                            onChange={e => setFormData({...formData, doctorName: e.target.value})}
                                        >
                                            <option>Dr. Sarah Chen</option>
                                            <option>Dr. Michael Wilson</option>
                                            <option>Dr. Emily Brown</option>
                                            <option>Dr. James Lee</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2 flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add to Triage Queue
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OPDQueue;
