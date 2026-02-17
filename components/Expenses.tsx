import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingDown, TrendingUp, PieChart as PieIcon, Plus, X, Search, Filter, FileText, CheckCircle, AlertCircle, Clock, Calendar, Edit, Trash2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  requestedBy: string;
  receipt?: string;
}

const CATEGORIES = ['Medical Supplies', 'Salaries', 'Utilities', 'Maintenance', 'Pharmacy', 'Equipment', 'Marketing', 'Administrative'];

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: '1', category: 'Medical Supplies', amount: 5400, date: '2024-03-10', description: 'Surgical kits restocking', status: 'Approved', requestedBy: 'Dr. Sarah Chen' },
  { id: '2', category: 'Utilities', amount: 2100, date: '2024-03-11', description: 'Electricity bill Feb', status: 'Approved', requestedBy: 'Admin' },
  { id: '3', category: 'Equipment', amount: 15000, date: '2024-03-12', description: 'New Ultrasound Machine', status: 'Pending', requestedBy: 'Dr. Michael Ross' },
  { id: '4', category: 'Maintenance', amount: 800, date: '2024-03-12', description: 'AC repair in Ward A', status: 'Approved', requestedBy: 'Facility Mgr' },
  { id: '5', category: 'Pharmacy', amount: 3200, date: '2024-03-15', description: 'Antibiotics bulk order', status: 'Approved', requestedBy: 'Pharmacy Head' },
  { id: '6', category: 'Marketing', amount: 4500, date: '2024-03-16', description: 'Q1 Health Camp Campaign', status: 'Pending', requestedBy: 'Marketing Team' },
];

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState<Partial<ExpenseItem>>({
    category: 'Medical Supplies',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    requestedBy: '',
    status: 'Pending'
  });

  const stats = useMemo(() => ({
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0),
    monthlyChange: -2.5 // Mock data
  }), [expenses]);

  const chartData = useMemo(() => {
    // Mock daily data for the chart
    return [
      { name: 'Mon', amount: 4000 },
      { name: 'Tue', amount: 3000 },
      { name: 'Wed', amount: 15400 },
      { name: 'Thu', amount: 2780 },
      { name: 'Fri', amount: 1890 },
      { name: 'Sat', amount: 2390 },
      { name: 'Sun', amount: 3490 },
    ];
  }, []);

  const categoryData = useMemo(() => {
    const data = CATEGORIES.map(cat => ({
      name: cat,
      value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    })).filter(d => d.value > 0);
    return data;
  }, [expenses]);

  const filtered = useMemo(() => expenses.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(searchQuery.toLowerCase()) || e.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [expenses, searchQuery, categoryFilter, statusFilter]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    if (isEditing && selectedId) {
      setExpenses(prev => prev.map(e => e.id === selectedId ? { ...e, ...formData, amount: Number(formData.amount) } as ExpenseItem : e));
    } else {
      const newExpense: ExpenseItem = {
        id: Date.now().toString(),
        ...(formData as ExpenseItem),
        amount: Number(formData.amount)
      };
      setExpenses(prev => [newExpense, ...prev]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleEdit = (expense: ExpenseItem) => {
    setFormData(expense);
    setSelectedId(expense.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ category: 'Medical Supplies', amount: 0, date: new Date().toISOString().split('T')[0], description: '', requestedBy: '', status: 'Pending' });
    setIsEditing(false);
    setSelectedId(null);
  };

  const updateStatus = (id: string, status: ExpenseItem['status']) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-success-light text-success-dark';
      case 'Rejected': return 'bg-danger-light text-danger-dark';
      case 'Pending': return 'bg-warning-light text-warning-dark';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Expense Tracking</h1>
          <p className="text-foreground-secondary">Monitor hospital spending and approvals.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all theme-transition">
          <Plus size={18} /> Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Expenses', value: formatCurrency(stats.total), icon: <DollarSign size={22} />, color: 'bg-danger-light text-danger-dark' },
          { label: 'Pending Approval', value: formatCurrency(stats.pending), icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
          { label: 'Approved', value: formatCurrency(stats.approved), icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
          { label: 'Monthly Change', value: `${stats.monthlyChange}%`, icon: <TrendingDown size={22} />, color: 'bg-success-light text-success-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-background-elevated p-5 rounded-2xl shadow-sm border border-border theme-transition">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                <p className="text-xl font-bold text-foreground-primary">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-background-elevated p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <h3 className="font-bold text-foreground-primary mb-6">Daily Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--background-elevated)', border: 'none', borderRadius: '8px', color: 'var(--foreground-primary)' }}
                  itemStyle={{ color: 'var(--foreground-primary)' }}
                  formatter={(value) => [`$${value}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-background-elevated p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <h3 className="font-bold text-foreground-primary mb-6">Category Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--background-elevated)', border: 'none', borderRadius: '8px', color: 'var(--foreground-primary)' }}
                  itemStyle={{ color: 'var(--foreground-primary)' }}
                  formatter={(value) => [`$${value}`, 'Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {categoryData.slice(0, 4).map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-foreground-muted">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search expenses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-rose-500 theme-transition" />
        </div>
        <div className="relative">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer theme-transition">
            <option value="All">All Categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-background-elevated border border-border rounded-xl text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer theme-transition">
            <option value="All">All Status</option><option>Approved</option><option>Pending</option><option>Rejected</option>
          </select>
          <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-background-elevated rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
              <tr>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Requested By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {filtered.map(expense => (
                <tr key={expense.id} className="hover:bg-background-secondary transition-colors theme-transition">
                  <td className="px-6 py-4 font-medium text-foreground-primary">{expense.description}</td>
                  <td className="px-6 py-4 text-foreground-secondary">{expense.category}</td>
                  <td className="px-6 py-4 font-bold text-foreground-primary">{formatCurrency(expense.amount)}</td>
                  <td className="px-6 py-4 text-foreground-muted">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-foreground-secondary">{expense.requestedBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${getStatusColor(expense.status)}`}>
                      {expense.status === 'Approved' && <CheckCircle size={12} />}
                      {expense.status === 'Rejected' && <XCircle size={12} />}
                      {expense.status === 'Pending' && <Clock size={12} />}
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {expense.status === 'Pending' && (
                      <>
                        <button onClick={() => updateStatus(expense.id, 'Approved')} className="p-1.5 text-success-dark hover:bg-success-light rounded-lg transition-colors theme-transition" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button onClick={() => updateStatus(expense.id, 'Rejected')} className="p-1.5 text-danger-dark hover:bg-danger-light rounded-lg transition-colors theme-transition" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button onClick={() => handleEdit(expense)} className="p-1.5 text-foreground-muted hover:text-accent rounded-lg hover:bg-accent/10 transition-colors theme-transition" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-foreground-muted hover:text-danger rounded-lg hover:bg-danger/10 transition-colors theme-transition" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border-muted">
              <h2 className="text-xl font-bold text-foreground-primary">{isEditing ? 'Edit Expense' : 'Record Expense'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Description</label>
                <input type="text" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="e.g. Office Supplies"
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-rose-500 theme-transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Category</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-rose-500 theme-transition">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Amount ($)</label>
                  <input type="number" value={formData.amount} onChange={e => setFormData(p => ({ ...p, amount: Number(e.target.value) }))} placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-rose-500 theme-transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-rose-500 theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Requested By</label>
                  <input type="text" value={formData.requestedBy} onChange={e => setFormData(p => ({ ...p, requestedBy: e.target.value }))} placeholder="Employee Name"
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-rose-500 theme-transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Attach Receipt (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-background-secondary transition-colors cursor-pointer theme-transition">
                  <p className="text-sm text-foreground-muted">Click to upload or drag and drop</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary transition-colors theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all theme-transition">{isEditing ? 'Update Expense' : 'Submit Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
