import React, { useState } from 'react';
import { AuditLog } from '../types';
import { ScrollText, ShieldAlert, CheckCircle, Sparkles, AlertTriangle, Loader2, Shield, Activity, Users } from 'lucide-react';
import { useAuditTrailAnalysis, useComplianceMonitoring } from '../hooks/useAI';
import { AuditTrailInput, ComplianceMonitoringInput } from '../types';

const MOCK_LOGS: AuditLog[] = [
    { id: 'LOG-001', user: 'Dr. Chen', action: 'Viewed Patient Record', resource: 'P-101', timestamp: '10:30:45 AM', status: 'Success' },
    { id: 'LOG-002', user: 'Admin', action: 'Deleted Appointment', resource: 'APT-443', timestamp: '10:15:20 AM', status: 'Success' },
    { id: 'LOG-003', user: 'Nurse Joy', action: 'Dispensed Medication', resource: 'MED-221', timestamp: '09:45:00 AM', status: 'Failed' },
    { id: 'LOG-004', user: 'Dr. Smith', action: 'Modified Patient Record', resource: 'P-205', timestamp: '02:30:15 AM', status: 'Success' },
    { id: 'LOG-005', user: 'Jane Smith', action: 'Accessed Financial Records', resource: 'FIN-001', timestamp: '11:45:30 PM', status: 'Success' },
    { id: 'LOG-006', user: 'Admin', action: 'Exported Patient Data', resource: 'P-*', timestamp: '03:15:00 AM', status: 'Success' },
];

