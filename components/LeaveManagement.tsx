import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Plus, X, Search, Filter, AlertCircle, User, FileText } from 'lucide-react';

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Personal' | 'Unpaid' | 'Maternity' | 'Paternity';

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  reason?: string;
  avatar: string;
}

const INITIAL: LeaveRequest[] = [
  { id: '1', name: 'Dr. Sarah Chen', role: 'Cardiologist', department: 'Cardiology', type: 'Annual Leave', startDate: '2024-03-15', endDate: '2024-03-20', days: 5, status: 'Pending', reason: 'Family vacation', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '2', name: 'James Wilson', role: 'Senior Nurse', department: 'Emergency', type: 'Sick Leave', startDate: '2024-03-10', endDate: '2024-03-10', days: 1, status: 'Approved', reason: 'Flu symptoms', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '3', name: 'Michael Ross', role: 'Surgeon', department: 'Surgery', type: 'Personal', startDate: '2024-03-12', endDate: '2024-03-13', days: 2, status: 'Rejected', reason: 'Urgent surgery scheduled', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '4', name: 'Emily Davis', role: 'Lab Tech', department: 'Laboratory', type: 'Unpaid', startDate: '2024-04-01', endDate: '2024-04-05', days: 5, status: 'Pending', reason: 'Personal matters', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100' },
];

const PROFILES = [
  { name: 'Dr. Sarah Chen', role: 'Cardiologist', dept: 'Cardiology', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100' },
  { name: 'James Wilson', role: 'Senior Nurse', dept: 'Emergency', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100' },
  { name: 'Michael Ross', role: 'Surgeon', dept: 'Surgery', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100&h=100' },
  { name: 'Emily Davis', role: 'Lab Tech', dept: 'Laboratory', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100&h=100' },
];

const LeaveManagement: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    profileIdx: 0,
    type: 'Annual Leave' as LeaveType,
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
  });

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'Pending').length;
    const approved = requests.filter((r) => r.status === 'Approved').length;
    const onLeaveToday = requests.filter((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const today = new Date();
      return r.status === 'Approved' && today >= start && today <= end;
    }).length;
    return { pending, approved, onLeaveToday };
  }, [requests]);

  const filtered = useMemo(() => requests.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [requests, searchQuery, statusFilter]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = PROFILES[formData.profileIdx];
    const newReq: LeaveRequest = {
      id: `LV-${Date.now()}`,
      name: profile.name,
      role: profile.role,
      department: profile.dept,
      avatar: profile.avatar,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      days: formData.days,
      status: 'Pending',
      reason: formData.reason,
    };
    setRequests((prev) => [newReq, ...prev]);
    setIsModalOpen(false);
    setFormData({ profileIdx: 0, type: 'Annual Leave', startDate: '', endDate: '', days: 1, reason: '' });
  };

  const updateStatus = (id: string, status: LeaveStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Leave Management</h1>
          <p className="text-foreground-muted">Review, approve, and track staff leave requests.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
          <Plus size={18} /> Apply for Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending Requests', value: stats.pending, icon: <Clock size={24} />, color: 'bg-warning-light text-warning-dark' },
          { label: 'Approved (This Month)', value: stats.approved, icon: <CheckCircle size={24} />, color: 'bg-success-light text-success-dark' },
          { label: 'Staff on Leave Today', value: stats.onLeaveToday, icon: <User size={24} />, color: 'bg-info-light text-info-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-background-elevated p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4 theme-transition">
            <div className={`p-4 rounded-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-foreground-muted font-medium mb-1">{s.label}</p>
              <h3 className="text-3xl font-bold text-foreground-primary">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search by name or department..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
            <option value="All">All Status</option><option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
          <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-background-tertiary theme-transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border-2 border-background-elevated shadow-sm" />
                      <div>
                        <p className="font-semibold text-foreground-primary">{item.name}</p>
                        <p className="text-xs text-foreground-muted">{item.role} • {item.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground-secondary bg-background-tertiary px-2 py-1 rounded-lg text-xs">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground-primary font-medium">{item.days} Day{item.days > 1 ? 's' : ''}</span>
                      <span className="text-xs text-foreground-muted">
                        {new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {item.days > 1 && ` - ${new Date(item.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground-secondary max-w-xs truncate" title={item.reason}>{item.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${item.status === 'Approved' ? 'bg-success-light text-success-dark' :
                      item.status === 'Rejected' ? 'bg-danger-light text-danger-dark' :
                        'bg-warning-light text-warning-dark'
                      }`}>
                      {item.status === 'Approved' && <CheckCircle size={12} />}
                      {item.status === 'Rejected' && <XCircle size={12} />}
                      {item.status === 'Pending' && <Clock size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {item.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(item.id, 'Approved')} className="p-2 text-success-dark hover:bg-success-light rounded-lg theme-transition" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => updateStatus(item.id, 'Rejected')} className="p-2 text-danger-dark hover:bg-danger-light rounded-lg theme-transition" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-foreground-muted hover:text-foreground-secondary hover:bg-background-tertiary rounded-lg theme-transition">
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-foreground-muted">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No leave requests found</p>
        </div>
      )}

      {/* Apply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-background-elevated rounded-2xl shadow-2xl w-full max-w-lg theme-transition" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground-primary">New Leave Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Staff Member (Simulated)</label>
                <select value={formData.profileIdx} onChange={e => setFormData(p => ({ ...p, profileIdx: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition">
                  {PROFILES.map((p, i) => <option key={i} value={i}>{p.name} - {p.role}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Leave Type</label>
                <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as LeaveType }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition">
                  {['Annual Leave', 'Sick Leave', 'Personal', 'Unpaid', 'Maternity', 'Paternity'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Start Date</label>
                  <input type="date" required value={formData.startDate} onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Total Days</label>
                <input type="number" min={1} value={formData.days} onChange={(e) => setFormData((p) => ({ ...p, days: parseInt(e.target.value, 10) || 1 }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Reason</label>
                <textarea rows={3} value={formData.reason} onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))} placeholder="Brief explanation..."
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg shadow-accent/20 theme-transition">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
