import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, Sparkles, FileText, Lightbulb, TrendingUp, Download, PieChart as PieIcon, BarChart as BarChartIcon, Target, Activity } from 'lucide-react';
import { useReportingAssistant } from '../hooks/useAI';
import { ReportingInput } from '../types';

const DEMOGRAPHICS_DATA = [
  { name: '0-18', value: 150 },
  { name: '19-35', value: 300 },
  { name: '36-60', value: 450 },
  { name: '60+', value: 200 },
];

const REVENUE_DATA = [
  { name: 'Jan', revenue: 40000, profit: 2400 },
  { name: 'Feb', revenue: 30000, profit: 1398 },
  { name: 'Mar', revenue: 20000, profit: 9800 },
  { name: 'Apr', revenue: 27800, profit: 3908 },
  { name: 'May', revenue: 18900, profit: 4800 },
  { name: 'Jun', revenue: 23900, profit: 3800 },
];

const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b'];

const Analytics: React.FC = () => {
  // AI Hooks
  const reporting = useReportingAssistant();

  // State
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [reportType, setReportType] = useState('Executive Summary');

  // Handle Generate AI Report
  const handleGenerateReport = async () => {
    const input: ReportingInput = {
      reportType,
      format: 'Executive',
      audience: 'Leadership',
      requestedMetrics: ['Revenue', 'Patient Volume', 'Occupancy Rate', 'Treatment Costs'],
      dataScope: {
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        departments: ['All'],
      },
    };

    await reporting.execute(input);
    setShowAIPanel(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Hospital Analytics</h1>
          <p className="text-foreground-secondary">Deep dive into hospital performance and demographics.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-background-primary border border-border text-foreground-primary px-4 py-2 rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>Executive Summary</option>
            <option>Financial Report</option>
            <option>Operational Report</option>
            <option>Quality Metrics</option>
          </select>
          <button
            onClick={handleGenerateReport}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Sparkles size={16} />
            AI Generate Report
          </button>
        </div>
      </div>

      {/* AI Generated Report Panel */}
      {showAIPanel && reporting.data && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 animate-scale-up theme-transition">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-purple-600 dark:text-purple-400" size={20} />
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">{reporting.data.reportTitle}</h3>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full font-medium">AI-Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-background-secondary text-foreground-secondary px-3 py-1.5 rounded-lg text-sm font-medium border border-border hover:bg-background-tertiary flex items-center gap-1 theme-transition">
                <Download size={14} />
                Export
              </button>
              <button onClick={() => setShowAIPanel(false)} className="text-foreground-muted hover:text-foreground-primary transition-colors">✕</button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-2 flex items-center gap-2">
              <Activity size={16} className="text-purple-500" />
              Executive Summary
            </h4>
            <p className="text-sm text-foreground-secondary leading-relaxed">{reporting.data.executiveSummary}</p>
          </div>

          {/* Natural Language Summary */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500" />
              AI Analysis Summary
            </h4>
            <p className="text-sm text-foreground-secondary leading-relaxed">{reporting.data.naturalLanguageSummary}</p>
          </div>

          {/* Key Findings */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
              <Target size={16} className="text-purple-500" />
              Key Findings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reporting.data.keyFindings.map((finding, idx) => (
                <div key={idx} className={`p-3 rounded-lg border transition-colors ${finding.importance === 'Critical' ? 'bg-danger-light border-red-200 dark:border-red-800' :
                  finding.importance === 'High' ? 'bg-warning-light border-orange-200 dark:border-orange-800' :
                    'bg-background-tertiary border-border'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${finding.importance === 'Critical' ? 'bg-red-500' :
                      finding.importance === 'High' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                    <span className="text-sm font-medium text-foreground-primary">{finding.finding}</span>
                  </div>
                  <p className="text-xs text-foreground-secondary">{reporting.data.keyFindings[idx].supportingData.join(' • ')}</p>
                  {finding.actionRequired && (
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-1 block">Action Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Report Sections */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-3">Detailed Sections</h4>
            {reporting.data.sections.map((section, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <h5 className="font-medium text-foreground-primary mb-2">{section.title}</h5>
                <p className="text-sm text-foreground-secondary mb-2">{section.content}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {section.metrics.map((metric, i) => (
                    <div key={i} className="p-3 bg-background-tertiary rounded-lg border border-border theme-transition">
                      <p className="text-xs text-foreground-muted">{metric.name}</p>
                      <p className="text-lg font-bold text-foreground-primary">{metric.value}</p>
                      {metric.trend && (
                        <span className={`text-xs flex items-center gap-1 ${metric.trend === 'increasing' ? 'text-success-dark' :
                          metric.trend === 'decreasing' ? 'text-danger-dark' :
                            'text-foreground-muted'
                          }`}>
                          <TrendingUp size={10} className={metric.trend === 'decreasing' ? 'rotate-180' : ''} />
                          {metric.trend}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-3">AI Recommendations</h4>
            <div className="space-y-3">
              {reporting.data.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-background-tertiary rounded-lg border border-border theme-transition">
                  <Lightbulb className={`${rec.priority === 'Immediate' ? 'text-danger-dark' :
                    rec.priority === 'Short-term' ? 'text-warning-dark' :
                      'text-accent'
                    } mt-0.5`} size={18} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground-primary">{rec.recommendation}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${rec.priority === 'Immediate' ? 'bg-danger-light text-danger-dark' :
                        rec.priority === 'Short-term' ? 'bg-warning-light text-warning-dark' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}>{rec.priority}</span>
                    </div>
                    <p className="text-sm text-foreground-secondary mb-1">{rec.rationale}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Expected Impact: {rec.expectedImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Report Builder Suggestions */}
          <div className="mt-4 bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 shadow-sm theme-transition">
            <h4 className="font-semibold text-foreground-primary mb-3">Custom Report Builder</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-2">Suggested Metrics</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedMetrics.map((metric, idx) => (
                    <span key={idx} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded border border-purple-200 dark:border-purple-800">{metric}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-2">Suggested Visualizations</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedVisualizations.map((viz, idx) => (
                    <span key={idx} className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-1 rounded border border-teal-200 dark:border-teal-800">{viz.type}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-2">Available Filters</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedFilters.map((filter, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">{filter.filter}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demographics Pie Chart */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground-primary">Patient Demographics</h3>
            <PieIcon size={18} className="text-foreground-muted" />
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEMOGRAPHICS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DEMOGRAPHICS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1e293b'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-foreground-muted mt-2">Distribution by Age Group</div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border lg:col-span-2 theme-transition">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground-primary">Revenue & Profit</h3>
              <BarChartIcon size={18} className="text-foreground-muted" />
            </div>
            <span className="text-success-dark text-sm font-medium flex items-center gap-1 bg-success-light px-2 py-1 rounded-lg border border-success-200 dark:border-success-800">
              <ArrowUpRight size={16} />
              +12.5% vs last period
            </span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1e293b'
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="profit" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <h3 className="font-bold text-lg mb-2 relative z-10">Occupancy Rate</h3>
          <div className="flex items-end gap-4 relative z-10">
            <span className="text-5xl font-bold">84%</span>
            <span className="text-teal-100 mb-2">Standard Ward</span>
          </div>
          <div className="w-full bg-teal-800/30 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className="bg-white h-full rounded-full" style={{ width: '84%' }}></div>
          </div>
          <Activity className="absolute -right-4 -bottom-4 opacity-10" size={120} />
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <h3 className="font-bold text-lg mb-2 relative z-10">Avg. Treatment Cost</h3>
          <div className="flex items-end gap-4 relative z-10">
            <span className="text-5xl font-bold">$4.2k</span>
            <span className="text-blue-100 mb-2">Per Patient</span>
          </div>
          <p className="text-sm text-blue-100 mt-4 opacity-80 relative z-10">Decreased by 2% due to efficiency improvements.</p>
          <Target className="absolute -right-4 -bottom-4 opacity-10" size={120} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;

