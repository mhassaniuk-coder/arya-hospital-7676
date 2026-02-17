import React, { useState } from 'react';
import { TrendingUp, DollarSign, Activity, FileText, Sparkles, AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight, Lightbulb, Plus, XCircle, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useRevenueCycleAnalytics, useReportingAssistant } from '../hooks/useAI';
import { RevenueCycleInput, ReportingInput } from '../types';

const Revenue: React.FC = () => {
  // AI Hooks
  const revenueCycle = useRevenueCycleAnalytics();
  const reporting = useReportingAssistant();

  // State
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: 'TX-001', date: '2024-03-15', description: 'Consultation Fees', category: 'Services', type: 'Income', amount: 4500 },
    { id: 'TX-002', date: '2024-03-14', description: 'Medical Supplies', category: 'Inventory', type: 'Expense', amount: 1200 },
    { id: 'TX-003', date: '2024-03-12', description: 'Insurance Payout', category: 'Insurance', type: 'Income', amount: 8200 },
  ]);
  const [newTransaction, setNewTransaction] = useState({
    type: 'Income' as 'Income' | 'Expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const tx = {
      id: `TX-${Math.floor(Math.random() * 10000)}`,
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount)
    };
    setTransactions([tx, ...transactions]);
    setShowTransactionModal(false);
    setNewTransaction({ type: 'Income', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const revenueData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
    { name: 'Jul', income: 3490, expenses: 4300 },
  ];

  const sourceData = [
    { name: 'Consultations', value: 400, color: '#0d9488' },
    { name: 'Pharmacy', value: 300, color: '#3b82f6' },
    { name: 'Surgery', value: 300, color: '#6366f1' },
    { name: 'Diagnostics', value: 200, color: '#f59e0b' },
  ];

  // Handle Revenue Cycle Analysis
  const handleAnalyzeRevenueCycle = async () => {
    const input: RevenueCycleInput = {
      timeframe: 'Current Quarter',
      currentRevenue: 2400000,
      historicalRevenue: revenueData.map((d, idx) => ({
        month: d.name,
        revenue: d.income * 100,
        collections: d.income * 85,
        writeOffs: d.income * 5,
      })),
      arAging: {
        days0to30: 450000,
        days31to60: 180000,
        days61to90: 95000,
        days90plus: 75000,
      },
      claimMetrics: {
        totalClaims: 1250,
        paidClaims: 980,
        deniedClaims: 125,
        pendingClaims: 145,
        averageDaysToPayment: 32,
      },
    };

    await revenueCycle.execute(input);
    setShowAIPanel(true);
  };

  // Handle Report Generation
  const handleGenerateReport = async () => {
    const input: ReportingInput = {
      reportType: 'Revenue Cycle Report',
      format: 'Executive',
      audience: 'Leadership',
      requestedMetrics: ['Revenue', 'Collections', 'AR Days', 'Denial Rate'],
    };

    await reporting.execute(input);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-danger-light text-danger-dark';
      case 'Medium': return 'bg-warning-light text-warning-dark';
      default: return 'bg-info-light text-info-dark';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Critical': return 'bg-danger';
      case 'High': return 'bg-warning';
      default: return 'bg-info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Above Benchmark': return 'bg-success-light text-success-dark';
      case 'At Benchmark': return 'bg-info-light text-info-dark';
      default: return 'bg-warning-light text-warning-dark';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Revenue & Analytics</h1>
          <p className="text-foreground-secondary">Track hospital income and financial health</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAnalyzeRevenueCycle}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 theme-transition"
          >
            <Sparkles size={18} />
            AI Revenue Analysis
          </button>
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg theme-transition"
          >
            <Plus size={18} />
            Record Transaction
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg theme-transition"
          >
            <FileText size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* AI Revenue Cycle Analytics Panel */}
      {showAIPanel && revenueCycle.data && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200 theme-transition">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-purple-900">AI Revenue Cycle Analytics</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-foreground-muted hover:text-foreground-primary theme-transition">X</button>
          </div>

          {/* Revenue Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {revenueCycle.data.revenueForecast.map((forecast, idx) => (
              <div key={idx} className="bg-background-elevated rounded-xl p-4 border border-purple-100">
                <p className="text-sm text-foreground-muted">{forecast.period}</p>
                <p className="text-2xl font-bold text-foreground-primary">${(forecast.predictedRevenue / 1000).toFixed(0)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  {forecast.trend === 'increasing' ? (
                    <ArrowUpRight size={14} className="text-success" />
                  ) : forecast.trend === 'decreasing' ? (
                    <ArrowDownRight size={14} className="text-danger" />
                  ) : null}
                  <span className={`text-xs ${forecast.trend === 'increasing' ? 'text-success-dark' :
                    forecast.trend === 'decreasing' ? 'text-danger-dark' :
                      'text-foreground-muted'
                    }`}>
                    {forecast.trend} ({Math.round(forecast.confidence * 100)}% confidence)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Leakage Analysis */}
          <div className="bg-background-elevated rounded-xl p-4 border border-purple-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground-primary">Revenue Leakage Analysis</h4>
              <span className="text-lg font-bold text-danger-dark">
                Total: ${revenueCycle.data.totalLeakage.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {revenueCycle.data.leakageAnalysis.map((leak, idx) => (
                <div key={idx} className="p-3 bg-danger-light rounded-lg border border-danger-dark/30">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className="text-danger" />
                    <span className="text-sm font-medium text-foreground-primary">{leak.category}</span>
                  </div>
                  <p className="text-xs text-foreground-muted mb-2">{leak.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-danger-dark font-medium">${leak.estimatedLoss.toLocaleString()}</span>
                    <span className="text-success-dark">Recover: ${leak.potentialRecovery.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Recommendations */}
          <div className="bg-background-elevated rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-foreground-primary mb-3">Optimization Recommendations</h4>
            <div className="space-y-3">
              {revenueCycle.data.optimizationRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-background-secondary rounded-lg">
                  <Lightbulb size={18} className={`${rec.priority === 'High' ? 'text-danger' :
                    rec.priority === 'Medium' ? 'text-warning' :
                      'text-info'
                    } mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground-primary">{rec.area}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(rec.priority)}`}>{rec.priority}</span>
                    </div>
                    <p className="text-sm text-foreground-secondary mt-1">Potential gain: ${rec.potentialGain.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rec.actions.slice(0, 2).map((action, i) => (
                        <span key={i} className="text-xs bg-background-elevated px-2 py-1 rounded border border-border text-foreground-secondary">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI Projections */}
          <div className="mt-4 bg-background-elevated rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-foreground-primary mb-3">KPI Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {revenueCycle.data.kpiProjections.map((kpi, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-sm text-foreground-muted">{kpi.kpi}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-lg font-bold text-foreground-primary">{kpi.currentValue}</span>
                    <ArrowUpRight size={14} className="text-success" />
                    <span className="text-lg font-bold text-success-dark">{kpi.projectedValue}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Report */}
      {reporting.data && (
        <div className="bg-gradient-to-r from-accent/10 to-cyan-50 rounded-2xl p-6 border border-accent/30 theme-transition">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-accent" size={20} />
            <h3 className="text-lg font-semibold text-accent">AI Generated Report</h3>
            <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
          </div>

          <div className="bg-background-elevated rounded-xl p-4 border border-accent/20">
            <h4 className="font-bold text-foreground-primary mb-2">{reporting.data.reportTitle}</h4>
            <p className="text-sm text-foreground-secondary mb-4">{reporting.data.executiveSummary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reporting.data.keyFindings.slice(0, 4).map((finding, idx) => (
                <div key={idx} className="p-3 bg-background-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${getImportanceColor(finding.importance)}`} />
                    <span className="text-sm font-medium text-foreground-primary">{finding.finding}</span>
                  </div>
                  <p className="text-xs text-foreground-muted">{finding.supportingData.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-success-light text-success-dark rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-medium bg-success-light text-success-dark px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +15%
            </span>
          </div>
          <p className="text-foreground-muted text-sm font-medium">Total Revenue (YTD)</p>
          <h3 className="text-2xl font-bold text-foreground-primary">$2.4M</h3>
        </div>

        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-info-light text-info-dark rounded-lg">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-foreground-muted text-sm font-medium">Net Profit Margin</p>
          <h3 className="text-2xl font-bold text-foreground-primary">22.4%</h3>
        </div>

        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-foreground-muted text-sm font-medium">Pending Invoices</p>
          <h3 className="text-2xl font-bold text-foreground-primary">145</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <h3 className="font-bold text-foreground-primary mb-6">Revenue vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--background-elevated)' }} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background-elevated p-6 rounded-xl border border-border shadow-sm theme-transition">
          <h3 className="font-bold text-foreground-primary mb-6">Revenue Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-background-elevated rounded-xl border border-border shadow-sm overflow-hidden theme-transition">
        <div className="p-6 border-b border-border-muted">
          <h3 className="font-bold text-foreground-primary">Recent Transactions</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {transactions.map(tx => (
              <tr key={tx.id} className="hover:bg-background-secondary transition-colors theme-transition">
                <td className="px-6 py-4 text-foreground-muted text-sm">{tx.date}</td>
                <td className="px-6 py-4 font-medium text-foreground-primary">{tx.description}</td>
                <td className="px-6 py-4"><span className="bg-background-tertiary text-foreground-secondary px-2 py-1 rounded text-xs">{tx.category}</span></td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${tx.type === 'Income' ? 'text-success-dark' : 'text-danger-dark'}`}>
                    {tx.type === 'Income' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {tx.type}
                  </span>
                </td>
                <td className={`px-6 py-4 text-right font-bold ${tx.type === 'Income' ? 'text-success-dark' : 'text-foreground-primary'}`}>
                  {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTransactionModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border-muted">
              <h2 className="text-xl font-bold text-foreground-primary">Record Transaction</h2>
              <button onClick={() => setShowTransactionModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary transition-colors theme-transition">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Type</label>
                  <select
                    value={newTransaction.type}
                    onChange={e => setNewTransaction({ ...newTransaction, type: e.target.value as 'Income' | 'Expense' })}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Description</label>
                <input
                  required
                  value={newTransaction.description}
                  onChange={e => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  placeholder="e.g. Consultation Fees"
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Category</label>
                  <input
                    required
                    value={newTransaction.category}
                    onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })}
                    placeholder="e.g. Services"
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={newTransaction.date}
                    onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTransactionModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary transition-colors theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg transition-all theme-transition">Record Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Revenue;
