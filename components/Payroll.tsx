import React, { useState, useMemo } from 'react';
import { PayrollRecord } from '../types';
import { DollarSign, Download, Search, Filter, CheckCircle, Clock, AlertCircle, FileText, ChevronDown, Plus, X, Calendar, Loader2 } from 'lucide-react';

const INITIAL_PAYROLL: PayrollRecord[] = [
  { id: 'PR-001', staffId: 'ST-001', staffName: 'Dr. Sarah Chen', role: 'Chief Physician', department: 'Cardiology', baseSalary: 20833, bonus: 2000, deductions: 500, netSalary: 22333, paymentDate: '2024-02-28', status: 'Paid', paymentMethod: 'Bank Transfer' },
  { id: 'PR-002', staffId: 'ST-002', staffName: 'James Wilson', role: 'Senior Nurse', department: 'Emergency', baseSalary: 7083, bonus: 500, deductions: 200, netSalary: 7383, paymentDate: '2024-02-28', status: 'Processing', paymentMethod: 'Bank Transfer' },
  { id: 'PR-003', staffId: 'ST-003', staffName: 'Dr. Michael Ross', role: 'Surgeon', department: 'Surgery', baseSalary: 25000, bonus: 5000, deductions: 1000, netSalary: 29000, paymentDate: '2024-02-28', status: 'Pending', paymentMethod: 'Check' },
  { id: 'PR-004', staffId: 'ST-004', staffName: 'Emily Davis', role: 'Lab Technician', department: 'Laboratory', baseSalary: 5416, bonus: 300, deductions: 150, netSalary: 5566, paymentDate: '2024-02-28', status: 'Paid', paymentMethod: 'Bank Transfer' },
  { id: 'PR-005', staffId: 'ST-005', staffName: 'David Kim', role: 'Pharmacist', department: 'Pharmacy', baseSalary: 7916, bonus: 400, deductions: 200, netSalary: 8116, paymentDate: '2024-02-28', status: 'Paid', paymentMethod: 'Bank Transfer' },
];

