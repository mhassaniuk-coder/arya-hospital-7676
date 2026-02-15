import React, { useState, useEffect } from 'react';
import { Ambulance, AmbulanceDispatchResult } from '../types';
import { Truck, MapPin, Phone, ShieldAlert, Sparkles, Brain, Loader2, Navigation, Clock, AlertCircle, CheckCircle, Radio } from 'lucide-react';
import { useData } from '../src/contexts/DataContext';
import { useAmbulanceDispatch } from '../hooks/useAI';

const AmbulanceManager: React.FC = () => {
  const { ambulances } = useData();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiDispatchResult, setAiDispatchResult] = useState<AmbulanceDispatchResult | null>(null);
  const [emergencyForm, setEmergencyForm] = useState({
    location: '',
    emergencyType: '',
    severity: 'Serious' as 'Critical' | 'Serious' | 'Moderate' | 'Minor',
    patientCount: '1'
  });

  const { data: dispatchResult, loading: dispatchLoading, execute: runDispatch } = useAmbulanceDispatch();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'On Route': return 'bg-orange-100 text-orange-700';
      case 'Maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
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
      availableAmbulances: ambulances.filter(a => a.status === 'Available'),
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

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ambulance Fleet & AI Dispatch</h1>
          <p className="text-slate-500">AI-powered emergency response coordination.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
          + Add Vehicle
        </button>
      </div>

      {/* Emergency Dispatch Form */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <ShieldAlert className="text-red-600" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Emergency Dispatch</h3>
            <p className="text-xs text-red-600">AI-powered ambulance dispatch system</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Location</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
              placeholder="e.g., 123 Main Street"
              value={emergencyForm.location}
              onChange={e => setEmergencyForm({...emergencyForm, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Type</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
              value={emergencyForm.emergencyType}
              onChange={e => setEmergencyForm({...emergencyForm, emergencyType: e.target.value})}
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm"
              value={emergencyForm.severity}
              onChange={e => setEmergencyForm({...emergencyForm, severity: e.target.value as any})}
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
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900">AI Dispatch Recommendation</h3>
                <p className="text-xs text-purple-600">Optimized emergency response coordination</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600" title="Close">
              <XIcon size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recommended Ambulance */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Truck size={16} className="text-teal-500" />
                Recommended Unit
              </h4>
              <div className="bg-teal-50 rounded-lg p-3">
                <p className="font-bold text-teal-800">{aiDispatchResult.recommendedAmbulance.vehicleNumber}</p>
                <p className="text-sm text-teal-600">{aiDispatchResult.recommendedAmbulance.type} Unit</p>
                <p className="text-sm text-teal-600">{aiDispatchResult.recommendedAmbulance.driverName}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Clock size={14} className="text-teal-500" />
                  <span className="text-sm font-bold text-teal-700">ETA: {aiDispatchResult.recommendedAmbulance.eta} min</span>
                </div>
              </div>
            </div>

            {/* Route Recommendation */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Navigation size={16} className="text-blue-500" />
                Route
              </h4>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800">{aiDispatchResult.routeRecommendation.route}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-blue-600">Time:</span>
                    <span className="font-bold text-blue-800 ml-1">{aiDispatchResult.routeRecommendation.estimatedTime} min</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Distance:</span>
                    <span className="font-bold text-blue-800 ml-1">{aiDispatchResult.routeRecommendation.distance} km</span>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">{aiDispatchResult.routeRecommendation.trafficConditions}</p>
              </div>
            </div>

            {/* ETA Predictions */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                ETA Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">To Scene</span>
                  <span className="font-bold text-slate-800">{aiDispatchResult.etaPredictions.toScene} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">To Hospital</span>
                  <span className="font-bold text-slate-800">{aiDispatchResult.etaPredictions.toHospital} min</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-700">Total</span>
                  <span className="font-bold text-orange-600">{aiDispatchResult.etaPredictions.total} min</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-orange-500 h-1.5 rounded-full" 
                      style={{ width: `${aiDispatchResult.etaPredictions.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{Math.round(aiDispatchResult.etaPredictions.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Emergency Response */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Response Details
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Priority Level</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-sm ${
                    aiDispatchResult.emergencyResponse.priorityLevel <= 1 ? 'bg-red-100 text-red-700' :
                    aiDispatchResult.emergencyResponse.priorityLevel <= 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    P{aiDispatchResult.emergencyResponse.priorityLevel}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Resources:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiDispatchResult.emergencyResponse.recommendedResources.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Destination */}
          <div className="mt-4 bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Hospital Destination
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Recommended Hospital</p>
                <p className="font-bold text-slate-800">{aiDispatchResult.hospitalDestination.recommendedHospital}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Reasoning</p>
                <p className="text-sm text-slate-700">{aiDispatchResult.hospitalDestination.reasoning}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Available Resources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {aiDispatchResult.hospitalDestination.availableResources.map((r, i) => (
                    <span key={i} className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-3">
            <button className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-bold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Dispatch Ambulance
            </button>
            <button className="px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2">
              <Radio size={18} />
              Notify Hospital
            </button>
          </div>
        </div>
      )}

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ambulances.map((amb) => (
          <div key={amb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                <Truck size={24} />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(amb.status)}`}>
                {amb.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1">{amb.vehicleNumber}</h3>
            <p className="text-sm text-slate-500 mb-4">{amb.type} Unit</p>

            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon />
                  <span>{amb.driverName}</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} />
                  <span>{amb.location}</span>
               </div>
            </div>
            
            <div className="mt-6 flex gap-2">
               <button className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100">
                 Details
               </button>
               <button className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100" title="Call driver">
                 <Phone size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const XIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default AmbulanceManager;
