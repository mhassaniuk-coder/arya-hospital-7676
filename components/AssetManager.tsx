import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, AlertTriangle, Search, Filter, Brain, AlertOctagon, TrendingUp, DollarSign, Clock, Zap, RefreshCw, Settings, Edit, Trash2, XCircle, Save } from 'lucide-react';
import { useEquipmentMaintenancePredictor } from '../hooks/useAI';
import { EquipmentMaintenanceInput } from '../types';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'Operational' | 'Maintenance' | 'Broken' | 'Retired';
  location: string;
  purchaseDate: string;
  lastMaintenance: string;
}

const AssetManager: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'AST-001', name: 'MRI Scanner X200', category: 'Medical Equipment', status: 'Operational', location: 'Radiology Room 1', purchaseDate: '2022-06-15', lastMaintenance: '2024-02-10' },
    { id: 'AST-002', name: 'Patient Monitor', category: 'Electronics', status: 'Maintenance', location: 'ICU Bed 4', purchaseDate: '2023-01-20', lastMaintenance: '2024-03-05' },
    { id: 'AST-003', name: 'Ambulance Van 3', category: 'Vehicle', status: 'Operational', location: 'Parking Zone B', purchaseDate: '2021-11-05', lastMaintenance: '2024-01-15' },
    { id: 'AST-004', name: 'X-Ray Machine', category: 'Medical Equipment', status: 'Broken', location: 'ER Triage', purchaseDate: '2020-03-10', lastMaintenance: '2023-12-01' },
  ]);

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', location: '' });
  const [manageForm, setManageForm] = useState({ status: 'Operational' as Asset['status'], location: '', lastMaintenance: '' });
  const [showAIPanel, setShowAIPanel] = useState(false);

  // AI Equipment Maintenance Predictor
  const { data: aiPrediction, loading: aiLoading, error: aiError, execute: executeAI } = useEquipmentMaintenancePredictor();

  const runAIMaintenancePrediction = () => {
    const input: EquipmentMaintenanceInput = {
      equipment: assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.category,
        serialNumber: `SN-${a.id}`,
        status: a.status === 'Retired' ? 'Broken' : a.status,
        lastService: a.lastMaintenance,
        usageHours: Math.floor(Math.random() * 5000) + 500,
        age: new Date().getFullYear() - new Date(a.purchaseDate).getFullYear(),
        criticality: a.category === 'Medical Equipment' ? 'Critical' : a.category === 'Vehicle' ? 'High' : 'Medium'
      })),
      maintenanceHistory: assets.map(a => ({
        equipmentId: a.id,
        date: a.lastMaintenance,
        type: 'Preventive' as const,
        cost: Math.floor(Math.random() * 5000) + 500,
        downtime: Math.floor(Math.random() * 24) + 1,
        issues: ['Routine check completed']
      })),
      usagePatterns: assets.map(a => ({
        equipmentId: a.id,
        dailyUsage: [8, 7, 9, 8, 6, 4, 3],
        peakUsageHours: ['10:00', '14:00', '16:00']
      }))
    };
    executeAI(input);
    setShowAIPanel(true);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      id: `AST-00${assets.length + 1}`,
      name: newAsset.name,
      category: newAsset.category,
      status: 'Operational',
      location: newAsset.location,
      purchaseDate: new Date().toISOString().split('T')[0],
      lastMaintenance: 'N/A'
    };
    setAssets([asset, ...assets]);
    setShowAddAsset(false);
    setNewAsset({ name: '', category: '', location: '' });
  };

  const handleOpenManage = (asset: Asset) => {
    setSelectedAsset(asset);
    setManageForm({ status: asset.status, location: asset.location, lastMaintenance: asset.lastMaintenance });
    setShowManageModal(true);
  };

  const handleUpdateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, ...manageForm } : a));
    setShowManageModal(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to retire this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-success-light text-success-dark';
      case 'Maintenance': return 'bg-warning-light text-warning-dark';
      case 'Broken': return 'bg-danger-light text-danger-dark';
      case 'Retired': return 'bg-background-tertiary text-foreground-muted';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Immediate': return 'bg-danger text-white';
      case 'High': return 'bg-warning-light text-warning-dark';
      case 'Medium': return 'bg-info-light text-info-dark';
      default: return 'bg-success-light text-success-dark';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-danger-light text-danger-dark';
      case 'High': return 'bg-warning-light text-warning-dark';
      case 'Medium': return 'bg-info-light text-info-dark';
      default: return 'bg-success-light text-success-dark';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Asset Management</h1>
          <p className="text-foreground-secondary">Track hospital equipment and maintenance schedules</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={runAIMaintenancePrediction}
            disabled={aiLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50 theme-transition"
          >
            <Brain size={18} />
            {aiLoading ? 'Analyzing...' : 'AI Predict Maintenance'}
          </button>
          <button
            onClick={() => setShowAddAsset(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg theme-transition"
          >
            <Plus size={18} />
            Register New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-info-light text-info-dark rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-foreground-primary">{assets.length}</span>
          </div>
          <p className="text-sm text-foreground-muted">Total Assets</p>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-success-light text-success-dark rounded-lg"><CheckCircle size={20} /></div>
            <span className="text-2xl font-bold text-foreground-primary">{assets.filter(a => a.status === 'Operational').length}</span>
          </div>
          <p className="text-sm text-foreground-muted">Operational</p>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-warning-light text-warning-dark rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-foreground-primary">{assets.filter(a => a.status === 'Maintenance').length}</span>
          </div>
          <p className="text-sm text-foreground-muted">In Maintenance</p>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-danger-light text-danger-dark rounded-lg"><AlertTriangle size={20} /></div>
            <span className="text-2xl font-bold text-foreground-primary">{assets.filter(a => a.status === 'Broken').length}</span>
          </div>
          <p className="text-sm text-foreground-muted">Broken / Retired</p>
        </div>
      </div>

      {/* AI Maintenance Prediction Panel */}
      {showAIPanel && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-lg overflow-hidden theme-transition">
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain size={20} />
              <h3 className="font-bold">AI Equipment Maintenance Prediction</h3>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white theme-transition">X</button>
          </div>

          {aiLoading && (
            <div className="p-8 text-center">
              <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
              <p className="text-foreground-secondary">Analyzing equipment data and predicting maintenance needs...</p>
            </div>
          )}

          {aiError && (
            <div className="p-4 bg-danger-light text-danger-dark">
              <p>Error: {aiError}</p>
            </div>
          )}

          {aiPrediction && (
            <div className="p-6 space-y-6">
              {/* Critical Alerts */}
              {aiPrediction.criticalAlerts && aiPrediction.criticalAlerts.length > 0 && (
                <div className="bg-danger-light border border-danger-dark/30 rounded-lg p-4">
                  <h4 className="font-semibold text-danger-dark flex items-center gap-2 mb-3">
                    <AlertOctagon size={18} />
                    Critical Alerts
                  </h4>
                  <div className="space-y-2">
                    {aiPrediction.criticalAlerts.map((alert, idx) => (
                      <div key={idx} className="bg-background-elevated p-3 rounded border border-danger-dark/30">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-danger-dark">{alert.equipmentId}</span>
                            <p className="text-sm text-danger-dark/80">{alert.alert}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${alert.urgency === 'Immediate' ? 'bg-danger text-white' :
                            alert.urgency === 'Urgent' ? 'bg-warning-light text-warning-dark' :
                              'bg-info-light text-info-dark'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiPrediction.predictiveMaintenance?.slice(0, 4).map((pred, idx) => (
                    <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-foreground-primary">{pred.equipmentName}</p>
                          <p className="text-xs text-foreground-muted">{pred.equipmentId}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(pred.priority)}`}>
                          {pred.priority}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Failure Risk:</span>
                          <span className="font-medium text-foreground-primary">{(pred.failureRisk * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Predicted Failure:</span>
                          <span className="font-medium text-foreground-primary">{pred.predictedFailureDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Recommended Service:</span>
                          <span className="font-medium text-accent">{pred.recommendedMaintenanceDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Est. Cost:</span>
                          <span className="font-medium text-foreground-primary">${pred.estimatedCost.toLocaleString()}</span>
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
                      {aiPrediction.riskAssessment?.map((risk, idx) => (
                        <tr key={idx} className="bg-background-elevated">
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground-primary">{risk.equipmentName}</p>
                            <p className="text-xs text-foreground-muted">{risk.equipmentId}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk.riskLevel)}`}>
                              {risk.riskLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary">{risk.impactOnOperations}</td>
                          <td className="px-4 py-3">
                            <ul className="text-xs text-foreground-muted list-disc list-inside">
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

              {/* Cost Optimization */}
              <div>
                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                  <DollarSign size={18} />
                  Cost Optimization Opportunities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiPrediction.costOptimization?.slice(0, 3).map((cost, idx) => (
                    <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-border">
                      <p className="font-medium text-foreground-primary mb-2">{cost.equipmentId}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Current Cost:</span>
                          <span className="text-danger-dark">${cost.currentMaintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground-muted">Optimized Cost:</span>
                          <span className="text-success-dark">${cost.optimizedMaintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-foreground-secondary">Savings:</span>
                          <span className="text-success-dark">${cost.savings.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-border-muted">
                        <p className="text-xs text-foreground-muted">{cost.recommendations[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div>
                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                  <Settings size={18} />
                  Optimized Maintenance Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {aiPrediction.maintenanceSchedule?.map((schedule, idx) => (
                    <div key={idx} className="bg-background-elevated p-3 rounded-lg border border-border">
                      <p className="font-medium text-accent">{schedule.date}</p>
                      <p className="text-xs text-foreground-muted mb-2">{schedule.type} - {schedule.estimatedDuration}h</p>
                      <div className="space-y-1">
                        {schedule.equipment.map((eq, i) => (
                          <span key={i} className="inline-block bg-background-secondary text-foreground-secondary text-xs px-2 py-0.5 rounded mr-1">
                            {eq}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-foreground-muted mt-2">
                        Resources: {schedule.requiredResources.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-background-elevated rounded-xl border border-border shadow-sm overflow-hidden theme-transition">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
            <input type="text" placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent bg-background-primary text-foreground-primary theme-transition" />
          </div>
          <button className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:bg-background-secondary text-foreground-secondary transition-colors theme-transition">
            <Filter size={18} /> Filter
          </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-background-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Asset ID</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Name</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Category</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Location</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Last Service</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Status</th>
              <th className="px-6 py-4 font-semibold text-foreground-secondary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-background-secondary transition-colors theme-transition">
                <td className="px-6 py-4 font-mono text-foreground-muted text-sm">{asset.id}</td>
                <td className="px-6 py-4 font-medium text-foreground-primary">{asset.name}</td>
                <td className="px-6 py-4 text-foreground-secondary">{asset.category}</td>
                <td className="px-6 py-4 text-foreground-secondary">{asset.location}</td>
                <td className="px-6 py-4 text-foreground-secondary">{asset.lastMaintenance}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => handleOpenManage(asset)} className="p-2 text-foreground-muted hover:text-accent rounded-lg hover:bg-accent/10 transition-colors theme-transition" title="Manage Asset">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteAsset(asset.id)} className="p-2 text-foreground-muted hover:text-danger rounded-lg hover:bg-danger/10 transition-colors theme-transition" title="Retire Asset">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage Asset Modal */}
      {showManageModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowManageModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-md w-full shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-muted flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground-primary">Manage Asset</h3>
                <p className="text-sm text-foreground-muted">{selectedAsset.name}</p>
              </div>
              <button onClick={() => setShowManageModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary transition-colors theme-transition">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Status</label>
                <select
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  value={manageForm.status}
                  onChange={e => setManageForm({ ...manageForm, status: e.target.value as any })}
                >
                  <option value="Operational">Operational</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Broken">Broken</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  value={manageForm.location}
                  onChange={e => setManageForm({ ...manageForm, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Last Maintenance Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  value={manageForm.lastMaintenance}
                  onChange={e => setManageForm({ ...manageForm, lastMaintenance: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg flex items-center justify-center gap-2 theme-transition">
                <Save size={18} /> Update Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddAsset(false)}>
          <div className="bg-background-elevated rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-muted flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground-primary">Register New Asset</h3>
              <button onClick={() => setShowAddAsset(false)} className="text-foreground-muted hover:text-foreground-primary theme-transition">X</button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                  value={newAsset.name}
                  onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                  value={newAsset.category}
                  onChange={e => setNewAsset({ ...newAsset, category: e.target.value })}
                >
                  <option value="">Select Category...</option>
                  <option>Medical Equipment</option>
                  <option>Electronics</option>
                  <option>Vehicle</option>
                  <option>Furniture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Location</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition"
                  value={newAsset.location}
                  onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg theme-transition">
                Register Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager;
