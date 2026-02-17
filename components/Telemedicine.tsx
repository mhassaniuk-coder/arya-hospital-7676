import React, { useState } from 'react';
import { Video, Phone, MessageSquare, Mic, User, Calendar, Clock, Paperclip, Send, Sparkles, Brain, Loader2, AlertTriangle, CheckCircle, Activity, Stethoscope, X } from 'lucide-react';
import { useSymptomChecker, useHealthChatbot, useAppointmentSchedulingAssistant, useDischargeFollowUp } from '../hooks/useAI';
import { SymptomCheckerResult, HealthChatbotResult, AppointmentSchedulingResult, DischargeFollowUpResult } from '../types';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'Video' | 'Audio' | 'Chat';
  status: 'Waiting' | 'In Call' | 'Completed';
  symptoms: string;
}

const Telemedicine: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'TELE-001', patientName: 'David Kim', time: '10:00 AM', type: 'Video', status: 'Waiting', symptoms: 'Fever, Cough' },
    { id: 'TELE-002', patientName: 'Maria Garcia', time: '10:30 AM', type: 'Chat', status: 'Waiting', symptoms: 'Skin Rash' },
    { id: 'TELE-003', patientName: 'James Wilson', time: '11:00 AM', type: 'Audio', status: 'Waiting', symptoms: 'Anxiety, Insomnia' },
  ]);

  const [activeCall, setActiveCall] = useState<Appointment | null>(null);
  const [message, setMessage] = useState('');

  // AI Feature States
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeAIFeature, setActiveAIFeature] = useState<'symptom' | 'chatbot' | 'scheduling' | 'followup'>('symptom');

  // Symptom Checker State
  const [symptomInput, setSymptomInput] = useState({
    symptoms: '',
    age: '',
    gender: 'Male',
    duration: '',
    severity: 'Moderate' as 'Mild' | 'Moderate' | 'Severe'
  });

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [chatInput, setChatInput] = useState('');

  // AI Hooks
  const symptomChecker = useSymptomChecker();
  const healthChatbot = useHealthChatbot();
  const appointmentScheduler = useAppointmentSchedulingAssistant();
  const dischargeFollowUp = useDischargeFollowUp();

  const startCall = (apt: Appointment) => {
    setActiveCall(apt);
  };

  const endCall = () => {
    if (activeCall) {
      setAppointments(appointments.map(a => a.id === activeCall.id ? { ...a, status: 'Completed' } : a));
      setActiveCall(null);
    }
  };

  // AI Symptom Checker Handler
  const handleSymptomCheck = async () => {
    if (!symptomInput.symptoms) return;

    await symptomChecker.execute({
      symptoms: symptomInput.symptoms,
      age: symptomInput.age ? parseInt(symptomInput.age) : undefined,
      gender: symptomInput.gender,
      duration: symptomInput.duration || undefined,
      severity: symptomInput.severity
    });
  };

  // AI Chatbot Handler
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');

    await healthChatbot.execute({
      message: userMessage,
      conversationHistory: chatMessages.map(m => ({
        role: m.role,
        content: m.content
      }))
    });

    if (healthChatbot.data) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: healthChatbot.data!.response }]);
    }
  };

  // Apply symptom checker recommendation to current patient
  const applySymptomRecommendation = () => {
    if (symptomChecker.data && activeCall) {
      // Update the appointment with AI recommendation
      console.log('Applied recommendation:', symptomChecker.data);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Telemedicine & Virtual Care</h1>
          <p className="text-foreground-secondary">AI-enhanced remote consultations and digital health services.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 theme-transition shadow-lg shadow-purple-600/20"
          >
            <Sparkles size={18} /> AI Assistant
          </button>
          <button className="bg-background-secondary border border-border text-foreground-primary px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-background-tertiary theme-transition">
            <Calendar size={18} /> Schedule
          </button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 theme-transition shadow-lg shadow-teal-600/20">
            <Video size={18} /> Instant Meeting
          </button>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAIPanel && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden">
          <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain size={20} />
              <h3 className="font-bold">AI Virtual Care Assistant</h3>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              {['symptom', 'chatbot', 'scheduling', 'followup'].map((feature) => (
                <button
                  key={feature}
                  onClick={() => setActiveAIFeature(feature as typeof activeAIFeature)}
                  className={`px-3 py-1 rounded text-sm font-medium theme-transition ${activeAIFeature === feature
                    ? 'bg-white text-purple-700'
                    : 'bg-purple-500 text-white hover:bg-purple-400'
                    }`}
                >
                  {feature === 'symptom' ? 'Symptom Check' :
                    feature === 'chatbot' ? 'Health Chat' :
                      feature === 'scheduling' ? 'Scheduling' : 'Follow-Up'}
                </button>
              ))}
              <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white ml-2 theme-transition">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Symptom Checker */}
            {activeAIFeature === 'symptom' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground-primary flex items-center gap-2">
                    <Stethoscope size={18} />
                    Patient Symptom Analysis
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-foreground-secondary mb-1">Symptoms</label>
                    <textarea
                      value={symptomInput.symptoms}
                      onChange={(e) => setSymptomInput({ ...symptomInput, symptoms: e.target.value })}
                      className="w-full h-24 p-3 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent theme-transition"
                      placeholder="Describe patient symptoms..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-1">Age</label>
                      <input
                        type="number"
                        value={symptomInput.age}
                        onChange={(e) => setSymptomInput({ ...symptomInput, age: e.target.value })}
                        className="w-full p-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 theme-transition"
                        placeholder="Patient age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-1">Gender</label>
                      <select
                        value={symptomInput.gender}
                        onChange={(e) => setSymptomInput({ ...symptomInput, gender: e.target.value })}
                        className="w-full p-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 theme-transition"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-1">Duration</label>
                      <input
                        type="text"
                        value={symptomInput.duration}
                        onChange={(e) => setSymptomInput({ ...symptomInput, duration: e.target.value })}
                        className="w-full p-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 theme-transition"
                        placeholder="e.g., 3 days"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground-secondary mb-1">Severity</label>
                      <select
                        value={symptomInput.severity}
                        onChange={(e) => setSymptomInput({ ...symptomInput, severity: e.target.value as 'Mild' | 'Moderate' | 'Severe' })}
                        className="w-full p-2 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 theme-transition"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSymptomCheck}
                    disabled={symptomChecker.loading || !symptomInput.symptoms}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {symptomChecker.loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Brain size={18} />
                        Analyze Symptoms
                      </>
                    )}
                  </button>
                </div>

                {/* Results */}
                <div className="bg-background-secondary rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-foreground-primary mb-4">AI Analysis Results</h4>

                  {symptomChecker.loading ? (
                    <div className="flex flex-col items-center justify-center h-48">
                      <Loader2 size={32} className="animate-spin text-purple-600 mb-4" />
                      <p className="text-foreground-secondary">Analyzing symptoms...</p>
                    </div>
                  ) : symptomChecker.data ? (
                    <div className="space-y-4">
                      {/* Urgency Level */}
                      <div className={`p-4 rounded-lg ${symptomChecker.data.urgencyLevel === 'Emergency' ? 'bg-danger-light border border-red-200' :
                        symptomChecker.data.urgencyLevel === 'Urgent' ? 'bg-warning-light border border-orange-200' :
                          'bg-success-light border border-green-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {symptomChecker.data.urgencyLevel === 'Emergency' ? (
                            <AlertTriangle className="text-danger-dark" size={20} />
                          ) : (
                            <Activity className={
                              symptomChecker.data.urgencyLevel === 'Urgent' ? 'text-warning-dark' : 'text-success-dark'
                            } size={20} />
                          )}
                          <span className="font-bold text-foreground-primary">Urgency: {symptomChecker.data.urgencyLevel}</span>
                        </div>
                        <p className="text-sm text-foreground-secondary">{symptomChecker.data.recommendation}</p>
                      </div>

                      {/* Possible Conditions */}
                      <div>
                        <h5 className="font-medium text-foreground-secondary mb-2">Possible Conditions</h5>
                        <div className="space-y-2">
                          {symptomChecker.data.possibleConditions.map((condition, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-background-tertiary rounded-lg">
                              <span className="text-sm text-foreground-primary">{condition.name}</span>
                              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">{condition.probability}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Actions */}
                      <div>
                        <h5 className="font-medium text-foreground-secondary mb-2">Recommended Actions</h5>
                        <div className="space-y-1">
                          {symptomChecker.data.recommendedActions.map((action, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-foreground-secondary">
                              <CheckCircle size={14} className="text-success-dark" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Red Flags */}
                      {symptomChecker.data.redFlags.length > 0 && (
                        <div className="p-3 bg-danger-light rounded-lg border border-red-200">
                          <h5 className="font-medium text-danger-dark mb-2 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Warning Signs to Watch For
                          </h5>
                          <div className="space-y-1">
                            {symptomChecker.data.redFlags.map((flag, idx) => (
                              <p key={idx} className="text-sm text-danger-dark">â€¢ {flag}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={applySymptomRecommendation}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2 theme-transition"
                      >
                        <CheckCircle size={16} />
                        Apply to Current Consultation
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-foreground-muted">
                      <Stethoscope size={32} className="mb-4" />
                      <p>Enter symptoms to get AI analysis</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Health Chatbot */}
            {activeAIFeature === 'chatbot' && (
              <div className="bg-background-secondary rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden">
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-foreground-muted">
                      <MessageSquare size={32} className="mb-4" />
                      <p>Start a conversation with the AI Health Assistant</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-background-tertiary text-foreground-primary rounded-bl-none'
                          }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {healthChatbot.loading && (
                    <div className="flex justify-start">
                      <div className="bg-background-tertiary p-3 rounded-lg rounded-bl-none">
                        <Loader2 size={18} className="animate-spin text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    className="flex-1 p-3 border border-border rounded-lg bg-background-primary text-foreground-primary focus:ring-2 focus:ring-purple-500 theme-transition"
                    placeholder="Ask a health question..."
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={healthChatbot.loading || !chatInput.trim()}
                    className="bg-purple-600 text-white px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 theme-transition"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Appointment Scheduling */}
            {activeAIFeature === 'scheduling' && (
              <div className="bg-background-secondary rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-foreground-primary mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  AI Appointment Scheduling Assistant
                </h4>
                <p className="text-foreground-secondary mb-4">
                  The AI assistant helps find optimal appointment slots based on patient preferences,
                  provider availability, and urgency levels.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <h5 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Smart Scheduling</h5>
                    <p className="text-sm text-purple-600 dark:text-purple-400">AI optimizes appointment timing based on multiple factors</p>
                  </div>
                  <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <h5 className="font-medium text-teal-800 dark:text-teal-300 mb-2">Wait Time Prediction</h5>
                    <p className="text-sm text-teal-600 dark:text-teal-400">Predicts expected wait times for better patient experience</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Preference Learning</h5>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Learns patient preferences over time</p>
                  </div>
                </div>
              </div>
            )}

            {/* Discharge Follow-Up */}
            {activeAIFeature === 'followup' && (
              <div className="bg-background-secondary rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-foreground-primary mb-4 flex items-center gap-2">
                  <Activity size={18} />
                  AI Post-Discharge Follow-Up System
                </h4>
                <p className="text-foreground-secondary mb-4">
                  Automated follow-up scheduling and monitoring for discharged patients to reduce
                  readmissions and improve outcomes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-success-light rounded-lg border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-success-dark mb-2">Risk Stratification</h5>
                    <p className="text-sm text-green-600 dark:text-green-400">Identifies high-risk patients for intensive follow-up</p>
                  </div>
                  <div className="p-4 bg-warning-light rounded-lg border border-orange-200 dark:border-orange-800">
                    <h5 className="font-medium text-warning-dark mb-2">Automated Check-ins</h5>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Sends automated check-in messages to patients</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Appointments List */}
        <div className="bg-background-secondary rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-muted bg-background-tertiary font-bold text-foreground-primary">
            Upcoming Consultations
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className={`p-4 border rounded-xl hover:shadow-sm cursor-pointer theme-transition ${activeCall?.id === apt.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-border bg-background-primary hover:border-teal-200 dark:hover:border-teal-800'
                  }`}
                onClick={() => startCall(apt)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background-tertiary rounded-full flex items-center justify-center text-foreground-secondary">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground-primary">{apt.patientName}</h4>
                      <p className="text-xs text-foreground-muted flex items-center gap-1">
                        <Clock size={12} /> {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg ${apt.type === 'Video' ? 'bg-info-light text-info-dark' :
                    apt.type === 'Audio' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                      'bg-success-light text-success-dark'
                    }`}>
                    {apt.type === 'Video' ? <Video size={16} /> : apt.type === 'Audio' ? <Phone size={16} /> : <MessageSquare size={16} />}
                  </div>
                </div>
                <p className="text-xs text-foreground-secondary bg-background-tertiary p-2 rounded-lg">
                  <span className="font-medium">Symptoms:</span> {apt.symptoms}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Call Interface */}
        <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-950 rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
          {activeCall ? (
            <>
              <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{activeCall.time} â€¢ {activeCall.patientName}</span>
              </div>

              {/* Video Area Placeholder */}
              <div className="flex-1 bg-slate-800 dark:bg-slate-900 flex items-center justify-center relative">
                <div className="text-center">
                  <div className="w-32 h-32 bg-slate-700 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-600 dark:border-slate-700">
                    <User size={64} className="text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg">Connecting to patient...</p>
                </div>

                {/* Self View */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-xl border border-slate-700 dark:border-slate-600 shadow-lg flex items-center justify-center">
                  <p className="text-xs text-slate-500">You</p>
                </div>
              </div>

              {/* Controls */}
              <div className="h-20 bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-slate-700 flex items-center justify-center gap-6">
                <button type="button" className="p-4 bg-slate-800 dark:bg-slate-700 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-600 theme-transition" aria-label="Mute microphone"><Mic size={20} /></button>
                <button type="button" className="p-4 bg-slate-800 dark:bg-slate-700 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-600 theme-transition" aria-label="Toggle video"><Video size={20} /></button>
                <button
                  type="button"
                  onClick={endCall}
                  className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 theme-transition px-8 font-bold"
                  aria-label="End call"
                >
                  End Call
                </button>
                <button type="button" className="p-4 bg-slate-800 dark:bg-slate-700 rounded-full text-white hover:bg-slate-700 dark:hover:bg-slate-600 theme-transition" aria-label="Open chat"><MessageSquare size={20} /></button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="w-20 h-20 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
                <Video size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-300 dark:text-slate-400 mb-2">No Active Consultation</h3>
              <p>Select a patient from the list to start a call.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
