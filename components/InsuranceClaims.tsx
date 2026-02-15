import React, { useState } from 'react';
import { InsuranceClaim } from '../types';
import { ShieldCheck, FileText, CheckCircle2, XCircle, Clock, Sparkles, AlertTriangle, Loader2, Shield, TrendingUp } from 'lucide-react';
import { useClaimsDenialPredictor, useFraudDetection } from '../hooks/useAI';
import { ClaimsDenialInput, FraudDetectionInput } from '../types';

const MOCK_CLAIMS: InsuranceClaim[] = [
    { id: 'CLM-001', patientName: 'John Doe', provider: 'BlueCross', amount: 5000, status: 'Pending', date: '2023-10-25' },
    { id: 'CLM-002', patientName: 'Sarah Smith', provider: 'Aetna', amount: 1200, status: 'Approved', date: '2023-10-24' },
    { id: 'CLM-003', patientName: 'Mike Jones', provider: 'Cigna', amount: 350, status: 'Rejected', date: '2023-10-20' },
    { id: 'CLM-004', patientName: 'Emily Brown', provider: 'UnitedHealth', amount: 8500, status: 'Pending', date: '2023-10-26' },
    { id: 'CLM-005', patientName: 'Robert Wilson', provider: 'Humana', amount: 2200, status: 'Pending', date: '2023-10-27' },
];

const InsuranceClaims: React.FC = () => {
    // AI Hooks
    const claimsDenial = useClaimsDenialPredictor();
    const fraudDetection = useFraudDetection();
    
    // State
    const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
    const [showDenialPanel, setShowDenialPanel] = useState(false);
    const [showFraudPanel, setShowFraudPanel] = useState(false);

    // Handle Claims Denial Prediction
    const handlePredictDenial = async (claim: InsuranceClaim) => {
        setSelectedClaim(claim);
        
        const input: ClaimsDenialInput = {
            patientInfo: {
                age: 45,
                gender: 'Unknown',
                insuranceType: claim.provider,
            },
            services: [{
                code: 'CPT-99213',
                description: 'Office Visit',
                quantity: 1,
                unitCost: claim.amount,
            }],
            diagnosisCodes: ['J18.9'],
            procedureCodes: ['99213'],
            priorAuthorization: {
                required: claim.amount > 3000,
                obtained: false,
            },
        };
        
        await claimsDenial.execute(input);
        setShowDenialPanel(true);
    };

    // Handle Fraud Detection
    const handleFraudCheck = async () => {
        const input: FraudDetectionInput = {
            billingData: MOCK_CLAIMS.map(claim => ({
                providerId: 'PROV-001',
                claimId: claim.id,
                date: claim.date,
                services: ['Office Visit'],
                amount: claim.amount,
                patientId: 'PT-' + claim.id.split('-')[1],
            })),
            timeWindow: 'Last 30 days',
        };
        
        await fraudDetection.execute(input);
        setShowFraudPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Insurance Claims</h1>
                    <p className="text-slate-500">Process and track patient insurance claims.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleFraudCheck}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-lg shadow-red-600/20 flex items-center gap-2"
                    >
                        <Shield size={16} />
                        AI Fraud Detection
                    </button>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20">
                        New Claim
                    </button>
                </div>
            </div>

            {/* AI Fraud Detection Panel */}
            {showFraudPanel && fraudDetection.data && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-red-600" size={20} />
                            <h3 className="text-lg font-semibold text-red-900">AI Fraud Detection Analysis</h3>
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowFraudPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <p className="text-sm text-slate-500">Overall Risk Score</p>
                            <p className={`text-2xl font-bold ${
                                fraudDetection.data.overallRiskScore > 70 ? 'text-red-600' :
                                fraudDetection.data.overallRiskScore > 40 ? 'text-amber-600' :
                                'text-green-600'
                            }`}>
                                {fraudDetection.data.overallRiskScore}
                            </p>
                            <p className="text-xs text-slate-400">Risk Level: {fraudDetection.data.riskLevel}</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <p className="text-sm text-slate-500">Detected Anomalies</p>
                            <p className="text-2xl font-bold text-slate-800">{fraudDetection.data.detectedAnomalies.length}</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <p className="text-sm text-slate-500">Investigation Alerts</p>
                            <p className="text-2xl font-bold text-slate-800">{fraudDetection.data.investigationAlerts.length}</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <p className="text-sm text-slate-500">Financial Impact</p>
                            <p className="text-2xl font-bold text-red-600">
                                ${fraudDetection.data.detectedAnomalies.reduce((sum, a) => sum + a.estimatedFinancialImpact, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    
                    {fraudDetection.data.detectedAnomalies.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-red-100">
                            <h4 className="font-semibold text-slate-800 mb-3">Detected Anomalies</h4>
                            {fraudDetection.data.detectedAnomalies.map((anomaly, idx) => (
                                <div key={idx} className="flex items-start gap-3 mb-3 p-3 bg-slate-50 rounded-lg">
                                    <AlertTriangle className={`${
                                        anomaly.severity === 'Critical' ? 'text-red-500' :
                                        anomaly.severity === 'High' ? 'text-orange-500' :
                                        'text-yellow-500'
                                    } mt-0.5`} size={18} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-800">{anomaly.type}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                                anomaly.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                anomaly.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>{anomaly.severity}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">{anomaly.description}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Confidence: {Math.round(anomaly.confidence * 100)}% | 
                                            Impact: ${anomaly.estimatedFinancialImpact.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Claims Denial Prediction Panel */}
            {showDenialPanel && claimsDenial.data && selectedClaim && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-amber-600" size={20} />
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
                                    <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
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

            {/* Claims Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Claim ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_CLAIMS.map(claim => (
                            <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{claim.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{claim.patientName}</td>
                                <td className="px-6 py-4 text-slate-600">{claim.provider}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">${claim.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        claim.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        claim.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-orange-100 text-orange-700 border-orange-200'
                                    }`}>
                                        {claim.status === 'Approved' ? <CheckCircle2 size={14} /> : 
                                         claim.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handlePredictDenial(claim)}
                                        className="p-2 text-amber-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                                        title="AI Denial Prediction"
                                    >
                                        <TrendingUp size={18} />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-teal-600 rounded-lg hover:bg-teal-50" title="View Details">
                                        <FileText size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InsuranceClaims;
