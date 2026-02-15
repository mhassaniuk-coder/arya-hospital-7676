import React, { useState } from 'react';
import { Invoice } from '../types';
import { Download, Eye, DollarSign, Sparkles, AlertTriangle, CheckCircle, Loader2, Code, Shield } from 'lucide-react';
import { useData } from '../src/contexts/DataContext';
import { useMedicalCodingAssistant, useClaimsDenialPredictor, useFraudDetection } from '../hooks/useAI';
import { MedicalCodingInput, ClaimsDenialInput } from '../types';

const Billing: React.FC = () => {
    const { invoices, addInvoice, getStats } = useData();
    const stats = getStats();
    
    // AI Hooks
    const medicalCoding = useMedicalCodingAssistant();
    const claimsDenial = useClaimsDenialPredictor();
    const fraudDetection = useFraudDetection();
    
    // State
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showCodingPanel, setShowCodingPanel] = useState(false);
    const [showDenialPanel, setShowDenialPanel] = useState(false);

    // Handle Medical Coding Analysis
    const handleAnalyzeCoding = async () => {
        if (!clinicalNotes.trim()) return;
        
        const input: MedicalCodingInput = {
            clinicalNotes,
            encounterType: 'outpatient',
        };
        
        await medicalCoding.execute(input);
    };

    // Handle Claims Denial Prediction
    const handlePredictDenial = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        
        const input: ClaimsDenialInput = {
            patientInfo: {
                age: 45,
                gender: 'Unknown',
                insuranceType: 'Commercial',
            },
            services: invoice.items.map(item => ({
                code: 'CPT-' + item.substring(0, 3),
                description: item,
                quantity: 1,
                unitCost: invoice.amount / invoice.items.length,
            })),
            diagnosisCodes: ['J18.9'],
            procedureCodes: ['99213'],
            priorAuthorization: {
                required: true,
                obtained: false,
            },
        };
        
        await claimsDenial.execute(input);
        setShowDenialPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
                    <p className="text-slate-500">Manage patient payments and financial records.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowCodingPanel(!showCodingPanel)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-lg shadow-purple-600/20 flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        AI Coding Assistant
                    </button>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20">
                        Create New Invoice
                    </button>
                </div>
            </div>

            {/* AI Coding Assistant Panel */}
            {showCodingPanel && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-purple-600" size={20} />
                        <h3 className="text-lg font-semibold text-purple-900">AI Medical Coding Assistant</h3>
                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Clinical Notes</label>
                            <textarea
                                value={clinicalNotes}
                                onChange={(e) => setClinicalNotes(e.target.value)}
                                className="w-full h-40 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter clinical notes for coding analysis..."
                            />
                            <button
                                onClick={handleAnalyzeCoding}
                                disabled={medicalCoding.loading || !clinicalNotes.trim()}
                                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {medicalCoding.loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Code size={16} />
                                        Analyze & Suggest Codes
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {medicalCoding.data && (
                            <div className="bg-white rounded-xl p-4 border border-purple-100">
                                <h4 className="font-semibold text-slate-800 mb-3">Suggested Codes</h4>
                                
                                {/* ICD Codes */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">ICD-10 Codes</p>
                                    {medicalCoding.data.icdCodes.map((code, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-mono font-bold">{code.code}</span>
                                            <span className="text-sm text-slate-700">{code.description}</span>
                                            {code.isPrimary && (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Primary</span>
                                            )}
                                            <span className="text-xs text-slate-400 ml-auto">{Math.round(code.confidence * 100)}% confidence</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* CPT Codes */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-slate-500 uppercase mb-2">CPT Codes</p>
                                    {medicalCoding.data.cptCodes.map((code, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2 p-2 bg-slate-50 rounded-lg">
                                            <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-mono font-bold">{code.code}</span>
                                            <span className="text-sm text-slate-700">{code.description}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Compliance Alerts */}
                                {medicalCoding.data.complianceAlerts.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Compliance Alerts</p>
                                        {medicalCoding.data.complianceAlerts.map((alert, idx) => (
                                            <div key={idx} className={`p-2 rounded-lg mb-2 ${
                                                alert.severity === 'Critical' ? 'bg-red-50 border border-red-200' :
                                                alert.severity === 'Warning' ? 'bg-yellow-50 border border-yellow-200' :
                                                'bg-blue-50 border border-blue-200'
                                            }`}>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle size={14} className={
                                                        alert.severity === 'Critical' ? 'text-red-600' :
                                                        alert.severity === 'Warning' ? 'text-yellow-600' :
                                                        'text-blue-600'
                                                    } />
                                                    <span className="text-sm font-medium text-slate-700">{alert.type}</span>
                                                </div>
                                                <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Total Revenue (Monthly)</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Pending Payments</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">${stats.pendingRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Overdue Invoices</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{invoices.filter(i => i.status === 'Overdue').length}</p>
                </div>
            </div>

            {/* Claims Denial Prediction Panel */}
            {showDenialPanel && claimsDenial.data && selectedInvoice && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-amber-600" size={20} />
                            <h3 className="text-lg font-semibold text-amber-900">Claims Denial Risk Analysis</h3>
                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowDenialPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-4 border border-amber-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Denial Probability</span>
                                <span className={`text-2xl font-bold ${
                                    claimsDenial.data.denialProbability > 0.7 ? 'text-red-600' :
                                    claimsDenial.data.denialProbability > 0.4 ? 'text-amber-600' :
                                    'text-green-600'
                                }`}>
                                    {Math.round(claimsDenial.data.denialProbability * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full ${
                                        claimsDenial.data.denialProbability > 0.7 ? 'bg-red-500' :
                                        claimsDenial.data.denialProbability > 0.4 ? 'bg-amber-500' :
                                        'bg-green-500'
                                    }`}
                                    style={{ width: `${claimsDenial.data.denialProbability * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Risk Level: {claimsDenial.data.riskLevel}</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-amber-100">
                            <h4 className="font-semibold text-slate-800 mb-2">Risk Factors</h4>
                            {claimsDenial.data.riskFactors.slice(0, 3).map((factor, idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2">
                                    <AlertTriangle size={14} className="text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{factor.factor}</p>
                                        <p className="text-xs text-slate-500">{factor.mitigationStrategy}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-amber-100">
                            <h4 className="font-semibold text-slate-800 mb-2">Corrective Actions</h4>
                            {claimsDenial.data.correctiveActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2">
                                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-slate-700">{action.action}</p>
                                        <p className="text-xs text-slate-500">Priority: {action.priority}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Invoices Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{inv.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{inv.patientName}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{inv.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${inv.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        inv.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                        inv.status === 'Pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                        'bg-red-100 text-red-700 border-red-200'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handlePredictDenial(inv)}
                                        className="text-purple-400 hover:text-purple-600 p-2" 
                                        title="AI Denial Prediction"
                                    >
                                        <Shield size={18} />
                                    </button>
                                    <button className="text-slate-400 hover:text-teal-600 p-2"><Eye size={18} /></button>
                                    <button className="text-slate-400 hover:text-slate-600 p-2"><Download size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Billing;
