import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { Megaphone, Pin, X, Pencil, Trash2, AlertTriangle, MessageSquare } from 'lucide-react';
import { Notice } from '../types';

const NoticeBoard: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'Normal' as 'Normal' | 'Urgent' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: Notice = {
      id: `N-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      priority: formData.priority,
    };
    addNotice(newNotice);
    setIsAddModalOpen(false);
    setFormData({ title: '', content: '', priority: 'Normal' });
  };

  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({ title: notice.title, content: notice.content, priority: notice.priority });
    setIsEditModalOpen(true);
  };

  const handleEditNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNotice) {
      updateNotice(selectedNotice.id, {
        title: formData.title,
        content: formData.content,
        priority: formData.priority
      });
      setIsEditModalOpen(false);
      setSelectedNotice(null);
      setFormData({ title: '', content: '', priority: 'Normal' });
    }
  };

  const openDeleteModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNotice = () => {
    if (selectedNotice) {
      deleteNotice(selectedNotice.id);
      setIsDeleteModalOpen(false);
      setSelectedNotice(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Notice Board</h1>
          <p className="text-foreground-secondary">Hospital-wide announcements and updates.</p>
        </div>
        <button
          onClick={() => {
            setFormData({ title: '', content: '', priority: 'Normal' });
            setIsAddModalOpen(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 shadow-md transition-colors flex items-center gap-2"
        >
          <Megaphone size={18} />
          Post Notice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl shadow-sm border relative transition-shadow hover:shadow-md group theme-transition ${notice.priority === 'Urgent'
              ? 'bg-danger-light/10 border-danger-light'
              : 'bg-warning-light/10 border-warning-light'
              }`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(notice)}
                  className="p-1.5 text-foreground-muted hover:text-primary-600 rounded bg-background-primary/50 theme-transition"
                  title="Edit Notice"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => openDeleteModal(notice)}
                  className="p-1.5 text-foreground-muted hover:text-danger-600 rounded bg-background-primary/50 theme-transition"
                  title="Delete Notice"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <Pin size={20} className={`transform rotate-45 ${notice.priority === 'Urgent' ? 'text-danger-500' : 'text-warning-500'}`} fill="currentColor" />
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-3 inline-block ${notice.priority === 'Urgent'
                ? 'bg-danger-light text-danger-dark'
                : 'bg-warning-light text-warning-dark'
                }`}
            >
              {notice.priority}
            </span>
            <h3 className="font-bold text-foreground-primary text-lg mb-2">{notice.title}</h3>
            <p className="text-foreground-secondary text-sm leading-relaxed mb-4">{notice.content}</p>
            <p className="text-xs text-foreground-muted font-medium flex items-center gap-1">
              <MessageSquare size={12} />
              {notice.date}
            </p>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-md animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">Post Notice</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Notice title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Announcement content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as 'Normal' | 'Urgent' }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Priority"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
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
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-md animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">Edit Notice</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditNotice} className="p-4 space-y-4">
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
                <label className="block text-sm font-medium text-foreground-primary mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value as 'Normal' | 'Urgent' }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
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
      {isDeleteModalOpen && selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-sm animate-scale-up p-6 text-center">
            <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-4 text-danger-dark">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground-primary mb-2">Delete Notice?</h3>
            <p className="text-foreground-secondary mb-6">
              Are you sure you want to delete "{selectedNotice.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteNotice}
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

export default NoticeBoard;
