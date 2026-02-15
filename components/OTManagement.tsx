import React, { useState, useEffect } from 'react';
import { Scissors, Clock, User, CheckSquare, Plus, AlertCircle, Calendar, Sparkles, Brain, Loader2, Zap, Users, Activity, Timer } from 'lucide-react';
import { useORScheduler } from '../hooks/useAI';
import { ORSchedulerResult, ORSchedulerInput } from '../types';

interface Surgery {
  id: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  anesthesiologist: string;
  theater: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  checklist: { preOp: boolean; anesthesia: boolean; postOp: boolean };
  duration?: number;
  urgency?: 'Elective' | 'Urgent' | 'Emergency';
  patientAge?: number;
}

interface OperatingTheater {
  id: string;
  name: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  currentProcedure?: string;
  doctor?: string;
  startTime?: string;
}

const OTManagement: React.FC = () => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([
    { 
        id: 'SURG-001', 
        patientName: 'Alice Johnson', 
        procedure: 'Appendectomy', 
        surgeon: 'Dr. Wilson', 
        anesthesiologist: 'Dr. Ray', 
        theater: 'OT-1', 
        time: '09:00 AM', 
        status: 'In Progress',
        checklist: { preOp: true, anesthesia: true, postOp: false },
        duration: 90,
        urgency: 'Urgent',
        patientAge: 45
    },
    { 
        id: 'SURG-002', 
        patientName: 'Mark Lee', 
        procedure: 'Knee Replacement', 
        surgeon: 'Dr. Patel', 
        anesthesiologist: 'Dr. Ray', 
        theater: 'OT-2', 
        time: '11:00 AM', 
        status: 'Scheduled',
        checklist: { preOp: true, anesthesia: false, postOp: false },
        duration: 180,
        urgency: 'Elective',
        patientAge: 62
    },
    { 
        id: 'SURG-003', 
        patientName: 'Sarah Connor', 
        procedure: 'C-Section', 
        surgeon: 'Dr. Chen', 
        anesthesiologist: 'Dr. Miles', 
        theater: 'OT-3', 
        time: '02:00 PM', 
        status: 'Scheduled',
        checklist: { preOp: false, anesthesia: false, postOp: false },
        duration: 60,
        urgency: 'Urgent',
        patientAge: 32
    },
    { 
        id: 'SURG-004', 
        patientName: 'James Wilson', 
        procedure: 'Gallbladder Removal', 
        surgeon: 'Dr. Wilson', 
        anesthesiologist: 'Dr. Miles', 
        theater: 'OT-1', 
        time: '03:00 PM', 
        status: 'Scheduled',
        checklist: { preOp: false, anesthesia: false, postOp: false },
        duration: 75,
        urgency: 'Elective',
        patientAge: 55
    },
  ]);

  const [theaters, setTheaters] = useState<OperatingTheater[]>([
    { id: 'OT-1', name: 'Operating Theater 1', status: 'Occupied', currentProcedure: 'Appendectomy', doctor: 'Dr. Wilson', startTime: '09:00 AM' },
    { id: 'OT-2', name: 'Operating Theater 2', status: 'Occupied', currentProcedure: 'Knee Replacement', doctor: 'Dr. Patel', startTime: '11:00 AM' },
    { id: 'OT-3', name: 'Operating Theater 3', status: 'Available' },
    { id: 'OT-4', name: 'Operating Theater 4', status: 'Cleaning' },
    { id: 'OT-5', name: 'Operating Theater 5', status: 'Maintenance' },
  ]);

  const [showAddSurgery, setShowAddSurgery] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiResult, setAIResult] = useState<ORSchedulerResult | null>(null);

  const { data, loading, error, execute } = useORScheduler();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTheaterStatusColor = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700 border-green-200';
      case 'Occupied': return 'bg-red-100 text-red-700 border-red-200';
      case 'Cleaning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Maintenance': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch(urgency) {
      case 'Emergency': return 'bg-red-500 text-white';
      case 'Urgent': return 'bg-orange-500 text-white';
      case 'Elective': return 'bg-blue-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  // Run AI optimization
  const runAIOptimization = async () => {
    const input: ORSchedulerInput = {
      procedures: surgeries.map(s => ({
        id: s.id,
        procedureName: s.procedure,
        patientAge: s.patientAge,
        surgeon: s.surgeon,
        urgency: s.urgency || 'Elective',
        estimatedDuration: s.duration,
        requiredEquipment: []
      })),
      operatingRooms: theaters.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status as 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance',
        currentProcedure: t.currentProcedure,
        doctor: t.doctor,
        startTime: t.startTime
      })),
      staffAvailability: [
        { role: 'Surgeon', name: 'Dr. Wilson', available: true, specialties: ['General Surgery'] },
        { role: 'Surgeon', name: 'Dr. Patel', available: true, specialties: ['Orthopedics'] },
        { role: 'Surgeon', name: 'Dr. Chen', available: true, specialties: ['OB/GYN'] },
        { role: 'Anesthesiologist', name: 'Dr. Ray', available: true },
        { role: 'Anesthesiologist', name: 'Dr. Miles', available: true },
        { role: 'Scrub Nurse', name: 'Nurse Johnson', available: true },
        { role: 'Scrub Nurse', name: 'Nurse Williams', available: true },
      ]
    };
    
    await execute(input);
  };

  // Update AI result when data changes
  useEffect(() => {
    if (data) {
      setAIResult(data);
      setShowAIPanel(true);
    }
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operation Theater Management</h1>
          <p className="text-slate-500">AI-powered surgery scheduling and resource optimization.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={runAIOptimization}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            AI Optimize Schedule
          </button>
          <button 
            onClick={() => setShowAddSurgery(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
          >
            <Plus size={18} /> Schedule Surgery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Scissors size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Surgeries Today</p>
                    <h3 className="text-2xl font-bold text-slate-900">{surgeries.length}</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><Activity size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Theaters Active</p>
                    <h3 className="text-2xl font-bold text-slate-900">{theaters.filter(t => t.status === 'Occupied').length}/{theaters.length}</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Timer size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Duration</p>
                    <h3 className="text-2xl font-bold text-slate-900">{Math.round(surgeries.reduce((a, b) => a + (b.duration || 0), 0) / surgeries.length)}m</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Zap size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">OR Utilization</p>
                    <h3 className="text-2xl font-bold text-slate-900">{aiResult?.efficiency.orUtilizationRate || 78}%</h3>
                </div>
            </div>
        </div>
      </div>

      {/* AI Optimization Panel */}
      {showAIPanel && aiResult && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900">AI OR Schedule Optimization</h3>
                <p className="text-xs text-purple-600">Intelligent scheduling and resource allocation</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600" title="Close">
              <XIcon size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Optimized Schedule */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                Optimized Schedule
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.schedule.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate">{item.procedureName}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {item.assignedOR}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500">
                        {new Date(item.suggestedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-slate-500">{item.predictedDuration} min</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-green-600 font-medium">Score: {item.optimizationScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Predictions */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-orange-500" />
                Duration Predictions
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.durationPredictions.map((pred, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate">{pred.procedureName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 line-through">{pred.baseDuration}m</span>
                      <span className="text-xs text-green-600 font-bold">→ {pred.adjustedDuration}m</span>
                    </div>
                    {pred.factors.length > 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Factors: {pred.factors.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Optimization */}
            <div className="bg-white rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Users size={16} className="text-teal-500" />
                Resource Optimization
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.resourceOptimization.map((resource, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{resource.resource}</span>
                      <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        {resource.utilizationRate}% utilized
                      </span>
                    </div>
                    {resource.suggestions.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">{resource.suggestions[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-slate-500 font-medium">OR Utilization</p>
              <p className="text-2xl font-bold text-teal-600">{aiResult.efficiency.orUtilizationRate}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-slate-500 font-medium">Staff Utilization</p>
              <p className="text-2xl font-bold text-blue-600">{aiResult.efficiency.staffUtilizationRate}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-slate-500 font-medium">Predicted Delays</p>
              <p className="text-2xl font-bold text-orange-600">{aiResult.efficiency.predictedDelays}</p>
            </div>
          </div>

          {/* Conflicts */}
          {aiResult.conflicts.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Scheduling Conflicts
              </h4>
              {aiResult.conflicts.map((conflict, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 font-medium">{conflict.description}</p>
                  <p className="text-xs text-red-600 mt-1">Resolution: {conflict.resolution}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Theater Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Operating Theater Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {theaters.map((theater) => (
            <div 
              key={theater.id}
              className={`p-4 rounded-xl border-2 ${getTheaterStatusColor(theater.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-700">{theater.id}</span>
                <span className="text-xs font-medium">{theater.status}</span>
              </div>
              {theater.status === 'Occupied' && (
                <div className="mt-2 pt-2 border-t border-red-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{theater.currentProcedure}</p>
                  <p className="text-[10px] text-slate-500">{theater.doctor}</p>
                  <p className="text-[10px] text-slate-500">Since {theater.startTime}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Surgery Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surgeries.map((surgery) => (
            <div key={surgery.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800">{surgery.procedure}</h3>
                        <p className="text-xs text-slate-500">{surgery.id} • {surgery.theater}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {surgery.urgency && (
                        <span className={`text-[10px] px-2 py-0.5 rounded ${getUrgencyColor(surgery.urgency)}`}>
                          {surgery.urgency}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(surgery.status)}`}>
                          {surgery.status}
                      </span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                {surgery.patientName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{surgery.patientName}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock size={12} /> {surgery.time}
                                  {surgery.duration && <span className="text-teal-600">({surgery.duration} min)</span>}
                                </p>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                            <p><span className="font-medium">Surgeon:</span> {surgery.surgeon}</p>
                            <p><span className="font-medium">Anesthesia:</span> {surgery.anesthesiologist}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Safety Checklist</p>
                        <div className="flex gap-4">
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.preOp ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Pre-Op
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.anesthesia ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Anesthesia
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.postOp ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Post-Op
                            </div>
                        </div>
                    </div>

                    {/* AI Duration Prediction */}
                    {aiResult && (
                      <div className="mt-3 bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <div className="flex items-center gap-2">
                          <Sparkles size={12} className="text-purple-500" />
                          <span className="text-xs text-purple-700">
                            AI Predicted Duration: {
                              aiResult.durationPredictions.find(p => p.procedureId === surgery.id)?.adjustedDuration || surgery.duration
                            } min
                          </span>
                        </div>
                      </div>
                    )}
                </div>
                <div className="p-3 border-t border-slate-100 flex gap-2">
                    <button className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        View Details
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        Update Status
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// X Icon component
const XIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default OTManagement;
