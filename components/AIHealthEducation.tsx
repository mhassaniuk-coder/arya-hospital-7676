import React, { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  Activity, 
  Pill, 
  Apple, 
  Moon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  FileText,
  Video,
  Users,
  Phone,
  ExternalLink,
  CheckCircle,
  Info
} from 'lucide-react';
import { useHealthEducationGenerator } from '../hooks/useAI';
import { HealthEducationResult } from '../types';

const AIHealthEducation: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [currentCondition, setCurrentCondition] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMedication, setCurrentMedication] = useState('');
  const [educationGoals, setEducationGoals] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('primary');

  const { execute: generateEducation, data: result, loading, error } = useHealthEducationGenerator();

  const commonConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis',
    'Depression', 'Anxiety', 'COPD', 'Thyroid Disorder', 'High Cholesterol'
  ];

  const goalOptions = [
    { id: 'understand_condition', label: 'Understand My Condition' },
    { id: 'treatment_options', label: 'Learn About Treatment Options' },
    { id: 'medication_management', label: 'Medication Management' },
    { id: 'lifestyle_changes', label: 'Lifestyle Changes' },
    { id: 'prevention', label: 'Preventive Care' }
  ];

  const addCondition = (condition: string) => {
    if (!condition.trim() || conditions.includes(condition)) return;
    setConditions([...conditions, condition]);
    setCurrentCondition('');
  };

  const removeCondition = (condition: string) => {
    setConditions(conditions.filter(c => c !== condition));
  };

  const addMedication = () => {
    if (!currentMedication.trim() || medications.includes(currentMedication)) return;
    setMedications([...medications, currentMedication]);
    setCurrentMedication('');
  };

  const removeMedication = (medication: string) => {
    setMedications(medications.filter(m => m !== medication));
  };

  const toggleGoal = (goalId: string) => {
    if (educationGoals.includes(goalId)) {
      setEducationGoals(educationGoals.filter(g => g !== goalId));
    } else {
      setEducationGoals([...educationGoals, goalId]);
    }
  };

  const handleGenerate = async () => {
    if (conditions.length === 0 || !age || !gender) return;

    await generateEducation({
      patientInfo: {
        age: parseInt(age),
        gender: gender
      },
      healthContext: {
        conditions: conditions,
        medications: medications.length > 0 ? medications : undefined
      },
      educationGoals: educationGoals.length > 0 ? educationGoals as any : ['understand_condition']
    });
    setShowResults(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diet': return <Apple size={16} />;
      case 'exercise': return <Activity size={16} />;
      case 'sleep': return <Moon size={16} />;
      case 'stress_management': return <Heart size={16} />;
      default: return <Target size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'diet': return 'bg-green-100 text-green-700';
      case 'exercise': return 'bg-blue-100 text-blue-700';
      case 'sleep': return 'bg-purple-100 text-purple-700';
      case 'stress_management': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Personalized Health Education
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Get personalized health education content</p>
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                title="Select gender"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Health Conditions *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonConditions.map(condition => (
                <button
                  key={condition}
                  onClick={() => addCondition(condition)}
                  disabled={conditions.includes(condition)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    conditions.includes(condition)
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-500 hover:text-indigo-600'
                  }`}
                >
                  {conditions.includes(condition) ? '✓ ' : '+ '}{condition}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentCondition}
                onChange={(e) => setCurrentCondition(e.target.value)}
                placeholder="Or type a condition..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCondition(currentCondition)}
              />
              <button
                onClick={() => addCondition(currentCondition)}
                disabled={!currentCondition.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {conditions.map(condition => (
                  <span key={condition} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    {condition}
                    <button onClick={() => removeCondition(condition)} className="hover:text-indigo-900">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Current Medications (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMedication}
                onChange={(e) => setCurrentMedication(e.target.value)}
                placeholder="Enter medication name"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addMedication()}
              />
              <button
                onClick={addMedication}
                disabled={!currentMedication.trim()}
                className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
            {medications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {medications.map(med => (
                  <span key={med} className="bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Pill size={12} />
                    {med}
                    <button onClick={() => removeMedication(med)} className="hover:text-slate-900">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Education Goals */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">What would you like to learn about?</label>
            <div className="grid grid-cols-2 gap-2">
              {goalOptions.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                    educationGoals.includes(goal.id)
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                  }`}
                >
                  {educationGoals.includes(goal.id) && <CheckCircle size={14} className="inline mr-2" />}
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={conditions.length === 0 || !age || !gender || loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating Education Content...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Personalized Education
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
              ← Back to input
            </button>

            {/* Primary Content */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'primary' ? null : 'primary')}
                className="w-full p-4 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-indigo-800">{result.primaryContent.title}</span>
                </div>
                {expandedSection === 'primary' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSection === 'primary' && (
                <div className="p-4">
                  <p className="text-slate-600 mb-4">{result.primaryContent.summary}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.primaryContent.detailedContent}</p>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Key Points:</p>
                    <ul className="space-y-2">
                      {result.primaryContent.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <span className="bg-slate-100 px-2 py-1 rounded-full">
                      {result.primaryContent.readingLevel} reading level
                    </span>
                    <span className="bg-slate-100 px-2 py-1 rounded-full">
                      ~{result.primaryContent.estimatedReadTime} min read
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Condition Explanation */}
            {result.conditionExplanation.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'conditions' ? null : 'conditions')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Understanding Your Condition</span>
                  </div>
                  {expandedSection === 'conditions' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'conditions' && (
                  <div className="p-4 space-y-4">
                    {result.conditionExplanation.map((condition, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-800 text-lg">{condition.condition}</h4>
                        <p className="text-sm text-slate-600 mt-2">{condition.whatItIs}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Causes</p>
                            <div className="flex flex-wrap gap-1">
                              {condition.causes.map((cause, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                  {cause}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">Symptoms</p>
                            <div className="flex flex-wrap gap-1">
                              {condition.symptoms.map((symptom, i) => (
                                <span key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-sm text-slate-600"><strong>Progression:</strong> {condition.progression}</p>
                          <p className="text-sm text-slate-600 mt-1"><strong>Prognosis:</strong> {condition.prognosis}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Treatment Information */}
            {result.treatmentInformation.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'treatments' ? null : 'treatments')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Treatment Options</span>
                  </div>
                  {expandedSection === 'treatments' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'treatments' && (
                  <div className="p-4 space-y-3">
                    {result.treatmentInformation.map((treatment, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-800">{treatment.treatment}</h4>
                        <p className="text-sm text-slate-600 mt-1">{treatment.howItWorks}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-1">Benefits</p>
                            <ul className="space-y-1">
                              {treatment.benefits.map((benefit, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                                  <CheckCircle size={10} className="text-green-500 mt-0.5" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-1">Risks</p>
                            <ul className="space-y-1">
                              {treatment.risks.map((risk, i) => (
                                <li key={i} className="text-xs text-slate-600 flex items-start gap-1">
                                  <Info size={10} className="text-red-500 mt-0.5" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500"><strong>What to Expect:</strong> {treatment.whatToExpect}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Lifestyle Recommendations */}
            {result.lifestyleRecommendations.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'lifestyle' ? null : 'lifestyle')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Lifestyle Recommendations</span>
                  </div>
                  {expandedSection === 'lifestyle' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'lifestyle' && (
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {result.lifestyleRecommendations.map((rec, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(rec.category)}`}>
                            {getCategoryIcon(rec.category)}
                          </span>
                          <span className="font-medium text-slate-700 capitalize">{rec.category}</span>
                        </div>
                        <p className="text-sm text-slate-800">{rec.recommendation}</p>
                        <p className="text-xs text-slate-500 mt-1">{rec.rationale}</p>
                        <div className="mt-2">
                          <p className="text-xs text-slate-500">Tips:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rec.implementationTips.map((tip, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
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
            )}

            {/* Medication Education */}
            {result.medicationEducation.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'meds' ? null : 'meds')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Medication Guide</span>
                  </div>
                  {expandedSection === 'meds' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'meds' && (
                  <div className="p-4 space-y-3">
                    {result.medicationEducation.map((med, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                          <Pill size={14} className="text-indigo-500" />
                          {med.medication}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">{med.purpose}</p>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                          <div>
                            <p className="font-medium text-slate-500">How to Take:</p>
                            <p className="text-slate-700">{med.howToTake}</p>
                          </div>
                          <div>
                            <p className="font-medium text-slate-500">Storage:</p>
                            <p className="text-slate-700">{med.storage}</p>
                          </div>
                          <div>
                            <p className="font-medium text-yellow-600">Side Effects:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {med.sideEffects.map((effect, i) => (
                                <span key={i} className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                                  {effect}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">Interactions:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {med.interactions.map((interaction, i) => (
                                <span key={i} className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
                                  {interaction}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-xs text-slate-500"><strong>Missed Dose:</strong> {med.missedDose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preventive Care */}
            {result.preventiveCare.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'preventive' ? null : 'preventive')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Preventive Care</span>
                  </div>
                  {expandedSection === 'preventive' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'preventive' && (
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {result.preventiveCare.map((screening, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <p className="font-medium text-slate-700">{screening.screening}</p>
                        <p className="text-xs text-slate-500 mt-1">Frequency: {screening.frequency}</p>
                        <p className="text-xs text-slate-600 mt-1">{screening.importance}</p>
                        {screening.nextDue && (
                          <p className="text-xs text-indigo-600 mt-1">Next due: {screening.nextDue}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQs */}
            {result.faqs.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'faqs' ? null : 'faqs')}
                  className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800">Frequently Asked Questions</span>
                  </div>
                  {expandedSection === 'faqs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedSection === 'faqs' && (
                  <div className="p-4 space-y-3">
                    {result.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3">
                        <p className="font-medium text-slate-700">{faq.question}</p>
                        <p className="text-sm text-slate-600 mt-1">{faq.answer}</p>
                        <span className="text-xs text-indigo-600 mt-2 inline-block">{faq.category}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources */}
            {result.resources.length > 0 && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <ExternalLink size={16} />
                  Additional Resources
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {result.resources.map((resource, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {resource.type}
                      </span>
                      <p className="text-sm font-medium text-slate-700 mt-2">{resource.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Plan */}
            {result.actionPlan.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <Target size={16} />
                  Your Personal Action Plan
                </h3>
                <div className="space-y-3">
                  {result.actionPlan.map((plan, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-700">{plan.goal}</p>
                        <span className="text-xs text-indigo-600">{plan.timeline}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-slate-500 mb-1">Steps:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.steps.map((step, i) => (
                            <span key={i} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                              {i + 1}. {step}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        <strong>Success:</strong> {plan.successMetrics}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default AIHealthEducation;
