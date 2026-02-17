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
                    <h1 className="text-2xl font-bold text-foreground-primary">Shift Roster & AI Scheduling</h1>
                    <p className="text-foreground-secondary">AI-optimized staff scheduling and fatigue management.</p>
                </div>
                <button
                    onClick={runAIScheduling}
                    disabled={scheduleLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center gap-2 theme-transition"
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
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg p-6 animate-scale-up theme-transition">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Brain className="text-purple-600 dark:text-purple-400" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-900 dark:text-purple-100">AI Schedule Optimization</h3>
                                <p className="text-xs text-purple-600 dark:text-purple-300">Intelligent staff allocation and fatigue management</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600 theme-transition" title="Close">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Optimization Metrics */}
                        <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                                <TrendingUp size={16} className="text-teal-500" />
                                Optimization Metrics
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-foreground-secondary">Preference Match</span>
                                        <span className="font-bold text-teal-600">{aiScheduleResult.optimizationMetrics.preferenceMatchRate}%</span>
                                    </div>
                                    <div className="w-full bg-background-tertiary rounded-full h-2">
                                        <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.preferenceMatchRate}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-foreground-secondary">Skill Coverage</span>
                                        <span className="font-bold text-blue-600">{aiScheduleResult.optimizationMetrics.skillCoverageRate}%</span>
                                    </div>
                                    <div className="w-full bg-background-tertiary rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.skillCoverageRate}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-foreground-secondary">Fairness Score</span>
                                        <span className="font-bold text-purple-600">{aiScheduleResult.optimizationMetrics.fairnessScore}%</span>
                                    </div>
                                    <div className="w-full bg-background-tertiary rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${aiScheduleResult.optimizationMetrics.fairnessScore}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fatigue Risk Alerts */}
                        <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" />
                                Fatigue Risk Alerts
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {aiScheduleResult.fatigueRiskAlerts.length > 0 ? (
                                    aiScheduleResult.fatigueRiskAlerts.map((alert, idx) => (
                                        <div key={idx} className={`p-2 rounded-lg ${alert.riskLevel === 'High' ? 'bg-danger-light border border-red-200' :
                                            alert.riskLevel === 'Medium' ? 'bg-warning-light border border-orange-200' :
                                                'bg-success-light border border-green-200'
                                            }`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-foreground-primary">{alert.staffName}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${alert.riskLevel === 'High' ? 'bg-danger-light text-danger-dark' :
                                                    alert.riskLevel === 'Medium' ? 'bg-warning-light text-warning-dark' :
                                                        'bg-success-light text-success-dark'
                                                    }`}>{alert.riskLevel}</span>
                                            </div>
                                            <p className="text-xs text-foreground-muted mt-1">{alert.recommendation}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <CheckCircle size={24} className="text-success-dark mx-auto mb-2" />
                                        <p className="text-sm text-success-dark">No fatigue risks detected</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Staffing Needs */}
                        <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
                            <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                                <Users size={16} className="text-blue-500" />
                                Staffing Needs
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {aiScheduleResult.staffingNeeds.map((need, idx) => (
                                    <div key={idx} className="bg-background-secondary rounded-lg p-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-foreground-primary">{need.department}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-foreground-muted">{need.currentAllocation}</span>
                                                <span className="text-xs text-foreground-muted">→</span>
                                                <span className={`text-xs font-bold ${need.gap > 0 ? 'text-danger-dark' : 'text-success-dark'}`}>
                                                    {need.recommendedStaff}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-foreground-muted mt-1">{need.recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Coverage Prediction Heatmap */}
                    <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4 theme-transition">
                        <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                            <TrendingUp size={16} className="text-teal-500" />
                            Shift Coverage Prediction (7-Day Forecast)
                        </h4>
                        <div className="grid grid-cols-7 gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                <div key={day} className="flex flex-col gap-1">
                                    <span className="text-xs text-center font-medium text-foreground-muted">{day}</span>
                                    <div className={`h-12 rounded-lg flex items-center justify-center border text-xs font-bold transition-all hover:scale-105 cursor-help theme-transition
                                        ${i === 2 || i === 5 ? 'bg-danger-light border-red-200 dark:border-red-800 text-danger-dark' :
                                            i === 3 ? 'bg-warning-light border-orange-200 dark:border-orange-800 text-warning-dark' :
                                                'bg-success-light border-green-200 dark:border-green-800 text-success-dark'}`}
                                        title={i === 2 || i === 5 ? "High risk of understaffing in ICU" : "Optimal coverage predicted"}
                                    >
                                        {i === 2 || i === 5 ? '85%' : i === 3 ? '92%' : '100%'}
                                    </div>
                                    <div className="flex gap-0.5 justify-center">
                                        {i === 2 && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-foreground-muted mt-2 flex items-center gap-1">
                            <AlertCircle size={12} className="text-purple-500" />
                            AI predicts a shortage on Wednesday (ICU) and Saturday (Emergency) based on historical admission trends.
                        </p>
                    </div>

                    {/* Optimized Schedule Preview */}
                    <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
                        <h4 className="font-semibold text-foreground-primary mb-3">Optimized Schedule Preview</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {aiScheduleResult.optimizedSchedule.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="bg-background-secondary rounded-lg p-3 theme-transition">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-foreground-primary">{item.area}</span>
                                        <span className="text-xs text-foreground-muted">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-foreground-secondary mb-2">{item.time}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {item.assignedStaff.slice(0, 3).map((staff, i) => (
                                            <span key={i} className="text-xs bg-info-light text-info-dark px-2 py-0.5 rounded-full">
                                                {staff.name}
                                            </span>
                                        ))}
                                    </div>
                                    {item.coverageGap && (
                                        <span className="text-xs bg-danger-light text-danger-dark px-2 py-0.5 rounded mt-2 inline-block">
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
                    <div key={day} className="bg-background-elevated p-4 rounded-2xl shadow-sm border border-border theme-transition">
                        <h3 className="font-bold text-foreground-primary mb-4 pb-2 border-b border-border">{day}</h3>
                        <div className="space-y-3">
                            {MOCK_SHIFTS.filter(s => s.day === day).map(shift => (
                                <div key={shift.id} className="p-3 bg-background-secondary rounded-xl border border-border theme-transition">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-info-light rounded-full flex items-center justify-center text-info-dark">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground-primary">{shift.staffName}</p>
                                            <p className="text-xs text-foreground-muted">{shift.role} • {shift.area}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-foreground-secondary bg-background-tertiary p-2 rounded-lg border border-border">
                                        <Clock size={14} className="text-teal-500" />
                                        {shift.time}
                                    </div>
                                </div>
                            ))}
                            {MOCK_SHIFTS.filter(s => s.day === day).length === 0 && (
                                <p className="text-sm text-foreground-muted italic text-center py-4">No shifts scheduled</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftRoster;
