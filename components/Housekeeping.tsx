import React, { useState } from 'react';
import { HousekeepingTask } from '../types';
import { Brush, CheckCircle, Clock, Brain, RefreshCw, Users, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { useHousekeepingScheduler } from '../hooks/useAI';
import { HousekeepingSchedulingInput } from '../types';

const MOCK_TASKS: HousekeepingTask[] = [
    { id: '1', area: 'Room 304-A', assignee: 'Staff A', status: 'Pending', priority: 'Normal' },
    { id: '2', area: 'ICU Corridor', assignee: 'Staff B', status: 'In Progress', priority: 'High' },
    { id: '3', area: 'Lobby', assignee: 'Staff C', status: 'Completed', priority: 'Normal' },
];

const Housekeeping: React.FC = () => {
    const [showAIPanel, setShowAIPanel] = useState(false);
    const { data: aiResult, loading: aiLoading, error: aiError, execute: executeAI } = useHousekeepingScheduler();

    const runAIOptimization = () => {
        const input: HousekeepingSchedulingInput = {
            tasks: MOCK_TASKS.map(t => ({
                id: t.id,
                area: t.area,
                assignee: t.assignee,
                status: t.status,
                priority: t.priority
            })),
            dischargePredictions: [
                { roomNumber: '304-A', predictedDischargeTime: '2024-03-15 10:00', patientName: 'John Doe' },
                { roomNumber: '205-B', predictedDischargeTime: '2024-03-15 14:00', patientName: 'Jane Smith' },
                { roomNumber: 'ICU-3', predictedDischargeTime: '2024-03-16 09:00', patientName: 'Bob Wilson' },
            ],
            staffAvailability: [
                { name: 'Staff A', role: 'Cleaner', shift: '07:00-15:00', skills: ['General', 'ICU'] },
                { name: 'Staff B', role: 'Cleaner', shift: '07:00-15:00', skills: ['ICU', 'Surgery'] },
                { name: 'Staff C', role: 'Supervisor', shift: '08:00-16:00', skills: ['All'] },
            ],
            roomPriorities: [
                { roomNumber: 'ICU-3', type: 'ICU', priority: 1 },
                { roomNumber: '304-A', type: 'General', priority: 2 },
                { roomNumber: '205-B', type: 'General', priority: 3 },
            ],
            currentWorkload: [
                { staffName: 'Staff A', assignedTasks: 3, completedTasks: 1 },
                { staffName: 'Staff B', assignedTasks: 4, completedTasks: 2 },
                { staffName: 'Staff C', assignedTasks: 2, completedTasks: 2 },
            ]
        };
        executeAI(input);
        setShowAIPanel(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Housekeeping</h1>
                  <p className="text-slate-500">Track cleaning schedules and tasks.</p>
                </div>
                <button 
                    onClick={runAIOptimization}
                    disabled={aiLoading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                    <Brain size={16} />
                    {aiLoading ? 'Optimizing...' : 'AI Optimize Schedule'}
                </button>
            </div>

            {/* AI Optimization Panel */}
            {showAIPanel && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-lg overflow-hidden">
                    <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Housekeeping Schedule Optimization</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white">✕</button>
                    </div>
                    
                    {aiLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
                            <p className="text-slate-600">Optimizing housekeeping schedules based on discharge predictions...</p>
                        </div>
                    )}
                    
                    {aiError && (
                        <div className="p-4 bg-red-50 text-red-700">
                            <p>Error: {aiError}</p>
                        </div>
                    )}
                    
                    {aiResult && (
                        <div className="p-6 space-y-6">
                            {/* Optimized Schedule */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Calendar size={18} />
                                    Optimized Cleaning Schedule
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Area</th>
                                                <th className="px-4 py-2 text-left">Assignee</th>
                                                <th className="px-4 py-2 text-left">Scheduled Time</th>
                                                <th className="px-4 py-2 text-left">Priority</th>
                                                <th className="px-4 py-2 text-left">Duration</th>
                                                <th className="px-4 py-2 text-left">Reasoning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {aiResult.optimizedSchedule?.map((task, idx) => (
                                                <tr key={idx} className="bg-white">
                                                    <td className="px-4 py-3 font-medium">{task.area}</td>
                                                    <td className="px-4 py-3">{task.assignee}</td>
                                                    <td className="px-4 py-3 text-purple-600 font-medium">{task.scheduledTime}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{task.estimatedDuration} min</td>
                                                    <td className="px-4 py-3 text-slate-500 text-xs">{task.reasoning}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Discharge-Based Tasks */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Clock size={18} />
                                    Discharge-Based Cleaning Tasks
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.dischargeBasedTasks?.map((task, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-slate-900">{task.roomNumber}</p>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">Discharge: {task.predictedDischargeTime}</p>
                                            <div className="text-sm">
                                                <p className="text-slate-500">Cleaning Window:</p>
                                                <p className="text-purple-600 font-medium">{task.cleaningWindow.start} - {task.cleaningWindow.end}</p>
                                            </div>
                                            {task.specialRequirements && task.specialRequirements.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-slate-100">
                                                    <p className="text-xs text-slate-500">Special Requirements:</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {task.specialRequirements.map((req, i) => (
                                                            <span key={i} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">{req}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resource Allocation */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <Users size={18} />
                                    Resource Allocation
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.resourceAllocation?.map((resource, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                                            <p className="font-medium text-slate-900">{resource.staffName}</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Assigned Tasks:</span>
                                                    <span>{resource.assignedTasks}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Workload Score:</span>
                                                    <span className={resource.workloadScore > 80 ? 'text-red-600' : 'text-green-600'}>
                                                        {resource.workloadScore}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Efficiency:</span>
                                                    <span className="text-purple-600">{(resource.efficiency * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Adjustments */}
                            {aiResult.priorityAdjustments && aiResult.priorityAdjustments.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Priority Adjustments
                                    </h4>
                                    <div className="bg-white rounded-lg border border-purple-200 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-purple-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Area</th>
                                                    <th className="px-4 py-2 text-left">Original</th>
                                                    <th className="px-4 py-2 text-left">Adjusted</th>
                                                    <th className="px-4 py-2 text-left">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-purple-100">
                                                {aiResult.priorityAdjustments.map((adj, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 font-medium">{adj.area}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                adj.originalPriority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {adj.originalPriority}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                adj.adjustedPriority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {adj.adjustedPriority}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-500">{adj.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Efficiency Metrics */}
                            <div>
                                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
                                    <TrendingUp size={18} />
                                    Efficiency Metrics
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
                                        <p className="text-sm text-slate-500">Est. Completion Time</p>
                                        <p className="text-2xl font-bold text-purple-600">{aiResult.efficiency?.estimatedCompletionTime} min</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
                                        <p className="text-sm text-slate-500">Staff Utilization</p>
                                        <p className="text-2xl font-bold text-green-600">{(aiResult.efficiency?.staffUtilization * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                                        <p className="text-sm text-slate-500 mb-2">Task Distribution</p>
                                        <div className="space-y-1">
                                            {aiResult.efficiency?.taskDistribution?.map((dist, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span>{dist.staff}</span>
                                                    <span className="font-medium">{dist.tasks} tasks</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Area</th>
                            <th className="px-6 py-4">Assignee</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_TASKS.map(task => (
                            <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{task.area}</td>
                                <td className="px-6 py-4 text-slate-600">{task.assignee}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${
                                        task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {task.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 text-sm font-medium hover:underline">Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Housekeeping;
