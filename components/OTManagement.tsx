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
    switch (status) {
      case 'In Progress': return 'bg-info-light text-info-dark animate-pulse';
      case 'Completed': return 'bg-success-light text-success-dark';
      case 'Delayed': return 'bg-danger-light text-danger-dark';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  const getTheaterStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-success-light text-success-dark border-success-dark/30';
      case 'Occupied': return 'bg-danger-light text-danger-dark border-danger-dark/30';
      case 'Cleaning': return 'bg-warning-light text-warning-dark border-warning-dark/30';
      case 'Maintenance': return 'bg-background-tertiary text-foreground-secondary border-border';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'Emergency': return 'bg-danger text-white';
      case 'Urgent': return 'bg-warning text-white';
      case 'Elective': return 'bg-info text-white';
      default: return 'bg-background-tertiary text-foreground-secondary';
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
          <h1 className="text-2xl font-bold text-foreground-primary">Operation Theater Management</h1>
          <p className="text-foreground-secondary">AI-powered surgery scheduling and resource optimization.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runAIOptimization}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 theme-transition"
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
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg theme-transition"
          >
            <Plus size={18} /> Schedule Surgery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-info-light text-info-dark rounded-lg"><Scissors size={24} /></div>
            <div>
              <p className="text-sm text-foreground-muted font-medium">Surgeries Today</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{surgeries.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-light text-success-dark rounded-lg"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-foreground-muted font-medium">Theaters Active</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{theaters.filter(t => t.status === 'Occupied').length}/{theaters.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-light text-warning-dark rounded-lg"><Timer size={24} /></div>
            <div>
              <p className="text-sm text-foreground-muted font-medium">Avg. Duration</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{Math.round(surgeries.reduce((a, b) => a + (b.duration || 0), 0) / surgeries.length)}m</h3>
            </div>
          </div>
        </div>
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Zap size={24} /></div>
            <div>
              <p className="text-sm text-foreground-muted font-medium">OR Utilization</p>
              <h3 className="text-2xl font-bold text-foreground-primary">{aiResult?.efficiency.orUtilizationRate || 78}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* AI Optimization Panel */}
      {showAIPanel && aiResult && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-lg p-6 animate-scale-up theme-transition">
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
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600 theme-transition" title="Close">
              <XIcon size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Optimized Schedule */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-info" />
                Optimized Schedule
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.schedule.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate text-foreground-primary">{item.procedureName}</span>
                      <span className="text-xs bg-info-light text-info-dark px-2 py-0.5 rounded-full">
                        {item.assignedOR}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-foreground-muted">
                        {new Date(item.suggestedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-foreground-muted">{item.predictedDuration} min</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-success-dark font-medium">Score: {item.optimizationScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Predictions */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Clock size={16} className="text-warning" />
                Duration Predictions
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.durationPredictions.map((pred, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm truncate text-foreground-primary">{pred.procedureName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-foreground-muted line-through">{pred.baseDuration}m</span>
                      <span className="text-xs text-success-dark font-bold">→ {pred.adjustedDuration}m</span>
                    </div>
                    {pred.factors.length > 0 && (
                      <p className="text-xs text-warning-dark mt-1">
                        Factors: {pred.factors.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Optimization */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Users size={16} className="text-accent" />
                Resource Optimization
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {aiResult.resourceOptimization.map((resource, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-foreground-primary">{resource.resource}</span>
                      <span className="text-xs bg-success-light text-success-dark px-2 py-0.5 rounded-full">
                        {resource.utilizationRate}% utilized
                      </span>
                    </div>
                    {resource.suggestions.length > 0 && (
                      <p className="text-xs text-foreground-muted mt-1">{resource.suggestions[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-foreground-muted font-medium">OR Utilization</p>
              <p className="text-2xl font-bold text-accent">{aiResult.efficiency.orUtilizationRate}%</p>
            </div>
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-foreground-muted font-medium">Staff Utilization</p>
              <p className="text-2xl font-bold text-info-dark">{aiResult.efficiency.staffUtilizationRate}%</p>
            </div>
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 text-center">
              <p className="text-xs text-foreground-muted font-medium">Predicted Delays</p>
              <p className="text-2xl font-bold text-warning-dark">{aiResult.efficiency.predictedDelays}</p>
            </div>
          </div>

          {/* Conflicts */}
          {aiResult.conflicts.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-foreground-primary flex items-center gap-2">
                <AlertCircle size={16} className="text-danger" />
                Scheduling Conflicts
              </h4>
              {aiResult.conflicts.map((conflict, idx) => (
                <div key={idx} className="bg-danger-light border border-danger-dark/30 rounded-lg p-3">
                  <p className="text-sm text-danger-dark font-medium">{conflict.description}</p>
                  <p className="text-xs text-danger-dark/80 mt-1">Resolution: {conflict.resolution}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Theater Status */}
      <div className="bg-background-elevated rounded-2xl border border-border shadow-sm p-6 theme-transition">
        <h3 className="font-bold text-foreground-primary mb-4">Operating Theater Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className={`p-4 rounded-xl border-2 theme-transition ${getTheaterStatusColor(theater.status)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-foreground-primary">{theater.id}</span>
                <span className="text-xs font-medium">{theater.status}</span>
              </div>
              {theater.status === 'Occupied' && (
                <div className="mt-2 pt-2 border-t border-danger-dark/20">
                  <p className="text-xs font-bold text-foreground-primary truncate">{theater.currentProcedure}</p>
                  <p className="text-[10px] text-foreground-muted">{theater.doctor}</p>
                  <p className="text-[10px] text-foreground-muted">Since {theater.startTime}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Surgery Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surgeries.map((surgery) => (
          <div key={surgery.id} className="bg-background-elevated rounded-xl border border-border shadow-sm overflow-hidden theme-transition">
            <div className="p-4 border-b border-border-muted flex justify-between items-center bg-background-secondary">
              <div>
                <h3 className="font-bold text-foreground-primary">{surgery.procedure}</h3>
                <p className="text-xs text-foreground-muted">{surgery.id} • {surgery.theater}</p>
              </div>
              <div className="flex items-center gap-2">
                {surgery.urgency && (
                  <span className={`text-[10px] px-2 py-0.5 rounded theme-transition ${getUrgencyColor(surgery.urgency)}`}>
                    {surgery.urgency}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-bold theme-transition ${getStatusColor(surgery.status)}`}>
                  {surgery.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                    {surgery.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground-primary">{surgery.patientName}</p>
                    <p className="text-xs text-foreground-muted flex items-center gap-1">
                      <Clock size={12} /> {surgery.time}
                      {surgery.duration && <span className="text-accent">({surgery.duration} min)</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-foreground-secondary">
                  <p><span className="font-medium">Surgeon:</span> {surgery.surgeon}</p>
                  <p><span className="font-medium">Anesthesia:</span> {surgery.anesthesiologist}</p>
                </div>
              </div>

              <div className="bg-background-secondary rounded-lg p-3">
                <p className="text-xs font-bold text-foreground-muted uppercase mb-2">Safety Checklist</p>
                <div className="flex gap-4">
                  <div className={`flex items-center gap-2 text-sm ${surgery.checklist.preOp ? 'text-success-dark font-medium' : 'text-foreground-muted'}`}>
                    <CheckSquare size={16} /> Pre-Op
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${surgery.checklist.anesthesia ? 'text-success-dark font-medium' : 'text-foreground-muted'}`}>
                    <CheckSquare size={16} /> Anesthesia
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${surgery.checklist.postOp ? 'text-success-dark font-medium' : 'text-foreground-muted'}`}>
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
            <div className="p-3 border-t border-border-muted flex gap-2">
              <button className="flex-1 py-2 text-sm font-medium text-foreground-secondary hover:bg-background-secondary rounded-lg transition-colors theme-transition">
                View Details
              </button>
              <button className="flex-1 py-2 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors theme-transition">
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
