import React, { useState } from 'react';
import {
    X, Activity, Pill, FileText, FlaskConical, Stethoscope, File,
    Utensils, Clock, Download, Brain, Sparkles, Loader2, AlertTriangle,
    Mic, MicOff, TrendingUp, TrendingDown, AlertCircle, CheckCircle,
    Zap, Gauge, CalendarClock, HeartPulse, AlertOctagon, Heart, Upload
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
            case 'critical': return 'bg-danger-light text-danger-dark border-danger';
            case 'high': return 'bg-warning-light text-warning-dark border-warning';
            case 'moderate': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            case 'low': return 'bg-success-light text-success-dark border-success';
            default: return 'bg-background-tertiary text-foreground-secondary border-border';
        }
    };

    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'Critical': return 'bg-danger-light text-danger-dark border-danger';
            case 'High': return 'bg-warning-light text-warning-dark border-warning';
            case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default: return 'bg-success-light text-success-dark border-success';
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity theme-transition"
                    onClick={onClose}
                />
            )}

            <div className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-[700px] bg-background-primary shadow-2xl transform transition-transform duration-300 ease-in-out theme-transition
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
                <div className="p-6 border-b border-border bg-background-secondary theme-transition">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground-primary theme-transition">{patient.name}</h2>
                            <p className="text-sm text-foreground-secondary theme-transition">ID: {patient.id} • Room: {patient.roomNumber} • {patient.age} yrs, {patient.gender}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold theme-transition ${patient.urgency === 'Critical' ? 'bg-danger-light text-danger-dark' :
                                patient.urgency === 'High' ? 'bg-warning-light text-warning-dark' :
                                    'bg-success-light text-success-dark'
                                }`}>
                                {patient.urgency || 'Normal'}
                            </span>
                            <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-full theme-transition text-foreground-secondary">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['overview', 'labs', 'docs', 'diet', 'history', 'ai'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg theme-transition whitespace-nowrap capitalize flex items-center gap-1 ${activeTab === tab ? 'bg-background-elevated shadow-sm text-accent' : 'text-foreground-secondary hover:bg-background-tertiary'}`}
                            >
                                {tab === 'history' ? 'Timeline' : tab === 'docs' ? 'Documents' : tab === 'ai' ? (
                                    <>
                                        AI Tools
                                        <Sparkles size={12} className="text-purple-500" />
                                    </>
                                ) : tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background-primary theme-transition">

                    {activeTab === 'overview' && (
                        <>
                            <div className="flex items-center gap-4 p-4 bg-info-light border border-info/30 rounded-xl theme-transition">
                                <div className="bg-info/20 p-2 rounded-lg">
                                    <FileText className="text-info-dark" size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-info-dark font-bold uppercase">Condition</p>
                                    <p className="font-semibold text-foreground-primary theme-transition">{patient.condition}</p>
                                </div>
                            </div>

                            {/* AI Vitals Analysis */}
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 theme-transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Brain className="text-purple-600 dark:text-purple-400" size={18} />
                                        <span className="font-semibold text-purple-900 dark:text-purple-300">AI Vitals Analysis</span>
                                        <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={8} /> AI
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAnalyzeVitals}
                                        disabled={vitalsLoading}
                                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1 theme-transition"
                                    >
                                        {vitalsLoading ? <Loader2 className="animate-spin" size={12} /> : <Activity size={12} />}
                                        Analyze
                                    </button>
                                </div>

                                {vitalsAnalysis ? (
                                    <div className="bg-background-primary rounded-lg p-3 space-y-2 theme-transition">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-foreground-secondary theme-transition">Early Warning Score</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskLevelColor(vitalsAnalysis.earlyWarningScore.riskLevel)}`}>
                                                {vitalsAnalysis.earlyWarningScore.score} - {vitalsAnalysis.earlyWarningScore.riskLevel}
                                            </span>
                                        </div>
                                        {vitalsAnalysis.alerts.length > 0 && (
                                            <div className="text-xs text-warning-dark flex items-center gap-1">
                                                <AlertTriangle size={12} />
                                                {vitalsAnalysis.alerts[0].message}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-purple-700 dark:text-purple-400">Click "Analyze" to get AI-powered early warning scores</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="text-red-500" size={20} />
                                    <h3 className="font-bold text-foreground-primary theme-transition">Vitals Monitor</h3>
                                </div>
                                <div className="h-[200px] w-full bg-background-primary border border-border rounded-xl p-2 shadow-sm theme-transition">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={vitalsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                                            <XAxis dataKey="time" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '8px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}
                                                itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                                            />
                                            <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Pill className="text-teal-500" size={20} />
                                    <h3 className="font-bold text-foreground-primary theme-transition">Medications</h3>
                                </div>
                                <div className="space-y-3">
                                    {medications.map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-background-secondary rounded-lg border border-border theme-transition">
                                            <div>
                                                <p className="font-medium text-foreground-primary theme-transition">{med.name}</p>
                                                <p className="text-xs text-foreground-secondary theme-transition">{med.dosage}</p>
                                            </div>
                                            <span className="text-xs font-semibold bg-background-elevated px-2 py-1 rounded border border-border-muted text-foreground-secondary theme-transition">
                                                {med.frequency}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'labs' && (
                        <div className="space-y-4">
                            {labResults.map((lab) => (
                                <div key={lab.id} className="p-4 border border-border rounded-xl hover:bg-background-secondary theme-transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400"><FlaskConical size={20} /></div>
                                            <div>
                                                <p className="font-semibold text-foreground-primary theme-transition">{lab.testName}</p>
                                                <p className="text-xs text-foreground-secondary theme-transition">{lab.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${lab.status === 'Normal' ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>{lab.status}</span>
                                    </div>
                                    <p className="text-sm ml-12 text-foreground-secondary theme-transition">Result: <span className="font-medium text-foreground-primary theme-transition">{lab.result}</span></p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="grid grid-cols-2 gap-4">
                            {docs.map(doc => (
                                <div key={doc.id} className="p-4 border border-border rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-background-secondary theme-transition">
                                    <div className="flex justify-between items-start mb-8">
                                        <File size={32} className="text-foreground-muted" />
                                        <span className="text-[10px] font-bold bg-background-elevated border border-border-muted px-1.5 py-0.5 rounded text-foreground-secondary theme-transition">{doc.type}</span>
                                    </div>
                                    <p className="font-medium text-sm text-foreground-primary theme-transition truncate">{doc.name}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-foreground-muted">{doc.size}</span>
                                        <Download size={16} className="text-foreground-muted hover:text-accent" />
                                    </div>
                                </div>
                            ))}
                            <button className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:text-accent p-4 transition-colors theme-transition">
                                <File size={24} className="mb-2" />
                                <span className="text-xs font-medium">Upload File</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'diet' && (
                        <div className="space-y-4">
                            {diet.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 border border-border rounded-xl theme-transition">
                                    <div className={`p-3 rounded-full ${item.status === 'Consumed' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                                        <Utensils size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-foreground-primary theme-transition">{item.meal}</p>
                                        <p className="text-sm text-foreground-secondary theme-transition">{item.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-foreground-primary theme-transition">{item.calories} kcal</p>
                                        <span className="text-xs text-foreground-muted">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="relative border-l-2 border-border ml-4 space-y-8 py-2">
                            {timeline.map((event, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-background-primary border-2 border-accent theme-transition"></div>
                                    <p className="text-xs text-foreground-muted mb-1 font-mono">{event.date}</p>
                                    <h4 className="font-bold text-foreground-primary theme-transition text-sm">{event.title}</h4>
                                    <p className="text-sm text-foreground-secondary theme-transition mt-1">{event.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* AI Tools Tab */}
                    {activeTab === 'ai' && (
                        <div className="space-y-6">
                            {/* AI Medical Scribe */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 theme-transition">
                                <div className="flex items-center gap-2 mb-3">
                                    <Mic className="text-blue-600 dark:text-blue-400" size={18} />
                                    <span className="font-semibold text-blue-900 dark:text-blue-300">AI Medical Scribe</span>
                                    <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles size={8} /> AI
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={toggleRecording}
                                            className={`p-3 rounded-full theme-transition ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'}`}
                                        >
                                            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                        </button>
                                        <div className="flex-1">
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                {isRecording ? 'Recording... Click to stop' : 'Click to start voice recording'}
                                            </p>
                                        </div>
                                    </div>

                                    <textarea
                                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none bg-background-primary text-foreground-primary placeholder:text-foreground-muted theme-transition"
                                        value={transcription}
                                        onChange={e => setTranscription(e.target.value)}
                                        placeholder="Transcription will appear here, or type/paste clinical notes..."
                                    />

                                    <button
                                        onClick={handleGenerateNotes}
                                        disabled={!transcription || scribeLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2 theme-transition"
                                    >
                                        {scribeLoading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Brain size={16} />
                                                Generate SOAP Note
                                            </>
                                        )}
                                    </button>
                                </div>

                                {scribeResult && (
                                    <div className="mt-4 bg-background-primary rounded-lg p-4 space-y-3 theme-transition">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-foreground-primary theme-transition">Generated SOAP Note</span>
                                            <span className="text-xs text-foreground-secondary theme-transition">Quality: {scribeResult.qualityScore}%</span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="bg-background-secondary p-2 rounded theme-transition">
                                                <span className="font-semibold text-foreground-secondary theme-transition">Subjective:</span>
                                                <p className="text-foreground-primary theme-transition">{scribeResult.soapNote.subjective}</p>
                                            </div>
                                            <div className="bg-background-secondary p-2 rounded theme-transition">
                                                <span className="font-semibold text-foreground-secondary theme-transition">Objective:</span>
                                                <p className="text-foreground-primary theme-transition">{scribeResult.soapNote.objective}</p>
                                            </div>
                                            <div className="bg-background-secondary p-2 rounded theme-transition">
                                                <span className="font-semibold text-foreground-secondary theme-transition">Assessment:</span>
                                                <p className="text-foreground-primary theme-transition">{scribeResult.soapNote.assessment}</p>
                                            </div>
                                            <div className="bg-background-secondary p-2 rounded theme-transition">
                                                <span className="font-semibold text-foreground-secondary theme-transition">Plan:</span>
                                                <p className="text-foreground-primary theme-transition">{scribeResult.soapNote.plan}</p>
                                            </div>
                                        </div>

                                        {scribeResult.icdCodes.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {scribeResult.icdCodes.map((code, i) => (
                                                    <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-mono rounded">
                                                        {code.code}: {code.description}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Clinical Decision Support */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4 theme-transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="text-green-600 dark:text-green-400" size={18} />
                                        <span className="font-semibold text-green-900 dark:text-green-300">Clinical Decision Support</span>
                                        <span className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Sparkles size={8} /> AI
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleGetCDSS}
                                        disabled={cdssLoading}
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1 theme-transition"
                                    >
                                        {cdssLoading ? <Loader2 className="animate-spin" size={12} /> : <Zap size={12} />}
                                        Analyze
                                    </button>
                                </div>

                                {cdssResult ? (
                                    <div className="bg-background-primary rounded-lg p-4 space-y-3 theme-transition">
                                        {cdssResult.alerts.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-xs font-semibold text-foreground-secondary theme-transition">Clinical Alerts</span>
                                                {cdssResult.alerts.map((alert, i) => (
                                                    <div key={i} className={`p-2 rounded-lg flex items-start gap-2 theme-transition ${alert.type === 'critical' ? 'bg-danger-light border border-danger/30' :
                                                        alert.type === 'warning' ? 'bg-warning-light border border-warning/30' :
                                                            'bg-info-light border border-info/30'
                                                        }`}>
                                                        {alert.type === 'critical' ? (
                                                            <AlertCircle className="text-danger-dark flex-shrink-0" size={16} />
                                                        ) : alert.type === 'warning' ? (
                                                            <AlertTriangle className="text-warning-dark flex-shrink-0" size={16} />
                                                        ) : (
                                                            <CheckCircle className="text-info-dark flex-shrink-0" size={16} />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground-primary theme-transition">{alert.title}</p>
                                                            <p className="text-xs text-foreground-secondary theme-transition">{alert.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {cdssResult.recommendations.length > 0 && (
                                            <div>
                                                <span className="text-xs font-semibold text-foreground-secondary theme-transition">Recommendations</span>
                                                <ul className="mt-1 space-y-1">
                                                    {cdssResult.recommendations.map((rec, i) => (
                                                        <li key={i} className="text-sm text-foreground-secondary theme-transition flex items-start gap-2">
                                                            <CheckCircle size={14} className="text-success-dark mt-0.5 flex-shrink-0" />
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-green-700 dark:text-green-400">Click "Analyze" to get clinical decision support recommendations</p>
                                )}
                            </div>

                            {/* Vitals Analysis Detail */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4 theme-transition">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="text-purple-600 dark:text-purple-400" size={18} />
                                    <span className="font-semibold text-purple-900 dark:text-purple-300">Vital Signs Analysis</span>
                                    <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                        <Sparkles size={8} /> AI
                                    </span>
                                </div>

                                {vitalsAnalysis ? (
                                    <div className="bg-background-primary rounded-lg p-4 space-y-3 theme-transition">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-background-secondary rounded-lg theme-transition">
                                                <p className="text-3xl font-bold text-foreground-primary theme-transition">{vitalsAnalysis.earlyWarningScore.score}</p>
                                                <p className="text-xs text-foreground-secondary theme-transition">Early Warning Score</p>
                                            </div>
                                            <div className="text-center p-3 bg-background-secondary rounded-lg theme-transition">
                                                <p className="text-3xl font-bold text-foreground-primary theme-transition">{Math.round(vitalsAnalysis.deteriorationRisk.probability * 100)}%</p>
                                                <p className="text-xs text-foreground-secondary theme-transition">Deterioration Risk</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {vitalsAnalysis.earlyWarningScore.parameters.map((param, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm">
                                                    <span className="text-foreground-secondary theme-transition">{param.parameter}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground-primary theme-transition">{param.value}</span>
                                                        <span className={`px-1.5 py-0.5 rounded text-xs ${param.score >= 3 ? 'bg-danger-light text-danger-dark' :
                                                            param.score >= 1 ? 'bg-warning-light text-warning-dark' :
                                                                'bg-success-light text-success-dark'
                                                            }`}>
                                                            Score: {param.score}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {vitalsAnalysis.recommendedInterventions.length > 0 && (
                                            <div className="bg-info-light border border-info/30 rounded-lg p-3 theme-transition">
                                                <p className="text-xs font-semibold text-info-dark mb-1">Recommended Interventions</p>
                                                <ul className="text-xs text-info-dark space-y-1">
                                                    {vitalsAnalysis.recommendedInterventions.map((int, i) => (
                                                        <li key={i}>• {int}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-purple-700 dark:text-purple-400">Click "Analyze" in the Overview tab to get detailed vitals analysis</p>
                                )}
                            </div>

                            {/* Predictive Analytics Section */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-foreground-primary theme-transition flex items-center gap-2">
                                    <Gauge size={18} className="text-indigo-500" />
                                    Predictive Analytics
                                    <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full">AI-Powered</span>
                                </h3>


                                {/* Risk Stratification */}
                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-100 dark:border-cyan-800 rounded-xl p-4 theme-transition">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Activity className="text-cyan-600 dark:text-cyan-400" size={18} />
                                            <span className="font-semibold text-cyan-900 dark:text-cyan-300">Patient Risk Stratification</span>
                                        </div>
                                        <button
                                            onClick={handleStratifyRisk}
                                            disabled={riskStratLoading}
                                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1 theme-transition"
                                        >
                                            {riskStratLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                            Analyze Risk
                                        </button>
                                    </div>

                                    {riskStratResult ? (
                                        <div className="bg-background-primary rounded-lg p-3 space-y-3 theme-transition">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-foreground-secondary theme-transition">Overall Risk Level</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${riskStratResult.risk_level === 'High' ? 'bg-danger-light text-danger-dark' :
                                                    riskStratResult.risk_level === 'Moderate' ? 'bg-warning-light text-warning-dark' :
                                                        'bg-success-light text-success-dark'
                                                    }`}>{riskStratResult.risk_level || 'Low'}</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="p-2 bg-background-secondary rounded theme-transition">
                                                    <p className="text-foreground-secondary theme-transition">Risk Score</p>
                                                    <p className="font-bold text-foreground-primary theme-transition text-lg">{riskStratResult.risk_score || 0}</p>
                                                </div>
                                                <div className="p-2 bg-background-secondary rounded theme-transition">
                                                    <p className="text-foreground-secondary theme-transition">Primary Driver</p>
                                                    <p className="font-medium text-foreground-primary theme-transition truncate" title={riskStratResult.primary_driver}>{riskStratResult.primary_driver || 'None'}</p>
                                                </div>
                                            </div>

                                            {riskStratResult.care_pathway && (
                                                <div className="bg-info-light border border-info/30 rounded p-2 theme-transition">
                                                    <p className="text-xs font-semibold text-info-dark mb-1">Recommended Care Pathway</p>
                                                    <p className="text-xs text-info-dark">{riskStratResult.care_pathway}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-cyan-700 dark:text-cyan-400">Click "Analyze Risk" to calculate comprehensive patient risk profile</p>
                                    )}
                                </div>

                                {/* Readmission Risk */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <AlertOctagon className="text-orange-600 dark:text-orange-400" size={18} />
                                            <span className="font-semibold text-orange-900 dark:text-orange-300">Readmission Risk</span>
                                        </div>
                                        <button
                                            onClick={handleReadmissionRisk}
                                            disabled={readmissionLoading}
                                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {readmissionLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                            Predict
                                        </button>
                                    </div>

                                    {readmissionResult ? (
                                        <div className="bg-background-primary rounded-lg p-3 space-y-2 theme-transition">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-foreground-secondary theme-transition">Risk Score</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-2xl font-bold ${readmissionResult.riskScore > 70 ? 'text-danger-dark' :
                                                        readmissionResult.riskScore > 40 ? 'text-warning-dark' :
                                                            'text-success-dark'
                                                        }`}>{readmissionResult.riskScore}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${readmissionResult.riskLevel === 'high' || readmissionResult.riskLevel === 'very_high' ? 'bg-danger-light text-danger-dark' :
                                                        readmissionResult.riskLevel === 'moderate' ? 'bg-warning-light text-warning-dark' :
                                                            'bg-success-light text-success-dark'
                                                        }`}>{readmissionResult.riskLevel.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-foreground-secondary theme-transition">
                                                30-day readmission probability: {(readmissionResult.predictedReadmissionProbability * 100).toFixed(0)}%
                                            </div>
                                            {readmissionResult.topRiskFactors.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-semibold text-foreground-secondary theme-transition">Top Risk Factors:</p>
                                                    <ul className="text-xs text-foreground-secondary theme-transition mt-1">
                                                        {readmissionResult.topRiskFactors.slice(0, 3).map((factor, i) => (
                                                            <li key={i}>• {factor}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-orange-700 dark:text-orange-400">Click "Predict" to assess 30-day readmission risk</p>
                                    )}
                                </div>

                                {/* Length of Stay Prediction */}
                                <div className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border border-cyan-100 dark:border-cyan-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <CalendarClock className="text-cyan-600 dark:text-cyan-400" size={18} />
                                            <span className="font-semibold text-cyan-900 dark:text-cyan-300">Length of Stay</span>
                                        </div>
                                        <button
                                            onClick={handleLengthOfStay}
                                            disabled={losLoading}
                                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {losLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                            Predict
                                        </button>
                                    </div>

                                    {losResult ? (
                                        <div className="bg-background-primary rounded-lg p-3 space-y-2 theme-transition">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-foreground-secondary theme-transition">Predicted LOS</span>
                                                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{losResult.predictedLOS} days</span>
                                            </div>
                                            <div className="text-xs text-foreground-secondary theme-transition">
                                                Expected discharge: {losResult.predictedDischargeDate}
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-foreground-secondary theme-transition">Risk Level:</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${losResult.riskLevel === 'significantly_prolonged' ? 'bg-danger-light text-danger-dark' :
                                                    losResult.riskLevel === 'prolonged' ? 'bg-warning-light text-warning-dark' :
                                                        'bg-success-light text-success-dark'
                                                    }`}>{losResult.riskLevel.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-cyan-700 dark:text-cyan-400">Click "Predict" to estimate length of stay</p>
                                    )}
                                </div>

                                {/* Mortality Risk Assessment */}
                                <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <HeartPulse className="text-rose-600 dark:text-rose-400" size={18} />
                                            <span className="font-semibold text-rose-900 dark:text-rose-300">Mortality Risk</span>
                                        </div>
                                        <button
                                            onClick={handleMortalityRisk}
                                            disabled={mortalityLoading}
                                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center gap-1"
                                        >
                                            {mortalityLoading ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                                            Assess
                                        </button>
                                    </div>

                                    {mortalityResult ? (
                                        <div className="bg-background-primary rounded-lg p-3 space-y-2 theme-transition">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-foreground-secondary theme-transition">Risk Score</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-2xl font-bold ${mortalityResult.riskScore > 70 ? 'text-danger-dark' :
                                                        mortalityResult.riskScore > 40 ? 'text-warning-dark' :
                                                            'text-success-dark'
                                                        }`}>{mortalityResult.riskScore}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${mortalityResult.riskLevel === 'high' || mortalityResult.riskLevel === 'very_high' ? 'bg-danger-light text-danger-dark' :
                                                        mortalityResult.riskLevel === 'moderate' ? 'bg-warning-light text-warning-dark' :
                                                            'bg-success-light text-success-dark'
                                                        }`}>{mortalityResult.riskLevel.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div className="bg-background-secondary p-2 rounded theme-transition">
                                                    <span className="text-foreground-secondary theme-transition">In-Hospital:</span>
                                                    <span className="ml-1 font-medium text-foreground-primary theme-transition">{(mortalityResult.mortalityProbability.inHospital * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="bg-background-secondary p-2 rounded theme-transition">
                                                    <span className="text-foreground-secondary theme-transition">30-Day:</span>
                                                    <span className="ml-1 font-medium text-foreground-primary theme-transition">{(mortalityResult.mortalityProbability.thirtyDay * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                            {mortalityResult.icuRecommendation && (
                                                <div className={`text-xs p-2 rounded ${mortalityResult.icuRecommendation.recommended ? 'bg-danger-light text-danger-dark' :
                                                    'bg-success-light text-success-dark'
                                                    }`}>
                                                    ICU: {mortalityResult.icuRecommendation.reasoning}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-rose-700 dark:text-rose-400">Click "Assess" to evaluate mortality risk</p>
                                    )}
                                </div>

                                {/* ECG Analysis */}
                                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 theme-transition">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Heart className="text-red-600 dark:text-red-400" size={18} />
                                            <span className="font-semibold text-red-900 dark:text-red-300">ECG Analysis</span>
                                            <span className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Sparkles size={8} /> AI
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {/* ECG Upload */}
                                        <div className="border-2 border-dashed border-red-200 dark:border-red-800 rounded-lg p-3 text-center theme-transition">
                                            {ecgImage ? (
                                                <div className="space-y-2">
                                                    <img src={ecgImage} alt="ECG" className="max-h-32 mx-auto rounded" />
                                                    <button
                                                        onClick={() => { setEcgImage(null); setEcgResult(null); }}
                                                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer">
                                                    <Upload className="mx-auto text-red-400 dark:text-red-500 mb-2" size={24} />
                                                    <p className="text-xs text-red-600 dark:text-red-400">Upload ECG image</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleECGImageUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {ecgImage && !ecgResult && (
                                            <button
                                                onClick={handleAnalyzeECG}
                                                disabled={ecgLoading}
                                                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg disabled:opacity-50 flex items-center justify-center gap-1 theme-transition"
                                            >
                                                {ecgLoading ? <Loader2 className="animate-spin" size={12} /> : <Brain size={12} />}
                                                Analyze ECG
                                            </button>
                                        )}

                                        {ecgResult && (
                                            <div className="bg-background-primary rounded-lg p-3 space-y-2 theme-transition">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-foreground-secondary theme-transition">Rhythm</span>
                                                    <span className="font-medium text-foreground-primary theme-transition">{ecgResult.rhythmAnalysis.rhythmType}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-foreground-secondary theme-transition">Heart Rate</span>
                                                    <span className="font-medium text-foreground-primary theme-transition">{ecgResult.rhythmAnalysis.heartRate} bpm</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-foreground-secondary theme-transition">Severity</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityColor(ecgResult.overallAssessment.severity)}`}>
                                                        {ecgResult.overallAssessment.severity.toUpperCase()}
                                                    </span>
                                                </div>
                                                {ecgResult.findings.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-border">
                                                        <p className="text-xs font-semibold text-foreground-secondary theme-transition mb-1">Findings:</p>
                                                        <ul className="text-xs text-foreground-secondary theme-transition space-y-1">
                                                            {ecgResult.findings.slice(0, 3).map((finding, i) => (
                                                                <li key={i} className="flex items-center gap-1">
                                                                    <AlertCircle size={10} className={finding.severity === 'critical' ? 'text-danger-dark' : 'text-warning-dark'} />
                                                                    {finding.finding}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {ecgResult.overallAssessment.requiresImmediateAttention && (
                                                    <div className="bg-danger-light text-danger-dark text-xs p-2 rounded flex items-center gap-1">
                                                        <AlertTriangle size={12} />
                                                        Requires immediate clinical attention
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PatientDetailDrawer;
