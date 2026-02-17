import { Staff } from '../types';
import { useData } from '../src/contexts/DataContext';
import { Users, Search, Filter, Plus, Mail, Phone, MoreHorizontal, MapPin, Calendar, DollarSign, Briefcase, Star, X, Check, Edit2, Trash2 } from 'lucide-react';



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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Staff Directory</h1>
          <p className="text-foreground-muted">Manage doctors, nurses, and support staff.</p>
        </div>
        <button onClick={openAdd} className="bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center gap-2 theme-transition">
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: stats.total, icon: <Users size={22} />, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
          { label: 'Active Now', value: stats.active, icon: <Check size={22} />, color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' },
          { label: 'On Leave', value: stats.onLeave, icon: <Calendar size={22} />, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
          { label: 'New Joiners', value: stats.newJoiners, icon: <Star size={22} />, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
        ].map((s, i) => (
          <div key={i} className="bg-background-elevated p-5 rounded-2xl shadow-sm border border-border">
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
      <div className="flex flex-col lg:flex-row gap-4 bg-background-elevated p-4 rounded-2xl shadow-sm border border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search by name, role, or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background-secondary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-teal-500 placeholder:text-foreground-muted" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer whitespace-nowrap">
            <option value="All">All Departments</option>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer whitespace-nowrap">
            <option value="All">All Status</option><option>Active</option><option>On Leave</option><option>Terminated</option>
          </select>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(person => (
          <div key={person.id} className="bg-background-elevated rounded-2xl shadow-sm border border-border hover:shadow-lg theme-transition group overflow-hidden">
            <div className="relative h-24 bg-gradient-to-r from-teal-500 to-emerald-500">
              <button className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex justify-between items-end">
                <div className="w-24 h-24 rounded-2xl border-4 border-background-elevated overflow-hidden shadow-md bg-background-primary">
                  <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 mb-1">
                  <button onClick={() => openEdit(person)} className="p-2 bg-background-secondary text-foreground-secondary rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 theme-transition"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteConfirm(person.id)} className="p-2 bg-background-secondary text-foreground-secondary rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 theme-transition"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground-primary text-lg">{person.name}</h3>
                    <p className="text-teal-600 dark:text-teal-400 font-medium text-sm">{person.role}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${person.status === 'Active' ? 'bg-success-light text-success-dark border-green-200 dark:border-green-800' :
                    person.status === 'On Leave' ? 'bg-warning-light text-warning-dark border-amber-200 dark:border-amber-800' :
                      'bg-danger-light text-danger-dark border-red-200 dark:border-red-800'
                    }`}>
                    {person.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <Briefcase size={14} className="text-foreground-muted" />
                    {person.department}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary truncate" title={person.email}>
                    <Mail size={14} className="text-foreground-muted" />
                    {person.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <Phone size={14} className="text-foreground-muted" />
                    {person.phone}
                  </div>
                </div>

                {person.role.includes('Doctor') || person.role.includes('Surgeon') || person.role.includes('Pediatrician') ? (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-xs text-foreground-muted font-medium uppercase">Patients</p>
                      <p className="font-bold text-foreground-primary">1.2k</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                      <p className="text-xs text-foreground-muted font-medium uppercase">Exp.</p>
                      <p className="font-bold text-foreground-primary">8y</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                      <p className="text-xs text-foreground-muted font-medium uppercase">Rating</p>
                      <div className="flex items-center gap-1 font-bold text-foreground-primary">
                        4.9 <Star size={12} className="fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div className="text-center w-full">
                      <p className="text-xs text-foreground-muted font-medium uppercase">Joined</p>
                      <p className="font-bold text-foreground-primary">{new Date(person.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No staff members found</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-background-elevated rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-foreground-primary mb-2">Remove Staff?</h3>
            <p className="text-sm text-foreground-muted mb-6">This action cannot be undone. Their access will be revoked immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 theme-transition">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground-primary">{editingStaff ? 'Edit Staff Profile' : 'Add New Staff'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex justify-center mb-2">
                  <div className="relative">
                    <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-border" />
                    <button className="absolute bottom-0 right-0 p-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 shadow-md theme-transition"><Edit2 size={12} /></button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. Jane Doe"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-foreground-muted" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Role *</label>
                  <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Department *</label>
                  <select value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Email *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="staff@nexus.com"
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-foreground-muted" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Phone</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) ..."
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-foreground-muted" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Join Date</label>
                  <input type="date" value={formData.joinDate} onChange={e => setFormData(p => ({ ...p, joinDate: e.target.value }))}
                    className="w-full border border-border rounded-xl p-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Salary (Annual)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                    <input type="number" value={formData.salary || ''} onChange={e => setFormData(p => ({ ...p, salary: parseInt(e.target.value) || 0 }))} placeholder="0.00"
                      className="w-full border border-border rounded-xl pl-10 pr-3 py-3 text-sm bg-background-secondary text-foreground-primary focus:ring-2 focus:ring-teal-500 outline-none placeholder:text-foreground-muted" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-foreground-secondary mb-3">Status</label>
                  <div className="flex gap-4">
                    {['Active', 'On Leave', 'Terminated'].map(s => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="status" checked={formData.status === s} onChange={() => setFormData(p => ({ ...p, status: s as any }))} className="accent-teal-600 w-4 h-4" />
                        <span className="text-sm text-foreground-secondary">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 theme-transition">{editingStaff ? 'Update Profile' : 'Create Staff'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;