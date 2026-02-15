import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { MaternityPatient } from '../types';
import { Baby, Heart, Plus, X, Loader2, Brain, Activity, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, Image } from 'lucide-react';
import { analyzeUltrasound } from '../services/aiService';
import { UltrasoundAnalysisResult } from '../types';

const Maternity: React.FC = () => {
    const { maternityPatients, addMaternityPatient } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<MaternityPatient | null>(null);
    const [showUltrasoundAI, setShowUltrasoundAI] = useState(false);
    const [ultrasoundAnalysis, setUltrasoundAnalysis] = useState<UltrasoundAnalysisResult | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
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

    const runUltrasoundAnalysis = async (patient: MaternityPatient) => {
        setSelectedPatient(patient);
        setShowUltrasoundAI(true);
        setAiLoading(true);
        setUltrasoundAnalysis(null);

        try {
            const response = await analyzeUltrasound({
                imageData: 'base64_encoded_image_data',
                scanType: 'obstetric',
                patientInfo: {
                    age: 28,
                    gender: 'Female',
                    gestationalAge: patient.weeksPregnant,
                    clinicalIndication: 'Routine obstetric ultrasound'
                }
            });
            setUltrasoundAnalysis(response.data || null);
        } catch (error) {
            console.error('Ultrasound AI analysis error:', error);
        } finally {
            setAiLoading(false);
        }
    };

    const renderConfidenceBadge = (confidence: number) => {
        const percentage = Math.round(confidence * 100);
        const color = percentage >= 90 ? 'bg-green-100 text-green-700' :
                      percentage >= 70 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700';
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {percentage}% confidence
            </span>
        );
    };

    const renderUltrasoundAnalysis = () => {
        if (aiLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
                    <p className="text-slate-600 font-medium">Running AI Ultrasound Analysis...</p>
                    <p className="text-slate-400 text-sm">Analyzing fetal development and biometry</p>
                </div>
            );
        }

        if (!ultrasoundAnalysis) {
            return (
                <div className="text-center py-12">
                    <AlertTriangle className="text-amber-500 mx-auto mb-4" size={48} />
                    <p className="text-slate-600">Unable to perform ultrasound analysis</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {/* Overall Impression */}
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">Overall Impression</h4>
                    <p className="text-slate-700">{ultrasoundAnalysis.overallImpression}</p>
                    <div className="mt-2 flex items-center gap-2">
                        {renderConfidenceBadge(ultrasoundAnalysis.confidence)}
                    </div>
                </div>

                {/* Obstetric Analysis */}
                {ultrasoundAnalysis.obstetricAnalysis && (
                    <>
                        {/* Gestational Age */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Baby className="text-pink-500" size={18} />
                                Gestational Age Assessment
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-pink-50 rounded-lg">
                                    <p className="text-3xl font-bold text-pink-600">
                                        {ultrasoundAnalysis.obstetricAnalysis.gestationalAge.estimated}
                                    </p>
                                    <p className="text-sm text-slate-600">weeks</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Range: {ultrasoundAnalysis.obstetricAnalysis.gestationalAge.range.lower}-{ultrasoundAnalysis.obstetricAnalysis.gestationalAge.range.upper} weeks
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Method:</span>
                                        <span className="font-medium uppercase">{ultrasoundAnalysis.obstetricAnalysis.gestationalAge.method}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Fetal Presentation:</span>
                                        <span className="font-medium capitalize">{ultrasoundAnalysis.obstetricAnalysis.fetalPresentation}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Multiple Gestation:</span>
                                        <span className={`font-medium ${ultrasoundAnalysis.obstetricAnalysis.multipleGestation ? 'text-amber-600' : 'text-green-600'}`}>
                                            {ultrasoundAnalysis.obstetricAnalysis.multipleGestation ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fetal Biometry */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h5 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                                <Activity className="text-blue-500" size={18} />
                                Fetal Biometry
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                                {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.biparietalDiameter && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">BPD</span>
                                            <span className="text-xs text-slate-400">{ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.biparietalDiameter.percentile}th %ile</span>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.biparietalDiameter.value} {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.biparietalDiameter.unit}
                                        </p>
                                    </div>
                                )}
                                {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.headCircumference && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">HC</span>
                                            <span className="text-xs text-slate-400">{ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.headCircumference.percentile}th %ile</span>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.headCircumference.value} {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.headCircumference.unit}
                                        </p>
                                    </div>
                                )}
                                {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.abdominalCircumference && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">AC</span>
                                            <span className="text-xs text-slate-400">{ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.abdominalCircumference.percentile}th %ile</span>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.abdominalCircumference.value} {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.abdominalCircumference.unit}
                                        </p>
                                    </div>
                                )}
                                {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.femurLength && (
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">FL</span>
                                            <span className="text-xs text-slate-400">{ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.femurLength.percentile}th %ile</span>
                                        </div>
                                        <p className="font-bold text-slate-800">
                                            {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.femurLength.value} {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.femurLength.unit}
                                        </p>
                                    </div>
                                )}
                                {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.estimatedFetalWeight && (
                                    <div className="p-3 bg-blue-50 rounded-lg col-span-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-blue-600">Estimated Fetal Weight</span>
                                            <span className="text-xs text-slate-400">{ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.estimatedFetalWeight.percentile}th %ile</span>
                                        </div>
                                        <p className="font-bold text-blue-800 text-lg">
                                            {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.estimatedFetalWeight.value} {ultrasoundAnalysis.obstetricAnalysis.fetalBiometry.estimatedFetalWeight.unit}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {ultrasoundAnalysis.obstetricAnalysis.fetalHeartRate && (
                                <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="text-red-500" size={20} />
                                        <span className="text-sm text-slate-600">Fetal Heart Rate</span>
                                    </div>
                                    <span className="font-bold text-red-600">{ultrasoundAnalysis.obstetricAnalysis.fetalHeartRate} bpm</span>
                                </div>
                            )}
                        </div>

                        {/* Amniotic Fluid & Placenta */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h5 className="font-medium text-slate-800 mb-3">Amniotic Fluid</h5>
                                <div className="space-y-2">
                                    {ultrasoundAnalysis.obstetricAnalysis.amnioticFluid.index && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">AFI:</span>
                                            <span className="font-medium">{ultrasoundAnalysis.obstetricAnalysis.amnioticFluid.index} cm</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Status:</span>
                                        <span className={`font-medium capitalize ${
                                            ultrasoundAnalysis.obstetricAnalysis.amnioticFluid.status === 'normal' ? 'text-green-600' :
                                            ultrasoundAnalysis.obstetricAnalysis.amnioticFluid.status === 'oligohydramnios' ? 'text-amber-600' :
                                            'text-blue-600'
                                        }`}>
                                            {ultrasoundAnalysis.obstetricAnalysis.amnioticFluid.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                <h5 className="font-medium text-slate-800 mb-3">Placenta</h5>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Location:</span>
                                        <span className="font-medium">{ultrasoundAnalysis.obstetricAnalysis.placenta.location}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Grade:</span>
                                        <span className="font-medium">{ultrasoundAnalysis.obstetricAnalysis.placenta.grade}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Position:</span>
                                        <span className={`font-medium capitalize ${
                                            ultrasoundAnalysis.obstetricAnalysis.placenta.position === 'normal' ? 'text-green-600' :
                                            'text-amber-600'
                                        }`}>
                                            {ultrasoundAnalysis.obstetricAnalysis.placenta.position.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fetal Anatomy Survey */}
                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                            <h5 className="font-medium text-slate-800 mb-3">Fetal Anatomy Survey</h5>
                            <div className="grid grid-cols-2 gap-2">
                                {ultrasoundAnalysis.obstetricAnalysis.fetalAnatomy.map((structure, idx) => (
                                    <div key={idx} className={`p-2 rounded-lg text-sm ${
                                        structure.status === 'visualized' ? 'bg-green-50 border border-green-200' :
                                        structure.status === 'abnormal' ? 'bg-red-50 border border-red-200' :
                                        'bg-slate-50 border border-slate-200'
                                    }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-slate-700">{structure.structure}</span>
                                            {structure.status === 'visualized' && <CheckCircle size={14} className="text-green-500" />}
                                            {structure.status === 'abnormal' && <AlertTriangle size={14} className="text-red-500" />}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{structure.findings}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Recommendations */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h5 className="font-medium text-slate-800 mb-3">Recommendations</h5>
                    <div className="space-y-2">
                        {ultrasoundAnalysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                                <Info className="text-pink-500 mt-0.5 flex-shrink-0" size={16} />
                                <div>
                                    <span className="font-medium">{rec.recommendation}</span>
                                    <p className="text-slate-500 text-xs">Timeframe: {rec.timeframe}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 flex items-start gap-2">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <span>
                            <strong>Disclaimer:</strong> This AI analysis is for educational purposes only. 
                            All findings should be verified by a qualified sonographer/radiologist.
                        </span>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Maternity Ward</h1>
                  <p className="text-slate-500">Monitoring ante-natal and labor patients with AI-powered ultrasound analysis.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md shadow-pink-200 flex items-center gap-2"
                >
                    <Plus size={16} /> Admit Patient
                </button>
            </div>

            {/* AI Feature Banner */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold">AI-Powered Ultrasound Analysis</h3>
                        <p className="text-sm text-pink-100">Fetal development assessment, biometry, and anomaly detection</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    AI Ready
                </div>
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
                        
                        <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center mb-3">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Gestation</p>
                                <p className="font-bold text-slate-800">{mom.weeksPregnant} Weeks</p>
                            </div>
                            <Heart size={20} className="text-red-400" fill="currentColor" />
                        </div>

                        {/* AI Analysis Button */}
                        <button
                            onClick={() => runUltrasoundAnalysis(mom)}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all"
                        >
                            <Brain size={16} />
                            AI Ultrasound Analysis
                        </button>
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

            {/* Ultrasound AI Analysis Modal */}
            {showUltrasoundAI && selectedPatient && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden m-4 animate-scale-up">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Brain size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold">AI Ultrasound Analysis</h2>
                                    <p className="text-sm text-pink-100">{selectedPatient.name} • {selectedPatient.weeksPregnant} weeks</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setShowUltrasoundAI(false);
                                    setUltrasoundAnalysis(null);
                                }} 
                                className="text-white/80 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
                            {renderUltrasoundAnalysis()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maternity;
