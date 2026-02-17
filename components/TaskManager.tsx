import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { Task } from '../types';
import { Plus, ChevronLeft, ChevronRight, X, Pencil, Trash2, AlertTriangle } from 'lucide-react';

type TaskStatus = 'Todo' | 'In Progress' | 'Done';

const STATUS_ORDER: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', assignee: '', priority: 'Medium' as Task['priority'] });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'High': return 'bg-danger-light text-danger-dark';
      case 'Medium': return 'bg-warning-light text-warning-dark';
      default: return 'bg-primary-light text-primary-dark';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
  };
  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    const idx = STATUS_ORDER.indexOf(current);
    return idx > 0 ? STATUS_ORDER[idx - 1] : null;
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `T-${Date.now()}`,
      title: formData.title,
      assignee: formData.assignee || 'Unassigned',
      priority: formData.priority,
      status: 'Todo',
    };
    addTask(newTask);
    setIsAddModalOpen(false);
    setFormData({ title: '', assignee: '', priority: 'Medium' });
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({ title: task.title, assignee: task.assignee, priority: task.priority });
    setIsEditModalOpen(true);
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
      updateTask(selectedTask.id, {
        title: formData.title,
        assignee: formData.assignee,
        priority: formData.priority
      });
      setIsEditModalOpen(false);
      setSelectedTask(null);
      setFormData({ title: '', assignee: '', priority: 'Medium' });
    }
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
    }
  };

  const renderColumn = (title: string, status: TaskStatus) => {
    const filteredTasks = tasks.filter((t) => t.status === status);
    const nextStatus = getNextStatus(status);
    const prevStatus = getPrevStatus(status);

    return (
      <div key={status} className="bg-background-secondary p-4 rounded-xl h-full flex flex-col border border-border theme-transition">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-foreground-primary">{title}</h3>
          <span className="bg-background-tertiary text-foreground-secondary px-2 py-0.5 rounded-full text-xs font-bold">
            {filteredTasks.length}
          </span>
        </div>
        <div className="space-y-3 flex-1 overflow-y-auto">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-background-primary p-4 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow group relative"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1 text-foreground-muted hover:text-primary-600 rounded mr-1"
                    title="Edit Task"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(task)}
                    className="p-1 text-foreground-muted hover:text-danger-600 rounded mr-2"
                    title="Delete Task"
                  >
                    <Trash2 size={14} />
                  </button>

                  {prevStatus && (
                    <button
                      onClick={() => updateTaskStatus(task.id, prevStatus)}
                      className="p-1 text-foreground-muted hover:text-primary-600 rounded"
                      title={`Move to ${prevStatus}`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  )}
                  {nextStatus && (
                    <button
                      onClick={() => updateTaskStatus(task.id, nextStatus)}
                      className="p-1 text-foreground-muted hover:text-primary-600 rounded"
                      title={`Move to ${nextStatus}`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="font-semibold text-foreground-primary text-sm mb-2">{task.title}</p>
              <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                <div className="w-5 h-5 bg-primary-light rounded-full flex items-center justify-center text-primary-dark font-bold">
                  {task.assignee.charAt(0)}
                </div>
                {task.assignee}
              </div>
            </div>
          ))}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full py-2 border-2 border-dashed border-border rounded-xl text-foreground-muted text-sm font-medium hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
          >
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
          <h1 className="text-2xl font-bold text-foreground-primary">Task Board</h1>
          <p className="text-foreground-secondary">Manage daily operations and assignments.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', assignee: '', priority: 'Medium' });
            setIsAddModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {renderColumn('To Do', 'Todo')}
        {renderColumn('In Progress', 'In Progress')}
        {renderColumn('Completed', 'Done')}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-md animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">New Task</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData((p) => ({ ...p, assignee: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Assignee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as Task['priority'] }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-md animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">Edit Task</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditTask} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Assignee</label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData((p) => ({ ...p, assignee: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as Task['priority'] }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-sm animate-scale-up p-6 text-center">
            <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-4 text-danger-dark">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground-primary mb-2">Delete Task?</h3>
            <p className="text-foreground-secondary mb-6">
              Are you sure you want to delete "{selectedTask.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
