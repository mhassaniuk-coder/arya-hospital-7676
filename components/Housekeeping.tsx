import React, { useState } from 'react';
import { HousekeepingTask } from '../types';
import { Brush, CheckCircle, Clock, Brain, RefreshCw, Users, Calendar, AlertTriangle, TrendingUp, Plus, X, Search, Filter, Edit2 } from 'lucide-react';
import { useHousekeepingScheduler } from '../hooks/useAI';
import { HousekeepingSchedulingInput } from '../types';

const Housekeeping: React.FC = () => {
    const [tasks, setTasks] = useState<HousekeepingTask[]>([
        { id: '1', area: 'Room 304-A', assignee: 'Staff A', status: 'Pending', priority: 'Normal' },
        { id: '2', area: 'ICU Corridor', assignee: 'Staff B', status: 'In Progress', priority: 'High' },
        { id: '3', area: 'Lobby', assignee: 'Staff C', status: 'Completed', priority: 'Normal' },
        { id: '4', area: 'Ward 5 — Room 502', assignee: 'Staff D', status: 'Pending', priority: 'High' },
        { id: '5', area: 'Emergency Dept Hallway', assignee: 'Staff A', status: 'In Progress', priority: 'Normal' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<'All' | 'High' | 'Normal'>('All');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
    const [showAIPanel, setShowAIPanel] = useState(false);
    const { data: aiResult, loading: aiLoading, error: aiError, execute: executeAI } = useHousekeepingScheduler();

    const [newTask, setNewTask] = useState<Partial<HousekeepingTask>>({
        area: '',
        assignee: '',
        priority: 'Normal',
    });

    const handleAddTask = () => {
        if (!newTask.area || !newTask.assignee) return;
        const task: HousekeepingTask = {
            id: `HK-${Date.now().toString().slice(-4)}`,
            area: newTask.area,
            assignee: newTask.assignee,
            status: 'Pending',
            priority: newTask.priority as 'High' | 'Normal',
        };
        setTasks([task, ...tasks]);
        setIsModalOpen(false);
        setNewTask({ area: '', assignee: '', priority: 'Normal' });
    };

    const updateTaskStatus = (id: string, status: HousekeepingTask['status']) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    };

    const getNextStatus = (current: HousekeepingTask['status']): HousekeepingTask['status'] | null => {
        switch (current) {
            case 'Pending': return 'In Progress';
            case 'In Progress': return 'Completed';
            default: return null;
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || t.priority === filterPriority;
        const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
        return matchesSearch && matchesPriority && matchesStatus;
    });

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'Pending').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
    };

    const runAIOptimization = () => {
        const input: HousekeepingSchedulingInput = {
            tasks: tasks.map(t => ({
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
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Housekeeping</h1>
                    <p className="text-foreground-secondary">Track cleaning schedules and tasks.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md flex items-center gap-2 theme-transition dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        <Plus size={16} /> Assign Task
                    </button>
                    <button
                        onClick={runAIOptimization}
                        disabled={aiLoading}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 shadow-md flex items-center gap-2 disabled:opacity-50 theme-transition"
                    >
                        <Brain size={16} />
                        {aiLoading ? 'Optimizing...' : 'AI Optimize'}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Brush className="text-purple-600 dark:text-purple-400" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.total}</p>
                            <p className="text-xs text-foreground-muted">Total Tasks</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-warning-light rounded-lg">
                            <Clock className="text-warning-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.pending}</p>
                            <p className="text-xs text-foreground-muted">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-info-light rounded-lg">
                            <RefreshCw className="text-info-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.inProgress}</p>
                            <p className="text-xs text-foreground-muted">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-elevated rounded-xl border border-border p-4 theme-transition">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-light rounded-lg">
                            <CheckCircle className="text-success-dark" size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground-primary">{stats.completed}</p>
                            <p className="text-xs text-foreground-muted">Completed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Optimization Panel */}
            {showAIPanel && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 shadow-lg overflow-hidden animate-scale-up theme-transition">
                    <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Brain size={20} />
                            <h3 className="font-bold">AI Housekeeping Schedule Optimization</h3>
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">AI-Assisted</span>
                        </div>
                        <button onClick={() => setShowAIPanel(false)} className="text-white/80 hover:text-white theme-transition">✕</button>
                    </div>

                    {aiLoading && (
                        <div className="p-8 text-center">
                            <RefreshCw className="animate-spin mx-auto mb-4 text-purple-600 dark:text-purple-400" size={32} />
                            <p className="text-foreground-secondary">Optimizing housekeeping schedules based on discharge predictions...</p>
                        </div>
                    )}

                    {aiError && (
                        <div className="p-4 bg-danger-light text-danger-dark">
                            <p>Error: {aiError}</p>
                        </div>
                    )}

                    {aiResult && (
                        <div className="p-6 space-y-6">
                            {/* Optimized Schedule */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <Calendar size={18} />
                                    Optimized Cleaning Schedule
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-background-secondary">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Area</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Assignee</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Scheduled Time</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Priority</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Duration</th>
                                                <th className="px-4 py-2 text-left text-foreground-secondary">Reasoning</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {aiResult.optimizedSchedule?.map((task, idx) => (
                                                <tr key={idx} className="bg-background-elevated theme-transition">
                                                    <td className="px-4 py-3 font-medium text-foreground-primary">{task.area}</td>
                                                    <td className="px-4 py-3 text-foreground-secondary">{task.assignee}</td>
                                                    <td className="px-4 py-3 text-purple-600 dark:text-purple-400 font-medium">{task.scheduledTime}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${task.priority === 'High' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'
                                                            }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-foreground-secondary">{task.estimatedDuration} min</td>
                                                    <td className="px-4 py-3 text-foreground-muted text-xs">{task.reasoning}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Discharge-Based Tasks */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <Clock size={18} />
                                    Discharge-Based Cleaning Tasks
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.dischargeBasedTasks?.map((task, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 theme-transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-medium text-foreground-primary">{task.roomNumber}</p>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${task.priority === 'High' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground-secondary mb-2">Discharge: {task.predictedDischargeTime}</p>
                                            <div className="text-sm">
                                                <p className="text-foreground-muted">Cleaning Window:</p>
                                                <p className="text-purple-600 dark:text-purple-400 font-medium">{task.cleaningWindow.start} - {task.cleaningWindow.end}</p>
                                            </div>
                                            {task.specialRequirements && task.specialRequirements.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-border">
                                                    <p className="text-xs text-foreground-muted">Special Requirements:</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {task.specialRequirements.map((req, i) => (
                                                            <span key={i} className="bg-warning-light text-warning-dark text-xs px-2 py-0.5 rounded">{req}</span>
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
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <Users size={18} />
                                    Resource Allocation
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiResult.resourceAllocation?.map((resource, idx) => (
                                        <div key={idx} className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 theme-transition">
                                            <p className="font-medium text-foreground-primary">{resource.staffName}</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Assigned Tasks:</span>
                                                    <span className="text-foreground-secondary">{resource.assignedTasks}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Workload Score:</span>
                                                    <span className={resource.workloadScore > 80 ? 'text-danger-dark' : 'text-success-dark'}>
                                                        {resource.workloadScore}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-foreground-muted">Efficiency:</span>
                                                    <span className="text-purple-600 dark:text-purple-400">{(resource.efficiency * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Adjustments */}
                            {aiResult.priorityAdjustments && aiResult.priorityAdjustments.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                        <AlertTriangle size={18} />
                                        Priority Adjustments
                                    </h4>
                                    <div className="bg-background-elevated rounded-lg border border-purple-200 dark:border-purple-800/50 overflow-hidden theme-transition">
                                        <table className="w-full text-sm">
                                            <thead className="bg-purple-50 dark:bg-purple-900/20">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-foreground-secondary">Area</th>
                                                    <th className="px-4 py-2 text-left text-foreground-secondary">Original</th>
                                                    <th className="px-4 py-2 text-left text-foreground-secondary">Adjusted</th>
                                                    <th className="px-4 py-2 text-left text-foreground-secondary">Reason</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-purple-100 dark:divide-purple-900/30">
                                                {aiResult.priorityAdjustments.map((adj, idx) => (
                                                    <tr key={idx}>
                                                        <td className="px-4 py-3 font-medium text-foreground-primary">{adj.area}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${adj.originalPriority === 'High' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'
                                                                }`}>
                                                                {adj.originalPriority}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded text-xs ${adj.adjustedPriority === 'High' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'
                                                                }`}>
                                                                {adj.adjustedPriority}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-foreground-muted">{adj.reason}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Efficiency Metrics */}
                            <div>
                                <h4 className="font-semibold text-foreground-primary flex items-center gap-2 mb-3">
                                    <TrendingUp size={18} />
                                    Efficiency Metrics
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 text-center theme-transition">
                                        <p className="text-sm text-foreground-muted">Est. Completion Time</p>
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{aiResult.efficiency?.estimatedCompletionTime} min</p>
                                    </div>
                                    <div className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 text-center theme-transition">
                                        <p className="text-sm text-foreground-muted">Staff Utilization</p>
                                        <p className="text-2xl font-bold text-success-dark">{(aiResult.efficiency?.staffUtilization * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="bg-background-elevated p-4 rounded-lg border border-purple-200 dark:border-purple-800/50 theme-transition">
                                        <p className="text-sm text-foreground-muted mb-2">Task Distribution</p>
                                        <div className="space-y-1">
                                            {aiResult.efficiency?.taskDistribution?.map((dist, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-foreground-secondary">{dist.staff}</span>
                                                    <span className="font-medium text-foreground-primary">{dist.tasks} tasks</span>
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

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search by area or assignee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-border bg-background-elevated text-foreground-primary rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder:text-foreground-muted theme-transition"
                    />
                </div>
                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="px-3 py-2 border border-border bg-background-elevated text-foreground-primary rounded-lg text-sm theme-transition"
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Normal">Normal Priority</option>
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-border bg-background-elevated text-foreground-primary rounded-lg text-sm theme-transition"
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Task Table */}
            <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                            <th className="px-6 py-4">Area</th>
                            <th className="px-6 py-4">Assignee</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredTasks.map(task => (
                            <tr key={task.id} className="hover:bg-background-secondary theme-transition">
                                <td className="px-6 py-4 font-medium text-foreground-primary">{task.area}</td>
                                <td className="px-6 py-4 text-foreground-secondary">{task.assignee}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${task.priority === 'High' ? 'bg-danger-light text-danger-dark' : 'bg-info-light text-info-dark'}`}>
                                        {task.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold ${task.status === 'Completed' ? 'bg-success-light text-success-dark' :
                                        task.status === 'In Progress' ? 'bg-info-light text-info-dark' :
                                            'bg-warning-light text-warning-dark'
                                        }`}>
                                        {task.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {getNextStatus(task.status) ? (
                                        <button
                                            onClick={() => updateTaskStatus(task.id, getNextStatus(task.status)!)}
                                            className="text-accent text-sm font-medium hover:underline"
                                        >
                                            {task.status === 'Pending' ? 'Start' : 'Complete'}
                                        </button>
                                    ) : (
                                        <span className="text-success-dark text-sm font-medium flex items-center gap-1 justify-end">
                                            <CheckCircle size={14} /> Done
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-foreground-muted">No tasks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-background-elevated rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-border theme-transition">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-background-secondary">
                            <h2 className="text-xl font-bold text-foreground-primary">Assign Cleaning Task</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-foreground-muted hover:text-foreground-secondary theme-transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Area / Location</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 bg-background-primary text-foreground-primary theme-transition"
                                    placeholder="e.g. Room 304-A, ICU Corridor"
                                    value={newTask.area}
                                    onChange={e => setNewTask({ ...newTask, area: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Assign To</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 bg-background-primary text-foreground-primary theme-transition"
                                    placeholder="Staff name"
                                    value={newTask.assignee}
                                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground-secondary mb-1">Priority</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 bg-background-primary text-foreground-primary theme-transition"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border bg-background-secondary flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-foreground-secondary font-medium hover:bg-background-tertiary rounded-lg theme-transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTask}
                                disabled={!newTask.area || !newTask.assignee}
                                className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed theme-transition shadow-lg shadow-purple-500/30"
                            >
                                Assign Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Housekeeping;
