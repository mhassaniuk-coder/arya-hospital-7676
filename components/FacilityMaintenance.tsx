import React, { useState } from 'react';
import { FacilityJob } from '../types';
import { Hammer, Wrench, Thermometer, Brain, Zap, TrendingDown, Clock, AlertTriangle, RefreshCw, Lightbulb, DollarSign } from 'lucide-react';
import { useEquipmentMaintenancePredictor, useEnergyManagement } from '../hooks/useAI';
import { EquipmentMaintenanceInput, EnergyManagementInput } from '../types';

const MOCK_JOBS: FacilityJob[] = [
    { id: '1', issue: 'AC Not Cooling', location: 'Ward 3', type: 'HVAC', status: 'Fixing', technician: 'Mike T.' },
    { id: '2', issue: 'Flickering Light', location: 'Lobby', type: 'Electrical', status: 'Reported', technician: 'Pending' },
];

const FacilityMaintenance: React.FC = () => {
    const [showEnergyPanel, setShowEnergyPanel] = useState(false);
    const [showMaintenancePanel, setShowMaintenancePanel] = useState(false);

    // AI Equipment Maintenance Predictor
    const { data: maintenancePrediction, loading: maintenanceLoading, error: maintenanceError, execute: executeMaintenance } = useEquipmentMaintenancePredictor();
    
    // AI Energy Management
    const { data: energyData, loading: energyLoading, error: energyError, execute: executeEnergy } = useEnergyManagement();

    const runMaintenancePrediction = () => {
        const input: EquipmentMaintenanceInput = {
            equipment: [
                { id: 'HVAC-001', name: 'Main HVAC Unit', type: 'HVAC', serialNumber: 'SN-HVAC001', status: 'Operational', lastService: '2024-01-15', usageHours: 8760, age: 5, criticality: 'Critical' },
                { id: 'ELEC-001', name: 'Main Electrical Panel', type: 'Electrical', serialNumber: 'SN-ELEC001', status: 'Operational', lastService: '2024-02-01', usageHours: 8760, age: 10, criticality: 'Critical' },
                { id: 'PLMB-001', name: 'Water Heater System', type: 'Plumbing', serialNumber: 'SN-PLMB001', status: 'Maintenance', lastService: '2023-11-20', usageHours: 4380, age: 7, criticality: 'High' },
            ],
            maintenanceHistory: [
                { equipmentId: 'HVAC-001', date: '2024-01-15', type: 'Preventive', cost: 2500, downtime: 8, issues: ['Filter replacement', 'Coil cleaning'] },
                { equipmentId: 'ELEC-001', date: '2024-02-01', type: 'Preventive', cost: 1500, downtime: 4, issues: ['Breaker inspection'] },
            ],
            usagePatterns: [
                { equipmentId: 'HVAC-001', dailyUsage: [24, 24, 24, 24, 24, 24, 24], peakUsageHours: ['14:00', '15:00', '16:00'] },
                { equipmentId: 'ELEC-001', dailyUsage: [24, 24, 24, 24, 24, 24, 24], peakUsageHours: ['09:00', '10:00', '14:00'] },
            ]
        };
        executeMaintenance(input);
        setShowMaintenancePanel(true);
    };

    const runEnergyAnalysis = () => {
        const input: EnergyManagementInput = {
            currentUsage: [
                { area: 'HVAC', consumption: 18000, cost: 2700 },
                { area: 'Lighting', consumption: 9000, cost: 1350 },
                { area: 'Medical Equipment', consumption: 12000, cost: 1800 },
                { area: 'Other', consumption: 6000, cost: 900 }
            ],
            historicalUsage: [
                { date: '2024-01-15', hour: 10, consumption: 2100, temperature: 68 },
                { date: '2024-01-15', hour: 14, consumption: 2400, temperature: 72 },
                { date: '2024-01-15', hour: 18, consumption: 2200, temperature: 70 },
                { date: '2024-01-16', hour: 10, consumption: 2050, temperature: 67 },
                { date: '2024-01-16', hour: 14, consumption: 2350, temperature: 71 },
            ],
            equipment: [
                { name: 'Main HVAC Unit', type: 'HVAC', powerConsumption: 150, operationalHours: '24/7' },
                { name: 'MRI Scanner', type: 'Medical', powerConsumption: 80, operationalHours: '08:00-18:00' },
                { name: 'Lighting System', type: 'Electrical', powerConsumption: 50, operationalHours: '24/7' },
            ],
            peakHours: ['10:00', '14:00', '18:00'],
            renewableSources: [
                { type: 'Solar', capacity: 100, currentOutput: 45 },
                { type: 'Generator', capacity: 500, currentOutput: 0 }
            ]
        };
        executeEnergy(input);
        setShowEnergyPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Facility Maintenance</h1>
                  <p className="text-slate-500">Building repairs and infrastructure.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={runEnergyAnalysis}
                        disabled={energyLoading}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Zap size={16} />
                        {energyLoading ? 'Analyzing...' : 'AI Energy Analysis'}
                    </button>
                    <button 
                        onClick={runMaintenancePrediction}
                        disabled={maintenanceLoading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <Brain size={16} />
                        {maintenanceLoading ? 'Analyzing...' : 'AI Maintenance Prediction'}
                    </button>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-md">
                        Report Issue
                    </button>
                </div>
            </div>

            {/* AI Energy Management Panel */}
            {showEnergyPanel && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-lg overflow-hidden">
                    <div className="p-4 bg-amber-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Zap size={20} />
                            <h3 className="font-bold">AI Energy Management</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowEnergyPanel(false)} className="text-white/80 hover:text-white">✕</button>
                    </div>
                    
                    {energyLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-amber-600" size={32} />
                            <p className="text-slate-600">Analyzing energy consumption patterns...</p>
                        </div>
                    )}
                    
                    {energyError && (
                        <div className="p-4 bg-red-50 text-red-700">
                            <p>Error: {energyError}</p>
                        </div>
                    )}
                    
                    {energyData && (
                        <div className="p-6 space-y-6">
                            {/* Usage Optimization */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Lightbulb size={18} />
                                    Usage Optimization
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {energyData.usageOptimization?.map((opt, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-amber-200">
                                            <p className="font-medium text-slate-900">{opt.area}</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Current:</span>
                                                    <span>{opt.currentUsage} kWh</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Optimized:</span>
                                                    <span className="text-green-600">{opt.optimizedUsage} kWh</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-amber-700">
                                                    <span>Savings:</span>
                                                    <span>{opt.savings}%</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">{opt.recommendations?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Peak Predictions */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <TrendingDown size={18} />
                                    Peak Usage Predictions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {energyData.peakPrediction?.map((peak, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-amber-200">
                                            <p className="font-medium text-slate-900">{peak.date}</p>
                                            <p className="text-2xl font-bold text-amber-600 mt-1">{peak.expectedDemand} kW</p>
                                            <div className="mt-2">
                                                <p className="text-xs text-slate-500">Peak Hours:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {peak.predictedPeakHours?.map((hour, i) => (
                                                        <span key={i} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">{hour}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 mt-2">{peak.suggestedActions?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Savings */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <DollarSign size={18} />
                                    Cost Savings Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {energyData.costSavings?.map((saving, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-amber-200">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Current Cost:</span>
                                                    <span className="text-red-600">${saving.currentCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Optimized Cost:</span>
                                                    <span className="text-green-600">${saving.optimizedCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between font-medium">
                                                    <span className="text-slate-700">Monthly Savings:</span>
                                                    <span className="text-green-700">${saving.monthlySavings.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Yearly Projection:</span>
                                                    <span className="text-green-700 font-medium">${saving.yearlyProjection.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">{saving.implementationSteps?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Equipment Efficiency */}
                            {energyData.equipmentEfficiency && (
                                <div>
                                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                        <Wrench size={18} />
                                        Equipment Efficiency
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-amber-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium text-slate-700">Equipment</th>
                                                    <th className="px-4 py-3 text-left font-medium text-slate-700">Efficiency</th>
                                                    <th className="px-4 py-3 text-left font-medium text-slate-700">Recommendation</th>
                                                    <th className="px-4 py-3 text-left font-medium text-slate-700">Potential Savings</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-100">
                                                {energyData.equipmentEfficiency.map((eq, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 text-slate-900">{eq.equipment}</td>
                                                        <td className="px-4 py-3">{(eq.efficiency * 100).toFixed(0)}%</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                eq.recommendation === 'Replace' ? 'bg-red-100 text-red-700' :
                                                                eq.recommendation === 'Upgrade' ? 'bg-orange-100 text-orange-700' :
                                                                eq.recommendation === 'Optimize' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-green-100 text-green-700'
                                                            }`}>
                                                                {eq.recommendation}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-green-600 font-medium">${eq.potentialSavings.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Alerts */}
                            {energyData.alerts && energyData.alerts.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Energy Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {energyData.alerts.map((alert, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded border border-red-200 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-red-800">{alert.type}</p>
                                                    <p className="text-sm text-red-700">{alert.message}</p>
                                                    <p className="text-xs text-slate-500">Area: {alert.affectedArea}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    alert.severity === 'Critical' ? 'bg-red-600 text-white' :
                                                    alert.severity === 'Warning' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* AI Maintenance Prediction Panel */}
            {showMaintenancePanel && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-lg overflow-hidden">
                    <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Facility Maintenance Prediction</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowMaintenancePanel(false)} className="text-white/80 hover:text-white">✕</button>
                    </div>
                    
                    {maintenanceLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
                            <p className="text-slate-600">Analyzing facility equipment...</p>
                        </div>
                    )}
                    
                    {maintenanceError && (
                        <div className="p-4 bg-red-50 text-red-700">
                            <p>Error: {maintenanceError}</p>
                        </div>
                    )}
                    
                    {maintenancePrediction && (
                        <div className="p-6 space-y-6">
                            {/* Critical Alerts */}
                            {maintenancePrediction.criticalAlerts && maintenancePrediction.criticalAlerts.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Critical Maintenance Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {maintenancePrediction.criticalAlerts.map((alert, idx) => (
                                            <div key={idx} className="bg-white p-3 rounded border border-red-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-medium text-red-800">{alert.equipmentId}</span>
                                                        <p className="text-sm text-red-700">{alert.alert}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        alert.urgency === 'Immediate' ? 'bg-red-600 text-white' :
                                                        alert.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {alert.urgency}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mt-1">Action: {alert.action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Predictive Maintenance */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Clock size={18} />
                                    Predictive Maintenance Schedule
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {maintenancePrediction.predictiveMaintenance?.map((pred, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-slate-900">{pred.equipmentName}</p>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    pred.priority === 'Immediate' ? 'bg-red-100 text-red-700' :
                                                    pred.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                    pred.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {pred.priority}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Failure Risk:</span>
                                                    <span className="font-medium">{(pred.failureRisk * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Recommended Service:</span>
                                                    <span className="font-medium text-purple-600">{pred.recommendedMaintenanceDate}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Est. Cost:</span>
                                                    <span className="font-medium">${pred.estimatedCost.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2 italic">{pred.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Risk Assessment */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <AlertTriangle size={18} />
                                    Risk Assessment
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Equipment</th>
                                                <th className="px-4 py-2 text-left">Risk Level</th>
                                                <th className="px-4 py-2 text-left">Impact</th>
                                                <th className="px-4 py-2 text-left">Mitigation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {maintenancePrediction.riskAssessment?.map((risk, idx) => (
                                                <tr key={idx} className="bg-white">
                                                    <td className="px-4 py-3 font-medium">{risk.equipmentName}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            risk.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                                                            risk.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                                                            risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {risk.riskLevel}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600">{risk.impactOnOperations}</td>
                                                    <td className="px-4 py-3">
                                                        <ul className="text-xs text-slate-600 list-disc list-inside">
                                                            {risk.mitigationSteps.slice(0, 2).map((step, i) => (
                                                                <li key={i}>{step}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Issue</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Technician</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_JOBS.map(job => (
                            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{job.issue}</td>
                                <td className="px-6 py-4 text-slate-600">{job.location}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1 text-slate-600 text-sm">
                                        {job.type === 'HVAC' ? <Thermometer size={14} /> : <Wrench size={14} />}
                                        {job.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{job.technician}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'Reported' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {job.status}
                                     </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacilityMaintenance;
