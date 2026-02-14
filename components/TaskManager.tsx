import React from 'react';
import { useData } from '../src/contexts/DataContext';
import { CheckSquare, MoreHorizontal, Plus } from 'lucide-react';

const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTaskStatus } = useData();

  const getPriorityColor = (p: string) => {
    switch(p) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-orange-100 text-orange-700';
        default: return 'bg-blue-100 text-blue-700';
    }
  };

  const renderColumn = (title: string, status: string) => {
      const filteredTasks = tasks.filter(t => t.status === status);
      return (
          <div className="bg-slate-50 p-4 rounded-xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-700">{title}</h3>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{filteredTasks.length}</span>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                  {filteredTasks.map(task => (
                      <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                              </span>
                              <button className="text-slate-400 hover:text-slate-600">
                                  <MoreHorizontal size={16} />
                              </button>
                          </div>
                          <p className="font-semibold text-slate-800 text-sm mb-2">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                              <div className="w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                  {task.assignee.charAt(0)}
                              </div>
                              {task.assignee}
                          </div>
                      </div>
                  ))}
                  <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-sm font-medium hover:border-slate-400 hover:text-slate-500 transition-colors flex items-center justify-center gap-2">
                      <Plus size={16} /> Add Task
                  </button>
              </div>
          </div>
      );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500">Manage daily operations and assignments.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          {renderColumn('To Do', 'Todo')}
          {renderColumn('In Progress', 'In Progress')}
          {renderColumn('Completed', 'Done')}
      </div>
    </div>
  );
};

export default TaskManager;