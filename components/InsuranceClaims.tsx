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
    const [claims, setClaims] = useState<InsuranceClaim[]>(MOCK_CLAIMS);
    const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
    const [showDenialPanel, setShowDenialPanel] = useState(false);
    const [showFraudPanel, setShowFraudPanel] = useState(false);
    const [showNewClaimModal, setShowNewClaimModal] = useState(false);
    const [newClaim, setNewClaim] = useState({
        patientName: '',
        provider: '',
        amount: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        diagnosisCodes: ''
    });

    // Handle Create Claim
    const handleCreateClaim = (e: React.FormEvent) => {
        e.preventDefault();
        const claim: InsuranceClaim = {
            id: `CLM-${Math.floor(Math.random() * 10000)}`,
            patientName: newClaim.patientName,
            provider: newClaim.provider,
            amount: parseFloat(newClaim.amount),
            status: newClaim.status as 'Pending' | 'Approved' | 'Rejected',
            date: newClaim.date,
        };
        setClaims([claim, ...claims]);
        setShowNewClaimModal(false);
        setNewClaim({ patientName: '', provider: '', amount: '', status: 'Pending', date: new Date().toISOString().split('T')[0], diagnosisCodes: '' });
    };

    // Handle Delete Claim
    const handleDeleteClaim = (id: string) => {
        if (confirm('Are you sure you want to delete this claim?')) {
            setClaims(claims.filter(c => c.id !== id));
        }
    };

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
            billingData: claims.map(claim => ({
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
                    <h1 className="text-2xl font-bold text-foreground-primary">Insurance Claims</h1>
                    <p className="text-foreground-secondary">Process and track patient insurance claims.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleFraudCheck}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all theme-transition"
                    >
                        <Shield size={16} />
                        AI Fraud Detection
                    </button>
                    <button
                        onClick={() => setShowNewClaimModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all theme-transition"
                    >
                        New Claim
                    </button>
                </div>
            </div>

            {/* AI Fraud Detection Panel */}
            {showFraudPanel && fraudDetection.data && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-red-200 dark:border-red-900/50 theme-transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-red-600 dark:text-red-400" size={20} />
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">AI Fraud Detection Analysis</h3>
                            <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowFraudPanel(false)} className="text-foreground-muted hover:text-foreground-primary">✕</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/30 theme-transition">
                            <p className="text-sm text-foreground-secondary">Overall Risk Score</p>
                            <p className={`text-2xl font-bold ${fraudDetection.data.overallRiskScore > 70 ? 'text-danger-dark' :
                                fraudDetection.data.overallRiskScore > 40 ? 'text-warning-dark' :
                                    'text-success-dark'
                                }`}>
                                {fraudDetection.data.overallRiskScore}
                            </p>
                            <p className="text-xs text-foreground-muted">Risk Level: {fraudDetection.data.riskLevel}</p>
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/30 theme-transition">
                            <p className="text-sm text-foreground-secondary">Detected Anomalies</p>
                            <p className="text-2xl font-bold text-foreground-primary">{fraudDetection.data.detectedAnomalies.length}</p>
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/30 theme-transition">
                            <p className="text-sm text-foreground-secondary">Investigation Alerts</p>
                            <p className="text-2xl font-bold text-foreground-primary">{fraudDetection.data.investigationAlerts.length}</p>
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/30 theme-transition">
                            <p className="text-sm text-foreground-secondary">Financial Impact</p>
                            <p className="text-2xl font-bold text-danger-dark">
                                ${fraudDetection.data.detectedAnomalies.reduce((sum, a) => sum + a.estimatedFinancialImpact, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {fraudDetection.data.detectedAnomalies.length > 0 && (
                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/30 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-3">Detected Anomalies</h4>
                            {fraudDetection.data.detectedAnomalies.map((anomaly, idx) => (
                                <div key={idx} className="flex items-start gap-3 mb-3 p-3 bg-background-secondary rounded-lg theme-transition">
                                    <AlertTriangle className={`${anomaly.severity === 'Critical' ? 'text-danger-dark' :
                                        anomaly.severity === 'High' ? 'text-orange-500' :
                                            'text-yellow-500'
                                        } mt-0.5`} size={18} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-foreground-primary">{anomaly.type}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${anomaly.severity === 'Critical' ? 'bg-danger-light text-danger-dark' :
                                                anomaly.severity === 'High' ? 'bg-warning-light text-warning-dark' :
                                                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                }`}>{anomaly.severity}</span>
                                        </div>
                                        <p className="text-sm text-foreground-secondary mt-1">{anomaly.description}</p>
                                        <p className="text-xs text-foreground-muted mt-1">
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
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-900/50 theme-transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="text-amber-600 dark:text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Claims Denial Risk Analysis</h3>
                            <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowDenialPanel(false)} className="text-foreground-muted hover:text-foreground-primary">✕</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 theme-transition">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground-secondary">Denial Probability</span>
                                <span className={`text-2xl font-bold ${claimsDenial.data.denialProbability > 0.7 ? 'text-danger-dark' :
                                    claimsDenial.data.denialProbability > 0.4 ? 'text-warning-dark' :
                                        'text-success-dark'
                                    }`}>
                                    {Math.round(claimsDenial.data.denialProbability * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-background-tertiary rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${claimsDenial.data.denialProbability > 0.7 ? 'bg-danger-dark' :
                                        claimsDenial.data.denialProbability > 0.4 ? 'bg-warning-dark' :
                                            'bg-success-dark'
                                        }`}
                                    style={{ width: `${claimsDenial.data.denialProbability * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-foreground-muted mt-2">Risk Level: {claimsDenial.data.riskLevel}</p>
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-2">Risk Factors</h4>
                            {claimsDenial.data.riskFactors.slice(0, 3).map((factor, idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2">
                                    <AlertTriangle size={14} className="text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground-primary">{factor.factor}</p>
                                        <p className="text-xs text-foreground-muted">{factor.mitigationStrategy}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/30 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-2">Corrective Actions</h4>
                            {claimsDenial.data.correctiveActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2">
                                    <CheckCircle2 size={14} className="text-success-dark mt-0.5" />
                                    <div>
                                        <p className="text-sm text-foreground-primary">{action.action}</p>
                                        <p className="text-xs text-foreground-muted">Priority: {action.priority}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Claims Table */}
            <div className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-secondary font-semibold theme-transition">
                            <th className="px-6 py-4">Claim ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Provider</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {claims.map(claim => (
                            <tr key={claim.id} className="hover:bg-background-secondary transition-colors theme-transition">
                                <td className="px-6 py-4 font-mono text-sm text-foreground-secondary">{claim.id}</td>
                                <td className="px-6 py-4 font-medium text-foreground-primary">{claim.patientName}</td>
                                <td className="px-6 py-4 text-foreground-secondary">{claim.provider}</td>
                                <td className="px-6 py-4 font-bold text-foreground-primary">${claim.amount}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${claim.status === 'Approved' ? 'bg-success-light text-success-dark border-green-200 dark:border-green-800' :
                                        claim.status === 'Rejected' ? 'bg-danger-light text-danger-dark border-red-200 dark:border-red-800' :
                                            'bg-warning-light text-warning-dark border-orange-200 dark:border-orange-800'
                                        }`}>
                                        {claim.status === 'Approved' ? <CheckCircle2 size={14} /> :
                                            claim.status === 'Rejected' ? <XCircle size={14} /> : <Clock size={14} />}
                                        {claim.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handlePredictDenial(claim)}
                                        className="p-2 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                                        title="AI Denial Prediction"
                                    >
                                        <TrendingUp size={18} />
                                    </button>
                                    <button className="p-2 text-foreground-muted hover:text-accent rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors" title="View Details">
                                        <FileText size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClaim(claim.id)}
                                        className="p-2 text-foreground-muted hover:text-danger-dark rounded-lg hover:bg-danger-light transition-colors"
                                        title="Delete Claim"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New Claim Modal */}
            {showNewClaimModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewClaimModal(false)}>
                    <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up theme-transition" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground-primary">New Insurance Claim</h2>
                            <button onClick={() => setShowNewClaimModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClaim} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Patient Name</label>
                                <input
                                    required
                                    value={newClaim.patientName}
                                    onChange={e => setNewClaim({ ...newClaim, patientName: e.target.value })}
                                    placeholder="e.g. Sarah Connor"
                                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Provider</label>
                                    <input
                                        required
                                        value={newClaim.provider}
                                        onChange={e => setNewClaim({ ...newClaim, provider: e.target.value })}
                                        placeholder="e.g. BlueCross"
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={newClaim.amount}
                                        onChange={e => setNewClaim({ ...newClaim, amount: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newClaim.date}
                                        onChange={e => setNewClaim({ ...newClaim, date: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Status</label>
                                    <select
                                        value={newClaim.status}
                                        onChange={e => setNewClaim({ ...newClaim, status: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Diagnosis Codes (comma separated)</label>
                                <input
                                    value={newClaim.diagnosisCodes}
                                    onChange={e => setNewClaim({ ...newClaim, diagnosisCodes: e.target.value })}
                                    placeholder="e.g. J18.9, E11.9"
                                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowNewClaimModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors theme-transition">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all">Submit Claim</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InsuranceClaims;
