import React, { useState, useMemo } from 'react';
import { Staff } from '../types';
import { useData } from '../src/contexts/DataContext';
import { Users, Search, Filter, Plus, Mail, Phone, MoreHorizontal, MapPin, Calendar, DollarSign, Briefcase, Star, X, Check, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEPARTMENTS = ['Cardiology', 'Emergency', 'Surgery', 'Laboratory', 'Pharmacy', 'Administration', 'Security', 'Pediatrics', 'Nursing', 'Radiology'];
const ROLES = ['Chief Physician', 'Senior Nurse', 'Surgeon', 'Lab Technician', 'Pharmacist', 'Receptionist', 'Security Head', 'Pediatrician', 'Nurse', 'Doctor', 'Admin'];

const StaffDirectory: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Staff>>({});

  const filtered = useMemo(() => staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  }), [staff, searchQuery, deptFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: staff.length,
    active: staff.filter(s => s.status === 'Active').length,
    onLeave: staff.filter(s => s.status === 'On Leave').length,
    newJoiners: staff.filter(s => {
      const join = new Date(s.joinDate);
      const now = new Date();
      return (now.getTime() - join.getTime()) / (1000 * 60 * 60 * 24) < 90; // Joined in last 90 days
    }).length,
  }), [staff]);

  const openAdd = () => {
    setEditingStaff(null);
    setFormData({ name: '', role: 'Doctor', department: 'Cardiology', email: '', phone: '', status: 'Active', joinDate: new Date().toISOString().split('T')[0], salary: 0, image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=300&h=300' });
    setShowModal(true);
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({ ...s });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) return;

    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, formData);
      } else {
        const newStaff: Staff = {
          id: `ST-${String(staff.length + 1).padStart(3, '0')}`,
          ...(formData as Staff)
        };
        await addStaff(newStaff);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save staff:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStaff(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">Staff Directory</h1>
          <p className="text-foreground-secondary">Manage and monitor doctors, nurses, and support staff.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/25 flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Add Staff
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: stats.total, icon: <Users size={22} />, color: 'bg-blue-500' },
          { label: 'Active Now', value: stats.active, icon: <Check size={22} />, color: 'bg-green-500' },
          { label: 'On Leave', value: stats.onLeave, icon: <Calendar size={22} />, color: 'bg-amber-500' },
          { label: 'New Joiners', value: stats.newJoiners, icon: <Star size={22} />, color: 'bg-purple-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-panel p-5 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${s.color} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className={`p-2.5 rounded-xl ${s.color} bg-opacity-10 text-${s.color.replace('bg-', '')}-600 dark:text-${s.color.replace('bg-', '')}-400`}>
                {s.icon}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-1">{s.label}</h3>
              <p className="text-2xl font-bold text-foreground-primary">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-20 backdrop-blur-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background-primary/50 border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-foreground-muted"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background-primary/50 border border-border">
            <Filter size={16} className="text-foreground-secondary" />
            <span className="text-xs font-medium text-foreground-secondary whitespace-nowrap">Filter by:</span>
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-background-primary/50 border border-border text-sm text-foreground-primary focus:border-accent outline-none cursor-pointer hover:bg-background-tertiary transition-colors"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-background-primary/50 border border-border text-sm text-foreground-primary focus:border-accent outline-none cursor-pointer hover:bg-background-tertiary transition-colors"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filtered.map((s) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={s.id}
              className="glass-panel p-5 rounded-2xl group hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={s.image || `https://ui-avatars.com/api/?name=${s.name}`} alt={s.name} className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm group-hover:scale-105 transition-transform" />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-background-primary rounded-full ${s.status === 'Active' ? 'bg-green-500' : s.status === 'On Leave' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground-primary text-sm line-clamp-1">{s.name}</h3>
                    <p className="text-xs text-accent font-medium">{s.role}</p>
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setEditingStaff(s)} className="p-1.5 rounded-lg text-foreground-muted hover:bg-background-tertiary hover:text-accent transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <Briefcase size={14} className="text-foreground-muted" />
                  <span>{s.department}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <Mail size={14} className="text-foreground-muted" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                  <Phone size={14} className="text-foreground-muted" />
                  <span>{s.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <button
                  onClick={() => openEdit(s)}
                  className="flex-1 py-2 rounded-lg bg-background-tertiary hover:bg-accent/10 hover:text-accent text-xs font-medium text-foreground-secondary transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => setDeleteConfirm(s.id)}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-2xl">
          <div className="w-16 h-16 bg-background-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-foreground-muted" />
          </div>
          <h3 className="text-lg font-semibold text-foreground-primary">No staff members found</h3>
          <p className="text-foreground-secondary">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Edit/Add Modal - Glassmorphic Overlay */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-background-primary dark:bg-slate-900 border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="p-6 border-b border-border bg-background-secondary/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-foreground-primary">{editingStaff ? 'Edit Profile' : 'Add New Staff'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-background-tertiary rounded-full text-foreground-secondary transition-colors"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar Upload Placeholder */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-background-tertiary flex items-center justify-center border-2 border-dashed border-border hover:border-accent cursor-pointer transition-colors group">
                    <Plus size={24} className="text-foreground-muted group-hover:text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground-primary">Profile Photo</h3>
                    <p className="text-xs text-foreground-muted">Upload a high-res picture. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background-tertiary/50 border border-border focus:border-accent outline-none text-foreground-primary"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background-tertiary/50 border border-border focus:border-accent outline-none text-foreground-primary"
                      placeholder="john@hospital.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Role</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background-tertiary/50 border border-border focus:border-accent outline-none text-foreground-primary"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Department</label>
                    <select
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background-tertiary/50 border border-border focus:border-accent outline-none text-foreground-primary"
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background-tertiary/50 border border-border focus:border-accent outline-none text-foreground-primary"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-background-secondary/30 flex justify-end gap-3 sticky bottom-0">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all">
                  {editingStaff ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-background-primary border border-border rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-foreground-primary mb-2">Delete Account?</h3>
              <p className="text-foreground-secondary text-sm mb-6">Are you sure you want to remove this staff member? This action cannot be undone.</p>

              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StaffDirectory;