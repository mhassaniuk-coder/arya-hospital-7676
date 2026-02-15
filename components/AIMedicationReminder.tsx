import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  TrendingUp,
  Info,
  Phone,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useMedicationReminder } from '../hooks/useAI';
import { MedicationReminderResult } from '../types';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
}

const AIMedicationReminder: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMed, setCurrentMed] = useState<Medication>({
    id: '',
    name: '',
    dosage: '',
    frequency: '',
    times: ['']
  });
  const [showResults, setShowResults] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('schedule');

  const { execute: getReminderPlan, data: result, loading, error } = useMedicationReminder();

  const addMedication = () => {
    if (!currentMed.name.trim()) return;
    setMedications([...medications, { ...currentMed, id: Date.now().toString() }]);
    setCurrentMed({ id: '', name: '', dosage: '', frequency: '', times: [''] });
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleGeneratePlan = async () => {
    if (medications.length === 0 || !patientName || !patientAge) return;

    await getReminderPlan({
      patientInfo: {
        patientId: 'demo-patient',
        name: patientName,
        age: parseInt(patientAge),
        contactMethods: ['app', 'sms']
      },
      medications: medications.map(m => ({
        medicationId: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        times: m.times,
        startDate: new Date().toISOString().split('T')[0],
        instructions: ''
      })),
      preferences: {
        reminderLeadTime: 15,
        snoozeDuration: 10,
        maxSnoozes: 3
      }
    });
    setShowResults(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'bg-red-100 text-red-700 border-red-200';
      case 'severe': return 'bg-red-100 text-red-700 border-red-200';
      case 'moderate': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'mild': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'standard': return 'bg-blue-100 text-blue-700';
      case 'gentle': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              AI Medication Reminder System
              <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Smart medication schedules with interaction warnings</p>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Enter age"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Medication */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Add Medications</label>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={currentMed.name}
                    onChange={(e) => setCurrentMed({...currentMed, name: e.target.value})}
                    placeholder="Medication name"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={currentMed.dosage}
                    onChange={(e) => setCurrentMed({...currentMed, dosage: e.target.value})}
                    placeholder="Dosage"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={currentMed.frequency}
                    onChange={(e) => setCurrentMed({...currentMed, frequency: e.target.value})}
                    placeholder="Frequency (e.g., twice daily)"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={currentMed.times[0]}
                    onChange={(e) => setCurrentMed({...currentMed, times: [e.target.value]})}
                    placeholder="Time (e.g., 8:00 AM)"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={addMedication}
                    disabled={!currentMed.name.trim()}
                    className="w-full bg-rose-600 text-white p-2 rounded-lg hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                    title="Add medication"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Medications List */}
          {medications.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Medications ({medications.length})
              </label>
              <div className="space-y-2">
                {medications.map(med => (
                  <div key={med.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <Pill size={16} className="text-rose-500" />
                      <div>
                        <span className="font-medium text-slate-700">{med.name}</span>
                        <span className="text-sm text-slate-500 ml-2">{med.dosage}</span>
                      </div>
                      <span className="text-xs text-slate-400">• {med.frequency}</span>
                      <span className="text-xs text-slate-400">• {med.times[0]}</span>
                    </div>
                    <button
                      onClick={() => removeMedication(med.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove medication"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={medications.length === 0 || !patientName || !patientAge || loading}
            className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white py-3 rounded-lg font-medium hover:from-rose-700 hover:to-rose-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Medication Plan...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Medication Plan
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
              ← Back to medication entry
            </button>

            {/* Adherence Summary */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-rose-800">Overall Adherence</h3>
                  <p className="text-3xl font-bold text-rose-600 mt-1">
                    {Math.round(result.adherenceReport.overallAdherence)}%
                  </p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#fecdd3"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#f43f5e"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${result.adherenceReport.overallAdherence * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <TrendingUp className="w-6 h-6 text-rose-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.adherenceReport.insights.map((insight, idx) => (
                  <span key={idx} className="text-xs bg-white/50 text-rose-700 px-2 py-1 rounded-full">
                    💡 {insight}
                  </span>
                ))}
              </div>
            </div>

            {/* Interaction Warnings */}
            {result.interactionWarnings.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'interactions' ? null : 'interactions')}
                  className="w-full p-4 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Drug Interaction Warnings</span>
                    <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                      {result.interactionWarnings.length} found
                    </span>
                  </div>
                  {expandedSection === 'interactions' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'interactions' && (
                  <div className="p-4 space-y-3">
                    {result.interactionWarnings.map((warning, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(warning.severity)}`}>
                        <div className="flex items-start gap-2">
                          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{warning.medication1} + {warning.medication2}</p>
                            <p className="text-sm mt-1">{warning.interaction}</p>
                            <div className="mt-2">
                              <p className="text-xs font-medium">Possible Symptoms:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {warning.symptoms.map((symptom, i) => (
                                  <span key={i} className="text-xs bg-white/50 px-2 py-0.5 rounded-full">
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm mt-2 font-medium">Recommendation: {warning.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Optimized Schedule */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'schedule' ? null : 'schedule')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-slate-800">Optimized Medication Schedule</span>
                </div>
                {expandedSection === 'schedule' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'schedule' && (
                <div className="p-4">
                  <div className="space-y-2">
                    {result.optimizedSchedule.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            med.status === 'taken' ? 'bg-green-100' :
                            med.status === 'missed' ? 'bg-red-100' :
                            'bg-slate-100'
                          }`}>
                            {med.status === 'taken' ? (
                              <CheckCircle size={18} className="text-green-600" />
                            ) : med.status === 'missed' ? (
                              <XCircle size={18} className="text-red-600" />
                            ) : (
                              <Clock size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{med.medicationName}</p>
                            <p className="text-xs text-slate-500">{med.dosage} • {med.instructions}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-700">{med.scheduledTime}</p>
                          <p className={`text-xs capitalize ${
                            med.status === 'taken' ? 'text-green-600' :
                            med.status === 'missed' ? 'text-red-600' :
                            'text-slate-500'
                          }`}>
                            {med.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Personalized Reminders */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'reminders' ? null : 'reminders')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-slate-800">Personalized Reminders</span>
                </div>
                {expandedSection === 'reminders' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'reminders' && (
                <div className="p-4 space-y-3">
                  {result.personalizedReminders.map((reminder, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Pill size={14} className="text-rose-500" />
                          <span className="font-medium text-slate-700">{reminder.medication}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">{reminder.time}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getToneColor(reminder.tone)}`}>
                            {reminder.tone}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
                        "{reminder.message}"
                      </p>
                      {reminder.additionalContext && (
                        <p className="text-xs text-slate-500 mt-1">{reminder.additionalContext}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refill Reminders */}
            {result.refillReminders.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'refills' ? null : 'refills')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-rose-600" />
                    <span className="font-semibold text-slate-800">Refill Reminders</span>
                  </div>
                  {expandedSection === 'refills' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'refills' && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {result.refillReminders.map((refill, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-700">{refill.medication}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              refill.daysRemaining <= 7 ? 'bg-red-100 text-red-700' :
                              refill.daysRemaining <= 14 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {refill.daysRemaining} days left
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Current supply: {refill.currentSupply} units
                          </p>
                          <p className="text-xs text-slate-500">
                            Refill by: {new Date(refill.refillDate).toLocaleDateString()}
                          </p>
                          {refill.pharmacyContact && (
                            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                              <Phone size={12} />
                              {refill.pharmacyContact}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Side Effect Monitoring */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'sideeffects' ? null : 'sideeffects')}
                className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-slate-800">Side Effect Monitoring</span>
                </div>
                {expandedSection === 'sideeffects' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'sideeffects' && (
                <div className="p-4 space-y-3">
                  {result.sideEffectMonitoring.map((monitoring, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="font-medium text-slate-700 flex items-center gap-2">
                        <Pill size={14} className="text-rose-500" />
                        {monitoring.medication}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Common Side Effects:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {monitoring.commonSideEffects.map((effect, i) => (
                              <span key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Serious Side Effects:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {monitoring.seriousSideEffects.map((effect, i) => (
                              <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                                {effect}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        <strong>When to Report:</strong> {monitoring.whenToReport.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Adherence Improvement Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                Adherence Improvement Tips
              </h3>
              <div className="space-y-2">
                {result.adherenceImprovementTips.map((tip, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3">
                    <p className="font-medium text-slate-700">{tip.tip}</p>
                    <p className="text-xs text-slate-500 mt-1">{tip.reason}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-green-600">{tip.implementation}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {tip.expectedImpact}
                      </span>
                    </div>
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

export default AIMedicationReminder;
