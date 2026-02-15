import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Sparkles, 
  ChevronRight,
  CheckCircle,
  Star,
  Phone,
  AlertCircle,
  CreditCard,
  FileText,
  Users,
  Timer
} from 'lucide-react';
import { useAppointmentSchedulingAssistant } from '../hooks/useAI';
import { AppointmentSchedulingResult } from '../types';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

const AIAppointmentScheduler: React.FC = () => {
  const [appointmentType, setAppointmentType] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [showResults, setShowResults] = useState(false);

  const { execute: getScheduleAssistance, data: result, loading, error } = useAppointmentSchedulingAssistant();

  const appointmentTypes = [
    'General Checkup',
    'Follow-up Visit',
    'New Patient Visit',
    'Specialist Consultation',
    'Annual Physical',
    'Urgent Care',
    'Telemedicine Visit',
    'Lab Work',
    'Vaccination'
  ];

  const timeSlots = [
    'Early Morning (7-9 AM)',
    'Morning (9-12 PM)',
    'Afternoon (12-5 PM)',
    'Evening (5-7 PM)'
  ];

  const handleFindAppointments = async () => {
    if (!appointmentType) return;

    await getScheduleAssistance({
      appointmentType,
      reasonForVisit,
      patientPreferences: {
        preferredDates: preferredDate ? [preferredDate] : undefined,
        preferredTimes: preferredTime ? [preferredTime] : undefined,
        urgencyLevel
      }
    });
    setShowResults(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Smart Appointment Scheduler
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                AI-Powered
              </span>
            </h2>
            <p className="text-sm text-slate-500">Find the best appointment time and provider for your needs</p>
          </div>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Appointment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Appointment Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {appointmentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setAppointmentType(type)}
                  className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                    appointmentType === type
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit (Optional)</label>
            <textarea
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="Describe your symptoms or reason for the appointment..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select preferred time"
              >
                <option value="">Any time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
              <select
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value as 'routine' | 'urgent' | 'emergency')}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Select urgency level"
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Find Appointments Button */}
          <button
            onClick={handleFindAppointments}
            disabled={!appointmentType || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finding Best Options...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Find Best Appointment Options
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
              ← Back to search
            </button>

            {/* Recommended Slots */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Recommended Appointment Times
              </h3>
              <div className="space-y-3">
                {result.recommendedSlots.map((slot, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">{formatDate(slot.date).split(' ')[0]}</span>
                          <span className="text-lg font-bold text-blue-700">{formatDate(slot.date).split(' ')[1]}</span>
                          <span className="text-xs text-blue-600">{formatDate(slot.date).split(' ')[2]}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800">{slot.time}</span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              {Math.round(slot.matchScore * 100)}% Match
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                            <User size={14} />
                            <span>{slot.providerName}</span>
                            <span className="text-slate-300">•</span>
                            <span>{slot.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <MapPin size={14} />
                            <span>{slot.location}</span>
                            <span className="text-slate-300">•</span>
                            <Timer size={14} />
                            <span>~{slot.estimatedWaitTime} min wait</span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Book Now
                      </button>
                    </div>
                    {slot.reasons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {slot.reasons.map((reason, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Matches */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Best Provider Matches
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {result.providerMatches.map((provider, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800">{provider.providerName}</h4>
                        <p className="text-xs text-slate-500">{provider.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {provider.patientRating && (
                            <div className="flex items-center gap-1 text-xs text-yellow-600">
                              <Star size={12} fill="currentColor" />
                              {provider.patientRating}
                            </div>
                          )}
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            {Math.round(provider.matchScore * 100)}% Match
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Why this provider?</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.matchReasons.slice(0, 2).map((reason, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle size={12} />
                      {provider.availability}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wait Time Predictions */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-600" />
                Wait Time Predictions
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {result.waitTimePredictions.map((prediction, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 text-center">
                    <p className="text-sm font-medium text-slate-600">{formatDate(prediction.date)}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">~{prediction.predictedWait} min</p>
                    <p className="text-xs text-slate-500">wait time</p>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500">{Math.round(prediction.confidence * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Considerations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Insurance & Cost Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Coverage</p>
                  <p className="font-medium text-blue-800">{result.insuranceConsiderations.coverage}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Estimated Cost</p>
                  <p className="font-medium text-blue-800">{result.insuranceConsiderations.estimatedCost}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Referral Required</p>
                  <p className="font-medium text-blue-800">
                    {result.insuranceConsiderations.referralRequired ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Pre-Authorization</p>
                  <p className="font-medium text-blue-800">
                    {result.insuranceConsiderations.preAuthorizationNeeded ? 'Required' : 'Not Required'}
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation Reminders */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Preparation Checklist
              </h3>
              <div className="space-y-2">
                {result.preparationReminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{reminder.reminder}</p>
                      <p className="text-xs text-slate-500">
                        <span className="text-blue-600">{reminder.timing}</span> • {reminder.importance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 mb-2">💡 Scheduling Tips</h3>
              <ul className="space-y-1">
                {result.optimizationTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                    <ChevronRight size={14} className="mt-1 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIAppointmentScheduler;
