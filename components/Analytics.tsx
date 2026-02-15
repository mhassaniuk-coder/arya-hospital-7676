import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, Sparkles, FileText, Lightbulb, TrendingUp, Download } from 'lucide-react';
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
          <h1 className="text-2xl font-bold text-slate-900">Hospital Analytics</h1>
          <p className="text-slate-500">Deep dive into hospital performance and demographics.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>Executive Summary</option>
            <option>Financial Report</option>
            <option>Operational Report</option>
            <option>Quality Metrics</option>
          </select>
          <button 
            onClick={handleGenerateReport}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"
          >
            <Sparkles size={16} />
            AI Generate Report
          </button>
        </div>
      </div>

      {/* AI Generated Report Panel */}
      {showAIPanel && reporting.data && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-purple-900">{reporting.data.reportTitle}</h3>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">AI-Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-white text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 flex items-center gap-1">
                <Download size={14} />
                Export
              </button>
              <button onClick={() => setShowAIPanel(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
          </div>
          
          {/* Executive Summary */}
          <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
            <h4 className="font-semibold text-slate-800 mb-2">Executive Summary</h4>
            <p className="text-sm text-slate-600">{reporting.data.executiveSummary}</p>
          </div>
          
          {/* Natural Language Summary */}
          <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
            <h4 className="font-semibold text-slate-800 mb-2">AI Analysis Summary</h4>
            <p className="text-sm text-slate-600">{reporting.data.naturalLanguageSummary}</p>
          </div>
          
          {/* Key Findings */}
          <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
            <h4 className="font-semibold text-slate-800 mb-3">Key Findings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reporting.data.keyFindings.map((finding, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${
                  finding.importance === 'Critical' ? 'bg-red-50 border border-red-200' :
                  finding.importance === 'High' ? 'bg-orange-50 border border-orange-200' :
                  'bg-slate-50 border border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      finding.importance === 'Critical' ? 'bg-red-500' :
                      finding.importance === 'High' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-700">{finding.finding}</span>
                  </div>
                  <p className="text-xs text-slate-500">{finding.supportingData.join(' • ')}</p>
                  {finding.actionRequired && (
                    <span className="text-xs text-purple-600 font-medium mt-1 block">Action Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Report Sections */}
          <div className="bg-white rounded-xl p-4 border border-purple-100 mb-4">
            <h4 className="font-semibold text-slate-800 mb-3">Detailed Sections</h4>
            {reporting.data.sections.map((section, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <h5 className="font-medium text-slate-700 mb-2">{section.title}</h5>
                <p className="text-sm text-slate-600 mb-2">{section.content}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {section.metrics.map((metric, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">{metric.name}</p>
                      <p className="text-lg font-bold text-slate-800">{metric.value}</p>
                      {metric.trend && (
                        <span className={`text-xs flex items-center gap-1 ${
                          metric.trend === 'increasing' ? 'text-green-600' :
                          metric.trend === 'decreasing' ? 'text-red-600' :
                          'text-slate-500'
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
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-3">AI Recommendations</h4>
            <div className="space-y-3">
              {reporting.data.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Lightbulb className={`${
                    rec.priority === 'Immediate' ? 'text-red-500' :
                    rec.priority === 'Short-term' ? 'text-amber-500' :
                    'text-blue-500'
                  } mt-0.5`} size={18} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-800">{rec.recommendation}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        rec.priority === 'Immediate' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'Short-term' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{rec.priority}</span>
                    </div>
                    <p className="text-sm text-slate-600">{rec.rationale}</p>
                    <p className="text-xs text-purple-600 mt-1">Expected Impact: {rec.expectedImpact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custom Report Builder Suggestions */}
          <div className="mt-4 bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-semibold text-slate-800 mb-3">Custom Report Builder</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Suggested Metrics</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedMetrics.map((metric, idx) => (
                    <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{metric}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Suggested Visualizations</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedVisualizations.map((viz, idx) => (
                    <span key={idx} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">{viz.type}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Available Filters</p>
                <div className="flex flex-wrap gap-1">
                  {reporting.data.customReportBuilder.suggestedFilters.map((filter, idx) => (
                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{filter.filter}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demographics Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Patient Demographics</h3>
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
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-slate-500 mt-2">Distribution by Age Group</div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Revenue & Profit</h3>
                <span className="text-green-600 text-sm font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={16} />
                    +12.5% vs last period
                </span>
            </div>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                        <Bar dataKey="profit" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-lg mb-2">Occupancy Rate</h3>
              <div className="flex items-end gap-4">
                  <span className="text-5xl font-bold">84%</span>
                  <span className="text-teal-100 mb-2">Standard Ward</span>
              </div>
              <div className="w-full bg-teal-800/30 h-2 rounded-full mt-4 overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-lg mb-2">Avg. Treatment Cost</h3>
              <div className="flex items-end gap-4">
                  <span className="text-5xl font-bold">$4.2k</span>
                  <span className="text-blue-100 mb-2">Per Patient</span>
              </div>
              <p className="text-sm text-blue-100 mt-4 opacity-80">Decreased by 2% due to efficiency improvements.</p>
          </div>
      </div>
    </div>
  );
};

export default Analytics;
