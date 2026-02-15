import React, { useState } from 'react';
import { 
  Search, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  X, 
  Sparkles, 
  Clock, 
  MapPin,
  Stethoscope,
  Heart,
  Activity,
  Calendar,
  Phone,
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react';
import { useSymptomChecker } from '../hooks/useAI';
import { SymptomCheckerResult, SymptomCheckerInput } from '../types';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  location: string;
}

const AISymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [currentDuration, setCurrentDuration] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

  const { execute: analyzeSymptoms, data: result, loading, error } = useSymptomChecker();

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea', 
    'Dizziness', 'Chest Pain', 'Shortness of Breath', 
    'Abdominal Pain', 'Back Pain', 'Sore Throat', 'Runny Nose'
  ];

  const addSymptom = () => {
    if (!currentSymptom.trim()) return;
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: currentSymptom,
      severity: currentSeverity,
      duration: currentDuration || 'Unknown',
      location: currentLocation
    };
    
    setSymptoms([...symptoms, newSymptom]);
    setCurrentSymptom('');
    setCurrentDuration('');
    setCurrentLocation('');
    setCurrentSeverity('moderate');
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const addQuickSymptom = (symptomName: string) => {
    if (symptoms.some(s => s.name.toLowerCase() === symptomName.toLowerCase())) return;
    
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity: 'moderate',
      duration: 'A few days',
      location: ''
    };
    
    setSymptoms([...symptoms, newSymptom]);
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0 || !age || !gender) return;

    const input: SymptomCheckerInput = {
      symptoms: symptoms.map(s => ({
        name: s.name,
        severity: s.severity,
        duration: s.duration,
        location: s.location || undefined
      })),
      patientInfo: {
        age: parseInt(age),
        gender: gender
      }
    };

    await analyzeSymptoms(input);
    setShowResults(true);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent_care': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'schedule_appointment': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'self_care': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-700';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'mild': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              AI Symptom Checker
              <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Get personalized health guidance based on your symptoms</p>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Quick Add Symptoms */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Quick Add Common Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => addQuickSymptom(symptom)}
                  disabled={symptoms.some(s => s.name.toLowerCase() === symptom.toLowerCase())}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    symptoms.some(s => s.name.toLowerCase() === symptom.toLowerCase())
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-500 hover:text-teal-600'
                  }`}
                >
                  + {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Symptom */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Add Custom Symptom</label>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <input
                  type="text"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  placeholder="Symptom name"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={currentSeverity}
                  onChange={(e) => setCurrentSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={currentDuration}
                  onChange={(e) => setCurrentDuration(e.target.value)}
                  placeholder="Duration (e.g., 2 days)"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={addSymptom}
                  disabled={!currentSymptom.trim()}
                  className="w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  title="Add symptom"
                >
                  <Plus size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Symptoms List */}
          {symptoms.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Symptoms ({symptoms.length})
              </label>
              <div className="space-y-2">
                {symptoms.map(symptom => (
                  <div 
                    key={symptom.id}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                      <span className="font-medium text-slate-700">{symptom.name}</span>
                      {symptom.location && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {symptom.location}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {symptom.duration}
                      </span>
                    </div>
                    <button
                      onClick={() => removeSymptom(symptom.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove symptom"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={symptoms.length === 0 || !age || !gender || loading}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Search size={18} />
                Analyze My Symptoms
              </>
            )}
          </button>
        </>
      ) : (
        /* Results Section */
        result && (
          <div className="space-y-6">
            {/* Back Button */}
            <button
              onClick={() => setShowResults(false)}
              className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              ← Back to symptom entry
            </button>

            {/* Urgency Banner */}
            <div className={`p-4 rounded-lg border ${getUrgencyColor(result.urgencyLevel)}`}>
              <div className="flex items-start gap-3">
                {result.urgencyLevel === 'emergency' ? (
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                ) : (
                  <Info className="w-6 h-6 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-lg capitalize">
                    {result.urgencyLevel.replace('_', ' ')} - {result.urgencyReasoning}
                  </h3>
                  <p className="text-sm mt-1 opacity-80">
                    {result.followUpTimeline}
                  </p>
                </div>
              </div>
            </div>

            {/* Possible Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                Possible Conditions
              </h3>
              <div className="space-y-3">
                {result.possibleConditions.map((condition, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedCondition(expandedCondition === condition.condition ? null : condition.condition)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRiskLevelColor(condition.riskLevel)}`}>
                          <span className="text-sm font-bold">{Math.round(condition.probability * 100)}%</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{condition.condition}</h4>
                          <p className="text-xs text-slate-500">
                            {condition.matchingSymptoms.length} matching symptoms
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(condition.riskLevel)}`}>
                          {condition.riskLevel} risk
                        </span>
                        {expandedCondition === condition.condition ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </button>
                    
                    {expandedCondition === condition.condition && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                        <p className="text-sm text-slate-600 mb-3">{condition.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Matching Symptoms</p>
                            <div className="flex flex-wrap gap-1">
                              {condition.matchingSymptoms.map((s, i) => (
                                <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          {condition.missingSymptoms && condition.missingSymptoms.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-slate-500 mb-1">Missing Symptoms</p>
                              <div className="flex flex-wrap gap-1">
                                {condition.missingSymptoms.map((s, i) => (
                                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {condition.selfCareOptions && condition.selfCareOptions.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Self-Care Options</p>
                            <ul className="text-sm text-slate-600 space-y-1">
                              {condition.selfCareOptions.map((option, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags */}
            {result.redFlags && result.redFlags.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Warning Signs to Watch For
                </h3>
                <div className="space-y-2">
                  {result.redFlags.map((flag, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-red-700">
                      <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{flag.symptom}:</span> {flag.description}
                        <p className="text-xs text-red-600 mt-0.5">Action: {flag.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-teal-600" />
                Recommended Actions
              </h3>
              <div className="space-y-2">
                {result.recommendedActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-700">{action.action}</p>
                      <p className="text-xs text-slate-500">Timeframe: {action.timeframe} • {action.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Specialists */}
            {result.recommendedSpecialists && result.recommendedSpecialists.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Recommended Specialists
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.recommendedSpecialists.map((spec, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                      <p className="font-medium text-slate-700">{spec.specialty}</p>
                      <p className="text-xs text-slate-500 mt-1">{spec.reason}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${
                        spec.urgency === 'immediate' ? 'bg-red-100 text-red-700' :
                        spec.urgency === 'urgent' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {spec.urgency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Home Remedies */}
            {result.homeRemedies && result.homeRemedies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-teal-600" />
                  Home Remedies
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.homeRemedies.map((remedy, idx) => (
                    <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="font-medium text-green-800">{remedy.remedy}</p>
                      <p className="text-xs text-green-700 mt-1">{remedy.instructions}</p>
                      {remedy.precautions.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          ⚠️ {remedy.precautions.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When to Seek Care */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">When to Seek Medical Care</h3>
              <ul className="space-y-2">
                {result.whenToSeekCare.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <Phone size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Disclaimer:</strong> {result.disclaimer}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                <Calendar size={18} />
                Schedule Appointment
              </button>
              <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={18} />
                Call Nurse Line
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AISymptomChecker;
