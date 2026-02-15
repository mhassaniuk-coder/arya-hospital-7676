import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Phone, 
  Video, 
  Home,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Activity,
  Target,
  FileText,
  User,
  Bell
} from 'lucide-react';
import { useDischargeFollowUp } from '../hooks/useAI';
import { DischargeFollowUpResult, DischargeFollowUpInput } from '../types';

interface PatientData {
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  dischargeDate: string;
  lengthOfStay: number;
}

const AIDischargeFollowUp: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: 0,
    gender: '',
    diagnosis: '',
    dischargeDate: '',
    lengthOfStay: 0
  });
  const [medications, setMedications] = useState<{name: string; dosage: string; frequency: string}[]>([]);
  const [currentMed, setCurrentMed] = useState({name: '', dosage: '', frequency: ''});
  const [showResults, setShowResults] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('schedule');

  const { execute: getFollowUpPlan, data: result, loading, error } = useDischargeFollowUp();

  const addMedication = () => {
    if (!currentMed.name.trim()) return;
    setMedications([...medications, currentMed]);
    setCurrentMed({name: '', dosage: '', frequency: ''});
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleGeneratePlan = async () => {
    if (!patientData.name || !patientData.diagnosis || !patientData.dischargeDate) return;

    const input: DischargeFollowUpInput = {
      patientInfo: {
        patientId: 'demo-patient',
        name: patientData.name,
        age: patientData.age,
        gender: patientData.gender
      },
      dischargeDetails: {
        dischargeDate: patientData.dischargeDate,
        diagnosis: patientData.diagnosis,
        dischargeSummary: `Patient discharged after ${patientData.lengthOfStay} days for ${patientData.diagnosis}`,
        lengthOfStay: patientData.lengthOfStay,
        dischargeDestination: 'home'
      },
      medications: medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: 'As prescribed',
        instructions: ''
      })),
      followUpInstructions: [],
      warningSigns: [],
      activityRestrictions: [],
      riskFactors: {}
    };

    await getFollowUpPlan(input);
    setShowResults(true);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'very_high': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getFollowUpTypeIcon = (type: string) => {
    switch (type) {
      case 'phone_call': return <Phone size={16} />;
      case 'video_call': return <Video size={16} />;
      case 'in_person': return <User size={16} />;
      case 'home_visit': return <Home size={16} />;
      default: return <Phone size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Post-Discharge Follow-Up Planner
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Generate personalized recovery and follow-up plans</p>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Patient Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Patient Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  placeholder="Enter name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Age</label>
                <input
                  type="number"
                  value={patientData.age || ''}
                  onChange={(e) => setPatientData({...patientData, age: parseInt(e.target.value) || 0})}
                  placeholder="Age"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gender</label>
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  title="Select gender"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Discharge Details */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Discharge Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Diagnosis *</label>
                <input
                  type="text"
                  value={patientData.diagnosis}
                  onChange={(e) => setPatientData({...patientData, diagnosis: e.target.value})}
                  placeholder="Primary diagnosis"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Discharge Date *</label>
                <input
                  type="date"
                  value={patientData.dischargeDate}
                  onChange={(e) => setPatientData({...patientData, dischargeDate: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  title="Discharge date"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Length of Stay (days)</label>
                <input
                  type="number"
                  value={patientData.lengthOfStay || ''}
                  onChange={(e) => setPatientData({...patientData, lengthOfStay: parseInt(e.target.value) || 0})}
                  placeholder="Days"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Discharge Medications</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={currentMed.name}
                    onChange={(e) => setCurrentMed({...currentMed, name: e.target.value})}
                    placeholder="Medication name"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={currentMed.dosage}
                    onChange={(e) => setCurrentMed({...currentMed, dosage: e.target.value})}
                    placeholder="Dosage"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={currentMed.frequency}
                    onChange={(e) => setCurrentMed({...currentMed, frequency: e.target.value})}
                    placeholder="Frequency"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={addMedication}
                    disabled={!currentMed.name.trim()}
                    className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    title="Add medication"
                  >
                    +
                  </button>
                </div>
              </div>
              {medications.length > 0 && (
                <div className="space-y-2">
                  {medications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <Pill size={14} className="text-purple-500" />
                        <span className="text-sm font-medium">{med.name}</span>
                        <span className="text-xs text-slate-500">{med.dosage}</span>
                        <span className="text-xs text-slate-400">• {med.frequency}</span>
                      </div>
                      <button
                        onClick={() => removeMedication(idx)}
                        className="text-slate-400 hover:text-red-500"
                        title="Remove medication"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={!patientData.name || !patientData.diagnosis || !patientData.dischargeDate || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Follow-Up Plan...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Follow-Up Plan
              </>
            )}
          </button>
        </>
      ) : (
        /* Results Section */
        result && (
          <div className="space-y-4">
            {/* Back Button */}
            <button
              onClick={() => setShowResults(false)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back to patient info
            </button>

            {/* Risk Assessment Banner */}
            <div className={`p-4 rounded-lg border ${getRiskLevelColor(result.readmissionRiskAssessment.riskLevel)}`}>
              <div className="flex items-start gap-3">
                <Activity className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg capitalize flex items-center gap-2">
                    Readmission Risk: {result.readmissionRiskAssessment.riskLevel.replace('_', ' ')}
                    <span className="text-sm font-normal">
                      ({Math.round(result.readmissionRiskAssessment.riskScore * 100)}% probability)
                    </span>
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.readmissionRiskAssessment.riskFactors.map((factor, idx) => (
                        <span key={idx} className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-Up Schedule */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'schedule' ? null : 'schedule')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-800">Follow-Up Schedule</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {result.followUpSchedule.length} appointments
                  </span>
                </div>
                {expandedSection === 'schedule' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'schedule' && (
                <div className="p-4 space-y-3">
                  {result.followUpSchedule.map((followUp, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(followUp.priority)}`}>
                        {getFollowUpTypeIcon(followUp.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{followUp.purpose}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(followUp.priority)}`}>
                            {followUp.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {new Date(followUp.scheduledDate).toLocaleDateString('en-US', { 
                            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                          })} • {followUp.type.replace('_', ' ')}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {followUp.checklistItems.map((item, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle size={10} />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recovery Milestones */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'milestones' ? null : 'milestones')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-800">Recovery Milestones</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {result.recoveryMilestones.length} milestones
                  </span>
                </div>
                {expandedSection === 'milestones' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'milestones' && (
                <div className="p-4">
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                    <div className="space-y-4">
                      {result.recoveryMilestones.map((milestone, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-10">
                          <div className="absolute left-3 w-4 h-4 bg-white border-2 border-purple-500 rounded-full"></div>
                          <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-slate-800">{milestone.milestone}</span>
                              <span className="text-xs text-slate-500">
                                Expected: {new Date(milestone.expectedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-slate-500 mb-1">Indicators:</p>
                              <div className="flex flex-wrap gap-1">
                                {milestone.indicators.map((ind, i) => (
                                  <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                    {ind}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {milestone.warningSigns.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-slate-500 mb-1">Warning Signs:</p>
                                <div className="flex flex-wrap gap-1">
                                  {milestone.warningSigns.map((sign, i) => (
                                    <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                                      {sign}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Medication Adherence Plan */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'meds' ? null : 'meds')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-800">Medication Adherence Plan</span>
                </div>
                {expandedSection === 'meds' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'meds' && (
                <div className="p-4 space-y-3">
                  {result.medicationAdherencePlan.map((med, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill size={14} className="text-purple-500" />
                        <span className="font-medium text-slate-800">{med.medication}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-slate-500">Schedule:</p>
                          <p className="text-slate-700">{med.schedule.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Potential Issues:</p>
                          <p className="text-slate-700">{med.potentialIssues.join(', ')}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-slate-500 mb-1">Adherence Tips:</p>
                        <div className="flex flex-wrap gap-1">
                          {med.adherenceTips.map((tip, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              {tip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Warning Signs */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'warnings' ? null : 'warnings')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-slate-800">Warning Signs to Monitor</span>
                </div>
                {expandedSection === 'warnings' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'warnings' && (
                <div className="p-4 space-y-2">
                  {result.warningSignMonitoring.map((warning, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      warning.urgencyLevel === 'emergency' ? 'bg-red-50 border-red-200' :
                      warning.urgencyLevel === 'urgent' ? 'bg-orange-50 border-orange-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className={`mt-0.5 ${
                          warning.urgencyLevel === 'emergency' ? 'text-red-600' :
                          warning.urgencyLevel === 'urgent' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`} />
                        <div>
                          <p className="font-medium text-slate-800">{warning.sign}</p>
                          <p className="text-sm text-slate-600">{warning.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            <strong>Action:</strong> {warning.actionToTake}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Tracking */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'progress' ? null : 'progress')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-slate-800">Progress Tracking</span>
                </div>
                {expandedSection === 'progress' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'progress' && (
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {result.progressTracking.map((metric, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-700">{metric.metric}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Baseline:</span>
                          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                            {metric.baseline}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Target:</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {metric.target}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Check: {metric.measurementFrequency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Bell size={16} />
                  Active Alerts
                </h3>
                <div className="space-y-2">
                  {result.alerts.map((alert, idx) => (
                    <div key={idx} className={`p-2 rounded text-sm ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <strong>{alert.type.replace('_', ' ')}:</strong> {alert.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Resources */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FileText size={16} />
                Educational Resources
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {result.educationalResources.map((resource, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {resource.format}
                    </span>
                    <p className="text-sm font-medium text-slate-700 mt-2">{resource.topic}</p>
                    <p className="text-xs text-slate-500 mt-1">{resource.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIDischargeFollowUp;
