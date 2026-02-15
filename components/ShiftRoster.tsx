import React, { useState, useEffect } from 'react';
import { Shift, StaffSchedulingResult } from '../types';
import { Clock, User, Sparkles, Brain, Loader2, AlertCircle, CheckCircle, TrendingUp, Users, X } from 'lucide-react';
import { useStaffSchedulingOptimizer } from '../hooks/useAI';

const MOCK_SHIFTS: Shift[] = [
    { id: '1', staffName: 'Dr. Sarah Chen', role: 'Doctor', day: 'Monday', time: '08:00 - 16:00', area: 'Cardiology' },
    { id: '2', staffName: 'Nurse Joy', role: 'Nurse', day: 'Monday', time: '08:00 - 20:00', area: 'ICU' },
    { id: '3', staffName: 'Dr. Mike Ross', role: 'Doctor', day: 'Tuesday', time: '16:00 - 00:00', area: 'Neurology' },
    { id: '4', staffName: 'Nurse Williams', role: 'Nurse', day: 'Monday', time: '08:00 - 16:00', area: 'Emergency' },
    { id: '5', staffName: 'Dr. Wilson', role: 'Doctor', day: 'Wednesday', time: '08:00 - 16:00', area: 'Surgery' },
    { id: '6', staffName: 'Nurse Johnson', role: 'Nurse', day: 'Tuesday', time: '08:00 - 20:00', area: 'ICU' },
];

const MOCK_STAFF = [
    { id: 's1', name: 'Dr. Sarah Chen', role: 'Doctor', skills: ['Cardiology', 'Emergency'], currentHours: 40, fatigueScore: 30 },
    { id: 's2', name: 'Nurse Joy', role: 'Nurse', skills: ['ICU', 'Emergency'], currentHours: 45, fatigueScore: 55 },
    { id: 's3', name: 'Dr. Mike Ross', role: 'Doctor', skills: ['Neurology', 'General'], currentHours: 38, fatigueScore: 25 },
    { id: 's4', name: 'Nurse Williams', role: 'Nurse', skills: ['Emergency', 'Trauma'], currentHours: 42, fatigueScore: 45 },
    { id: 's5', name: 'Dr. Wilson', role: 'Doctor', skills: ['Surgery', 'Orthopedics'], currentHours: 50, fatigueScore: 70 },
    { id: 's6', name: 'Nurse Johnson', role: 'Nurse', skills: ['ICU', 'Pediatrics'], currentHours: 35, fatigueScore: 20 },
];

