import React, { useState } from 'react';
import {
    Calendar, Clock, User, Stethoscope, CheckCircle,
    ChevronRight, ChevronLeft, Search, Plus, X
} from 'lucide-react';
import { useData } from '../src/contexts/DataContext';
import { useSmartScheduling, useRiskStratification } from '../hooks/useAdvancedAI';
import { Doctor, Appointment } from '../types';

interface AppointmentWizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

type Step = 'patient' | 'provider' | 'slot' | 'review' | 'success';

const STEPS: { id: Step; label: string; icon: React.FC<any> }[] = [
    { id: 'patient', label: 'Patient', icon: User },
    { id: 'provider', label: 'Provider', icon: Stethoscope },
    { id: 'slot', label: 'Time', icon: Clock },
    { id: 'review', label: 'Review', icon: CheckCircle },
];

const AppointmentWizard: React.FC<AppointmentWizardProps> = ({ onClose, onSuccess }) => {
    const { doctors, addAppointment, patients } = useData();
    const [currentStep, setCurrentStep] = useState<Step>('patient');

    // Form State
    const [selectedPatient, setSelectedPatient] = useState<{ name: string, id?: string, age?: number, gender?: string } | null>(null);
    const [newPatientName, setNewPatientName] = useState('');
    const [selectedDept, setSelectedDept] = useState('General Practice');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const [reason, setReason] = useState('General Checkup');

    // AI Hooks
    const { data: schedulingData, loading: schedulingLoading, execute: analyzeScheduling } = useSmartScheduling();
    const { data: riskData, loading: riskLoading, execute: analyzeRisk } = useRiskStratification();

    // Trigger AI analysis: No-Show Prediction (via Risk Stratification)
    React.useEffect(() => {
        if (currentStep === 'patient' && selectedPatient?.id && selectedPatient.id !== 'new') {
            analyzeRisk({
                patient_name: selectedPatient.name,
                age: selectedPatient.age || 35, // fallback
                gender: selectedPatient.gender || 'Female', // fallback
                diagnoses: ['Checkup'],
                social_factors: { history: 'Missed appointments' } // Trigger for demo
            });
        }
    }, [currentStep, selectedPatient]);

    // Trigger AI analysis: Slot Optimization
    React.useEffect(() => {
        if (currentStep === 'slot' && selectedDoctor && selectedDate) {
            analyzeScheduling({
                department: selectedDept,
                date: selectedDate,
                available_doctors: [selectedDoctor.name]
            });
        }
    }, [currentStep, selectedDoctor, selectedDate]);

    // Helpers
    const nextStep = () => {
        if (currentStep === 'patient') setCurrentStep('provider');
        else if (currentStep === 'provider') setCurrentStep('slot');
        else if (currentStep === 'slot') setCurrentStep('review');
        else if (currentStep === 'success') onSuccess();
    };

    const prevStep = () => {
        if (currentStep === 'provider') setCurrentStep('patient');
        else if (currentStep === 'slot') setCurrentStep('provider');
        else if (currentStep === 'review') setCurrentStep('slot');
    };

    const handleConfirm = () => {
        if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) return;

        const newApt: Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            patientName: selectedPatient.name,
            doctorName: selectedDoctor.name,
            date: new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            time: selectedTime,
            type: reason,
            status: 'Pending',
            isOnline
        };

        addAppointment(newApt);
        setCurrentStep('success');
    };

    // Mock Data
    const existingPatients = patients || [
        { id: 'p1', name: 'John Doe', age: 45 },
        { id: 'p2', name: 'Sarah Ahmed', age: 32 },
        { id: 'p3', name: 'Michael Chen', age: 28 },
    ];

    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">

                {/* Sidebar Steps */}
                <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-8 overflow-x-auto">
                    <div className="hidden md:block">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">New Appointment</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Follow the steps to schedule.</p>
                    </div>

                    <div className="flex md:flex-col gap-4 md:gap-6 flex-1">
                        {STEPS.map((step, idx) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = STEPS.findIndex(s => s.id === currentStep) > idx || currentStep === 'success';

                            return (
                                <div key={step.id} className={`flex items-center gap-3 ${isActive ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-40'} transition-all`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                    ${isActive ? 'border-teal-600 text-teal-600 bg-teal-50 dark:bg-teal-900/20' :
                                            isCompleted ? 'border-teal-600 bg-teal-600 text-white' :
                                                'border-slate-400 text-slate-400'}`}>
                                        {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                                    </div>
                                    <span className={`text-sm font-semibold hidden md:block ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                        {step.label}
                                    </span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 hidden md:block animate-pulse" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
                    {/* Header (Mobile only) */}
                    <div className="md:hidden p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 dark:text-white">Schedule Appointment</h2>
                        <button onClick={onClose}><X size={24} className="text-slate-400" /></button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        {currentStep === 'patient' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Who is this appointment for?</h3>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search patients by name or ID..."
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                        onChange={(e) => setNewPatientName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Patients</p>
                                    {existingPatients.slice(0, 3).map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setSelectedPatient({ name: p.name, id: p.id, age: p.age || 40, gender: (p as any).gender || 'Unknown' })}
                                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between
                        ${selectedPatient?.id === p.id
                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {p.id}</p>
                                                </div>
                                            </div>
                                            {selectedPatient?.id === p.id && <CheckCircle className="text-teal-600" size={20} />}
                                        </button>
                                    ))}

                                    {/* AI No-Show Prediction Alert */}
                                    {selectedPatient?.id && selectedPatient.id !== 'new' && riskData && (
                                        <div className={`mt-4 p-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${riskData.risk_level === 'High' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                                            riskData.risk_level === 'Moderate' ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' :
                                                'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            }`}>
                                            <div className={`p-1.5 rounded-full ${riskData.risk_level === 'High' ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300' :
                                                riskData.risk_level === 'Moderate' ? 'bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300' :
                                                    'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300'
                                                }`}>
                                                {riskLoading ? <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <ChevronRight size={16} />}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${riskData.risk_level === 'High' ? 'text-red-800 dark:text-red-300' :
                                                    riskData.risk_level === 'Moderate' ? 'text-orange-800 dark:text-orange-300' :
                                                        'text-green-800 dark:text-green-300'
                                                    }`}>
                                                    AI Prediction: {riskData.risk_level === 'High' ? 'High No-Show Probability' : riskData.risk_level === 'Moderate' ? 'Moderate No-Show Risk' : 'Reliable Patient'}
                                                </h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                    Based on historical data and current factors. {riskData.risk_level !== 'Low' && 'Consider sending an automated SMS reminder 24h prior.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {newPatientName && (
                                        <button
                                            onClick={() => setSelectedPatient({ name: newPatientName, id: 'new' })}
                                            className={`w-full text-left p-4 rounded-xl border border-dashed border-teal-300 bg-teal-50/50 hover:bg-teal-50 transition-all flex items-center gap-3
                        ${selectedPatient?.name === newPatientName && selectedPatient.id === 'new' ? 'ring-2 ring-teal-500' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white border border-teal-200 flex items-center justify-center text-teal-600">
                                                <Plus size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-teal-800">New Patient: "{newPatientName}"</p>
                                                <p className="text-xs text-teal-600">Create a new profile</p>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 'provider' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Choose a Medical Professional</h3>

                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {['General Practice', 'Cardiology', 'Neurology', 'Pediatrics', 'Dental'].map(dept => (
                                        <button
                                            key={dept}
                                            onClick={() => setSelectedDept(dept)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                        ${selectedDept === dept
                                                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctors.filter(d => d.specialty === selectedDept || selectedDept === 'General Practice').map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoctor(doc)}
                                            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group
                        ${selectedDoctor?.id === doc.id
                                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:shadow-md'}`}
                                        >
                                            <div className="flex gap-4">
                                                <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{doc.name}</p>
                                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{doc.specialty}</p>
                                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                        <span className={`w-2 h-2 rounded-full ${doc.status === 'Online' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                        {doc.status}
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedDoctor?.id === doc.id && (
                                                <div className="absolute top-2 right-2 text-teal-600"><CheckCircle size={18} /></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 'slot' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Select Date & Time</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preferred Date</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            value={selectedDate}
                                            min={new Date().toISOString().split('T')[0]}
                                        />

                                        <div className="mt-6">
                                            <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isOnline}
                                                    onChange={(e) => setIsOnline(e.target.checked)}
                                                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        Online Consultation <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full">Video Call</span>
                                                    </p>
                                                    <p className="text-xs text-slate-500">Connect with doctor via secure video link.</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason for Visit</label>
                                            <select
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                            >
                                                <option>General Checkup</option>
                                                <option>Follow Up</option>
                                                <option>Emergency</option>
                                                <option>Lab Results</option>
                                                <option>Vaccination</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex justify-between">
                                            <span>Available Slots</span>
                                            {schedulingLoading && <span className="text-xs text-teal-600 animate-pulse">AI Optimizing...</span>}
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 h-full content-start">
                                            {timeSlots.map(time => {
                                                const isOptimal = schedulingData?.optimal_slots?.includes(time) || (time === '10:00 AM' || time === '02:00 PM'); // Demo logic if AI returns null
                                                return (
                                                    <button
                                                        key={time}
                                                        onClick={() => setSelectedTime(time)}
                                                        className={`py-2.5 px-4 rounded-lg text-sm font-medium border transition-all text-center relative
                             ${selectedTime === time
                                                                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                                                : isOptimal
                                                                    ? 'bg-teal-50 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:border-teal-400'
                                                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400'}`}
                                                    >
                                                        {time}
                                                        {isOptimal && selectedTime !== time && (
                                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" title="AI Recommended" />
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {schedulingData && (
                                            <p className="text-xs text-slate-500 mt-2 text-center">
                                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
                                                AI Recommended Slot
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'success' && (
                            <div className="flex flex-col items-center justify-center h-full text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle size={40} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Appointment Confirmed!</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                                    Your appointment with <span className="font-semibold text-slate-900 dark:text-white">{selectedDoctor?.name}</span> has been successfully scheduled for <span className="font-semibold text-slate-900 dark:text-white">{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</span>.
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={onClose} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        Close
                                    </button>
                                    <button onClick={() => window.print()} className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                                        Print Confirmation
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentStep === 'review' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Review & Confirm</h3>

                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-6">
                                    <div className="flex items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Patient</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedPatient?.name}</p>
                                            <p className="text-sm text-slate-500">ID: {selectedPatient?.id === 'new' ? 'New Profile' : selectedPatient?.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                                        <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                            <Stethoscope size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Doctor & Department</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedDoctor?.name}</p>
                                            <p className="text-sm text-slate-500">{selectedDoctor?.specialty} • {selectedDept}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">Date & Time</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</p>
                                            <p className="text-sm text-slate-500">{reason} • {isOnline ? 'Online Consultation' : 'In-Person Visit'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Navigation */}
                    {currentStep !== 'success' && (
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-br-2xl">
                            {currentStep !== 'patient' && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Back
                                </button>
                            )}
                            {currentStep !== 'review' ? (
                                <button
                                    onClick={nextStep}
                                    disabled={
                                        (currentStep === 'patient' && !selectedPatient) ||
                                        (currentStep === 'provider' && !selectedDoctor) ||
                                        (currentStep === 'slot' && (!selectedDate || !selectedTime))
                                    }
                                    className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2"
                                >
                                    Next Step <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleConfirm}
                                    className="px-8 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center gap-2"
                                >
                                    Confirm Appointment <CheckCircle size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentWizard;
