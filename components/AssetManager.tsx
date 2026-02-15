import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, AlertTriangle, Search, Filter, Brain, AlertOctagon, TrendingUp, DollarSign, Clock, Zap, RefreshCw, Settings } from 'lucide-react';
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
  const [newAsset, setNewAsset] = useState({ name: '', category: '', location: '' });
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Track hospital equipment and maintenance schedules</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={runAIMaintenancePrediction}
            disabled={aiLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            <Brain size={18} />
            {aiLoading ? 'Analyzing...' : 'AI Predict Maintenance'}
          </button>
          <button 
            onClick={() => setShowAddAsset(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
          >
            <Plus size={18} />
            Register New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.length}</span>
          </div>
          <p className="text-sm text-slate-500">Total Assets</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Operational').length}</span>
          </div>
          <p className="text-sm text-slate-500">Operational</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Maintenance').length}</span>
          </div>
          <p className="text-sm text-slate-500">In Maintenance</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Broken').length}</span>
          </div>
          <p className="text-sm text-slate-500">Broken / Retired</p>
        </div>
      </div>

      {/* AI Maintenance Prediction Panel */}
      {showAIPanel && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-lg overflow-hidden">
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain size={20} />
              <h3 className="font-bold">AI Equipment Maintenance Prediction</h3>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          
          {aiLoading && (
            <div className="p-8 text-center">
              <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
              <p className="text-slate-600">Analyzing equipment data and predicting maintenance needs...</p>
            </div>
          )}
          
          {aiError && (
            <div className="p-4 bg-red-50 text-red-700">
              <p>Error: {aiError}</p>
            </div>
          )}
          
          {aiPrediction && (
            <div className="p-6 space-y-6">
              {/* Critical Alerts */}
              {aiPrediction.criticalAlerts && aiPrediction.criticalAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 flex items-center gap-2 mb-3">
                    <AlertOctagon size={18} />
                    Critical Alerts
                  </h4>
                  <div className="space-y-2">
                    {aiPrediction.criticalAlerts.map((alert, idx) => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiPrediction.predictiveMaintenance?.slice(0, 4).map((pred, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-slate-900">{pred.equipmentName}</p>
                          <p className="text-xs text-slate-500">{pred.equipmentId}</p>
                        </div>
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
                          <span className="text-slate-500">Predicted Failure:</span>
                          <span className="font-medium">{pred.predictedFailureDate}</span>
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
                      {aiPrediction.riskAssessment?.map((risk, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="px-4 py-3">
                            <p className="font-medium">{risk.equipmentName}</p>
                            <p className="text-xs text-slate-500">{risk.equipmentId}</p>
                          </td>
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

              {/* Cost Optimization */}
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <DollarSign size={18} />
                  Cost Optimization Opportunities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiPrediction.costOptimization?.slice(0, 3).map((cost, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="font-medium text-slate-900 mb-2">{cost.equipmentId}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Cost:</span>
                          <span className="text-red-600">${cost.currentMaintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Optimized Cost:</span>
                          <span className="text-green-600">${cost.optimizedMaintenanceCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700">Savings:</span>
                          <span className="text-green-700">${cost.savings.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500">{cost.recommendations[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Schedule */}
              <div>
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                  <Settings size={18} />
                  Optimized Maintenance Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {aiPrediction.maintenanceSchedule?.map((schedule, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="font-medium text-purple-600">{schedule.date}</p>
                      <p className="text-xs text-slate-500 mb-2">{schedule.type} • {schedule.estimatedDuration}h</p>
                      <div className="space-y-1">
                        {schedule.equipment.map((eq, i) => (
                          <span key={i} className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded mr-1">
                            {eq}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-600">
                <Filter size={18} /> Filter
            </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Asset ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Location</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Last Service</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600 text-sm">{asset.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{asset.name}</td>
                <td className="px-6 py-4 text-slate-600">{asset.category}</td>
                <td className="px-6 py-4 text-slate-600">{asset.location}</td>
                <td className="px-6 py-4 text-slate-600">{asset.lastMaintenance}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${asset.status === 'Operational' ? 'bg-green-100 text-green-700' : 
                      asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Register New Asset</h3>
              <button onClick={() => setShowAddAsset(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.name}
                  onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.category}
                  onChange={e => setNewAsset({...newAsset, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option>Medical Equipment</option>
                  <option>Electronics</option>
                  <option>Vehicle</option>
                  <option>Furniture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.location}
                  onChange={e => setNewAsset({...newAsset, location: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
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
