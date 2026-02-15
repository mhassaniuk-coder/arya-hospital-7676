import React, { useState } from 'react';
import { WasteRecord } from '../types';
import { Trash2, Scale, Brain, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Leaf, Clock } from 'lucide-react';
import { useWasteManagement } from '../hooks/useAI';
import { WasteManagementInput } from '../types';

const MOCK_WASTE: WasteRecord[] = [
    { id: 'W-001', type: 'Infectious', weight: 12.5, collectionTime: '08:00 AM', disposalStatus: 'Collected' },
    { id: 'W-002', type: 'Sharps', weight: 3.2, collectionTime: '08:15 AM', disposalStatus: 'Incinerated' },
    { id: 'W-003', type: 'General', weight: 45.0, collectionTime: '09:00 AM', disposalStatus: 'Pending' },
];

const WasteManagement: React.FC = () => {
    const [showAIPanel, setShowAIPanel] = useState(false);
    const { data: aiResult, loading: aiLoading, error: aiError, execute: executeAI } = useWasteManagement();

    const runAIAnalysis = () => {
        const input: WasteManagementInput = {
            wasteRecords: MOCK_WASTE,
            historicalGeneration: [
                { date: '2024-03-01', type: 'Infectious', weight: 15.2, department: 'ICU' },
                { date: '2024-03-01', type: 'Sharps', weight: 4.1, department: 'Emergency' },
                { date: '2024-03-02', type: 'General', weight: 52.0, department: 'Ward 3' },
                { date: '2024-03-03', type: 'Chemical', weight: 2.5, department: 'Laboratory' },
                { date: '2024-03-04', type: 'Infectious', weight: 18.3, department: 'Surgery' },
                { date: '2024-03-05', type: 'Sharps', weight: 5.2, department: 'ICU' },
            ],
            collectionSchedule: [
                { day: 'Monday', time: '08:00', type: 'Infectious' },
                { day: 'Wednesday', time: '08:00', type: 'Sharps' },
                { day: 'Daily', time: '09:00', type: 'General' },
            ],
            storageCapacity: [
                { type: 'Infectious', currentLevel: 75, maxCapacity: 100 },
                { type: 'Sharps', currentLevel: 40, maxCapacity: 50 },
                { type: 'General', currentLevel: 120, maxCapacity: 200 },
                { type: 'Chemical', currentLevel: 15, maxCapacity: 50 },
            ]
        };
        executeAI(input);
        setShowAIPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Bio-Medical Waste</h1>
                  <p className="text-slate-500">Track waste disposal categories and weight.</p>
                </div>
                <button 
                    onClick={runAIAnalysis}
                    disabled={aiLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    <Brain size={16} />
                    {aiLoading ? 'Analyzing...' : 'AI Waste Analysis'}
                </button>
            </div>

            {/* AI Waste Management Panel */}
            {showAIPanel && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-lg overflow-hidden">
                    <div className="p-4 bg-green-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Waste Management Analysis</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white">✕</button>
                    </div>
                    
                    {aiLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-green-600" size={32} />
                            <p className="text-slate-600">Analyzing waste generation patterns and optimizing collection schedules...</p>
                        </div>
                    )}
                    
                    {aiError && (
                        <div className="p-4 bg-red-50 text-red-700">
                            <p>Error: {aiError}</p>
                        </div>
                    )}
                    
                    {aiResult && (
                        <div className="p-6 space-y-6">
                            {/* Generation Predictions */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <TrendingUp size={18} />
                                    Waste Generation Predictions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {aiResult.generationPredictions?.map((pred, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-slate-900">{pred.wasteType}</p>
                                                <span className={`flex items-center gap-1 text-xs ${
                                                    pred.trend === 'increasing' ? 'text-red-600' :
                                                    pred.trend === 'decreasing' ? 'text-green-600' :
                                                    'text-blue-600'
                                                }`}>
                                                    {pred.trend === 'increasing' ? <TrendingUp size={12} /> :
                                                     pred.trend === 'decreasing' ? <TrendingDown size={12} /> :
                                                     <span>→</span>}
                                                    {pred.trend}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-600">{pred.predictedWeight} kg</p>
                                            <p className="text-xs text-slate-500">{pred.timeframe}</p>
                                            <div className="mt-2 pt-2 border-t border-slate-100">
                                                <p className="text-xs text-slate-500">By Department:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {pred.departmentBreakdown?.slice(0, 3).map((dept, i) => (
                                                        <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">
                                                            {dept.department}: {dept.percentage}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Collection Optimization */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Clock size={18} />
                                    Collection Schedule Optimization
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-green-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Waste Type</th>
                                                <th className="px-4 py-2 text-left">Recommended Schedule</th>
                                                <th className="px-4 py-2 text-left">Frequency</th>
                                                <th className="px-4 py-2 text-left">Cost Savings</th>
                                                <th className="px-4 py-2 text-left">Reasoning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-100">
                                            {aiResult.collectionOptimization?.map((opt, idx) => (
                                                <tr key={idx} className="bg-white">
                                                    <td className="px-4 py-3 font-medium">{opt.wasteType}</td>
                                                    <td className="px-4 py-3 text-green-600 font-medium">
                                                        {opt.recommendedSchedule.day} at {opt.recommendedSchedule.time}
                                                    </td>
                                                    <td className="px-4 py-3">{opt.recommendedSchedule.frequency}</td>
                                                    <td className="px-4 py-3 text-green-600 font-medium">${opt.costSavings}</td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">{opt.reasoning}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Compliance Alerts */}
                            {aiResult.complianceAlerts && aiResult.complianceAlerts.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Compliance Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {aiResult.complianceAlerts.map((alert, idx) => (
                                            <div key={idx} className={`p-4 rounded-lg border ${
                                                alert.severity === 'Critical' ? 'bg-red-50 border-red-200' :
                                                alert.severity === 'Warning' ? 'bg-orange-50 border-orange-200' :
                                                'bg-blue-50 border-blue-200'
                                            }`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                alert.severity === 'Critical' ? 'bg-red-600 text-white' :
                                                                alert.severity === 'Warning' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {alert.severity}
                                                            </span>
                                                            <span className="font-medium text-slate-900">{alert.type}</span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Location: {alert.location}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500">Deadline</p>
                                                        <p className="text-sm font-medium text-slate-700">{alert.deadline}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-slate-200">
                                                    <p className="text-sm"><span className="font-medium">Required Action:</span> {alert.requiredAction}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cost Analysis */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <DollarSign size={18} />
                                    Cost Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.costAnalysis?.map((cost, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-green-200">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Current Cost:</span>
                                                    <span className="text-red-600 font-medium">${cost.currentCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Optimized Cost:</span>
                                                    <span className="text-green-600 font-medium">${cost.optimizedCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-lg pt-2 border-t border-slate-100">
                                                    <span className="text-slate-700">Savings:</span>
                                                    <span className="text-green-700">${cost.savings.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-2 border-t border-slate-100">
                                                <p className="text-xs text-slate-500">{cost.recommendations?.[0]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Environmental Impact */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Leaf size={18} />
                                    Environmental Impact
                                </h4>
                                <div className="bg-white p-6 rounded-lg border border-green-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <p className="text-sm text-slate-500">Carbon Footprint</p>
                                            <p className="text-3xl font-bold text-slate-900">{aiResult.environmentalImpact?.carbonFootprint}</p>
                                            <p className="text-xs text-slate-500">kg CO2 equivalent</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-slate-500">Recycling Rate</p>
                                            <p className="text-3xl font-bold text-green-600">{(aiResult.environmentalImpact?.recyclingRate * 100).toFixed(0)}%</p>
                                            <p className="text-xs text-slate-500">of recyclable waste</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-2">Improvement Suggestions</p>
                                            <ul className="text-sm space-y-1">
                                                {aiResult.environmentalImpact?.improvementSuggestions?.map((suggestion, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Leaf size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-slate-600">{suggestion}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_WASTE.map(record => (
                    <div key={record.id} className={`p-6 rounded-2xl border-l-4 shadow-sm bg-white ${
                        record.type === 'Infectious' ? 'border-l-yellow-400' :
                        record.type === 'Sharps' ? 'border-l-red-500' :
                        'border-l-blue-400'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-800 text-lg">{record.type} Waste</h3>
                            <Trash2 size={20} className="text-slate-400" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Scale size={16} className="text-slate-500" />
                            <span className="font-bold text-2xl text-slate-900">{record.weight} kg</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{record.collectionTime}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                record.disposalStatus === 'Incinerated' ? 'bg-red-100 text-red-700' :
                                record.disposalStatus === 'Collected' ? 'bg-green-100 text-green-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                                {record.disposalStatus}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WasteManagement;
