import React, { useState } from 'react';
import { 
    Brain, 
    Stethoscope, 
    FileText, 
    Pill, 
    Scan, 
    Mic, 
    Activity,
    Upload,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    AlertTriangle,
    CheckCircle,
    Zap,
    Copy,
    Bot,
    Loader2,
    TrendingUp,
    AlertCircle,
    Heart,
    Image as ImageIcon,
    Info
} from 'lucide-react';
import { useDiagnosticEngine, useCDSS, useMedicalScribe, usePrescriptionGenerator } from '../hooks/useAI';
import { useTheme } from '../src/contexts/ThemeContext';
import { analyzeDermatologyImage } from '../services/aiService';
import { DermatologyImageAnalysisResult } from '../types';

const AIConsult: React.FC = () => {
    const { isDark } = useTheme();
    const [activeTab, setActiveTab] = useState('diagnosis');
    const [symptoms, setSymptoms] = useState('');
    const [medication1, setMedication1] = useState('');
    const [medication2, setMedication2] = useState('');
    const [interactionResult, setInteractionResult] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [imageAnalysis, setImageAnalysis] = useState<any>(null);
    const [dischargeNotes, setDischargeNotes] = useState('');
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Dermatology AI state
    const [dermatologyImage, setDermatologyImage] = useState<string | null>(null);
    const [dermatologyAnalysis, setDermatologyAnalysis] = useState<DermatologyImageAnalysisResult | null>(null);
    const [dermatologyLoading, setDermatologyLoading] = useState(false);
    const [bodyLocation, setBodyLocation] = useState('');
    
    // Patient context for AI
    const [patientContext, setPatientContext] = useState({
        age: '',
        gender: 'Male',
        medicalHistory: ''
    });

    // AI Hooks
    const { data: diagnosticResult, loading: diagnosticLoading, execute: getDiagnosis } = useDiagnosticEngine();
    const { data: cdssResult, loading: cdssLoading, execute: getCDSS } = useCDSS();
    const { data: scribeResult, loading: scribeLoading, execute: generateNotes } = useMedicalScribe();
    const { data: prescriptionResult, loading: prescriptionLoading, execute: generatePrescription } = usePrescriptionGenerator();

    // Enhanced Diagnosis with AI
    const handleDiagnosis = async () => {
        if (!symptoms) return;
        
        await getDiagnosis({
            symptoms: symptoms.split(',').map(s => s.trim()),
            patientAge: patientContext.age ? parseInt(patientContext.age) : undefined,
            patientGender: patientContext.gender,
            medicalHistory: patientContext.medicalHistory ? patientContext.medicalHistory.split(',').map(h => h.trim()) : undefined
        });
    };

    // CDSS Analysis
    const handleCDSS = async () => {
        if (!symptoms) return;
        
        await getCDSS({
            patientId: 'current-patient',
            diagnosis: symptoms,
            symptoms: symptoms.split(',').map(s => s.trim()),
            age: patientContext.age ? parseInt(patientContext.age) : undefined,
            gender: patientContext.gender
        });
    };

    // Prescription Generation
    const handlePrescription = async () => {
        if (!symptoms) return;
        
        await generatePrescription({
            diagnosis: symptoms,
            patientAge: patientContext.age ? parseInt(patientContext.age) : undefined,
            patientGender: patientContext.gender
        });
    };

    // Medical Scribe
    const handleGenerateNotes = async () => {
        if (!transcription) return;
        
        await generateNotes({
            transcription,
            encounterType: 'consultation',
            patientInfo: {
                age: patientContext.age ? parseInt(patientContext.age) : undefined,
                gender: patientContext.gender
            }
        });
    };

    const handleInteractionCheck = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (medication1.toLowerCase().includes('aspirin') && medication2.toLowerCase().includes('warfarin')) {
                setInteractionResult({ status: 'High Risk', message: 'Major interaction detected: Increased risk of bleeding due to combined anticoagulant effect.' });
            } else {
                setInteractionResult({ status: 'Safe', message: 'No significant interactions found between these medications.' });
            }
            setIsLoading(false);
        }, 1000);
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => {
                setTranscription("Patient presents with a 3-day history of productive cough and fever. Examination reveals crackles in the right lower lobe. Recommend chest X-ray and CBC. Patient denies allergies.");
                setIsRecording(false);
            }, 3000);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsLoading(true);
            setTimeout(() => {
                setImageAnalysis({
                    finding: 'Lobar Pneumonia',
                    confidence: 92,
                    location: 'Right Lower Lobe',
                    urgency: 'High',
                    recommendation: 'Start antibiotics and admit for observation.'
                });
                setIsLoading(false);
            }, 2000);
        }
    };

    const generateDischarge = () => {
        setIsLoading(true);
        setTimeout(() => {
            setDischargeSummary(`
**DISCHARGE SUMMARY**

**Patient Name:** John Doe
**Date:** ${new Date().toLocaleDateString()}
**Admitting Diagnosis:** Acute Appendicitis
**Procedure:** Laparoscopic Appendectomy

**Hospital Course:**
Patient admitted with RLQ pain. Surgery performed successfully without complications. Post-operative recovery uneventful. Tolerating soft diet.

**Discharge Instructions:**
1. Keep incision site clean and dry.
2. Avoid heavy lifting for 2 weeks.
3. Resume normal diet as tolerated.
4. Follow up with Dr. Chen in 1 week.

**Medications:**
- Ibuprofen 400mg PO q6h prn pain
- Cephalexin 500mg PO q6h x 5 days
            `);
            setIsLoading(false);
        }, 1500);
    };

    // Dermatology AI Analysis
    const handleDermatologyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setDermatologyImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const runDermatologyAnalysis = async () => {
        if (!dermatologyImage) return;
        
        setDermatologyLoading(true);
        try {
            const response = await analyzeDermatologyImage({
                imageData: dermatologyImage,
                imageType: 'clinical',
                bodyLocation: bodyLocation || undefined,
                patientInfo: {
                    age: patientContext.age ? parseInt(patientContext.age) : undefined,
                    gender: patientContext.gender,
                    symptoms: []
                }
            });
            setDermatologyAnalysis(response.data || null);
        } catch (error) {
            console.error('Dermatology analysis error:', error);
        } finally {
            setDermatologyLoading(false);
        }
    };

    const isLoadingAny = isLoading || diagnosticLoading || cdssLoading || scribeLoading || prescriptionLoading || dermatologyLoading;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-purple-600 dark:text-purple-400" size={32} />
                        Clinical AI Assistant
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Advanced diagnostic support, scribing, and analysis tools.</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-xl border border-purple-100 dark:border-purple-800 shadow-sm">
                    <Brain size={18} />
                    <span className="font-semibold">Gemini AI Active</span>
                </div>
            </div>

            {/* Patient Context */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Patient Context (Optional)</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Age</label>
                        <input 
                            type="number"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-700 dark:text-white"
                            value={patientContext.age}
                            onChange={e => setPatientContext({...patientContext, age: e.target.value})}
                            placeholder="Years"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Gender</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-700 dark:text-white"
                            value={patientContext.gender}
                            onChange={e => setPatientContext({...patientContext, gender: e.target.value})}
                        >
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Medical History</label>
                        <input 
                            type="text"
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-slate-700 dark:text-white"
                            value={patientContext.medicalHistory}
                            onChange={e => setPatientContext({...patientContext, medicalHistory: e.target.value})}
                            placeholder="Comma-separated"
                        />
                    </div>
                </div>
            </div>

            {/* AI Modules Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                    { id: 'diagnosis', icon: Stethoscope, label: 'Diagnosis', color: 'blue' },
                    { id: 'interactions', icon: Pill, label: 'Interactions', color: 'teal' },
                    { id: 'scribe', icon: Mic, label: 'Scribe', color: 'indigo' },
                    { id: 'radiology', icon: Scan, label: 'Radiology', color: 'orange' },
                    { id: 'dermatology', icon: ImageIcon, label: 'Dermatology', color: 'pink' },
                    { id: 'discharge', icon: FileText, label: 'Discharge', color: 'green' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 text-center ${
                            activeTab === item.id 
                            ? `bg-${item.color}-600 text-white border-${item.color}-600 shadow-lg` 
                            : `bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-${item.color}-300 dark:hover:border-${item.color}-700`
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-bold text-xs md:text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Active Module Content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 min-h-[400px] relative">
                
                {isLoadingAny && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
                        <Loader2 className="animate-spin text-purple-600 dark:text-purple-400 mb-2" size={48} />
                        <p className="text-purple-700 dark:text-purple-300 font-bold animate-pulse">Processing Clinical Data...</p>
                    </div>
                )}

                {/* 1. Diagnosis Support - Enhanced with AI */}
                {activeTab === 'diagnosis' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Diagnostic Engine</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Differential diagnosis with ICD-10 codes and recommendations.</p>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <Sparkles size={10} /> AI-Enhanced
                            </span>
                        </div>

                        <div className="relative">
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] dark:text-white dark:placeholder:text-slate-400"
                                placeholder="Enter symptoms (e.g. chest pain, fever, cough, headache...)"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={handleDiagnosis}
                                disabled={!symptoms || diagnosticLoading}
                                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Brain size={18} /> Get Differential Diagnosis
                            </button>
                            <button 
                                onClick={handleCDSS}
                                disabled={!symptoms || cdssLoading}
                                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Heart size={18} /> Clinical Decision Support
                            </button>
                            <button 
                                onClick={handlePrescription}
                                disabled={!symptoms || prescriptionLoading}
                                className="flex-1 bg-teal-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Pill size={18} /> Suggest Prescription
                            </button>
                        </div>

                        {/* Diagnostic Results */}
                        {diagnosticResult && (
                            <div className="animate-fade-in space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Bot size={18} className="text-blue-500" />
                                    Differential Diagnoses
                                </h3>
                                
                                {/* Primary Diagnosis */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-blue-900 dark:text-blue-100 text-lg">{diagnosticResult.primaryDiagnosis.diagnosis}</h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">{diagnosticResult.primaryDiagnosis.icdCode}</span>
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                                                diagnosticResult.primaryDiagnosis.likelihood === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                diagnosticResult.primaryDiagnosis.likelihood === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {diagnosticResult.primaryDiagnosis.likelihood} Confidence
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2 mb-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${diagnosticResult.primaryDiagnosis.confidence * 100}%` }}></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Supporting Evidence</p>
                                            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                {diagnosticResult.primaryDiagnosis.supportingEvidence.slice(0, 3).map((e, i) => (
                                                    <li key={i}>• {e}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Recommended Tests</p>
                                            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                {diagnosticResult.primaryDiagnosis.recommendedTests.slice(0, 3).map((t, i) => (
                                                    <li key={i}>• {t}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Differentials */}
                                {diagnosticResult.differentialDiagnoses.slice(1, 4).map((diff, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{diff.diagnosis}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{diff.icdCode}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                                                diff.likelihood === 'High' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                diff.likelihood === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                                'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {diff.likelihood}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5 mt-2">
                                            <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: `${diff.confidence * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}

                                {/* Clinical Guidelines */}
                                {diagnosticResult.clinicalGuidelines.length > 0 && (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Clinical Guidelines</p>
                                        <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                                            {diagnosticResult.clinicalGuidelines.map((g, i) => (
                                                <li key={i}>• {g}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CDSS Results */}
                        {cdssResult && (
                            <div className="animate-fade-in space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Heart size={18} className="text-green-500" />
                                    Clinical Decision Support
                                </h3>
                                
                                {cdssResult.alerts.length > 0 && (
                                    <div className="space-y-2">
                                        {cdssResult.alerts.map((alert, i) => (
                                            <div key={i} className={`p-3 rounded-lg flex items-start gap-3 ${
                                                alert.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' :
                                                alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' :
                                                'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800'
                                            }`}>
                                                {alert.type === 'critical' ? (
                                                    <AlertCircle className="text-red-500 dark:text-red-400 flex-shrink-0" size={18} />
                                                ) : alert.type === 'warning' ? (
                                                    <AlertTriangle className="text-amber-500 dark:text-amber-400 flex-shrink-0" size={18} />
                                                ) : (
                                                    <CheckCircle className="text-blue-500 dark:text-blue-400 flex-shrink-0" size={18} />
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-white">{alert.title}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">{alert.description}</p>
                                                    {alert.suggestedAction && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Action: {alert.suggestedAction}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {cdssResult.recommendations.length > 0 && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Recommendations</p>
                                        <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                                            {cdssResult.recommendations.map((r, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Prescription Results */}
                        {prescriptionResult && (
                            <div className="animate-fade-in space-y-4 border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Pill size={18} className="text-teal-500" />
                                    Suggested Prescription
                                </h3>
                                
                                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-teal-900 text-lg">{prescriptionResult.primaryPrescription.medication}</h4>
                                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded font-bold">
                                            {prescriptionResult.primaryPrescription.formularyStatus}
                                        </span>
                                    </div>
                                    <p className="text-teal-700">
                                        {prescriptionResult.primaryPrescription.dose} - {prescriptionResult.primaryPrescription.frequency} via {prescriptionResult.primaryPrescription.route}
                                    </p>
                                    <p className="text-sm text-teal-600 mt-1">Duration: {prescriptionResult.primaryPrescription.duration}</p>
                                    <p className="text-sm text-teal-600 mt-2 bg-white p-2 rounded border border-teal-100">
                                        {prescriptionResult.primaryPrescription.instructions}
                                    </p>
                                    
                                    {prescriptionResult.primaryPrescription.warnings.length > 0 && (
                                        <div className="mt-3 text-xs text-amber-600">
                                            <p className="font-semibold">Warnings:</p>
                                            <ul className="mt-1">
                                                {prescriptionResult.primaryPrescription.warnings.map((w, i) => (
                                                    <li key={i}>• {w}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {prescriptionResult.counselingPoints.length > 0 && (
                                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-purple-700 mb-2">Patient Counseling Points</p>
                                        <ul className="text-xs text-purple-600 space-y-1">
                                            {prescriptionResult.counselingPoints.map((c, i) => (
                                                <li key={i}>• {c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Drug Interactions */}
                {activeTab === 'interactions' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interaction Checker</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Verify safety of combined medications.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medication A</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white dark:placeholder:text-slate-400"
                                    placeholder="e.g. Warfarin"
                                    value={medication1}
                                    onChange={(e) => setMedication1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medication B</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dark:text-white dark:placeholder:text-slate-400"
                                    placeholder="e.g. Aspirin"
                                    value={medication2}
                                    onChange={(e) => setMedication2(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleInteractionCheck}
                            disabled={!medication1 || !medication2}
                            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Safety
                        </button>

                        {interactionResult && (
                            <div className={`mt-6 p-6 rounded-2xl border ${
                                interactionResult.status === 'High Risk' 
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300' 
                                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                            } animate-fade-in`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {interactionResult.status === 'High Risk' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                                    <h3 className="text-lg font-bold">{interactionResult.status}</h3>
                                </div>
                                <p>{interactionResult.message}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Medical Scribe - Enhanced with AI */}
                {activeTab === 'scribe' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                <Mic size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Medical Scribe</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Voice-to-text with automatic SOAP note generation.</p>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <Sparkles size={10} /> AI-Enhanced
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <button 
                                onClick={toggleRecording}
                                className={`p-6 rounded-full transition-all duration-500 ${
                                    isRecording 
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse ring-4 ring-red-50 dark:ring-red-900/20' 
                                    : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50'
                                }`}
                            >
                                <Mic size={48} />
                            </button>
                            <p className="text-slate-500 dark:text-slate-400">{isRecording ? 'Listening...' : 'Click to start recording'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transcription / Clinical Notes</label>
                            <textarea 
                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px] dark:text-white dark:placeholder:text-slate-400"
                                placeholder="Transcription will appear here, or type/paste clinical notes..."
                                value={transcription}
                                onChange={(e) => setTranscription(e.target.value)}
                            />
                        </div>

                        <button 
                            onClick={handleGenerateNotes}
                            disabled={!transcription || scribeLoading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {scribeLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Brain size={18} />
                                    Generate SOAP Note
                                </>
                            )}
                        </button>

                        {scribeResult && (
                            <div className="bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-xl p-6 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 dark:text-white">Generated SOAP Note</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Quality: {scribeResult.qualityScore}%</span>
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(JSON.stringify(scribeResult.soapNote))}
                                            className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline flex items-center gap-1"
                                        >
                                            <Copy size={14} /> Copy
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Subjective:</span>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{scribeResult.soapNote.subjective}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Objective:</span>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{scribeResult.soapNote.objective}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Assessment:</span>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{scribeResult.soapNote.assessment}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Plan:</span>
                                        <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{scribeResult.soapNote.plan}</p>
                                    </div>
                                </div>

                                {scribeResult.icdCodes.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Suggested ICD-10 Codes</p>
                                        <div className="flex flex-wrap gap-2">
                                            {scribeResult.icdCodes.map((code, i) => (
                                                <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-mono rounded">
                                                    {code.code}: {code.description}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {scribeResult.followUpRecommendations.length > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Follow-up Recommendations</p>
                                        <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                                            {scribeResult.followUpRecommendations.map((r, i) => (
                                                <li key={i}>• {r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Radiology AI */}
                {activeTab === 'radiology' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500">
                                <Upload size={48} />
                                <div>
                                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Drop X-Ray or CT Scan here</p>
                                    <p className="text-sm">Supports DICOM, JPG, PNG</p>
                                </div>
                            </div>
                        </div>

                        {imageAnalysis && (
                            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl animate-fade-in flex flex-col md:flex-row gap-6 items-center">
                                <div className="w-32 h-32 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                                    <Scan size={40} className="text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                                            {imageAnalysis.urgency}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-slate-300">
                                        <p>Finding: <span className="text-white font-bold">{imageAnalysis.finding}</span></p>
                                        <p>Location: <span className="text-white">{imageAnalysis.location}</span></p>
                                        <p className="text-sm bg-slate-800 p-2 rounded mt-2 border border-slate-700">
                                            Recommendation: {imageAnalysis.recommendation}
                                        </p>
                                        <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-blue-500 h-2 rounded-full" 
                                                style={{ width: `${imageAnalysis.confidence}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-right mt-1">{imageAnalysis.confidence}% Confidence</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 5. Dermatology AI Analysis */}
                {activeTab === 'dermatology' && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Dermatology Analysis</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Skin lesion classification and melanoma risk assessment.</p>
                            </div>
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                                <Sparkles size={10} /> AI-Enhanced
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative min-h-[200px] flex items-center justify-center">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleDermatologyImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {dermatologyImage ? (
                                        <img src={dermatologyImage} alt="Uploaded skin lesion" className="max-h-48 rounded-lg shadow-md" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500">
                                            <Upload size={48} />
                                            <div>
                                                <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Upload Skin Image</p>
                                                <p className="text-sm">Supports JPG, PNG</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Body Location (Optional)</label>
                                    <input 
                                        type="text"
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none dark:bg-slate-700 dark:text-white"
                                        placeholder="e.g., Left forearm, Back, Face..."
                                        value={bodyLocation}
                                        onChange={(e) => setBodyLocation(e.target.value)}
                                    />
                                </div>

                                <button 
                                    onClick={runDermatologyAnalysis}
                                    disabled={!dermatologyImage || dermatologyLoading}
                                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {dermatologyLoading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Brain size={18} />
                                            Analyze Skin Lesion
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Analysis Results */}
                            <div className="space-y-4">
                                {dermatologyLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">Running AI Analysis...</p>
                                        <p className="text-slate-400 dark:text-slate-500 text-sm">Analyzing skin lesion characteristics</p>
                                    </div>
                                ) : dermatologyAnalysis ? (
                                    <div className="space-y-4 animate-fade-in">
                                        {/* Primary Diagnosis */}
                                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 p-4 rounded-xl border border-pink-200 dark:border-pink-800">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-bold text-pink-800 dark:text-pink-200">Primary Diagnosis</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    dermatologyAnalysis.primaryDiagnosis.isMalignant 
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                                                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                }`}>
                                                    {dermatologyAnalysis.primaryDiagnosis.isMalignant ? 'Requires Attention' : 'Likely Benign'}
                                                </span>
                                            </div>
                                            <p className="text-lg font-semibold text-slate-800 dark:text-white">{dermatologyAnalysis.primaryDiagnosis.diagnosis}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{dermatologyAnalysis.primaryDiagnosis.description}</p>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Confidence:</span>
                                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                    <div 
                                                        className="bg-pink-500 h-2 rounded-full" 
                                                        style={{ width: `${dermatologyAnalysis.primaryDiagnosis.confidence * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    {Math.round(dermatologyAnalysis.primaryDiagnosis.confidence * 100)}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Melanoma Risk Assessment */}
                                        {dermatologyAnalysis.melanomaRiskAssessment && (
                                            <div className={`p-4 rounded-xl border ${
                                                dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'low' 
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                                    : dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'moderate'
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                            }`}>
                                                <h5 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                                                    <AlertTriangle size={16} className={
                                                        dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'low' ? 'text-green-500' :
                                                        dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'moderate' ? 'text-yellow-500' :
                                                        'text-red-500'
                                                    } />
                                                    Melanoma Risk Assessment
                                                </h5>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Risk Level:</span>
                                                    <span className={`font-bold capitalize ${
                                                        dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'low' ? 'text-green-600 dark:text-green-400' :
                                                        dermatologyAnalysis.melanomaRiskAssessment.riskLevel === 'moderate' ? 'text-yellow-600 dark:text-yellow-400' :
                                                        'text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {dermatologyAnalysis.melanomaRiskAssessment.riskLevel}
                                                    </span>
                                                </div>
                                                
                                                {/* ABCDE Score */}
                                                <div className="mt-3 grid grid-cols-5 gap-1">
                                                    {[
                                                        { label: 'A', name: 'Asymmetry', value: dermatologyAnalysis.melanomaRiskAssessment.abcdeScore.asymmetry },
                                                        { label: 'B', name: 'Border', value: dermatologyAnalysis.melanomaRiskAssessment.abcdeScore.borderIrregularity },
                                                        { label: 'C', name: 'Color', value: dermatologyAnalysis.melanomaRiskAssessment.abcdeScore.colorVariation },
                                                        { label: 'D', name: 'Diameter', value: dermatologyAnalysis.melanomaRiskAssessment.abcdeScore.diameter },
                                                        { label: 'E', name: 'Evolution', value: dermatologyAnalysis.melanomaRiskAssessment.abcdeScore.evolution }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className={`p-2 rounded text-center ${item.value ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                                                            <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</div>
                                                            <div className={`text-xs ${item.value ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                                {item.value ? '✓' : '✗'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Lesion Analysis */}
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <h5 className="font-medium text-slate-800 dark:text-white mb-3">Lesion Characteristics</h5>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Shape:</span>
                                                    <span className="ml-2 font-medium capitalize">{dermatologyAnalysis.lesionAnalysis.morphology.shape}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Border:</span>
                                                    <span className="ml-2 font-medium capitalize">{dermatologyAnalysis.lesionAnalysis.morphology.border.replace('_', ' ')}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Surface:</span>
                                                    <span className="ml-2 font-medium capitalize">{dermatologyAnalysis.lesionAnalysis.morphology.surface}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 dark:text-slate-400">Elevation:</span>
                                                    <span className="ml-2 font-medium capitalize">{dermatologyAnalysis.lesionAnalysis.morphology.elevation}</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-500 dark:text-slate-400">Colors:</span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {dermatologyAnalysis.lesionAnalysis.morphology.color.map((color, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs capitalize">{color}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Treatment Suggestions */}
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <h5 className="font-medium text-slate-800 dark:text-white mb-3">Treatment Suggestions</h5>
                                            <div className="space-y-2">
                                                {dermatologyAnalysis.treatmentSuggestions.map((treatment, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                                        <CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <span className="font-medium">{treatment.treatment}</span>
                                                            <span className="text-slate-500 dark:text-slate-400 ml-1">({treatment.type})</span>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{treatment.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recommendations */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Recommendations</h5>
                                            <div className="space-y-2">
                                                {dermatologyAnalysis.recommendations.map((rec, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                                                        <Info size={14} className="mt-0.5 flex-shrink-0" />
                                                        <span>{rec.recommendation}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Disclaimer */}
                                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
                                                <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                                                <span>
                                                    <strong>Disclaimer:</strong> This AI analysis is for educational purposes only. 
                                                    Any suspicious lesion should be evaluated by a qualified dermatologist.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                                        <ImageIcon size={48} className="mb-4 opacity-50" />
                                        <p className="text-lg font-medium">Upload an image to begin analysis</p>
                                        <p className="text-sm">AI will analyze skin lesions and provide risk assessment</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. Discharge Generator */}
                {activeTab === 'discharge' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Discharge Summary</h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Auto-generate reports from clinical notes.</p>
                            </div>
                        </div>

                        <textarea 
                            className="w-full p-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 outline-none min-h-[120px] dark:text-white dark:placeholder:text-slate-400"
                            placeholder="Enter course of hospital stay, procedures, and outcome..."
                            value={dischargeNotes}
                            onChange={(e) => setDischargeNotes(e.target.value)}
                        />
                        <button 
                            onClick={generateDischarge}
                            disabled={!dischargeNotes}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate Report
                        </button>

                        {dischargeSummary && (
                             <div className="mt-8 text-left bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in relative">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(dischargeSummary);
                                        alert('Copied!');
                                    }}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                                >
                                    <Copy size={20} />
                                </button>
                                <pre className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">{dischargeSummary}</pre>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AIConsult;