const AuditLogs: React.FC = () => {
    // AI Hooks
    const auditTrail = useAuditTrailAnalysis();
    const compliance = useComplianceMonitoring();
    
    // State
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [showCompliancePanel, setShowCompliancePanel] = useState(false);

    // Handle Audit Trail Analysis
    const handleAnalyzeAuditTrail = async () => {
        const input: AuditTrailInput = {
            auditLogs: MOCK_LOGS,
            timeframe: 'Last 24 hours',
            sensitiveResources: ['Patient Records', 'Financial Records', 'Medication Records'],
            anomalyThreshold: 0.7,
        };
        
        await auditTrail.execute(input);
        setShowAIPanel(true);
    };

    // Handle Compliance Monitoring
    const handleComplianceCheck = async () => {
        const input: ComplianceMonitoringInput = {
            facilityType: 'Hospital',
            departments: ['Emergency', 'Surgery', 'Outpatient'],
            regulatoryRequirements: ['HIPAA', 'Joint Commission', 'CMS'],
        };
        
        await compliance.execute(input);
        setShowCompliancePanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                    <p className="text-slate-500">System activity and compliance tracking.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleAnalyzeAuditTrail}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Sparkles size={16} />
                        AI Audit Analysis
                    </button>
                    <button 
                        onClick={handleComplianceCheck}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <Shield size={16} />
                        Compliance Check
                    </button>
                    <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
                        Export CSV
                    </button>
                </div>
            </div>

            {/* AI Audit Trail Analysis Panel */}
            {showAIPanel && auditTrail.data && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-purple-600" size={20} />
                            <h3 className="text-lg font-semibold text-purple-900">AI Audit Trail Analysis</h3>
                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-2">
                                <Activity className="text-slate-400" size={18} />
                                <span className="text-sm text-slate-500">Total Events</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{auditTrail.data.auditSummary.totalEvents}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-2">
                                <Users className="text-slate-400" size={18} />
                                <span className="text-sm text-slate-500">Unique Users</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800 mt-1">{auditTrail.data.auditSummary.uniqueUsers}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="text-amber-500" size={18} />
                                <span className="text-sm text-slate-500">Flagged Events</span>
                            </div>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{auditTrail.data.auditSummary.flaggedEvents}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-2">
                                <Shield className="text-green-500" size={18} />
                                <span className="text-sm text-slate-500">Compliance Score</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 mt-1">{auditTrail.data.auditSummary.complianceScore}%</p>
                        </div>
                    </div>
                    
                    {/* Suspicious Activities */}
                    {auditTrail.data.suspiciousActivities.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
                            <h4 className="font-semibold text-slate-800 mb-3">Suspicious Activities Detected</h4>
                            {auditTrail.data.suspiciousActivities.map((activity, idx) => (
                                <div key={idx} className={`p-3 rounded-lg mb-2 ${
                                    activity.severity === 'Critical' ? 'bg-red-50 border border-red-200' :
                                    activity.severity === 'High' ? 'bg-orange-50 border border-orange-200' :
                                    'bg-yellow-50 border border-yellow-200'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className={`${
                                                activity.severity === 'Critical' ? 'text-red-500' :
                                                activity.severity === 'High' ? 'text-orange-500' :
                                                'text-yellow-500'
                                            }`} size={16} />
                                            <span className="font-medium text-slate-800">{activity.type}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                                activity.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                activity.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>{activity.severity}</span>
                                        </div>
                                        <span className="text-sm text-slate-500">{activity.userName}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{activity.description}</p>
                                    <p className="text-xs text-slate-500 mt-2">
                                        <strong>Recommended Action:</strong> {activity.recommendedAction}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Risk Scoring */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <h4 className="font-semibold text-slate-800 mb-3">Risk Scoring by Category</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {auditTrail.data.riskScoring.map((risk, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">{risk.category}</span>
                                        <span className={`text-lg font-bold ${
                                            risk.score > 70 ? 'text-red-600' :
                                            risk.score > 40 ? 'text-amber-600' :
                                            'text-green-600'
                                        }`}>{risk.score}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${
                                                risk.score > 70 ? 'bg-red-500' :
                                                risk.score > 40 ? 'bg-amber-500' :
                                                'bg-green-500'
                                            }`}
                                            style={{ width: `${risk.score}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Trend: {risk.trend} | {risk.contributingFactors.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Compliance Monitoring Panel */}
            {showCompliancePanel && compliance.data && (
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield className="text-teal-600" size={20} />
                            <h3 className="text-lg font-semibold text-teal-900">AI Compliance Monitoring</h3>
                            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
                        </div>
                        <button onClick={() => setShowCompliancePanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    
                    {/* Overall Score */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 border border-teal-100">
                            <p className="text-sm text-slate-500">Overall Compliance Score</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className={`text-4xl font-bold ${
                                    compliance.data.overallComplianceScore >= 90 ? 'text-green-600' :
                                    compliance.data.overallComplianceScore >= 70 ? 'text-amber-600' :
                                    'text-red-600'
                                }`}>
                                    {compliance.data.overallComplianceScore}
                                </span>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        compliance.data.complianceStatus === 'Excellent' ? 'bg-green-100 text-green-700' :
                                        compliance.data.complianceStatus === 'Good' ? 'bg-blue-100 text-blue-700' :
                                        compliance.data.complianceStatus === 'Needs Improvement' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {compliance.data.complianceStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-teal-100">
                            <p className="text-sm text-slate-500 mb-2">Upcoming Deadlines</p>
                            {compliance.data.upcomingDeadlines.slice(0, 2).map((deadline, idx) => (
                                <div key={idx} className="flex items-center justify-between py-1">
                                    <span className="text-sm text-slate-700">{deadline.requirement}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        deadline.status === 'On Track' ? 'bg-green-100 text-green-700' :
                                        deadline.status === 'At Risk' ? 'bg-amber-100 text-amber-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                        {deadline.daysRemaining} days
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Compliance Checklists */}
                    <div className="bg-white rounded-xl p-4 border border-teal-100 mb-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Compliance Checklists</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {compliance.data.checklists.map((checklist, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-slate-700">{checklist.category}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                            checklist.overallStatus === 'Compliant' ? 'bg-green-100 text-green-700' :
                                            checklist.overallStatus === 'Partial' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {checklist.overallStatus}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {checklist.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs">
                                                {item.status === 'Compliant' ? (
                                                    <CheckCircle size={12} className="text-green-500" />
                                                ) : (
                                                    <AlertTriangle size={12} className="text-amber-500" />
                                                )}
                                                <span className="text-slate-600">{item.requirement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Alerts */}
                    {compliance.data.alerts.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-teal-100">
                            <h4 className="font-semibold text-slate-800 mb-3">Compliance Alerts</h4>
                            {compliance.data.alerts.map((alert, idx) => (
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
                                        <span className="font-medium text-slate-800">{alert.title}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{alert.description}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        <strong>Action:</strong> {alert.actionRequired}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Audit Logs Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Resource</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs">
                        {MOCK_LOGS.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-4 font-bold text-slate-700">{log.user}</td>
                                <td className="px-6 py-4 text-slate-800">{log.action}</td>
                                <td className="px-6 py-4 text-slate-500">{log.resource}</td>
                                <td className="px-6 py-4">
                                    {log.status === 'Success' ? (
                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> Success</span>
                                    ) : (
                                        <span className="text-red-600 flex items-center gap-1"><ShieldAlert size={12} /> Failed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
