import React, { useState } from 'react';
import { TrendingUp, DollarSign, Activity, FileText, Sparkles, AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight, Lightbulb } from 'lucide-react';
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue & Analytics</h1>
          <p className="text-slate-500">Track hospital income and financial health</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAnalyzeRevenueCycle}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
          >
            <Sparkles size={18} />
            AI Revenue Analysis
          </button>
          <button 
            onClick={handleGenerateReport}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
          >
            <FileText size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* AI Revenue Cycle Analytics Panel */}
      {showAIPanel && revenueCycle.data && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-purple-900">AI Revenue Cycle Analytics</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
          
          {/* Revenue Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {revenueCycle.data.revenueForecast.map((forecast, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-purple-100">
                <p className="text-sm text-slate-500">{forecast.period}</p>
                <p className="text-2xl font-bold text-slate-800">${(forecast.predictedRevenue / 1000).toFixed(0)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  {forecast.trend === 'increasing' ? (
                    <ArrowUpRight size={14} className="text-green-500" />
                  ) : forecast.trend === 'decreasing' ? (
                    <ArrowDownRight size={14} className="text-red-500" />
                  ) : null}
                  <span className={`text-xs ${
                    forecast.trend === 'increasing' ? 'text-green-600' :
                    forecast.trend === 'decreasing' ? 'text-red-600' :
                    'text-slate-500'
                  }`}>
                    {forecast.trend} ({Math.round(forecast.confidence * 100)}% confidence)
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Leakage Analysis */}
          <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800">Revenue Leakage Analysis</h4>
              <span className="text-lg font-bold text-red-600">
                Total: ${revenueCycle.data.totalLeakage.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {revenueCycle.data.leakageAnalysis.map((leak, idx) => (
                <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-sm font-medium text-slate-700">{leak.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{leak.description}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-600 font-medium">${leak.estimatedLoss.toLocaleString()}</span>
                    <span className="text-green-600">Recover: ${leak.potentialRecovery.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Optimization Recommendations */}
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-3">Optimization Recommendations</h4>
            <div className="space-y-3">
              {revenueCycle.data.optimizationRecommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Lightbulb size={18} className={`${
                    rec.priority === 'High' ? 'text-red-500' :
                    rec.priority === 'Medium' ? 'text-amber-500' :
                    'text-blue-500'
                  } mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{rec.area}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{rec.priority}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Potential gain: ${rec.potentialGain.toLocaleString()}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rec.actions.slice(0, 2).map((action, i) => (
                        <span key={i} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
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
          <div className="mt-4 bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-3">KPI Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {revenueCycle.data.kpiProjections.map((kpi, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-sm text-slate-500">{kpi.kpi}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-lg font-bold text-slate-800">{kpi.currentValue}</span>
                    <ArrowUpRight size={14} className="text-green-500" />
                    <span className="text-lg font-bold text-green-600">{kpi.projectedValue}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    kpi.status === 'Above Benchmark' ? 'bg-green-100 text-green-700' :
                    kpi.status === 'At Benchmark' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
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
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-teal-600" size={20} />
            <h3 className="text-lg font-semibold text-teal-900">AI Generated Report</h3>
            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full font-medium">AI-Powered</span>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-teal-100">
            <h4 className="font-bold text-slate-800 mb-2">{reporting.data.reportTitle}</h4>
            <p className="text-sm text-slate-600 mb-4">{reporting.data.executiveSummary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reporting.data.keyFindings.slice(0, 4).map((finding, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      finding.importance === 'Critical' ? 'bg-red-500' :
                      finding.importance === 'High' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-700">{finding.finding}</span>
                  </div>
                  <p className="text-xs text-slate-500">{finding.supportingData.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
            <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +15%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Revenue (YTD)</p>
          <h3 className="text-2xl font-bold text-slate-900">$2.4M</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Net Profit Margin</p>
          <h3 className="text-2xl font-bold text-slate-900">22.4%</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pending Invoices</p>
          <h3 className="text-2xl font-bold text-slate-900">145</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Revenue vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Area type="monotone" dataKey="income" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Revenue Sources</h3>
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
    </div>
  );
};

export default Revenue;
