import React, { useState } from 'react';
import { Invoice } from '../types';
import { Download, Eye, DollarSign, Sparkles, AlertTriangle, CheckCircle, Loader2, Code, Shield, XCircle } from 'lucide-react';
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
    const [showFraudPanel, setShowFraudPanel] = useState(false);

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

    // Handle Fraud Detection
    const handleDetectFraud = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        await fraudDetection.execute({ invoiceId: invoice.id, amount: invoice.amount, items: invoice.items });
        setShowFraudPanel(true);
    };

    // Handle Delete Invoice
    const handleDeleteInvoice = (id: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            // In a real app, this would delete via API
            alert(`Invoice ${id} deleted`);
        }
    };

    // Handle Create Invoice
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        patientName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        items: ''
    });

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        const invoice: Invoice = {
            id: `INV-${Math.floor(Math.random() * 10000)}`,
            patientName: newInvoice.patientName,
            amount: parseFloat(newInvoice.amount),
            date: newInvoice.date,
            status: newInvoice.status as 'Pending' | 'Paid' | 'Overdue',
            items: newInvoice.items.split(',').map(i => i.trim())
        };
        addInvoice(invoice);
        setShowCreateModal(false);
        setNewInvoice({ patientName: '', amount: '', date: new Date().toISOString().split('T')[0], status: 'Pending', items: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Billing & Invoices</h1>
                    <p className="text-foreground-secondary">Manage patient payments and financial records.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowCodingPanel(!showCodingPanel)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-lg shadow-purple-600/20 flex items-center gap-2 theme-transition"
                    >
                        <Sparkles size={16} />
                        AI Coding Assistant
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-lg shadow-teal-600/20 theme-transition"
                    >
                        Create New Invoice
                    </button>
                </div>
            </div>

            {/* AI Coding Assistant Panel */}
            {showCodingPanel && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-purple-600 dark:text-purple-400" size={20} />
                        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">AI Medical Coding Assistant</h3>
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground-secondary mb-2">Clinical Notes</label>
                            <textarea
                                value={clinicalNotes}
                                onChange={(e) => setClinicalNotes(e.target.value)}
                                className="w-full h-40 p-3 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none theme-transition"
                                placeholder="Enter clinical notes for coding analysis..."
                            />
                            <button
                                onClick={handleAnalyzeCoding}
                                disabled={medicalCoding.loading || !clinicalNotes.trim()}
                                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 theme-transition"
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
                            <div className="bg-background-primary rounded-xl p-4 border border-purple-100 dark:border-purple-900/50">
                                <h4 className="font-semibold text-foreground-primary mb-3">Suggested Codes</h4>

                                {/* ICD Codes */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-foreground-muted uppercase mb-2">ICD-10 Codes</p>
                                    {medicalCoding.data.icdCodes.map((code, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2 p-2 bg-background-secondary rounded-lg">
                                            <span className="bg-info-light text-info-dark px-2 py-1 rounded text-xs font-mono font-bold">{code.code}</span>
                                            <span className="text-sm text-foreground-secondary">{code.description}</span>
                                            {code.isPrimary && (
                                                <span className="bg-success-light text-success-dark text-xs px-2 py-0.5 rounded">Primary</span>
                                            )}
                                            <span className="text-xs text-foreground-muted ml-auto">{Math.round(code.confidence * 100)}% confidence</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CPT Codes */}
                                <div className="mb-4">
                                    <p className="text-xs font-medium text-foreground-muted uppercase mb-2">CPT Codes</p>
                                    {medicalCoding.data.cptCodes.map((code, idx) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2 p-2 bg-background-secondary rounded-lg">
                                            <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded text-xs font-mono font-bold">{code.code}</span>
                                            <span className="text-sm text-foreground-secondary">{code.description}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Compliance Alerts */}
                                {medicalCoding.data.complianceAlerts.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-foreground-muted uppercase mb-2">Compliance Alerts</p>
                                        {medicalCoding.data.complianceAlerts.map((alert, idx) => (
                                            <div key={idx} className={`p-2 rounded-lg mb-2 ${alert.severity === 'Critical' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                                                alert.severity === 'Warning' ? 'bg-warning-light border border-yellow-200 dark:border-yellow-800' :
                                                    'bg-info-light border border-blue-200 dark:border-blue-800'
                                                }`}>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle size={14} className={
                                                        alert.severity === 'Critical' ? 'text-danger-dark' :
                                                            alert.severity === 'Warning' ? 'text-warning-dark' :
                                                                'text-info-dark'
                                                    } />
                                                    <span className="text-sm font-medium text-foreground-primary">{alert.type}</span>
                                                </div>
                                                <p className="text-xs text-foreground-secondary mt-1">{alert.description}</p>
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
                <div className="bg-background-elevated p-6 rounded-2xl shadow-sm border border-border theme-transition">
                    <p className="text-foreground-secondary text-sm font-medium">Total Revenue (Monthly)</p>
                    <p className="text-3xl font-bold text-foreground-primary mt-2">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-background-elevated p-6 rounded-2xl shadow-sm border border-border theme-transition">
                    <p className="text-foreground-secondary text-sm font-medium">Pending Payments</p>
                    <p className="text-3xl font-bold text-warning-dark mt-2">${stats.pendingRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-background-elevated p-6 rounded-2xl shadow-sm border border-border theme-transition">
                    <p className="text-foreground-secondary text-sm font-medium">Overdue Invoices</p>
                    <p className="text-3xl font-bold text-danger-dark mt-2">{invoices.filter(i => i.status === 'Overdue').length}</p>
                </div>
            </div>

            {/* Claims Denial Prediction Panel */}
            {showDenialPanel && claimsDenial.data && selectedInvoice && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-amber-600 dark:text-amber-400" size={20} />
                            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Claims Denial Risk Analysis</h3>
                            <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowDenialPanel(false)} className="text-foreground-muted hover:text-foreground-primary theme-transition">✕</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/50">
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
                                    className={`h-2 rounded-full ${claimsDenial.data.denialProbability > 0.7 ? 'bg-red-500' :
                                        claimsDenial.data.denialProbability > 0.4 ? 'bg-amber-500' :
                                            'bg-green-500'
                                        }`}
                                    style={{ width: `${claimsDenial.data.denialProbability * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-foreground-muted mt-2">Risk Level: {claimsDenial.data.riskLevel}</p>
                        </div>

                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/50">
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

                        <div className="bg-background-primary rounded-xl p-4 border border-amber-100 dark:border-amber-900/50">
                            <h4 className="font-semibold text-foreground-primary mb-2">Corrective Actions</h4>
                            {claimsDenial.data.correctiveActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-2 mb-2">
                                    <CheckCircle size={14} className="text-success-dark mt-0.5" />
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

            {/* Fraud Detection Panel */}
            {showFraudPanel && fraudDetection.data && selectedInvoice && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-danger-dark" size={20} />
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Fraud Detection Audit</h3>
                            <span className="bg-danger-light text-danger-dark text-xs px-2 py-1 rounded-full font-medium">AI Audit</span>
                        </div>
                        <button onClick={() => setShowFraudPanel(false)} className="text-foreground-muted hover:text-foreground-primary theme-transition">✕</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground-secondary">Fraud Probability</span>
                                <span className={`text-2xl font-bold ${fraudDetection.data.riskLevel === 'Critical' || fraudDetection.data.riskLevel === 'High' ? 'text-danger-dark' :
                                    fraudDetection.data.riskLevel === 'Medium' ? 'text-warning-dark' :
                                        'text-success-dark'
                                    }`}>
                                    {fraudDetection.data.riskLevel}
                                </span>
                            </div>
                            <p className="text-xs text-foreground-muted mt-2">Overall Risk Score: {fraudDetection.data.overallRiskScore || 0}/100</p>
                        </div>

                        <div className="lg:col-span-2 bg-background-primary rounded-xl p-4 border border-red-100 dark:border-red-900/50">
                            <h4 className="font-semibold text-foreground-primary mb-2">Detected Anomalies</h4>
                            {fraudDetection.data.detectedAnomalies.length > 0 ? (
                                <div className="space-y-2">
                                    {fraudDetection.data.detectedAnomalies.map((anomaly, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-2 bg-danger-light rounded-lg">
                                            <AlertTriangle size={16} className="text-danger-dark mt-0.5" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground-primary">{anomaly.description}</p>
                                                <p className="text-xs text-foreground-muted">Confidence: {Math.round(anomaly.confidence * 100)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-success-dark flex items-center gap-2">
                                    <CheckCircle size={16} /> No anomalies detected.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Invoices Table */}
            <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-background-tertiary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-background-secondary transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-foreground-secondary">{inv.id}</td>
                                <td className="px-6 py-4 font-medium text-foreground-primary">{inv.patientName}</td>
                                <td className="px-6 py-4 text-foreground-muted text-sm">{inv.date}</td>
                                <td className="px-6 py-4 font-bold text-foreground-primary">${inv.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${inv.status === 'Paid' ? 'bg-success-light text-success-dark border-green-200 dark:border-green-800' :
                                        inv.status === 'Pending' ? 'bg-warning-light text-warning-dark border-orange-200 dark:border-orange-800' :
                                            'bg-danger-light text-danger-dark border-red-200 dark:border-red-800'
                                        }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end items-center gap-1">
                                    <button
                                        onClick={() => handleDetectFraud(inv)}
                                        className="text-warning-dark hover:text-orange-600 p-2 theme-transition"
                                        title="AI Fraud Detection"
                                    >
                                        <AlertTriangle size={18} />
                                    </button>
                                    <button
                                        onClick={() => handlePredictDenial(inv)}
                                        className="text-purple-500 hover:text-purple-600 p-2 theme-transition"
                                        title="AI Denial Prediction"
                                    >
                                        <Shield size={18} />
                                    </button>
                                    <button type="button" className="text-foreground-muted hover:text-teal-600 p-2 theme-transition" aria-label="View invoice" title="View Invoice"><Eye size={18} /></button>
                                    {inv.status !== 'Paid' && (
                                        <button type="button" className="text-foreground-muted hover:text-success-dark p-2 theme-transition" aria-label="Mark as Paid" title="Mark as Paid"><CheckCircle size={18} /></button>
                                    )}
                                    <button type="button" className="text-foreground-muted hover:text-danger-dark p-2 theme-transition" onClick={() => handleDeleteInvoice(inv.id)} aria-label="Delete invoice" title="Delete"><XCircle size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground-primary">Create New Invoice</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Patient Name</label>
                                <input
                                    required
                                    value={newInvoice.patientName}
                                    onChange={e => setNewInvoice({ ...newInvoice, patientName: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Amount ($)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={newInvoice.amount}
                                        onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={newInvoice.date}
                                        onChange={e => setNewInvoice({ ...newInvoice, date: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Items (comma separated)</label>
                                <textarea
                                    required
                                    value={newInvoice.items}
                                    onChange={e => setNewInvoice({ ...newInvoice, items: e.target.value })}
                                    placeholder="Consultation, Blood Test, X-Ray..."
                                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 h-24 resize-none theme-transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Status</label>
                                <select
                                    value={newInvoice.status}
                                    onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 theme-transition">Create Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
