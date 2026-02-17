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
        switch (priority) {
            case 'Emergency': return 'bg-danger-light text-danger-dark border-red-200 dark:border-red-800';
            case 'Urgent': return 'bg-warning-light text-warning-dark border-orange-200 dark:border-orange-800';
            default: return 'bg-success-light text-success-dark border-green-200 dark:border-green-800';
        }
    };

    const getUrgencyIcon = (level: string) => {
        switch (level) {
            case 'Emergency': return <AlertTriangle className="text-danger-dark" size={20} />;
            case 'Urgent': return <Zap className="text-warning-dark" size={20} />;
            default: return <CheckCircle className="text-success-dark" size={20} />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">OPD Triage & Queue</h1>
                    <p className="text-foreground-secondary">AI-powered triage and outpatient management system.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2 transition-colors theme-transition"
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
                    <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-background-secondary flex justify-between items-center">
                            <span className="font-bold text-foreground-primary flex items-center gap-2">
                                <ListOrdered size={18} /> Current Queue
                            </span>
                            <span className="text-sm text-foreground-muted">
                                {opdQueue.length} Patients Waiting
                            </span>
                        </div>
                        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                            {opdQueue.length === 0 ? (
                                <div className="p-8 text-center text-foreground-muted">No patients in queue.</div>
                            ) : (
                                opdQueue.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedPatient(item)}
                                        className={`p-4 hover:bg-background-secondary cursor-pointer transition-colors flex items-center justify-between group theme-transition ${selectedPatient?.id === item.id ? 'bg-teal-50/50 dark:bg-teal-900/20' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${getPriorityColor(item.priority)}`}>
                                                {item.tokenNumber}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground-primary">{item.patientName}</h4>
                                                <p className="text-xs text-foreground-muted flex items-center gap-2">
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
                                                <p className="text-xs text-foreground-muted flex items-center justify-end gap-1">
                                                    <Clock size={12} /> {item.waitTime} wait
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className="text-foreground-muted group-hover:text-teal-500 theme-transition" />
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
                        <div className="bg-background-elevated rounded-2xl shadow-sm border border-border p-6 animate-fade-in">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider">Token #{selectedPatient.tokenNumber}</span>
                                    <h2 className="text-xl font-bold text-foreground-primary mt-1">{selectedPatient.patientName}</h2>
                                    <p className="text-sm text-foreground-secondary">{selectedPatient.department}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedPatient.priority)}`}>
                                    {selectedPatient.priority || 'Routine'}
                                </span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-background-secondary p-3 rounded-xl border border-border-muted">
                                    <p className="text-xs text-foreground-muted mb-1 font-medium">Reported Symptoms</p>
                                    <p className="text-sm text-foreground-primary">{selectedPatient.symptoms || "No specific symptoms recorded."}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 border border-border rounded-xl bg-background-elevated">
                                        <div className="flex items-center gap-2 text-foreground-muted mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">BP</span>
                                        </div>
                                        <p className="font-bold text-foreground-primary">120/80</p>
                                    </div>
                                    <div className="p-3 border border-border rounded-xl bg-background-elevated">
                                        <div className="flex items-center gap-2 text-foreground-muted mb-1">
                                            <Heart size={14} /> <span className="text-xs font-medium">HR</span>
                                        </div>
                                        <p className="font-bold text-foreground-primary">72 bpm</p>
                                    </div>
                                    <div className="p-3 border border-border rounded-xl bg-background-elevated">
                                        <div className="flex items-center gap-2 text-foreground-muted mb-1">
                                            <Thermometer size={14} /> <span className="text-xs font-medium">Temp</span>
                                        </div>
                                        <p className="font-bold text-foreground-primary">98.6 F</p>
                                    </div>
                                    <div className="p-3 border border-border rounded-xl bg-background-elevated">
                                        <div className="flex items-center gap-2 text-foreground-muted mb-1">
                                            <Activity size={14} /> <span className="text-xs font-medium">SpO2</span>
                                        </div>
                                        <p className="font-bold text-foreground-primary">98%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full bg-teal-600 text-white py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 theme-transition">
                                    Call Patient
                                </button>
                                <button className="w-full bg-background-elevated border border-border text-foreground-secondary py-2.5 rounded-xl font-medium hover:bg-background-secondary transition-colors theme-transition">
                                    Update Vitals
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-background-secondary rounded-2xl border-2 border-dashed border-border p-8 text-center h-full flex flex-col items-center justify-center text-foreground-muted">
                            <Stethoscope size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Select a patient to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-background-elevated rounded-2xl shadow-xl w-full max-w-2xl p-6 m-4 animate-scale-up max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-foreground-primary">Triage New Patient</h2>
                                <p className="text-sm text-foreground-secondary">Enter patient information for AI-assisted triage</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); resetTriage(); }} className="text-foreground-muted hover:text-foreground-primary theme-transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Patient Info Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Patient Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Patient Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.patientName}
                                            onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Age</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.age}
                                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="Years"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Gender</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
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
                                <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Symptoms & Vitals</h3>
                                <div>
                                    <label className="block text-sm font-medium text-foreground-secondary mb-1">Symptoms / Chief Complaint *</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none h-24 resize-none theme-transition"
                                        value={formData.symptoms}
                                        onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                                        placeholder="Describe the patient's symptoms in detail..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Heart Rate (bpm)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.heartRate}
                                            onChange={e => setFormData({ ...formData, heartRate: e.target.value })}
                                            placeholder="e.g., 72"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Blood Pressure</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.bloodPressure}
                                            onChange={e => setFormData({ ...formData, bloodPressure: e.target.value })}
                                            placeholder="e.g., 120/80"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Temperature (F)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.temperature}
                                            onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                                            placeholder="e.g., 98.6"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">SpO2 (%)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.oxygenSaturation}
                                            onChange={e => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                                            placeholder="e.g., 98"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* AI Triage Button */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                                        <span className="font-semibold text-purple-900 dark:text-purple-200">AI Triage Analysis</span>
                                    </div>
                                    <span className="px-2 py-1 bg-purple-200 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles size={10} /> AI-Assisted
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAITriage}
                                    disabled={!formData.symptoms || triageLoading}
                                    className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 theme-transition"
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
                                <div className="bg-background-elevated border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-foreground-primary flex items-center gap-2">
                                            {getUrgencyIcon(triageResult.urgencyLevel)}
                                            AI Triage Result
                                        </h4>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(triageResult.urgencyLevel)}`}>
                                            {triageResult.urgencyLevel}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-foreground-muted">Priority Score</p>
                                            <p className="font-bold text-foreground-primary">{triageResult.priorityScore}/10</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground-muted">Recommended Dept</p>
                                            <p className="font-bold text-foreground-primary">{triageResult.recommendedDepartment}</p>
                                        </div>
                                        <div>
                                            <p className="text-foreground-muted">Est. Wait Time</p>
                                            <p className="font-bold text-foreground-primary">{triageResult.estimatedWaitTime}</p>
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <p className="text-foreground-muted mb-1">Clinical Reasoning</p>
                                        <p className="text-foreground-secondary">{triageResult.reasoning}</p>
                                    </div>

                                    {triageResult.redFlags.length > 0 && (
                                        <div className="bg-danger-light border border-red-100 dark:border-red-800 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-danger-dark mb-1 flex items-center gap-1">
                                                <AlertTriangle size={14} /> Red Flags
                                            </p>
                                            <ul className="text-xs text-danger-dark list-disc list-inside">
                                                {triageResult.redFlags.map((flag, i) => (
                                                    <li key={i}>{flag}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {triageResult.recommendedActions.length > 0 && (
                                        <div className="bg-info-light border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-info-dark mb-1">Recommended Actions</p>
                                            <ul className="text-xs text-info-dark list-disc list-inside">
                                                {triageResult.recommendedActions.map((action, i) => (
                                                    <li key={i}>{action}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={applyTriageRecommendation}
                                        className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors theme-transition"
                                    >
                                        Apply AI Recommendation
                                    </button>
                                </div>
                            )}

                            {/* Assignment Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Assignment</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Priority</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.priority}
                                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        >
                                            <option>Routine</option>
                                            <option>Urgent</option>
                                            <option>Emergency</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Department</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
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
                                        <label className="block text-sm font-medium text-foreground-secondary mb-1">Assign to Doctor</label>
                                        <select
                                            className="w-full px-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-xl focus:ring-2 focus:ring-teal-500 outline-none theme-transition"
                                            value={formData.doctorName}
                                            onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
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
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2 flex items-center justify-center gap-2 theme-transition"
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