const ShiftRoster: React.FC = () => {
    const [showAIPanel, setShowAIPanel] = useState(false);
    const [aiScheduleResult, setAiScheduleResult] = useState<StaffSchedulingResult | null>(null);

    const { data: scheduleResult, loading: scheduleLoading, execute: runScheduleOptimization } = useStaffSchedulingOptimizer();

    // Run AI scheduling optimization
    const runAIScheduling = async () => {
        await runScheduleOptimization({
            staff: MOCK_STAFF.map(s => ({
                id: s.id,
                name: s.name,
                role: s.role,
                skills: s.skills,
                currentHours: s.currentHours,
                fatigueScore: s.fatigueScore,
                preferences: {
                    preferredShifts: ['Morning'],
                    unavailableDates: [],
                    maxHoursPerWeek: 48
                }
            })),
            shifts: MOCK_SHIFTS.map(shift => ({
                id: shift.id,
                date: shift.day,
                time: shift.time,
                area: shift.area,
                requiredRole: shift.role,
                requiredSkills: [],
                minStaff: 2
            }))
        });
    };

    // Update AI result when data changes
    useEffect(() => {
        if (scheduleResult) {
            setAiScheduleResult(scheduleResult);
            setShowAIPanel(true);
        }
    }, [scheduleResult]);

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Shift Roster & AI Scheduling</h1>
                  <p className="text-slate-500">AI-optimized staff scheduling and fatigue management.</p>
                </div>
                <button 
                    onClick={runAIScheduling}
                    disabled={scheduleLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                    {scheduleLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Sparkles size={18} />
                    )}
                    AI Optimize Schedule
                </button>
            </div>

            {/* AI Scheduling Result Panel */}
            {showAIPanel && aiScheduleResult && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 shadow-lg p-6 animate-scale-up">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Brain className="text-purple-600" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-900">AI Schedule Optimization</h3>
                                <p className="text-xs text-purple-600">Intelligent staff allocation and fatigue management</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600" title="Close">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Optimization Metrics */}
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <TrendingUp size={16} className="text-teal-500" />
                                Optimization Metrics
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Preference Match</span>
                                        <span className="font-bold text-teal-600">{aiScheduleResult.optimizationMetrics.preferenceMatchRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.preferenceMatchRate}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Skill Coverage</span>
                                        <span className="font-bold text-blue-600">{aiScheduleResult.optimizationMetrics.skillCoverageRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.skillCoverageRate}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600">Fairness Score</span>
                                        <span className="font-bold text-purple-600">{aiScheduleResult.optimizationMetrics.fairnessScore}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.fairnessScore}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fatigue Risk Alerts */}
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" />
                                Fatigue Risk Alerts
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {aiScheduleResult.fatigueRiskAlerts.length > 0 ? (
                                    aiScheduleResult.fatigueRiskAlerts.map((alert, idx) => (
                                        <div key={idx} className={`p-2 rounded-lg ${
                                            alert.riskLevel === 'High' ? 'bg-red-50 border border-red-200' :
                                            alert.riskLevel === 'Medium' ? 'bg-orange-50 border border-orange-200' :
                                            'bg-green-50 border border-green-200'
                                        }`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-slate-800">{alert.staffName}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    alert.riskLevel === 'High' ? 'bg-red-200 text-red-800' :
                                                    alert.riskLevel === 'Medium' ? 'bg-orange-200 text-orange-800' :
                                                    'bg-green-200 text-green-800'
                                                }`}>{alert.riskLevel}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">{alert.recommendation}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <CheckCircle size={24} className="text-green-500 mx-auto mb-2" />
                                        <p className="text-sm text-green-600">No fatigue risks detected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Staffing Needs */}
                        <div className="bg-white rounded-xl p-4 border border-purple-100">
                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                <Users size={16} className="text-blue-500" />
                                Staffing Needs
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {aiScheduleResult.staffingNeeds.map((need, idx) => (
                                    <div key={idx} className="bg-slate-50 rounded-lg p-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-800">{need.department}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-slate-500">{need.currentAllocation}</span>
                                                <span className="text-xs text-slate-400">→</span>
                                                <span className={`text-xs font-bold ${need.gap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {need.recommendedStaff}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{need.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Optimized Schedule Preview */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <h4 className="font-semibold text-slate-800 mb-3">Optimized Schedule Preview</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {aiScheduleResult.optimizedSchedule.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-slate-800">{item.area}</span>
                                        <span className="text-xs text-slate-500">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2">{item.time}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {item.assignedStaff.slice(0, 3).map((staff, i) => (
                                            <span key={i} className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                                                {staff.name}
                                            </span>
                                        ))}
                                    </div>
                                    {item.coverageGap && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded mt-2 inline-block">
                                            Coverage Gap
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Monday', 'Tuesday', 'Wednesday'].map(day => (
                    <div key={day} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{day}</h3>
                        <div className="space-y-3">
                            {MOCK_SHIFTS.filter(s => s.day === day).map(shift => (
                                <div key={shift.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{shift.staffName}</p>
                                            <p className="text-xs text-slate-500">{shift.role} • {shift.area}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                        <Clock size={14} className="text-teal-500" />
                                        {shift.time}
                                    </div>
                                </div>
                            ))}
                            {MOCK_SHIFTS.filter(s => s.day === day).length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">No shifts scheduled</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftRoster;
