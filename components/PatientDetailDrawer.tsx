import React, { useState } from 'react';
import {
    X, Activity, Pill, FileText, FlaskConical, Stethoscope, File,
    Utensils, Clock, Download, Brain, Sparkles, Loader2, AlertTriangle,
    Mic, MicOff, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
    Zap, Gauge, CalendarClock, HeartPulse, AlertOctagon, Heart, Upload,
    ChevronRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient, LabResult, VitalSign, ReadmissionRiskResult, LengthOfStayResult, MortalityRiskResult, ECGAnalysisResult } from '../types';
import { useMedicalScribe, useVitalSignsMonitor, useCDSS } from '../hooks/useAI';
import { useRiskStratification } from '../hooks/useAdvancedAI';
import { predictReadmissionRisk, predictLengthOfStay, assessMortalityRisk, analyzeECG } from '../services/aiService';
import { useTheme } from '../src/contexts/ThemeContext';

interface PatientDetailDrawerProps {
    patient: Patient | null;
    isOpen: boolean;
    onClose: () => void;
}

const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({ patient, isOpen, onClose }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'docs' | 'diet' | 'history' | 'ai'>('overview');
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');

    // AI Hooks
    const { data: scribeResult, loading: scribeLoading, execute: generateNotes } = useMedicalScribe();
    const { data: vitalsAnalysis, loading: vitalsLoading, execute: analyzeVitals } = useVitalSignsMonitor();
    const { data: cdssResult, loading: cdssLoading, execute: getCDSS } = useCDSS();
    const { data: riskStratResult, loading: riskStratLoading, execute: stratifyRisk } = useRiskStratification();

    // Predictive Analytics State
    const [readmissionResult, setReadmissionResult] = useState<ReadmissionRiskResult | null>(null);
    const [losResult, setLosResult] = useState<LengthOfStayResult | null>(null);
    const [mortalityResult, setMortalityResult] = useState<MortalityRiskResult | null>(null);
    const [readmissionLoading, setReadmissionLoading] = useState(false);
    const [losLoading, setLosLoading] = useState(false);
    const [mortalityLoading, setMortalityLoading] = useState(false);

    // ECG Analysis State
    const [ecgImage, setEcgImage] = useState<string | null>(null);
    const [ecgResult, setEcgResult] = useState<ECGAnalysisResult | null>(null);
    const [ecgLoading, setEcgLoading] = useState(false);

    if (!patient) return null;

    const vitalsData = patient.vitals || [
        { time: '08:00', heartRate: 72, temp: 36.6, bloodPressure: '120/80' },
        { time: '10:00', heartRate: 75, temp: 36.7, bloodPressure: '122/81' },
        { time: '12:00', heartRate: 78, temp: 36.8, bloodPressure: '121/82' },
        { time: '14:00', heartRate: 76, temp: 36.7, bloodPressure: '119/80' },
        { time: '16:00', heartRate: 82, temp: 36.9, bloodPressure: '125/83' },
    ];

    const medications = patient.medications || [
        { name: 'Amoxicillin', dosage: '500mg', frequency: '3x Daily' },
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed' },
    ];

    const labResults: LabResult[] = patient.labResults || [
        { id: '1', testName: 'Complete Blood Count', date: '2023-10-24', result: 'Normal', status: 'Normal' },
        { id: '2', testName: 'Metabolic Panel', date: '2023-10-24', result: 'Slightly Elevated Glucose', status: 'Abnormal' },
    ];

    const docs = [
        { id: '1', name: 'MRI Scan - Head', type: 'DICOM', date: 'Oct 24, 2023', size: '45 MB' },
        { id: '2', name: 'Blood Test Report', type: 'PDF', date: 'Oct 23, 2023', size: '1.2 MB' },
    ];

    const diet = [
        { meal: 'Breakfast', description: 'Oatmeal with berries', calories: 350, status: 'Consumed' },
        { meal: 'Lunch', description: 'Grilled chicken salad', calories: 450, status: 'Planned' },
    ];

    const timeline = [
        { date: 'Oct 24, 10:00 AM', title: 'Admitted', description: 'Patient admitted via ER', type: 'Admission' },
        { date: 'Oct 24, 02:00 PM', title: 'MRI Scan', description: 'Head scan completed', type: 'Surgery' },
        { date: 'Oct 25, 09:00 AM', title: 'Consultation', description: 'Dr. Chen reviewed results', type: 'Medication' },
    ];

    // AI Functions
    const handleAnalyzeVitals = async () => {
        await analyzeVitals({
            vitalSigns: vitalsData,
            patientAge: patient.age,
            patientCondition: patient.condition
        });
    };

    const handleGenerateNotes = async () => {
        if (!transcription) return;
        await generateNotes({
            transcription,
            encounterType: 'consultation',
            patientInfo: {
                name: patient.name,
                age: patient.age,
                gender: patient.gender
            }
        });
    };

    const handleGetCDSS = async () => {
        await getCDSS({
            patientId: patient.id,
            diagnosis: patient.condition,
            currentMedications: medications,
            labResults: labResults,
            vitalSigns: vitalsData,
            age: patient.age,
            gender: patient.gender
        });
    };

    // Predictive Analytics Functions
    const handleStratifyRisk = async () => {
        await stratifyRisk({
            patient_name: patient.name,
            age: patient.age,
            gender: patient.gender,
            diagnoses: [patient.condition],
            medications: medications.map(m => m.name),
            lab_results: labResults.reduce((acc, curr) => ({ ...acc, [curr.testName]: curr.result }), {}),
            social_factors: {
                smoking: 'No',
                alcohol: 'Occasional'
            }
        });
    };

    const handleReadmissionRisk = async () => {
        setReadmissionLoading(true);
        try {
            const response = await predictReadmissionRisk({
                patientId: patient.id,
                patientInfo: {
                    age: patient.age,
                    gender: patient.gender,
                    admissionDate: patient.admissionDate
                },
                diagnosis: {
                    primary: patient.condition
                },
                medicalHistory: {
                    conditions: patient.history ? [patient.history] : [],
                    previousAdmissions: 2,
                    previousAdmissionsLast30Days: 0,
                    previousAdmissionsLast90Days: 1,
                    chronicConditions: patient.condition.includes('Chronic') ? [patient.condition] : []
                },
                currentVisit: {
                    department: 'General Medicine',
                    admissionType: 'emergency'
                }
            });
            if (response.success && response.data) {
                setReadmissionResult(response.data);
            }
        } catch (error) {
            console.error('Readmission risk error:', error);
        } finally {
            setReadmissionLoading(false);
        }
    };

    const handleLengthOfStay = async () => {
        setLosLoading(true);
        try {
            const response = await predictLengthOfStay({
                patientId: patient.id,
                patientInfo: {
                    age: patient.age,
                    gender: patient.gender
                },
                admission: {
                    date: patient.admissionDate,
                    type: 'emergency',
                    department: 'General Medicine',
                    source: 'home'
                },
                diagnosis: {
                    primary: patient.condition,
                    severity: patient.urgency === 'Critical' ? 'critical' :
                        patient.urgency === 'High' ? 'severe' : 'moderate'
                }
            });
            if (response.success && response.data) {
                setLosResult(response.data);
            }
        } catch (error) {
            console.error('LOS prediction error:', error);
        } finally {
            setLosLoading(false);
        }
    };

    const handleMortalityRisk = async () => {
        setMortalityLoading(true);
        try {
            const response = await assessMortalityRisk({
                patientId: patient.id,
                patientInfo: {
                    age: patient.age,
                    gender: patient.gender
                },
                admission: {
                    date: patient.admissionDate,
                    type: 'emergency',
                    department: 'General Medicine',
                    icuAdmission: patient.urgency === 'Critical'
                },
                diagnosis: {
                    primary: patient.condition
                },
                vitals: vitalsData.slice(0, 3).map(v => ({
                    date: v.time,
                    systolicBP: parseInt(v.bloodPressure?.split('/')[0] || '120'),
                    diastolicBP: parseInt(v.bloodPressure?.split('/')[1] || '80'),
                    heartRate: v.heartRate,
                    temperature: v.temp,
                    respiratoryRate: 16,
                    oxygenSaturation: 98
                })),
                labResults: labResults.map(l => ({
                    date: l.date,
                    testName: l.testName,
                    value: l.result,
                    isAbnormal: l.status === 'Abnormal'
                })),
                medicalHistory: {
                    conditions: patient.history ? [patient.history] : [],
                    surgeries: [],
                    allergies: []
                },
                currentStatus: {
                    consciousness: 'alert',
                    ventilation: false,
                    vasopressors: false,
                    dialysis: false,
                    cpr: false
                }
            });
            if (response.success && response.data) {
                setMortalityResult(response.data);
            }
        } catch (error) {
            console.error('Mortality risk error:', error);
        } finally {
            setMortalityLoading(false);
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            // Simulate recording
            setTimeout(() => {
                setTranscription("Patient presents with persistent headache for 3 days. Describes pain as throbbing, primarily frontal. No nausea or photophobia. Vitals stable. Neurological examination unremarkable. Patient reports similar episodes in the past, usually lasting 2-3 days. No known triggers identified.");
                setIsRecording(false);
            }, 3000);
        }
    };

    // ECG Analysis Functions
    const handleECGImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEcgImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyzeECG = async () => {
        if (!ecgImage) return;
        setEcgLoading(true);
        try {
            const response = await analyzeECG({
                ecgData: ecgImage,
                leadConfiguration: '12-lead',
                patientInfo: {
                    age: patient.age,
                    gender: patient.gender,
                    symptoms: [patient.condition]
                }
            });
            if (response.success && response.data) {
                setEcgResult(response.data);
            }
        } catch (error) {
            console.error('ECG analysis error:', error);
        } finally {
            setEcgLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
            case 'moderate': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'low': return 'bg-green-500/10 text-green-500 border-green-500/30';
            default: return 'bg-background-tertiary text-foreground-secondary border-border';
        }
    };

    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/30';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
            case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            default: return 'bg-green-500/10 text-green-500 border-green-500/30';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full md:w-[800px] bg-background-primary/95 backdrop-blur-xl shadow-2xl border-l border-border flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border bg-background-secondary/50">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl border border-accent/30 shadow-lg shadow-accent/10">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground-primary mb-1">{patient.name}</h2>
                                        <div className="flex items-center gap-3 text-sm text-foreground-secondary">
                                            <span className="flex items-center gap-1"><FileText size={14} /> ID: {patient.id}</span>
                                            <span>•</span>
                                            <span>{patient.age} yrs, {patient.gender}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${patient.urgency === 'Critical' ? 'bg-red-500 text-white shadow-red-500/20' :
                                            patient.urgency === 'High' ? 'bg-orange-500 text-white shadow-orange-500/20' :
                                                'bg-green-500 text-white shadow-green-500/20'
                                        }`}>
                                        {patient.urgency || 'Normal'}
                                    </span>
                                    <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-full text-foreground-secondary transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide border-b border-border/50">
                                {['overview', 'labs', 'docs', 'diet', 'history', 'ai'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all relative flex items-center gap-2 ${activeTab === tab
                                                ? 'text-accent bg-accent/5'
                                                : 'text-foreground-secondary hover:text-foreground-primary hover:bg-background-tertiary'
                                            }`}
                                    >
                                        {tab === 'ai' && <Sparkles size={14} className="text-purple-500" />}
                                        <span className="capitalize">{tab === 'docs' ? 'Documents' : tab}</span>
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            {/* Primary Info Card */}
                                            <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-accent/20 rounded-lg text-accent">
                                                        <Activity size={20} />
                                                    </div>
                                                    <h3 className="font-bold text-foreground-primary">Primary Condition</h3>
                                                </div>
                                                <p className="text-lg font-medium text-foreground-primary pl-11">{patient.condition}</p>
                                            </div>

                                            {/* Vitals Chart */}
                                            <div className="glass-panel p-6 rounded-2xl">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-foreground-primary flex items-center gap-2">
                                                        <HeartPulse className="text-red-500" size={20} />
                                                        Vitals Monitor
                                                    </h3>
                                                    <button
                                                        onClick={() => setActiveTab('ai')}
                                                        className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-lg font-medium border border-purple-500/30 flex items-center gap-1 hover:bg-purple-500/20 transition-colors"
                                                    >
                                                        <Brain size={12} /> AI Analysis
                                                    </button>
                                                </div>
                                                <div className="h-[250px] w-full">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={vitalsData}>
                                                            <defs>
                                                                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                                                            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                                            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                                            <Tooltip
                                                                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                                                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                                            />
                                                            <Area type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorHr)" />
                                                            <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            {/* Medications */}
                                            <div className="glass-panel p-6 rounded-2xl">
                                                <h3 className="font-bold text-foreground-primary flex items-center gap-2 mb-4">
                                                    <Pill className="text-teal-500" size={20} />
                                                    Active Medications
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {medications.map((med, idx) => (
                                                        <div key={idx} className="flex flex-col p-4 bg-background-tertiary/50 rounded-xl border border-border hover:border-accent/30 transition-colors">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className="font-bold text-foreground-primary">{med.name}</p>
                                                                <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-1 rounded-full uppercase tracking-wide">
                                                                    {med.frequency}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-foreground-secondary">{med.dosage}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'labs' && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {labResults.map((lab) => (
                                                <div key={lab.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:border-accent/40 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                            <FlaskConical size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-foreground-primary">{lab.testName}</h4>
                                                            <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                                                <Clock size={14} />
                                                                <span>{lab.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-1 ${lab.status === 'Normal' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                            }`}>
                                                            {lab.status}
                                                        </span>
                                                        <p className="text-sm font-medium text-foreground-primary">{lab.result}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'docs' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {docs.map(doc => (
                                                <div key={doc.id} className="glass-panel p-5 rounded-2xl group hover:border-accent/40 cursor-pointer transition-all">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <div className="p-3 bg-background-tertiary rounded-xl group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                                            <File size={24} className="text-foreground-secondary group-hover:text-accent" />
                                                        </div>
                                                        <span className="text-[10px] font-bold bg-background-tertiary border border-border px-2 py-1 rounded text-foreground-muted uppercase">
                                                            {doc.type}
                                                        </span>
                                                    </div>
                                                    <p className="font-bold text-sm text-foreground-primary truncate mb-1">{doc.name}</p>
                                                    <div className="flex justify-between items-center text-xs text-foreground-muted">
                                                        <span>{doc.size}</span>
                                                        <span>{doc.date}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <button className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/5 p-4 transition-all h-full min-h-[160px]">
                                                <Upload size={32} className="mb-3 opacity-50" />
                                                <span className="text-sm font-bold">Upload Document</span>
                                                <span className="text-xs opacity-70 mt-1">PDF, DICOM, JPG</span>
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'ai' && (
                                        <div className="space-y-6">
                                            {/* Risk Cards Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Readmission Risk */}
                                                <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-orange-500 relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-bold text-foreground-primary flex items-center gap-2">
                                                            <AlertOctagon size={16} className="text-orange-500" />
                                                            Readmission
                                                        </h4>
                                                        <button
                                                            onClick={handleReadmissionRisk}
                                                            disabled={readmissionLoading}
                                                            className="text-xs bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-lg font-bold hover:bg-orange-500/20 transition-colors disabled:opacity-50"
                                                        >
                                                            {readmissionLoading ? <Loader2 className="animate-spin" size={12} /> : 'Predict'}
                                                        </button>
                                                    </div>
                                                    {readmissionResult ? (
                                                        <div>
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="text-3xl font-bold text-foreground-primary">{readmissionResult.riskScore}</span>
                                                                <span className="text-sm text-foreground-secondary">/ 100</span>
                                                            </div>
                                                            <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded ${getRiskLevelColor(readmissionResult.riskLevel)}`}>
                                                                {readmissionResult.riskLevel?.replace('_', ' ').toUpperCase()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-foreground-muted italic">Click predict to assess 30-day risk.</p>
                                                    )}
                                                </div>

                                                {/* Mortality Risk */}
                                                <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-red-500 relative overflow-hidden">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-bold text-foreground-primary flex items-center gap-2">
                                                            <HeartPulse size={16} className="text-red-500" />
                                                            Mortality
                                                        </h4>
                                                        <button
                                                            onClick={handleMortalityRisk}
                                                            disabled={mortalityLoading}
                                                            className="text-xs bg-red-500/10 text-red-600 px-2.5 py-1 rounded-lg font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                        >
                                                            {mortalityLoading ? <Loader2 className="animate-spin" size={12} /> : 'Assess'}
                                                        </button>
                                                    </div>
                                                    {mortalityResult ? (
                                                        <div>
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="text-3xl font-bold text-foreground-primary">{mortalityResult.riskScore}</span>
                                                                <span className="text-sm text-foreground-secondary">/ 100</span>
                                                            </div>
                                                            <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded ${getRiskLevelColor(mortalityResult.riskLevel)}`}>
                                                                {mortalityResult.riskLevel?.replace('_', ' ').toUpperCase()}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-foreground-muted italic">Click assess to evaluate risk.</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Vitals AI Analysis */}
                                            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-bold text-foreground-primary flex items-center gap-2">
                                                        <Brain className="text-purple-500" size={20} />
                                                        AI Vitals Analysis
                                                    </h3>
                                                    <button onClick={handleAnalyzeVitals} disabled={vitalsLoading} className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-2 disabled:opacity-50">
                                                        {vitalsLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                                        Analyze Now
                                                    </button>
                                                </div>

                                                {vitalsAnalysis ? (
                                                    <div className="bg-background-primary/50 rounded-xl p-4 border border-border space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-foreground-secondary">Early Warning Score</span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(vitalsAnalysis.earlyWarningScore.riskLevel)}`}>
                                                                {vitalsAnalysis.earlyWarningScore.score} - {vitalsAnalysis.earlyWarningScore.riskLevel}
                                                            </span>
                                                        </div>
                                                        {vitalsAnalysis.alerts.length > 0 && (
                                                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                                                <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                                                <p className="text-sm text-red-600 dark:text-red-400">{vitalsAnalysis.alerts[0].message}</p>
                                                            </div>
                                                        )}
                                                        {vitalsAnalysis.recommendedInterventions.length > 0 && (
                                                            <div className="space-y-2">
                                                                <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Recommended Actions</p>
                                                                <ul className="space-y-1">
                                                                    {vitalsAnalysis.recommendedInterventions.map((int, i) => (
                                                                        <li key={i} className="text-sm text-foreground-secondary flex items-start gap-2">
                                                                            <ChevronRight size={14} className="text-purple-500 flex-shrink-0 mt-0.5" />
                                                                            {int}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 border border-dashed border-border rounded-xl">
                                                        <Activity size={32} className="text-foreground-muted mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm text-foreground-secondary">Analyze patient vitals for early warning signs.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* AI Scribe */}
                                            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Mic className="text-blue-500" size={20} />
                                                    <h3 className="font-bold text-foreground-primary">AI Medical Scribe</h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 bg-background-primary/50 p-2 pr-4 rounded-full border border-border">
                                                        <button
                                                            onClick={toggleRecording}
                                                            className={`p-3 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'}`}
                                                        >
                                                            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                                        </button>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-foreground-primary">
                                                                {isRecording ? 'Recording in progress...' : 'Start voice recording'}
                                                            </p>
                                                            {isRecording && <p className="text-xs text-red-500 animate-pulse">Listening...</p>}
                                                        </div>
                                                    </div>

                                                    <textarea
                                                        className="w-full px-4 py-3 border border-border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-24 resize-none bg-background-primary/50 text-foreground-primary placeholder:text-foreground-muted transition-all"
                                                        value={transcription}
                                                        onChange={e => setTranscription(e.target.value)}
                                                        placeholder="Or type clinical notes here..."
                                                    />

                                                    <button
                                                        onClick={handleGenerateNotes}
                                                        disabled={!transcription || scribeLoading}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                                                    >
                                                        {scribeLoading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                                                        Generate Clinical Note
                                                    </button>
                                                </div>

                                                {scribeResult && (
                                                    <div className="mt-6 bg-background-primary rounded-xl p-5 border border-border animate-fade-in">
                                                        <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                                                            <h4 className="font-bold text-foreground-primary">SOAP Note</h4>
                                                            <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">Quality: {scribeResult.qualityScore}%</span>
                                                        </div>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                <span className="font-bold text-foreground-secondary uppercase text-xs pt-1">Subjective</span>
                                                                <p className="text-foreground-primary bg-background-tertiary/30 p-2 rounded-lg">{scribeResult.soapNote.subjective}</p>
                                                            </div>
                                                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                <span className="font-bold text-foreground-secondary uppercase text-xs pt-1">Objective</span>
                                                                <p className="text-foreground-primary bg-background-tertiary/30 p-2 rounded-lg">{scribeResult.soapNote.objective}</p>
                                                            </div>
                                                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                <span className="font-bold text-foreground-secondary uppercase text-xs pt-1">Assessment</span>
                                                                <p className="text-foreground-primary bg-background-tertiary/30 p-2 rounded-lg">{scribeResult.soapNote.assessment}</p>
                                                            </div>
                                                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                                                <span className="font-bold text-foreground-secondary uppercase text-xs pt-1">Plan</span>
                                                                <p className="text-foreground-primary bg-background-tertiary/30 p-2 rounded-lg">{scribeResult.soapNote.plan}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PatientDetailDrawer;
