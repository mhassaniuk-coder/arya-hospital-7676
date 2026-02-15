import React, { useState } from 'react';
import { LegalCase } from '../types';
import { Scale, FileText, Sparkles, AlertTriangle, Clock, CheckCircle, FileCheck, RefreshCw } from 'lucide-react';
import { useContractManagement, usePolicyManagement } from '../hooks/useAI';
import { ContractManagementInput, PolicyManagementInput } from '../types';

const MOCK_CASES: LegalCase[] = [
    { id: '1', caseNumber: 'MLC-2023-045', patientName: 'John Doe', type: 'Accident', policeStation: 'Central Station', status: 'Active' },
    { id: '2', caseNumber: 'MLC-2023-042', patientName: 'Jane Smith', type: 'Assault', policeStation: 'North Precinct', status: 'Closed' },
];

const Legal: React.FC = () => {
    // AI Hooks
    const contractManagement = useContractManagement();
    const policyManagement = usePolicyManagement();
    
    // State
    const [showContractPanel, setShowContractPanel] = useState(false);
    const [showPolicyPanel, setShowPolicyPanel] = useState(false);

    // Handle Contract Management
    const handleContractAnalysis = async () => {
        const input: ContractManagementInput = {
            contracts: [
                { id: 'CTR-001', name: 'Medical Equipment Lease', type: 'Lease', startDate: '2023-01-01', endDate: '2024-03-31', value: 150000, status: 'Pending Renewal', parties: ['MedEquip Corp'] },
                { id: 'CTR-002', name: 'IT Support Services', type: 'Service', startDate: '2023-06-01', endDate: '2024-05-15', value: 85000, status: 'Active', parties: ['TechSolutions Inc'] },
                { id: 'CTR-003', name: 'Pharmaceutical Supply', type: 'Vendor', startDate: '2023-03-15', endDate: '2024-02-28', value: 250000, status: 'Active', parties: ['PharmaCorp'] },
            ],
            vendorPerformance: [
                { vendorId: 'V-001', vendorName: 'MedEquip Corp', performanceScore: 92, issues: [] },
                { vendorId: 'V-002', vendorName: 'TechSolutions Inc', performanceScore: 78, issues: ['Response time delays'] },
            ],
        };
        
        await contractManagement.execute(input);
        setShowContractPanel(true);
    };

    // Handle Policy Management
    const handlePolicyAnalysis = async () => {
        const input: PolicyManagementInput = {
            policies: [
                { id: 'POL-001', name: 'Patient Privacy Policy', category: 'Privacy', version: '2.1', effectiveDate: '2023-01-01', lastReviewDate: '2023-07-15', nextReviewDate: '2024-01-15', status: 'Active', owner: 'Privacy Officer' },
                { id: 'POL-002', name: 'Data Retention Policy', category: 'Compliance', version: '1.5', effectiveDate: '2022-06-01', lastReviewDate: '2023-06-01', nextReviewDate: '2024-02-01', status: 'Active', owner: 'Compliance Team' },
                { id: 'POL-003', name: 'Emergency Response Plan', category: 'Safety', version: '3.0', effectiveDate: '2023-03-01', lastReviewDate: '2023-09-01', nextReviewDate: '2024-02-01', status: 'Active', owner: 'Safety Manager' },
            ],
            complianceGaps: ['Electronic messaging retention not addressed'],
            organizationType: 'Hospital',
        };
        
        await policyManagement.execute(input);
        setShowPolicyPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Legal / MLC</h1>
                    <p className="text-slate-500">Medico-Legal Cases and documentation.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleContractAnalysis}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                        <FileCheck size={16} />
                        AI Contract Manager
                    </button>
                    <button 
                        onClick={handlePolicyAnalysis}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <RefreshCw size={16} />
                        AI Policy Manager
                    </button>
                </div>
            </div>

            {/* AI Contract Management Panel */}
            {showContractPanel && contractManagement.data && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FileCheck className="text-purple-600" size={20} />
                            <h3 className="text-lg font-semibold text-purple-900">AI Contract Management</h3>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowContractPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    {/* Expiry Alerts */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Contract Expiry Alerts</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {contractManagement.data.expiryAlerts.map((alert, idx) => (
                                <div key={idx} className={`p-3 rounded-lg ${
                                    alert.priority === 'Critical' ? 'bg-red-50 border border-red-200' :
                                    alert.priority === 'High' ? 'bg-orange-50 border border-orange-200' :
                                    'bg-yellow-50 border border-yellow-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-800">{alert.contractName}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            alert.daysUntilExpiry <= 30 ? 'bg-red-100 text-red-700' :
                                            alert.daysUntilExpiry <= 60 ? 'bg-orange-100 text-orange-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {alert.daysUntilExpiry} days
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600">{alert.impact}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Clock size={12} className="text-slate-400" />
                                        <span className="text-xs text-slate-500">Action: {alert.recommendedAction}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Renewal Recommendations */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Renewal Recommendations</h4>
                        {contractManagement.data.renewalRecommendations.map((rec, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg mb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-800">{rec.contractName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        rec.recommendation === 'Renew' ? 'bg-green-100 text-green-700' :
                                        rec.recommendation === 'Renegotiate' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {rec.recommendation}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{rec.reasoning}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-green-600 font-medium">
                                        Est. Savings: ${rec.estimatedSavings.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Vendor Insights */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <h4 className="font-semibold text-slate-800 mb-3">Vendor Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {contractManagement.data.vendorInsights.map((vendor, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-700">{vendor.vendor}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            vendor.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                                            vendor.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {vendor.riskLevel} Risk
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <p>Contracts: {vendor.totalContracts}</p>
                                        <p>Value: ${vendor.totalValue.toLocaleString()}</p>
                                        <p>Score: {vendor.performanceScore}/100</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Policy Management Panel */}
            {showPolicyPanel && policyManagement.data && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="text-teal-600" size={20} />
                            <h3 className="text-lg font-semibold text-teal-900">AI Policy Management</h3>
                            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowPolicyPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    {/* Policy Alerts */}
                    {policyManagement.data.alerts.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-teal-100 mb-4">
                            <h4 className="font-semibold text-slate-800 mb-3">Policy Alerts</h4>
                            {policyManagement.data.alerts.map((alert, idx) => (
                                <div key={idx} className={`p-3 rounded-lg mb-2 ${
                                    alert.severity === 'Critical' ? 'bg-red-50 border border-red-200' :
                                    alert.severity === 'Warning' ? 'bg-amber-50 border border-amber-200' :
                                    'bg-blue-50 border border-blue-200'
                                }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertTriangle className={`${
                                            alert.severity === 'Critical' ? 'text-red-500' :
                                            alert.severity === 'Warning' ? 'text-amber-500' :
                                            'text-blue-500'
                                        }`} size={14} />
                                        <span className="font-medium text-slate-800">{alert.policy}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                            alert.severity === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>{alert.severity}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{alert.message}</p>
                                    <p className="text-xs text-slate-500 mt-1">Action: {alert.action}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Gap Analysis */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100 mb-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Compliance Gap Analysis</h4>
                        {policyManagement.data.gapAnalysis.map((gap, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-lg mb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-slate-800">{gap.policyName}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        gap.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                        gap.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>{gap.severity}</span>
                                </div>
                                <p className="text-sm text-slate-600">{gap.description}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    <strong>Reference:</strong> {gap.regulatoryReference}
                                </p>
                                <p className="text-xs text-teal-600 mt-1">
                                    <strong>Remediation:</strong> {gap.remediation}
                                </p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Review Schedule */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100">
                        <h4 className="font-semibold text-slate-800 mb-3">Upcoming Policy Reviews</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {policyManagement.data.reviewSchedule.map((review, idx) => (
                                <div key={idx} className={`p-3 rounded-lg ${
                                    review.status === 'Overdue' ? 'bg-red-50 border border-red-200' :
                                    review.status === 'Due Soon' ? 'bg-amber-50 border border-amber-200' :
                                    'bg-slate-50'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-700">{review.policy}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            review.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                                            review.status === 'Due Soon' ? 'bg-amber-100 text-amber-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {review.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        <p>Next Review: {review.nextReview}</p>
                                        <p>Reviewer: {review.reviewer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Legal Cases Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Case No.</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Police Station</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CASES.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{c.caseNumber}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{c.patientName}</td>
                                <td className="px-6 py-4 text-slate-600">{c.type}</td>
                                <td className="px-6 py-4 text-slate-600">{c.policeStation}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Active' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 hover:underline" title="View File"><FileText size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Legal;
