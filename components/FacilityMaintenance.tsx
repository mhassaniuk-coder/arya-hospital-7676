import React, { useState } from 'react';
import { FacilityJob } from '../types';
import { Hammer, Wrench, Thermometer, Brain, Zap, TrendingDown, Clock, AlertTriangle, RefreshCw, Lightbulb, DollarSign, Plus, X, Search, CheckCircle, Settings } from 'lucide-react';
import { useEquipmentMaintenancePredictor, useEnergyManagement } from '../hooks/useAI';
import { EquipmentMaintenanceInput, EnergyManagementInput } from '../types';

const FacilityMaintenance: React.FC = () => {
    const [jobs, setJobs] = useState<FacilityJob[]>([
        { id: '1', issue: 'AC Not Cooling', location: 'Ward 3', type: 'HVAC', status: 'Fixing', technician: 'Mike T.' },
        { id: '2', issue: 'Flickering Light', location: 'Lobby', type: 'Electrical', status: 'Reported', technician: 'Pending' },
        { id: '3', issue: 'Leaking Faucet', location: 'Room 205-B', type: 'Plumbing', status: 'Resolved', technician: 'Sam W.' },
        { id: '4', issue: 'Broken Socket', location: 'ICU Corridor', type: 'Electrical', status: 'Reported', technician: 'Pending' },
        { id: '5', issue: 'Heating Malfunction', location: 'Emergency Dept', type: 'HVAC', status: 'Fixing', technician: 'Jake R.' },
    ]);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [assigningJobId, setAssigningJobId] = useState<string | null>(null);
    const [assignTechnician, setAssignTechnician] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Electrical' | 'Plumbing' | 'HVAC'>('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Reported' | 'Fixing' | 'Resolved'>('All');
    const [showEnergyPanel, setShowEnergyPanel] = useState(false);
    const [showMaintenancePanel, setShowMaintenancePanel] = useState(false);

    const [newJob, setNewJob] = useState<Partial<FacilityJob>>({
        issue: '',
        location: '',
        type: 'Electrical',
        technician: '',
    });

    // AI hooks
    const { data: maintenancePrediction, loading: maintenanceLoading, error: maintenanceError, execute: executeMaintenance } = useEquipmentMaintenancePredictor();
    const { data: energyData, loading: energyLoading, error: energyError, execute: executeEnergy } = useEnergyManagement();

    const handleReportIssue = () => {
        if (!newJob.issue || !newJob.location) return;
        const job: FacilityJob = {
            id: `FM-${Date.now().toString().slice(-4)}`,
            issue: newJob.issue,
            location: newJob.location,
            type: newJob.type as FacilityJob['type'],
            status: 'Reported',
            technician: newJob.technician || 'Pending',
        };
        setJobs([job, ...jobs]);
        setIsReportModalOpen(false);
        setNewJob({ issue: '', location: '', type: 'Electrical', technician: '' });
    };

    const updateJobStatus = (id: string, status: FacilityJob['status']) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    };

    const openAssignModal = (id: string) => {
        setAssigningJobId(id);
        setAssignTechnician('');
        setIsAssignModalOpen(true);
    };

    const handleAssignTechnician = () => {
        if (!assigningJobId || !assignTechnician) return;
        setJobs(jobs.map(j => j.id === assigningJobId ? { ...j, technician: assignTechnician, status: 'Fixing' } : j));
        setIsAssignModalOpen(false);
        setAssigningJobId(null);
        setAssignTechnician('');
    };

    const getNextStatus = (current: FacilityJob['status']): FacilityJob['status'] | null => {
        switch (current) {
            case 'Reported': return 'Fixing';
            case 'Fixing': return 'Resolved';
            default: return null;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'HVAC': return <Thermometer size={14} />;
            case 'Plumbing': return <Settings size={14} />;
            default: return <Wrench size={14} />;
        }
    };

    const filteredJobs = jobs.filter(j => {
        const matchesSearch = j.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            j.technician.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'All' || j.type === filterType;
        const matchesStatus = filterStatus === 'All' || j.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const stats = {
        total: jobs.length,
        reported: jobs.filter(j => j.status === 'Reported').length,
        fixing: jobs.filter(j => j.status === 'Fixing').length,
        resolved: jobs.filter(j => j.status === 'Resolved').length,
    };

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
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Facility Maintenance</h1>
                    <p className="text-foreground-secondary">Building repairs and infrastructure.</p>
                </div>
                <div className="flex gap-2 flex-wrap w-full md:w-auto">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-md flex items-center gap-2 transition-colors"
                    >
                        <Plus size={16} /> Report Issue
                    </button>
                    <button
                        onClick={runEnergyAnalysis}
                        disabled={energyLoading}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 shadow-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <Zap size={16} />
                        {energyLoading ? 'Analyzing...' : 'AI Energy'}
                    </button>
                    <button
                        onClick={runMaintenancePrediction}
                        disabled={maintenanceLoading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <Brain size={16} />
                        {maintenanceLoading ? 'Predicting...' : 'AI Predict'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning-light rounded-lg">
                            <Hammer className="text-warning-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.total}</p>
                            <p className="text-xs text-foreground-muted">Total Jobs</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-danger-light rounded-lg">
                            <AlertTriangle className="text-danger-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.reported}</p>
                            <p className="text-xs text-foreground-muted">Reported</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-info-light rounded-lg">
                            <Wrench className="text-info-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.fixing}</p>
                            <p className="text-xs text-foreground-muted">Fixing</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-light rounded-lg">
                            <CheckCircle className="text-success-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.resolved}</p>
                            <p className="text-xs text-foreground-muted">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Energy Management Panel */}
            {showEnergyPanel && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800 shadow-lg overflow-hidden animate-scale-up theme-transition">
                    <div className="p-4 bg-amber-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Zap size={20} />
                            <h3 className="font-bold">AI Energy Management</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowEnergyPanel(false)} className="text-white/80 hover:text-white theme-transition">✕</button>
                    </div>

                    {energyLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-amber-600 dark:text-amber-400" size={32} />
                            <p className="text-foreground-secondary">Analyzing energy consumption patterns...</p>
                        </div>
                    )}

                    {energyError && (
                        <div className="p-4 bg-danger-light text-danger-dark">
                            <p>Error: {energyError}</p>
                        </div>
                    )}

                    {energyData && (
                        <div className="p-6 space-y-6">
                            {/* Usage Optimization */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <Lightbulb size={18} />
                                    Usage Optimization
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {energyData.usageOptimization?.map((opt, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 theme-transition">
                                            <p className="font-medium text-foreground-primary">{opt.area}</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Current:</span>
                                                    <span className="text-foreground-secondary">{opt.currentUsage} kWh</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Optimized:</span>
                                                    <span className="text-success-dark">{opt.optimizedUsage} kWh</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-amber-700 dark:text-amber-400">
                                                    <span>Savings:</span>
                                                    <span>{opt.savings}%</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-foreground-muted mt-2">{opt.recommendations?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Peak Predictions */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <TrendingDown size={18} />
                                    Peak Usage Predictions
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {energyData.peakPrediction?.map((peak, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 theme-transition">
                                            <p className="font-medium text-foreground-primary">{peak.date}</p>
                                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{peak.expectedDemand} kW</p>
                                            <div className="mt-2">
                                                <p className="text-xs text-foreground-muted">Peak Hours:</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {peak.predictedPeakHours?.map((hour, i) => (
                                                        <span key={i} className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded">{hour}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground-secondary mt-2">{peak.suggestedActions?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Savings */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <DollarSign size={18} />
                                    Cost Savings Analysis
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {energyData.costSavings?.map((saving, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-amber-200 dark:border-amber-800/50 theme-transition">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Current Cost:</span>
                                                    <span className="text-danger-dark">${saving.currentCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Optimized Cost:</span>
                                                    <span className="text-success-dark">${saving.optimizedCost.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between font-medium">
                                                    <span className="text-foreground-secondary">Monthly Savings:</span>
                                                    <span className="text-success-dark">${saving.monthlySavings.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Yearly Projection:</span>
                                                    <span className="text-success-dark font-medium">${saving.yearlyProjection.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-foreground-muted mt-2">{saving.implementationSteps?.[0]}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Equipment Efficiency */}
                            {energyData.equipmentEfficiency && (
                                <div>
                                    <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                        <Wrench size={18} />
                                        Equipment Efficiency
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-amber-50 dark:bg-amber-900/20">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-medium text-foreground-secondary">Equipment</th>
                                                    <th className="px-4 py-3 text-left font-medium text-foreground-secondary">Efficiency</th>
                                                    <th className="px-4 py-3 text-left font-medium text-foreground-secondary">Recommendation</th>
                                                    <th className="px-4 py-3 text-left font-medium text-foreground-secondary">Potential Savings</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-amber-100 dark:divide-amber-900/30">
                                                {energyData.equipmentEfficiency.map((eq, idx) => (
                                                    <tr key={idx} className="bg-background-elevated theme-transition">
                                                        <td className="px-4 py-3 text-foreground-primary">{eq.equipment}</td>
                                                        <td className="px-4 py-3 text-foreground-secondary">{(eq.efficiency * 100).toFixed(0)}%</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${eq.recommendation === 'Replace' ? 'bg-danger-light text-danger-dark' :
                                                                eq.recommendation === 'Upgrade' ? 'bg-warning-light text-warning-dark' :
                                                                    eq.recommendation === 'Optimize' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                        'bg-success-light text-success-dark'
                                                                }`}>
                                                                {eq.recommendation}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-success-dark font-medium">${eq.potentialSavings.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Alerts */}
                            {energyData.alerts && energyData.alerts.length > 0 && (
                                <div className="bg-danger-light border border-red-200 dark:border-red-800 rounded-lg p-4 theme-transition">
                                    <h4 className="font-semibold text-danger-dark flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Energy Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {energyData.alerts.map((alert, idx) => (
                                            <div key={idx} className="bg-background-elevated p-3 rounded border border-red-200 dark:border-red-800/50 flex justify-between items-center theme-transition">
                                                <div>
                                                    <p className="font-medium text-danger-dark">{alert.type}</p>
                                                    <p className="text-sm text-danger-dark">{alert.message}</p>
                                                    <p className="text-xs text-foreground-muted">Area: {alert.affectedArea}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${alert.severity === 'Critical' ? 'bg-red-600 text-white' :
                                                    alert.severity === 'Warning' ? 'bg-warning-light text-warning-dark' :
                                                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
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
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden animate-scale-up theme-transition">
                    <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Facility Maintenance Prediction</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowMaintenancePanel(false)} className="text-white/80 hover:text-white theme-transition">✕</button>
                    </div>

                    {maintenanceLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600 dark:text-purple-400" size={32} />
                            <p className="text-foreground-secondary">Analyzing facility equipment...</p>
                        </div>
                    )}

                    {maintenanceError && (
                        <div className="p-4 bg-danger-light text-danger-dark">
                            <p>Error: {maintenanceError}</p>
                        </div>
                    )}

                    {maintenancePrediction && (
                        <div className="p-6 space-y-6">
                            {/* Critical Alerts */}
                            {maintenancePrediction.criticalAlerts && maintenancePrediction.criticalAlerts.length > 0 && (
                                <div className="bg-danger-light border border-red-200 dark:border-red-800 rounded-lg p-4 theme-transition">
                                    <h4 className="font-semibold text-danger-dark flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Critical Maintenance Alerts
                                    </h4>
                                    <div className="space-y-2">
                                        {maintenancePrediction.criticalAlerts.map((alert, idx) => (
                                            <div key={idx} className="bg-background-elevated p-3 rounded border border-red-200 dark:border-red-800/50 theme-transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="font-medium text-danger-dark">{alert.equipmentId}</span>
                                                        <p className="text-sm text-danger-dark">{alert.alert}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${alert.urgency === 'Immediate' ? 'bg-red-600 text-white' :
                                                        alert.urgency === 'Urgent' ? 'bg-warning-light text-warning-dark' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {alert.urgency}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground-secondary mt-1">Action: {alert.action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Predictive Maintenance */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <Clock size={18} />
                                    Predictive Maintenance Schedule
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {maintenancePrediction.predictiveMaintenance?.map((pred, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 theme-transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-foreground-primary">{pred.equipmentName}</p>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${pred.priority === 'Immediate' ? 'bg-danger-light text-danger-dark' :
                                                    pred.priority === 'High' ? 'bg-warning-light text-warning-dark' :
                                                        pred.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-success-light text-success-dark'
                                                    }`}>
                                                    {pred.priority}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Failure Risk:</span>
                                                    <span className="font-medium text-foreground-secondary">{(pred.failureRisk * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Recommended Service:</span>
                                                    <span className="font-medium text-purple-600 dark:text-purple-400">{pred.recommendedMaintenanceDate}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Est. Cost:</span>
                                                    <span className="font-medium text-foreground-secondary">${pred.estimatedCost.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-foreground-muted mt-2 italic">{pred.reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Risk Assessment */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <AlertTriangle size={18} />
                                    Risk Assessment
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-background-secondary">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Equipment</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Risk Level</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Impact</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Mitigation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {maintenancePrediction.riskAssessment?.map((risk, idx) => (
                                                <tr key={idx} className="bg-background-elevated theme-transition">
                                                    <td className="px-4 py-3 font-medium text-foreground-primary">{risk.equipmentName}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${risk.riskLevel === 'Critical' ? 'bg-danger-light text-danger-dark' :
                                                            risk.riskLevel === 'High' ? 'bg-warning-light text-warning-dark' :
                                                                risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                    'bg-success-light text-success-dark'
                                                            }`}>
                                                            {risk.riskLevel}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-foreground-secondary">{risk.impactOnOperations}</td>
                                                    <td className="px-4 py-3">
                                                        <ul className="text-xs text-foreground-secondary list-disc list-inside">
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

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search by issue, location, or technician..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-border bg-background-elevated text-foreground-primary rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm placeholder:text-foreground-muted theme-transition"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 border border-border bg-background-elevated text-foreground-primary rounded-lg text-sm theme-transition"
                >
                    <option value="All">All Types</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-border bg-background-elevated text-foreground-primary rounded-lg text-sm theme-transition"
                >
                    <option value="All">All Status</option>
                    <option value="Reported">Reported</option>
                    <option value="Fixing">Fixing</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            {/* Job Table */}
            <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                            <th className="px-6 py-4">Issue</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Technician</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredJobs.map(job => (
                            <tr key={job.id} className="hover:bg-background-secondary theme-transition">
                                <td className="px-6 py-4 font-medium text-foreground-primary">{job.issue}</td>
                                <td className="px-6 py-4 text-foreground-secondary">{job.location}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1 text-foreground-secondary text-sm">
                                        {getTypeIcon(job.type)}
                                        {job.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-foreground-secondary">
                                    {job.technician === 'Pending' ? (
                                        <button
                                            onClick={() => openAssignModal(job.id)}
                                            className="text-accent text-sm font-medium hover:underline"
                                        >
                                            + Assign
                                        </button>
                                    ) : job.technician}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'Reported' ? 'bg-danger-light text-danger-dark' :
                                        job.status === 'Fixing' ? 'bg-warning-light text-warning-dark' :
                                            'bg-success-light text-success-dark'
                                        }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {getNextStatus(job.status) ? (
                                        <button
                                            onClick={() => updateJobStatus(job.id, getNextStatus(job.status)!)}
                                            className="text-accent text-sm font-medium hover:underline"
                                        >
                                            {job.status === 'Reported' ? 'Start Fix' : 'Mark Resolved'}
                                        </button>
                                    ) : (
                                        <span className="text-success-dark text-sm font-medium flex items-center gap-1 justify-end">
                                            <CheckCircle size={14} /> Done
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredJobs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-foreground-muted">No maintenance jobs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Report Issue Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-elevated rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary">
                            <h2 className="text-xl font-bold text-foreground-primary">Report Maintenance Issue</h2>
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Issue Description</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-primary text-foreground-primary theme-transition"
                                    placeholder="e.g. AC Not Cooling, Leaking Pipe"
                                    value={newJob.issue}
                                    onChange={e => setNewJob({ ...newJob, issue: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-primary text-foreground-primary theme-transition"
                                    placeholder="e.g. Ward 3, Room 205-B"
                                    value={newJob.location}
                                    onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-primary text-foreground-primary theme-transition"
                                    value={newJob.type}
                                    onChange={e => setNewJob({ ...newJob, type: e.target.value as any })}
                                >
                                    <option value="Electrical">Electrical</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="HVAC">HVAC</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Assign Technician (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 bg-background-primary text-foreground-primary theme-transition"
                                    placeholder="Leave blank for Pending"
                                    value={newJob.technician}
                                    onChange={e => setNewJob({ ...newJob, technician: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReportIssue}
                                disabled={!newJob.issue || !newJob.location}
                                className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition shadow-lg shadow-orange-500/30"
                            >
                                Report Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Technician Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-elevated rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-border theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary">
                            <h2 className="text-lg font-bold text-foreground-primary">Assign Technician</h2>
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-foreground-secondary mb-1">Technician Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                                placeholder="Enter technician name"
                                value={assignTechnician}
                                onChange={e => setAssignTechnician(e.target.value)}
                            />
                        </div>
                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignTechnician}
                                disabled={!assignTechnician}
                                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition"
                            >
                                Assign & Start Fix
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilityMaintenance;
