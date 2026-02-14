import React from 'react';
import { HousekeepingTask } from '../types';
import { Brush, CheckCircle, Clock } from 'lucide-react';

const MOCK_TASKS: HousekeepingTask[] = [
    { id: '1', area: 'Room 304-A', assignee: 'Staff A', status: 'Pending', priority: 'Normal' },
    { id: '2', area: 'ICU Corridor', assignee: 'Staff B', status: 'In Progress', priority: 'High' },
    { id: '3', area: 'Lobby', assignee: 'Staff C', status: 'Completed', priority: 'Normal' },
];

const Housekeeping: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Housekeeping</h1>
                  <p className="text-slate-500">Track cleaning schedules and tasks.</p>
                </div>
            </div>

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