const Payroll: React.FC = () => {
  const [records, setRecords] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

  const filtered = useMemo(() => records.filter(r => {
    const matchesSearch = r.staffName.toLowerCase().includes(searchQuery.toLowerCase()) || r.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [records, searchQuery, statusFilter]);

  const stats = useMemo(() => ({
    totalCost: records.reduce((sum, r) => sum + r.netSalary, 0),
    pending: records.filter(r => r.status === 'Pending').length,
    processing: records.filter(r => r.status === 'Processing').length,
    paid: records.filter(r => r.status === 'Paid').length,
  }), [records]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleRunPayroll = () => {
    // Simulate running payroll
    setRecords(prev => prev.map(r => r.status === 'Pending' ? { ...r, status: 'Processing' } : r));
    setShowRunModal(false);
  };

  const updateStatus = (id: string, newStatus: PayrollRecord['status']) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Payroll Management</h1>
          <p className="text-foreground-muted">Manage staff salaries, bonuses, and slips.</p>
        </div>
        <button onClick={() => setShowRunModal(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 flex items-center gap-2 theme-transition">
          <DollarSign size={18} /> Run Payroll
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payroll Cost', value: formatCurrency(stats.totalCost), icon: <DollarSign size={22} />, color: 'bg-info-light text-info-dark' },
          { label: 'Pending Approval', value: stats.pending, icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
          { label: 'Processing', value: stats.processing, icon: <Loader2 size={22} className={stats.processing > 0 ? 'animate-spin' : ''} />, color: 'bg-info-light text-info-dark' },
          { label: 'Paid This Month', value: stats.paid, icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
        ].map((s, i) => {
          const Icon = s.icon as any; // Type workaround for icon component
          return (
            <div key={i} className="bg-background-elevated p-5 rounded-2xl shadow-sm border border-border theme-transition">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                  <p className="text-xl font-bold text-foreground-primary">{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search staff or role..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent theme-transition" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent cursor-pointer theme-transition">
            <option value="All">All Status</option><option>Paid</option><option>Processing</option><option>Pending</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                <th className="px-6 py-4">Staff Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Base Salary</th>
                <th className="px-6 py-4">Net Pay</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-background-tertiary theme-transition">
                  <td className="px-6 py-4 font-semibold text-foreground-primary">{record.staffName}</td>
                  <td className="px-6 py-4 text-foreground-secondary">
                    <div className="flex flex-col">
                      <span>{record.role}</span>
                      <span className="text-xs text-foreground-muted">{record.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground-secondary font-mono">{formatCurrency(record.baseSalary)}</td>
                  <td className="px-6 py-4 font-bold text-accent font-mono">{formatCurrency(record.netSalary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${record.status === 'Paid' ? 'bg-success-light text-success-dark' :
                      record.status === 'Processing' ? 'bg-info-light text-info-dark' :
                        'bg-warning-light text-warning-dark'
                      }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted text-xs">{new Date(record.paymentDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedSlip(record)} className="text-accent font-medium hover:underline text-xs flex items-center justify-end gap-1">
                      <FileText size={14} /> View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run Payroll Modal */}
      {showRunModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRunModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-md w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground-primary flex items-center gap-2"><DollarSign size={20} className="text-accent" /> Run Payroll</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-info-light p-4 rounded-xl border border-info-dark/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground-secondary font-medium">Period</span>
                  <span className="text-sm font-bold text-foreground-primary">February 2024</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground-secondary font-medium">Total Employees</span>
                  <span className="text-sm font-bold text-foreground-primary">{records.length}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-info-dark/20">
                  <span className="text-sm text-foreground-secondary font-bold">Total Payout</span>
                  <span className="text-lg font-bold text-accent">{formatCurrency(stats.totalCost)}</span>
                </div>
              </div>
              <p className="text-sm text-foreground-muted text-center">
                This will initiate payment processing for {records.filter(r => r.status === 'Pending').length} pending records.
              </p>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <button onClick={() => setShowRunModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
              <button onClick={handleRunPayroll} className="flex-1 py-2.5 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20 theme-transition">Confirm Payout</button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSlip(null)}>
          <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl theme-transition" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground-primary">Salary Slip</h3>
              <button onClick={() => setSelectedSlip(null)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary theme-transition"><X size={18} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-info-light text-accent mb-3">
                  <DollarSign size={24} />
                </div>
                <h2 className="text-2xl font-bold text-foreground-primary">{formatCurrency(selectedSlip.netSalary)}</h2>
                <p className="text-foreground-muted text-sm">Net Pay</p>
              </div>

              <div className="bg-background-secondary rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Employee</span>
                  <span className="font-semibold text-foreground-primary">{selectedSlip.staffName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Role</span>
                  <span className="font-semibold text-foreground-primary">{selectedSlip.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Department</span>
                  <span className="font-semibold text-foreground-primary">{selectedSlip.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Payment Date</span>
                  <span className="font-semibold text-foreground-primary">{new Date(selectedSlip.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground-primary text-sm uppercase tracking-wider">Earnings</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Base Salary</span>
                  <span className="font-medium text-foreground-primary">{formatCurrency(selectedSlip.baseSalary)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Bonus</span>
                  <span className="font-medium text-success-dark">+{formatCurrency(selectedSlip.bonus)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <h4 className="font-semibold text-foreground-primary text-sm uppercase tracking-wider">Deductions</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Tax & Insurance</span>
                  <span className="font-medium text-danger-dark">-{formatCurrency(selectedSlip.deductions)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-center">
                <button className="flex items-center gap-2 text-accent font-semibold hover:underline">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import specific icon needed for dynamic rendering */}
      <div className="hidden">
        <Loader2 />
      </div>
    </div>
  );
};

export default Payroll;
