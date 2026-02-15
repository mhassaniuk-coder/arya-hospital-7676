import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { MedicalCertificate } from '../types';
import { FileBadge, Download, Printer, X, Sparkles, FileSearch, Code, Loader2, CheckCircle } from 'lucide-react';
import { useDocumentProcessing, useMedicalCodingAssistant } from '../hooks/useAI';
import { DocumentProcessingInput, MedicalCodingInput } from '../types';

const MedicalCertificates: React.FC = () => {
    const { medicalCertificates, addMedicalCertificate } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        type: 'Sick Leave',
        doctor: 'Dr. Chen',
    });
    
    // AI Hooks
    const documentProcessing = useDocumentProcessing();
    const medicalCoding = useMedicalCodingAssistant();
    
    // State
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [documentContent, setDocumentContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCert: MedicalCertificate = {
            id: `MC-${Math.floor(Math.random() * 10000)}`,
            patientName: formData.patientName,
            type: formData.type as 'Sick Leave' | 'Fitness' | 'Death',
            issueDate: new Date().toISOString().split('T')[0],
            doctor: formData.doctor,
            status: 'Issued'
        };
        addMedicalCertificate(newCert);
        setIsModalOpen(false);
        setFormData({ patientName: '', type: 'Sick Leave', doctor: 'Dr. Chen' });
    };

    // Handle Document Processing
    const handleProcessDocument = async () => {
        if (!documentContent.trim()) return;
        
        const input: DocumentProcessingInput = {
            documentType: 'Medical Record',
            documentContent,
        };
        
        await documentProcessing.execute(input);
        setShowAIPanel(true);
    };

    // Handle Medical Coding for Certificate
    const handleSuggestCodes = async () => {
        const input: MedicalCodingInput = {
            clinicalNotes: `Patient ${formData.patientName} requires ${formData.type} certificate. Examined by ${formData.doctor}.`,
            encounterType: 'outpatient',
        };
        
        await medicalCoding.execute(input);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Medical Certificates</h1>
                    <p className="text-slate-500">Generate sick leave and fitness documents.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowAIPanel(!showAIPanel)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        AI Document Processing
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md"
                    >
                        Generate New
                    </button>
                </div>
            </div>

            {/* AI Document Processing Panel */}
            {showAIPanel && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileSearch className="text-purple-600" size={20} />
                            <h3 className="text-lg font-semibold text-purple-900">AI Document Processing</h3>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Document Content</label>
                            <textarea
                                value={documentContent}
                                onChange={(e) => setDocumentContent(e.target.value)}
                                className="w-full h-40 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Paste document content for AI analysis..."
                            />
                            <button
                                onClick={handleProcessDocument}
                                disabled={documentProcessing.loading || !documentContent.trim()}
                                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {documentProcessing.loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FileSearch size={16} />
                                        Process Document
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {documentProcessing.data && (
                            <div className="bg-white rounded-xl p-4 border border-purple-100">
                                <h4 className="font-semibold text-slate-800 mb-3">Extracted Information</h4>
                                
                                {/* Document Classification */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase mb-1">Document Type</p>
                                    <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-sm font-medium">
                                        {documentProcessing.data.documentType}
                                    </span>
                                </div>
                                
                                {/* Extracted Data */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">Extracted Fields</p>
                                    {documentProcessing.data.extractedData.map((field, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100">
                                            <span className="text-sm text-slate-600">{field.field}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-800">{field.value}</span>
                                                {field.confidence > 0.9 && (
                                                    <CheckCircle size={14} className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Entities */}
                                {documentProcessing.data.indexingMetadata.entities.length > 0 && (
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Identified Entities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {documentProcessing.data.indexingMetadata.entities.map((entity, idx) => (
                                                <span key={idx} className={`text-xs px-2 py-1 rounded ${
                                                    entity.type === 'Patient' ? 'bg-blue-100 text-blue-700' :
                                                    entity.type === 'Provider' ? 'bg-teal-100 text-teal-700' :
                                                    entity.type === 'Date' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {entity.type}: {entity.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Data Quality */}
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs font-medium text-slate-500 mb-2">Data Quality</p>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <p className="text-lg font-bold text-slate-800">{Math.round(documentProcessing.data.dataQuality.completeness * 100)}%</p>
                                            <p className="text-xs text-slate-500">Complete</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-800">{Math.round(documentProcessing.data.dataQuality.accuracy * 100)}%</p>
                                            <p className="text-xs text-slate-500">Accurate</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-800">{Math.round(documentProcessing.data.dataQuality.timeliness * 100)}%</p>
                                            <p className="text-xs text-slate-500">Timely</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalCertificates.map(cert => (
                    <div key={cert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileBadge size={20} className="text-teal-600" />
                                <h3 className="font-bold text-slate-800">{cert.type} Certificate</h3>
                            </div>
                            <p className="text-sm text-slate-600">Patient: <span className="font-medium text-slate-900">{cert.patientName}</span></p>
                            <p className="text-sm text-slate-500">Doctor: {cert.doctor}</p>
                            <p className="text-xs text-slate-400 mt-2">Issued: {cert.issueDate}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold text-center ${cert.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {cert.status}
                            </span>
                            {cert.status === 'Issued' && (
                                <div className="flex gap-2">
                                    <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500" title="Print"><Printer size={16} /></button>
                                    <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500" title="Download"><Download size={16} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Generate Certificate</h2>
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
                                <select 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Fitness">Fitness</option>
                                    <option value="Death">Death</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.doctor}
                                    onChange={e => setFormData({...formData, doctor: e.target.value})}
                                />
                            </div>
                            
                            {/* AI Code Suggestion */}
                            {medicalCoding.data && (
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <p className="text-xs font-medium text-purple-700 mb-2">AI Suggested Codes</p>
                                    <div className="flex flex-wrap gap-1">
                                        {medicalCoding.data.icdCodes.slice(0, 2).map((code, idx) => (
                                            <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-purple-200">
                                                {code.code}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={handleSuggestCodes}
                                    disabled={medicalCoding.loading}
                                    className="flex-1 bg-purple-100 text-purple-700 font-medium py-3 rounded-xl hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    {medicalCoding.loading ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Code size={16} />
                                    )}
                                    AI Suggest Codes
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors"
                                >
                                    Generate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalCertificates;
