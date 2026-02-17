import React, { useState, useEffect } from 'react';
import { Ambulance, AmbulanceDispatchResult } from '../types';
import {
  Truck, MapPin, Phone, ShieldAlert, Sparkles, Brain, Loader2,
  Navigation, Clock, AlertCircle, CheckCircle, Radio, Plus, X,
  Search, Filter, Settings, Fuel, Wrench, Calendar, Edit2, Trash2
} from 'lucide-react';
import { useData } from '../src/contexts/DataContext';
import { useAmbulanceDispatch } from '../hooks/useAI';

const AmbulanceManager: React.FC = () => {
  const { ambulances } = useData();
  const [localAmbulances, setLocalAmbulances] = useState<Ambulance[]>(ambulances);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiDispatchResult, setAiDispatchResult] = useState<AmbulanceDispatchResult | null>(null);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);

  // Forms
  const [emergencyForm, setEmergencyForm] = useState({
    location: '',
    emergencyType: '',
    severity: 'Serious' as 'Critical' | 'Serious' | 'Moderate' | 'Minor',
    patientCount: '1'
  });

  const [ambulanceForm, setAmbulanceForm] = useState<Partial<Ambulance>>({
    vehicleNumber: '',
    driverName: '',
    type: 'ALS',
    status: 'Available',
    location: 'Hospital Base',
    fuelLevel: 100,
    equipmentCheck: 'Passed'
  });

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dispatchResult, loading: dispatchLoading, execute: runDispatch } = useAmbulanceDispatch();

  // -- Handlers --

  const handleSaveAmbulance = () => {
    if (!ambulanceForm.vehicleNumber || !ambulanceForm.driverName) return;

    if (editingAmbulance) {
      // Update existing
      setLocalAmbulances(localAmbulances.map(amb =>
        amb.id === editingAmbulance.id ? { ...amb, ...ambulanceForm } as Ambulance : amb
      ));
    } else {
      // Create new
      const newAmbulance: Ambulance = {
        id: Math.random().toString(36).substr(2, 9),
        vehicleNumber: ambulanceForm.vehicleNumber,
        driverName: ambulanceForm.driverName,
        type: ambulanceForm.type as any,
        status: ambulanceForm.status as any,
        location: ambulanceForm.location || 'Hospital Base',
        fuelLevel: ambulanceForm.fuelLevel,
        equipmentCheck: ambulanceForm.equipmentCheck,
        lastServiceDate: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0]
      };
      setLocalAmbulances([...localAmbulances, newAmbulance]);
    }
    closeModal();
  };

  const handleDeleteAmbulance = (id: string) => {
    if (confirm('Are you sure you want to remove this ambulance from the fleet?')) {
      setLocalAmbulances(localAmbulances.filter(a => a.id !== id));
    }
  };

  const openRegisterModal = () => {
    setEditingAmbulance(null);
    setAmbulanceForm({
      vehicleNumber: '',
      driverName: '',
      type: 'ALS',
      status: 'Available',
      location: 'Hospital Base',
      fuelLevel: 100,
      equipmentCheck: 'Passed'
    });
    setIsRegisterModalOpen(true);
  };

  const openEditModal = (amb: Ambulance) => {
    setEditingAmbulance(amb);
    setAmbulanceForm({ ...amb });
    setIsRegisterModalOpen(true);
  };

  const closeModal = () => {
    setIsRegisterModalOpen(false);
    setEditingAmbulance(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-success-light text-success-dark border-green-200 dark:border-green-800';
      case 'On Route': return 'bg-warning-light text-warning-dark border-orange-200 dark:border-orange-800';
      case 'Maintenance': return 'bg-danger-light text-danger-dark border-red-200 dark:border-red-800';
      default: return 'bg-background-tertiary text-foreground-secondary border-border';
    }
  };

  // Run AI dispatch optimization
  const runAIDispatch = async () => {
    if (!emergencyForm.location || !emergencyForm.emergencyType) return;

    await runDispatch({
      emergency: {
        location: emergencyForm.location,
        emergencyType: emergencyForm.emergencyType,
        severity: emergencyForm.severity,
        patientCount: parseInt(emergencyForm.patientCount) || 1
      },
      availableAmbulances: localAmbulances.filter(a => a.status === 'Available'),
      hospitalCapacity: {
        emergencyBeds: 5,
        icuBeds: 2,
        operatingRooms: 3
      }
    });
  };

  // Update AI result when data changes
  useEffect(() => {
    if (dispatchResult) {
      setAiDispatchResult(dispatchResult);
      setShowAIPanel(true);
    }
  }, [dispatchResult]);

  const filteredAmbulances = localAmbulances.filter(amb =>
    amb.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    amb.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Ambulance Fleet & AI Dispatch</h1>
          <p className="text-foreground-secondary">AI-powered emergency response coordination and fleet management.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
            <input
              type="text"
              placeholder="Search fleet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border bg-background-primary text-foreground-primary rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm placeholder:text-foreground-muted theme-transition"
            />
          </div>
          <button
            onClick={openRegisterModal}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md flex items-center gap-2 theme-transition whitespace-nowrap"
          >
            <Plus size={18} /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Emergency Dispatch Form */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200 dark:border-red-800 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
            <ShieldAlert className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-300">Emergency Dispatch</h3>
            <p className="text-xs text-red-600 dark:text-red-400">AI-powered ambulance dispatch system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">Emergency Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border bg-background-primary text-foreground-primary rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm placeholder:text-foreground-muted theme-transition"
              placeholder="e.g., 123 Main Street"
              value={emergencyForm.location}
              onChange={e => setEmergencyForm({ ...emergencyForm, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">Emergency Type</label>
            <select
              className="w-full px-3 py-2 border border-border bg-background-primary text-foreground-primary rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm theme-transition"
              value={emergencyForm.emergencyType}
              onChange={e => setEmergencyForm({ ...emergencyForm, emergencyType: e.target.value })}
            >
              <option value="">Select type...</option>
              <option value="Cardiac Emergency">Cardiac Emergency</option>
              <option value="Trauma">Trauma</option>
              <option value="Respiratory Distress">Respiratory Distress</option>
              <option value="Stroke">Stroke</option>
              <option value="Accident">Accident</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-secondary mb-1">Severity</label>
            <select
              className="w-full px-3 py-2 border border-border bg-background-primary text-foreground-primary rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm theme-transition"
              value={emergencyForm.severity}
              onChange={e => setEmergencyForm({ ...emergencyForm, severity: e.target.value as any })}
            >
              <option value="Critical">Critical</option>
              <option value="Serious">Serious</option>
              <option value="Moderate">Moderate</option>
              <option value="Minor">Minor</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={runAIDispatch}
              disabled={!emergencyForm.location || !emergencyForm.emergencyType || dispatchLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 theme-transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/30"
            >
              {dispatchLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              AI Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* AI Dispatch Result Panel */}
      {showAIPanel && aiDispatchResult && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Brain className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-300">AI Dispatch Recommendation</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400">Optimized emergency response coordination</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 theme-transition" title="Close">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recommended Ambulance */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Truck size={16} className="text-teal-500" />
                Recommended Unit
              </h4>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                <p className="font-bold text-teal-800 dark:text-teal-300">{aiDispatchResult.recommendedAmbulance.vehicleNumber}</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">{aiDispatchResult.recommendedAmbulance.type} Unit</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">{aiDispatchResult.recommendedAmbulance.driverName}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock size={14} className="text-teal-500" />
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-400">ETA: {aiDispatchResult.recommendedAmbulance.eta} min</span>
                </div>
              </div>
            </div>

            {/* Route Recommendation */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Navigation size={16} className="text-blue-500" />
                Route
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">{aiDispatchResult.routeRecommendation.route}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Time:</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300 ml-1">{aiDispatchResult.routeRecommendation.estimatedTime} min</span>
                  </div>
                  <div>
                    <span className="text-blue-600 dark:text-blue-400">Distance:</span>
                    <span className="font-bold text-blue-800 dark:text-blue-300 ml-1">{aiDispatchResult.routeRecommendation.distance} km</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">{aiDispatchResult.routeRecommendation.trafficConditions}</p>
              </div>
            </div>

            {/* ETA Predictions */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                ETA Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-secondary">To Scene</span>
                  <span className="font-bold text-foreground-primary">{aiDispatchResult.etaPredictions.toScene} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-secondary">To Hospital</span>
                  <span className="font-bold text-foreground-primary">{aiDispatchResult.etaPredictions.toHospital} min</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border-muted">
                  <span className="text-sm font-medium text-foreground-secondary">Total</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{aiDispatchResult.etaPredictions.total} min</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="flex-1 bg-background-tertiary rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full"
                      style={{ width: `${aiDispatchResult.etaPredictions.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-foreground-muted">{Math.round(aiDispatchResult.etaPredictions.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Emergency Response */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Response Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground-secondary">Priority Level</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-sm ${aiDispatchResult.emergencyResponse.priorityLevel <= 1 ? 'bg-danger-light text-danger-dark' :
                    aiDispatchResult.emergencyResponse.priorityLevel <= 2 ? 'bg-warning-light text-warning-dark' :
                      'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                    P{aiDispatchResult.emergencyResponse.priorityLevel}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-foreground-muted">Resources:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiDispatchResult.emergencyResponse.recommendedResources.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-xs bg-background-tertiary text-foreground-secondary px-1.5 py-0.5 rounded">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 theme-transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30">
              <CheckCircle size={18} />
              Dispatch Ambulance
            </button>
            <button className="px-4 py-3 bg-background-secondary border border-border text-foreground-primary rounded-lg font-medium hover:bg-background-tertiary theme-transition flex items-center gap-2">
              <Radio size={18} />
              Notify Hospital
            </button>
          </div>
        </div>
      )}

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAmbulances.map((amb) => (
          <div key={amb.id} className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border hover:shadow-md theme-transition group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-background-tertiary p-3 rounded-full text-foreground-secondary">
                <Truck size={24} />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(amb.status)}`}>
                {amb.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground-primary mb-1">{amb.vehicleNumber}</h3>
            <p className="text-sm text-foreground-muted mb-4">{amb.type} Unit</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <UserIcon />
                <span>{amb.driverName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <MapPin size={16} />
                <span>{amb.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Fuel size={16} className={amb.fuelLevel && amb.fuelLevel < 20 ? 'text-red-500' : 'text-foreground-muted'} />
                <span>Fuel: {amb.fuelLevel}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(amb)}
                className="flex-1 py-2 bg-background-tertiary text-foreground-primary rounded-lg text-sm font-medium hover:bg-background-elevated theme-transition flex items-center justify-center gap-1"
              >
                <Edit2 size={14} /> Edit
              </button>
              <div className="flex gap-1">
                <button className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 theme-transition" title="Call driver">
                  <Phone size={18} />
                </button>
                <button
                  onClick={() => handleDeleteAmbulance(amb.id)}
                  className="p-2 bg-danger-light text-danger-dark rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 theme-transition"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register/Edit Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
            <div className="p-6 border-b border-border-muted flex justify-between items-center bg-background-tertiary">
              <h2 className="text-xl font-bold text-foreground-primary">{editingAmbulance ? 'Edit Ambulance' : 'Register New Ambulance'}</h2>
              <button
                onClick={closeModal}
                className="text-foreground-muted hover:text-foreground-primary theme-transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Vehicle Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                  placeholder="e.g. AMB-001"
                  value={ambulanceForm.vehicleNumber}
                  onChange={e => setAmbulanceForm({ ...ambulanceForm, vehicleNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Driver Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                  placeholder="Driver's Full Name"
                  value={ambulanceForm.driverName}
                  onChange={e => setAmbulanceForm({ ...ambulanceForm, driverName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                    value={ambulanceForm.type}
                    onChange={e => setAmbulanceForm({ ...ambulanceForm, type: e.target.value as any })}
                  >
                    <option value="ALS">ALS (Advanced)</option>
                    <option value="BLS">BLS (Basic)</option>
                    <option value="Neonatal">Neonatal</option>
                    <option value="Patient Transport">Transport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                    value={ambulanceForm.status}
                    onChange={e => setAmbulanceForm({ ...ambulanceForm, status: e.target.value as any })}
                  >
                    <option value="Available">Available</option>
                    <option value="On Route">On Route</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-secondary mb-1">Current Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                    placeholder="Current Location / Base"
                    value={ambulanceForm.location}
                    onChange={e => setAmbulanceForm({ ...ambulanceForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Fuel Level (%)</label>
                  <input
                    type="number"
                    max="100" min="0"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                    value={ambulanceForm.fuelLevel}
                    onChange={e => setAmbulanceForm({ ...ambulanceForm, fuelLevel: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground-secondary mb-1">Equipment Check</label>
                  <select
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 bg-background-primary text-foreground-primary theme-transition"
                    value={ambulanceForm.equipmentCheck}
                    onChange={e => setAmbulanceForm({ ...ambulanceForm, equipmentCheck: e.target.value })}
                  >
                    <option value="Passed">Passed</option>
                    <option value="Warning">Warning</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-muted bg-background-tertiary flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-foreground-primary font-medium hover:bg-background-elevated rounded-lg theme-transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAmbulance}
                disabled={!ambulanceForm.vehicleNumber}
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition shadow-lg shadow-teal-500/30"
              >
                {editingAmbulance ? 'Update Vehicle' : 'Register Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

export default AmbulanceManager;
