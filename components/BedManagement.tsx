import React, { useState, useEffect } from 'react';
import { BedDouble, User, Clock, AlertCircle, CheckCircle, Plus, X, Sparkles, Brain, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { useBedManagementOptimizer } from '../hooks/useAI';
import { BedManagementResult, BedManagementInput } from '../types';
import { useTheme } from '../src/contexts/ThemeContext';

interface Bed {
  id: string;
  number: string;
  ward: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Cleaning';
  patientName?: string;
  admitDate?: string;
  doctor?: string;
  type: 'General' | 'ICU' | 'Private' | 'Emergency';
  expectedDischarge?: string;
  acuity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

const BedManagement: React.FC = () => {
  const { isDark } = useTheme();
  const [beds, setBeds] = useState<Bed[]>([
    { id: '101', number: 'A-101', ward: 'General Ward A', status: 'Occupied', patientName: 'John Doe', admitDate: '2024-03-10', doctor: 'Dr. Smith', type: 'General', expectedDischarge: '2024-03-17', acuity: 'Medium' },
    { id: '102', number: 'A-102', ward: 'General Ward A', status: 'Available', type: 'General' },
    { id: '103', number: 'A-103', ward: 'General Ward A', status: 'Cleaning', type: 'General' },
    { id: '104', number: 'A-104', ward: 'General Ward A', status: 'Occupied', patientName: 'Jane Smith', admitDate: '2024-03-12', doctor: 'Dr. Chen', type: 'General', expectedDischarge: '2024-03-16', acuity: 'Low' },
    { id: '201', number: 'ICU-1', ward: 'Intensive Care', status: 'Occupied', patientName: 'Robert Brown', admitDate: '2024-03-14', doctor: 'Dr. Wilson', type: 'ICU', expectedDischarge: '2024-03-18', acuity: 'Critical' },
    { id: '202', number: 'ICU-2', ward: 'Intensive Care', status: 'Available', type: 'ICU' },
    { id: '301', number: 'P-301', ward: 'Private Wing', status: 'Available', type: 'Private' },
    { id: '302', number: 'P-302', ward: 'Private Wing', status: 'Maintenance', type: 'Private' },
    { id: '401', number: 'E-401', ward: 'Emergency', status: 'Occupied', patientName: 'Alice Johnson', admitDate: '2024-03-15', doctor: 'Dr. Martinez', type: 'Emergency', expectedDischarge: '2024-03-16', acuity: 'High' },
    { id: '402', number: 'E-402', ward: 'Emergency', status: 'Available', type: 'Emergency' },
  ]);

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [filter, setFilter] = useState('All');
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiResult, setAIResult] = useState<BedManagementResult | null>(null);

  const { data, loading, error, execute } = useBedManagementOptimizer();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-success-light text-success-dark border-green-200 dark:border-green-800';
      case 'Occupied': return 'bg-danger-light text-danger-dark border-red-200 dark:border-red-800';
      case 'Cleaning': return 'bg-warning-light text-warning-dark border-yellow-200 dark:border-yellow-800';
      case 'Maintenance': return 'bg-background-secondary text-foreground-secondary border-border';
      default: return 'bg-background-secondary text-foreground-secondary';
    }
  };

  const getAcuityColor = (acuity?: string) => {
    switch (acuity) {
      case 'Critical': return 'bg-danger-dark text-white';
      case 'High': return 'bg-warning-dark text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-success-dark text-white';
      default: return 'bg-background-tertiary text-white';
    }
  };

  const filteredBeds = filter === 'All' ? beds : beds.filter(b => b.ward.includes(filter) || b.type === filter);

  // Run AI optimization
  const runAIOptimization = async () => {
    const input: BedManagementInput = {
      currentBeds: beds.map(b => ({
        id: b.id,
        ward: b.ward,
        number: b.number,
        status: b.status as 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance',
        patientName: b.patientName,
        type: b.type as 'General' | 'ICU' | 'Emergency'
      })),
      pendingDischarges: beds
        .filter(b => b.status === 'Occupied' && b.expectedDischarge)
        .map(b => ({
          patientName: b.patientName || '',
          bedId: b.id,
          estimatedDischargeTime: b.expectedDischarge || ''
        })),
      incomingPatients: [
        { priority: 'Urgent', department: 'Emergency', requiresICU: false },
        { priority: 'Routine', department: 'General', requiresICU: false }
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
          <h1 className="text-2xl font-bold text-foreground-primary">Inpatient Bed Management</h1>
          <p className="text-foreground-secondary">Real-time occupancy tracking and AI-powered optimization.</p>
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
            AI Optimize
          </button>
          <select
            className="bg-background-elevated border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 text-foreground-primary theme-transition"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Wards</option>
            <option value="General">General Ward</option>
            <option value="ICU">ICU</option>
            <option value="Private">Private Wing</option>
            <option value="Emergency">Emergency</option>
          </select>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 theme-transition">
            <Plus size={18} /> Admit Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background-elevated p-4 rounded-xl border border-border shadow-sm flex items-center justify-between theme-transition">
          <div>
            <p className="text-foreground-muted text-xs font-bold uppercase">Total Beds</p>
            <p className="text-2xl font-bold text-foreground-primary">{beds.length}</p>
          </div>
          <div className="p-3 bg-info-light text-info-dark rounded-lg"><BedDouble size={24} /></div>
        </div>
        <div className="bg-background-elevated p-4 rounded-xl border border-border shadow-sm flex items-center justify-between theme-transition">
          <div>
            <p className="text-foreground-muted text-xs font-bold uppercase">Available</p>
            <p className="text-2xl font-bold text-success-dark">{beds.filter(b => b.status === 'Available').length}</p>
          </div>
          <div className="p-3 bg-success-light text-success-dark rounded-lg"><CheckCircle size={24} /></div>
        </div>
        <div className="bg-background-elevated p-4 rounded-xl border border-border shadow-sm flex items-center justify-between theme-transition">
          <div>
            <p className="text-foreground-muted text-xs font-bold uppercase">Occupied</p>
            <p className="text-2xl font-bold text-danger-dark">{beds.filter(b => b.status === 'Occupied').length}</p>
          </div>
          <div className="p-3 bg-danger-light text-danger-dark rounded-lg"><User size={24} /></div>
        </div>
        <div className="bg-background-elevated p-4 rounded-xl border border-border shadow-sm flex items-center justify-between theme-transition">
          <div>
            <p className="text-foreground-muted text-xs font-bold uppercase">Blocked</p>
            <p className="text-2xl font-bold text-warning-dark">{beds.filter(b => ['Cleaning', 'Maintenance'].includes(b.status)).length}</p>
          </div>
          <div className="p-3 bg-warning-light text-warning-dark rounded-lg"><AlertCircle size={24} /></div>
        </div>
      </div>

      {/* AI Optimization Panel */}
      {showAIPanel && aiResult && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-100">AI Bed Optimization Analysis</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400">Powered by NexusHealth AI</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 theme-transition">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Optimal Assignments */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-success-dark" />
                Optimal Assignments
              </h4>
              <div className="space-y-2">
                {aiResult.optimalAssignments.slice(0, 3).map((assignment, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-foreground-primary">{assignment.bedNumber}</span>
                      <span className="text-xs bg-success-light text-success-dark px-2 py-0.5 rounded-full">
                        {assignment.matchScore}% match
                      </span>
                    </div>
                    <p className="text-xs text-foreground-muted mt-1">{assignment.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnover Predictions */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Clock size={16} className="text-info-dark" />
                Turnover Predictions
              </h4>
              <div className="space-y-2">
                {aiResult.turnoverPredictions.slice(0, 3).map((pred, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-foreground-primary">{pred.currentPatient}</span>
                      <span className="text-xs text-foreground-muted">
                        {new Date(pred.predictedDischargeTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex-1 bg-background-tertiary rounded-full h-1.5">
                        <div
                          className="bg-info-dark h-1.5 rounded-full"
                          style={{ width: `${pred.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-foreground-muted">{Math.round(pred.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discharge Planning */}
            <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-warning-dark" />
                Discharge Planning
              </h4>
              <div className="space-y-2">
                {aiResult.dischargePlanningSuggestions.slice(0, 3).map((plan, idx) => (
                  <div key={idx} className="bg-background-secondary rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm text-foreground-primary">{plan.patientName}</span>
                      <span className="text-xs text-foreground-muted">{plan.currentBed}</span>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-1">{plan.recommendation}</p>
                    {plan.barriers.length > 0 && (
                      <p className="text-xs text-warning-dark mt-1">
                        Barrier: {plan.barriers[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capacity Forecast */}
          <div className="mt-4 bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-teal-500" />
              Capacity Forecast (Next 24 Hours)
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {aiResult.capacityForecast.map((forecast, idx) => (
                <div key={idx} className="flex-shrink-0 bg-background-secondary rounded-lg p-3 min-w-[120px]">
                  <p className="text-xs text-foreground-muted font-medium">{forecast.time}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground-secondary">Occupancy</span>
                      <span className="font-bold text-foreground-primary">{forecast.expectedOccupancy}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground-secondary">Available</span>
                      <span className="font-bold text-success-dark">{forecast.availableBeds}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          {aiResult.alerts.length > 0 && (
            <div className="mt-4 space-y-2">
              {aiResult.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-center gap-2 ${alert.type === 'critical' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                      alert.type === 'warning' ? 'bg-warning-light border border-yellow-200 dark:border-yellow-800' :
                        'bg-info-light border border-blue-200 dark:border-blue-800'
                    }`}
                >
                  <AlertCircle size={16} className={
                    alert.type === 'critical' ? 'text-danger-dark' :
                      alert.type === 'warning' ? 'text-warning-dark' :
                        'text-info-dark'
                  } />
                  <span className={`text-sm ${alert.type === 'critical' ? 'text-danger-dark' :
                      alert.type === 'warning' ? 'text-warning-dark' :
                        'text-info-dark'
                    }`}>
                    {alert.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visual Bed Map */}
      <div className="bg-background-elevated rounded-2xl border border-border shadow-sm p-6 theme-transition">
        <h3 className="font-bold text-foreground-primary mb-4">Ward View</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBeds.map((bed) => (
            <div
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`
                        relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md theme-transition
                        ${selectedBed?.id === bed.id ? 'ring-2 ring-teal-500 ring-offset-2 ring-offset-background-primary' : ''}
                        ${bed.status === 'Available' ? 'border-green-200 dark:border-green-800 bg-success-light hover:border-green-400' :
                  bed.status === 'Occupied' ? 'border-red-200 dark:border-red-800 bg-danger-light hover:border-red-400' :
                    'border-border bg-background-secondary hover:border-border-muted'}
                    `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-foreground-primary">{bed.number}</span>
                <div className="flex items-center gap-1">
                  {bed.acuity && bed.status === 'Occupied' && (
                    <span className={`text-[8px] px-1 py-0.5 rounded ${getAcuityColor(bed.acuity)}`}>
                      {bed.acuity}
                    </span>
                  )}
                  <BedDouble size={16} className={`${bed.status === 'Available' ? 'text-success-dark' :
                      bed.status === 'Occupied' ? 'text-danger-dark' : 'text-foreground-muted'
                    }`} />
                </div>
              </div>
              <p className="text-xs font-medium text-foreground-muted mb-1">{bed.type}</p>
              {bed.status === 'Occupied' ? (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                  <p className="text-xs font-bold text-foreground-primary truncate">{bed.patientName}</p>
                  <p className="text-[10px] text-foreground-muted truncate">{bed.doctor}</p>
                  {bed.expectedDischarge && (
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1">
                      Discharge: {new Date(bed.expectedDischarge).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-transparent">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(bed.status)}`}>
                    {bed.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bed Detail Drawer (Simulated inline) */}
      {selectedBed && (
        <div className="bg-background-elevated rounded-2xl border border-border shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground-primary flex items-center gap-2">
                <BedDouble className="text-teal-600" />
                Bed {selectedBed.number} Details
              </h2>
              <p className="text-foreground-secondary">{selectedBed.ward} - {selectedBed.type}</p>
            </div>
            <button onClick={() => setSelectedBed(null)} className="text-foreground-muted hover:text-foreground-primary theme-transition">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="bg-background-secondary p-4 rounded-xl border border-border-muted">
                <h3 className="font-bold text-foreground-primary mb-3">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-foreground-muted mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedBed.status)}`}>
                      {selectedBed.status}
                    </span>
                  </div>
                  {selectedBed.status === 'Occupied' && (
                    <>
                      <div>
                        <p className="text-xs text-foreground-muted mb-1">Patient Name</p>
                        <p className="font-bold text-foreground-primary">{selectedBed.patientName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-muted mb-1">Admitted On</p>
                        <p className="font-medium text-foreground-primary">{selectedBed.admitDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground-muted mb-1">Attending Doctor</p>
                        <p className="font-medium text-foreground-primary">{selectedBed.doctor}</p>
                      </div>
                      {selectedBed.acuity && (
                        <div>
                          <p className="text-xs text-foreground-muted mb-1">Acuity Level</p>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getAcuityColor(selectedBed.acuity)}`}>
                            {selectedBed.acuity}
                          </span>
                        </div>
                      )}
                      {selectedBed.expectedDischarge && (
                        <div>
                          <p className="text-xs text-foreground-muted mb-1">Expected Discharge</p>
                          <p className="font-medium text-teal-600 dark:text-teal-400">{new Date(selectedBed.expectedDischarge).toLocaleDateString()}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* AI Recommendation for selected bed */}
              {aiResult && selectedBed.status === 'Available' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-500 dark:text-purple-400" />
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300">AI Recommendation</h4>
                  </div>
                  {aiResult.optimalAssignments.find(a => a.bedId === selectedBed.id) ? (
                    <div>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        This bed is recommended for incoming patient assignment.
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        Match Score: {aiResult.optimalAssignments.find(a => a.bedId === selectedBed.id)?.matchScore}%
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      No immediate assignment recommendation. Bed is suitable for general admissions.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-foreground-primary mb-2">Actions</h3>
              {selectedBed.status === 'Available' ? (
                <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 theme-transition">
                  Assign Patient
                </button>
              ) : selectedBed.status === 'Occupied' ? (
                <>
                  <button className="w-full bg-background-elevated border border-border text-foreground-secondary py-3 rounded-xl font-bold hover:bg-background-secondary transition-colors theme-transition">
                    View Patient Chart
                  </button>
                  <button className="w-full bg-danger-light text-danger-dark border border-red-100 dark:border-red-800 py-3 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors theme-transition">
                    Discharge Patient
                  </button>
                  <button className="w-full bg-info-light text-info-dark border border-blue-100 dark:border-blue-800 py-3 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors theme-transition">
                    Transfer Bed
                  </button>
                </>
              ) : (
                <button className="w-full bg-success-light text-success-dark border border-green-100 dark:border-green-800 py-3 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors theme-transition">
                  Mark as Available
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
