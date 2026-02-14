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
    Bot
} from 'lucide-react';

const AIConsult: React.FC = () => {
    const [activeTab, setActiveTab] = useState('diagnosis');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
    const [medication1, setMedication1] = useState('');
    const [medication2, setMedication2] = useState('');
    const [interactionResult, setInteractionResult] = useState<any>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [imageAnalysis, setImageAnalysis] = useState<any>(null);
    const [dischargeNotes, setDischargeNotes] = useState('');
    const [dischargeSummary, setDischargeSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- MOCK AI LOGIC ---

    const handleDiagnosis = () => {
        setIsLoading(true);
        setTimeout(() => {
            const conditions = [
                { name: 'Viral Gastroenteritis', confidence: 85, severity: 'Moderate', reasoning: 'Symptoms match viral pattern.' },
                { name: 'Influenza Type A', confidence: 60, severity: 'Moderate', reasoning: 'Seasonal prevalence high.' },
                { name: 'Food Poisoning', confidence: 45, severity: 'Mild', reasoning: 'Possible dietary link.' }
            ];
            setDiagnosisResult(conditions);
            setIsLoading(false);
        }, 1500);
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

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="text-purple-600" size={32} />
                        Clinical AI Assistant
                    </h1>
                    <p className="text-slate-500 mt-1">Advanced diagnostic support, scribing, and analysis tools.</p>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl border border-purple-100 shadow-sm">
                    <Brain size={18} />
                    <span className="font-semibold">Gemini 3 Flash Active</span>
                </div>
            </div>

            {/* AI Modules Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { id: 'diagnosis', icon: Stethoscope, label: 'Diagnosis', color: 'blue' },
                    { id: 'interactions', icon: Pill, label: 'Interactions', color: 'teal' },
                    { id: 'scribe', icon: Mic, label: 'Scribe', color: 'indigo' },
                    { id: 'radiology', icon: Scan, label: 'Radiology', color: 'orange' },
                    { id: 'discharge', icon: FileText, label: 'Discharge', color: 'green' },
                ].map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2 text-center ${
                            activeTab === item.id 
                            ? `bg-${item.color}-600 text-white border-${item.color}-600 shadow-lg shadow-${item.color}-200` 
                            : `bg-white text-slate-600 border-slate-200 hover:border-${item.color}-300 hover:bg-${item.color}-50`
                        }`}
                    >
                        <item.icon size={20} />
                        <span className="font-bold text-xs md:text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Active Module Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px] relative">
                
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-2xl">
                        <div className="animate-spin text-purple-600 mb-2">
                            <Brain size={48} />
                        </div>
                        <p className="text-purple-700 font-bold animate-pulse">Processing Clinical Data...</p>
                    </div>
                )}

                {/* 1. Diagnosis Support */}
                {activeTab === 'diagnosis' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Symptom Checker</h2>
                                <p className="text-slate-500 text-sm">Differential diagnosis based on clinical presentation.</p>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                                placeholder="Enter symptoms (e.g. 45M, chest pain radiating to left arm, sweating...)"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                            <button 
                                onClick={handleDiagnosis}
                                disabled={!symptoms}
                                className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                <Zap size={16} /> Analyze
                            </button>
                        </div>

                        {diagnosisResult && (
                            <div className="animate-fade-in space-y-4 border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Bot size={18} className="text-blue-500" />
                                    AI Suggestions
                                </h3>
                                {diagnosisResult.map((condition: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">{condition.name}</h4>
                                                <p className="text-xs text-slate-500">{condition.reasoning}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs px-2 py-1 rounded font-bold ${condition.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {condition.severity}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${condition.confidence}%` }}></div>
                                        </div>
                                        <p className="text-right text-xs text-slate-400 mt-1">{condition.confidence}% Match</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Drug Interactions */}
                {activeTab === 'interactions' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Interaction Checker</h2>
                                <p className="text-slate-500 text-sm">Verify safety of combined medications.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Medication A</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="e.g. Warfarin"
                                    value={medication1}
                                    onChange={(e) => setMedication1(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Medication B</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    placeholder="e.g. Aspirin"
                                    value={medication2}
                                    onChange={(e) => setMedication2(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleInteractionCheck}
                            disabled={!medication1 || !medication2}
                            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Check Safety
                        </button>

                        {interactionResult && (
                            <div className={`mt-6 p-6 rounded-2xl border ${interactionResult.status === 'High Risk' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'} animate-fade-in`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {interactionResult.status === 'High Risk' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                                    <h3 className="text-lg font-bold">{interactionResult.status}</h3>
                                </div>
                                <p>{interactionResult.message}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. Medical Scribe */}
                {activeTab === 'scribe' && (
                    <div className="max-w-3xl mx-auto space-y-6 text-center">
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <div className={`p-6 rounded-full transition-all duration-500 ${isRecording ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50' : 'bg-indigo-100 text-indigo-600'}`}>
                                <Mic size={48} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{isRecording ? 'Listening...' : 'Ready to Record'}</h2>
                                <p className="text-slate-500">AI-powered voice-to-text for clinical notes.</p>
                            </div>
                        </div>

                        <button 
                            onClick={toggleRecording}
                            className={`px-8 py-3 rounded-full font-bold text-white transition-all transform hover:scale-105 ${isRecording ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Dictation'}
                        </button>

                        {transcription && (
                            <div className="mt-8 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-fade-in">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                        <FileText size={18} />
                                        Transcribed Note
                                    </h3>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(transcription);
                                            alert('Copied to clipboard!');
                                        }}
                                        className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Copy size={14} /> Copy
                                    </button>
                                </div>
                                <p className="text-slate-600 leading-relaxed font-mono text-sm">{transcription}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Radiology AI */}
                {activeTab === 'radiology' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 transition-colors relative">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center gap-4 text-slate-400">
                                <Upload size={48} />
                                <div>
                                    <p className="text-lg font-bold text-slate-700">Drop X-Ray or CT Scan here</p>
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

                {/* 5. Discharge Generator */}
                {activeTab === 'discharge' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Discharge Summary</h2>
                                <p className="text-slate-500 text-sm">Auto-generate reports from clinical notes.</p>
                            </div>
                        </div>

                        <textarea 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none min-h-[120px]"
                            placeholder="Enter course of hospital stay, procedures, and outcome..."
                            value={dischargeNotes}
                            onChange={(e) => setDischargeNotes(e.target.value)}
                        />
                        <button 
                            onClick={generateDischarge}
                            disabled={!dischargeNotes}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate Report
                        </button>

                        {dischargeSummary && (
                             <div className="mt-8 text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-fade-in relative">
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(dischargeSummary);
                                        alert('Copied!');
                                    }}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                >
                                    <Copy size={20} />
                                </button>
                                <pre className="text-slate-700 leading-relaxed font-serif whitespace-pre-wrap">{dischargeSummary}</pre>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AIConsult;
