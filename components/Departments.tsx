import React, { useState, useMemo } from 'react';
import { Department } from '../types';
import { useData } from '../src/contexts/DataContext';
import { Building2, Users, Plus, Search, Edit2, Trash2, X, MapPin, Phone, DollarSign, Activity, ChevronDown } from 'lucide-react';



interface DeptExtra {
  location: string; floor: number; phone: string; budget: number; bedCount: number; services: string[];
}

const DEPT_EXTRAS: Record<string, DeptExtra> = {
  '1': { location: 'Building A, Wing 2', floor: 2, phone: '+1-555-0101', budget: 500000, bedCount: 30, services: ['ECG', 'Echocardiography', 'Catheterization', 'Pacemaker'] },
  '2': { location: 'Building B, Wing 1', floor: 3, phone: '+1-555-0102', budget: 350000, bedCount: 20, services: ['EEG', 'EMG', 'Stroke Care', 'Epilepsy'] },
  '3': { location: 'Building A, Wing 3', floor: 1, phone: '+1-555-0103', budget: 400000, bedCount: 25, services: ['NICU', 'Vaccination', 'Growth Assessment'] },
  '4': { location: 'Building C, Wing 1', floor: 2, phone: '+1-555-0104', budget: 300000, bedCount: 18, services: ['Joint Replacement', 'Fracture Care', 'Sports Medicine'] },
  '5': { location: 'Building B, Wing 3', floor: 4, phone: '+1-555-0105', budget: 600000, bedCount: 15, services: ['Chemotherapy', 'Radiation', 'Immunotherapy'] },
  '6': { location: 'Building A, Ground', floor: 0, phone: '+1-555-0106', budget: 800000, bedCount: 40, services: ['Trauma', 'Critical Care', 'Triage', 'Resuscitation'] },
  '7': { location: 'Building B, Wing 2', floor: 1, phone: '+1-555-0107', budget: 450000, bedCount: 0, services: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound'] },
  '8': { location: 'Building C, Wing 2', floor: 3, phone: '+1-555-0108', budget: 200000, bedCount: 0, services: ['Histopathology', 'Cytology', 'Microbiology'] },
};

const COLORS = ['bg-blue-500', 'bg-teal-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'];

const Departments: React.FC = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', head: '', staffCount: 0, status: 'Active' as 'Active' | 'Inactive' });

  const filtered = useMemo(() => {
    return departments.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.head.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [departments, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    total: departments.length,
    active: departments.filter(d => d.status === 'Active').length,
    totalStaff: departments.reduce((s, d) => s + d.staffCount, 0),
    totalBeds: Object.values(DEPT_EXTRAS).reduce((s, e) => s + e.bedCount, 0),
  }), [departments]);

  const openAdd = () => { setEditingDept(null); setFormData({ name: '', head: '', staffCount: 0, status: 'Active' }); setShowModal(true); };
  const openEdit = (d: Department) => { setEditingDept(d); setFormData({ name: d.name, head: d.head, staffCount: d.staffCount, status: d.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.head.trim()) return;
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, formData);
      } else {
        const newDept: Department = { id: `D-${Date.now()}`, ...formData };
        await addDepartment(newDept);
      }
      setShowModal(false);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id);
      setDeleteConfirm(null);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Departments</h1>
          <p className="text-foreground-secondary">Manage hospital wards and medical units.</p>
        </div>
        <button onClick={openAdd} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: stats.total, icon: <Building2 size={22} />, color: 'bg-info-light text-info-dark' },
          { label: 'Active', value: stats.active, icon: <Activity size={22} />, color: 'bg-success-light text-success-dark' },
          { label: 'Total Staff', value: stats.totalStaff, icon: <Users size={22} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
          { label: 'Total Beds', value: stats.totalBeds, icon: <MapPin size={22} />, color: 'bg-warning-light text-warning-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-background-primary p-5 rounded-2xl shadow-sm border border-border theme-transition">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-foreground-primary">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search departments or heads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
            <option>All</option><option>Active</option><option>Inactive</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept, idx) => {
          const extra = DEPT_EXTRAS[dept.id];
          return (
            <div key={dept.id} className="bg-background-primary rounded-2xl shadow-sm border border-border hover:shadow-lg theme-transition overflow-hidden group">
              <div className={`h-2 ${COLORS[idx % COLORS.length]}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${COLORS[idx % COLORS.length]} bg-opacity-10 p-2.5 rounded-xl`}>
                      <Building2 size={22} className={`${COLORS[idx % COLORS.length].replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground-primary text-lg">{dept.name}</h3>
                      <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${dept.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-background-tertiary text-foreground-muted'}`}>{dept.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(dept)} className="p-1.5 text-foreground-muted hover:text-accent hover:bg-accent/10 rounded-lg theme-transition"><Edit2 size={16} /></button>
                    <button onClick={() => setDeleteConfirm(dept.id)} className="p-1.5 text-foreground-muted hover:text-danger hover:bg-danger/10 rounded-lg theme-transition"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border-muted">
                    <span className="text-foreground-secondary">Head of Dept</span>
                    <span className="font-semibold text-foreground-primary">{dept.head}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border-muted">
                    <span className="text-foreground-secondary">Staff</span>
                    <div className="flex items-center gap-1.5"><Users size={14} className="text-foreground-muted" /><span className="font-semibold text-foreground-primary">{dept.staffCount}</span></div>
                  </div>
                  {extra && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-border-muted">
                        <span className="text-foreground-secondary">Location</span>
                        <span className="font-medium text-foreground-secondary text-xs">{extra.location}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border-muted">
                        <span className="text-foreground-secondary">Budget</span>
                        <span className="font-semibold text-foreground-primary flex items-center gap-1"><DollarSign size={14} />{extra.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-foreground-secondary">Phone</span>
                        <span className="font-medium text-foreground-secondary flex items-center gap-1"><Phone size={12} />{extra.phone}</span>
                      </div>
                    </>
                  )}
                </div>

                {extra && extra.services.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-foreground-muted uppercase mb-2">Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {extra.services.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-background-tertiary text-foreground-secondary rounded-md">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          <Building2 size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No departments found</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-background-primary rounded-2xl p-6 max-w-sm w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground-primary mb-2">Delete Department?</h3>
            <p className="text-sm text-foreground-secondary mb-6">This action cannot be undone. All associated data will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-danger text-white rounded-xl font-medium hover:opacity-90 theme-transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground-primary">{editingDept ? 'Edit Department' : 'Add New Department'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Department Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Cardiology"
                  className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Head of Department *</label>
                <input type="text" value={formData.head} onChange={e => setFormData(p => ({ ...p, head: e.target.value }))} placeholder="e.g. Dr. Sarah Chen"
                  className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Staff Count</label>
                  <input type="number" value={formData.staffCount} onChange={e => setFormData(p => ({ ...p, staffCount: parseInt(e.target.value) || 0 }))} min="0"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Status</label>
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as 'Active' | 'Inactive' }))}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-tertiary text-foreground-primary focus:ring-2 focus:ring-accent outline-none theme-transition">
                    <option value="Active">Active</option><option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-accent text-white rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-accent/20 theme-transition">{editingDept ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
