import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Pill,
  ClipboardList,
  Shield,
  Bell,
  Sparkles,
  Brain,
  Loader2,
  AlertCircle,
  TrendingUp,
  X,
  UserCheck,
  AlertTriangle,
  HeartPulse,
  LineChart,
  Gauge,
  Bug,
  CalendarClock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { StatCardProps, ChartDataPoint, UserRole, OutbreakDetectionResult, HealthTrendResult, ReadmissionRiskResult, PatientFlowResult } from '../types';
import { useData } from '../src/contexts/DataContext';
import { useAuth } from '../src/contexts/AuthContext';
import { useTheme } from '../src/contexts/ThemeContext';
import { useNav } from '../src/contexts/NavContext';
import { usePatientFlowAnalytics } from '../hooks/useAI';
import { detectDiseaseOutbreak, analyzeHealthTrends, predictReadmissionRisk } from '../services/aiService';
import { motion } from 'framer-motion';

const data: ChartDataPoint[] = [
  { name: 'Mon', patients: 40, appointments: 24 },
  { name: 'Tue', patients: 30, appointments: 18 },
  { name: 'Wed', patients: 55, appointments: 35 },
  { name: 'Thu', patients: 45, appointments: 28 },
  { name: 'Fri', patients: 60, appointments: 40 },
  { name: 'Sat', patients: 35, appointments: 20 },
  { name: 'Sun', patients: 20, appointments: 10 },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, trendUp, icon, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-panel p-6 rounded-2xl relative overflow-hidden group shadow-xl"
  >
    {/* Background Glow */}
    <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full ${color.replace('bg-', 'bg-opacity-10 bg-')} blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50`}></div>
    <div className={`absolute -left-10 -bottom-10 w-32 h-32 rounded-full ${color.replace('bg-', 'bg-opacity-5 bg-')} blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-30`}></div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-inner`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `text-${color.replace('bg-', '')}-600 dark:text-${color.replace('bg-', '')}-400` })}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full border shadow-sm backdrop-blur-sm ${trendUp ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
          {trendUp ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1 relative z-10 tracking-wide">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 relative z-10 tracking-tight">{value}</p>
  </motion.div>
);

const PatientDashboard: React.FC = () => {
  const { appointments } = useData();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={appointments.filter(a => a.status === 'Confirmed').length.toString()}
          icon={<Calendar size={24} />}
          color="bg-teal-500"
        />
        <StatCard
          title="Pending Bills"
          value="$150.00"
          icon={<FileText size={24} />}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Prescriptions"
          value="3"
          icon={<Pill size={24} />}
          color="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Calendar size={22} />
              </div>
              My Appointments
            </h2>
            <button className="text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {appointments.slice(0, 3).map((apt) => (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                key={apt.id} 
                className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-teal-500/30 hover:shadow-md transition-all group"
              >
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 text-teal-600 dark:text-teal-400 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-sm border border-teal-200/50 dark:border-teal-700/30 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="text-lg">{apt.time.split(' ')[0]}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-80">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{apt.type}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <UserCheck size={14} /> Dr. {apt.doctorName}
                  </p>
                </div>
                <div className={`px-3 py-1.5 text-xs font-bold rounded-full border shadow-sm ${apt.status === 'Confirmed' ? 'bg-emerald-100/50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-amber-100/50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400'}`}>
                  {apt.status}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Activity size={22} />
              </div>
              Recent Vitals
            </h2>
            <button className="text-sm text-rose-600 dark:text-rose-400 font-medium hover:underline">History</button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-rose-50 to-white dark:from-rose-900/10 dark:to-slate-800/50 rounded-2xl border border-rose-100 dark:border-rose-900/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-rose-500 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">Heart Rate</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> Today, 9:00 AM
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 relative z-10">
                72 <span className="text-sm text-slate-400 font-medium">bpm</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800/50 rounded-2xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800 dark:text-slate-100">Blood Pressure</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> Today, 9:00 AM
                  </p>
                </div>
              </div>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 relative z-10">
                120/80 <span className="text-sm text-slate-400 font-medium">mmHg</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC<{ role: string }> = ({ role }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Tasks"
          value="5"
          icon={<ClipboardList size={24} />}
          color="bg-indigo-500"
        />
        <StatCard
          title="Next Shift"
          value="08:00"
          trend="Tomorrow"
          trendUp={true}
          icon={<Clock size={24} />}
          color="bg-teal-500"
        />
        <StatCard
          title="New Notices"
          value="2"
          icon={<Bell size={24} />}
          color="bg-orange-500"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ClipboardList size={22} />
            </div>
            My Tasks - <span className="text-indigo-600 dark:text-indigo-400">{role}</span>
          </h2>
          <div className="flex gap-2">
             <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">All</button>
             <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500 text-white shadow-sm shadow-indigo-500/20">Pending</button>
          </div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <motion.div 
              whileHover={{ x: 5 }}
              key={i} 
              className="flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-500/30 hover:shadow-sm cursor-pointer group transition-all"
            >
              <div className={`w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center group-hover:border-indigo-500 transition-colors bg-white dark:bg-slate-900`}>
                <div className="w-3 h-3 rounded-[2px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100 transform duration-200" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Complete daily report for {role} department</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Clock size={12} /> Due: 5:00 PM
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold rounded-lg border border-amber-200 dark:border-amber-800">Pending</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { loginHistory, activeUsers } = useAuth();
  const { getStats } = useData();
  const { theme } = useTheme();
  const { setActiveTab } = useNav();
  const stats = getStats();
  const isDark = theme === 'dark';

  const userRoleData = [
    { name: 'Doctors', value: 45, color: '#0d9488' },
    { name: 'Nurses', value: 120, color: '#3b82f6' },
    { name: 'Admin', value: 5, color: '#6366f1' },
    { name: 'Staff', value: 80, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('ai-hub')}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 text-sm font-semibold transition-all flex items-center gap-2 group transform hover:-translate-y-0.5"
        >
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          AI Features Hub
        </button>
      </div>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Users Now"
          value={activeUsers.length.toString()}
          trend="Live"
          trendUp={true}
          icon={<Users size={24} />}
          color="bg-emerald-500"
        />
        <StatCard
          title="Total System Users"
          value="250"
          trend="+5"
          trendUp={true}
          icon={<Shield size={24} />}
          color="bg-indigo-500"
        />
        <StatCard
          title="System Health"
          value="98%"
          trend="Stable"
          trendUp={true}
          icon={<Activity size={24} />}
          color="bg-teal-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          trend="+12%"
          trendUp={true}
          icon={<DollarSign size={24} />}
          color="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Active Sessions List */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Active Sessions
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {activeUsers.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-10">No active users detected.</p>
            ) : (
              activeUsers.map((session, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-900/30">
                      {session.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{session.userName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{session.userRole} • <span className="font-mono text-[10px] opacity-70">{session.ip}</span></p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Online
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* User Distribution Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
        >
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">User Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: isDark ? '#fff' : '#0f172a',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: isDark ? '#fff' : '#0f172a', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* Recent Access Logs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield size={20} className="text-indigo-500" />
            System Access Logs
          </h2>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-4 font-semibold">User</th>
                <th className="py-4 px-4 font-semibold">Role</th>
                <th className="py-4 px-4 font-semibold">Time</th>
                <th className="py-4 px-4 font-semibold">IP Address</th>
                <th className="py-4 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loginHistory.slice(0, 8).map((log, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{log.userName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{log.loginTime}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">{log.ip}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${log.status === 'Active' ? 'bg-emerald-100/50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400' : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { getStats, appointments, beds, tasks, notices, opdQueue, patients } = useData();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stats = getStats();
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiFlowResult, setAiFlowResult] = useState<PatientFlowResult | null>(null);
  const [showOutbreakPanel, setShowOutbreakPanel] = useState(false);
  const [showTrendsPanel, setShowTrendsPanel] = useState(false);
  const [outbreakResult, setOutbreakResult] = useState<OutbreakDetectionResult | null>(null);
  const [trendsResult, setTrendsResult] = useState<HealthTrendResult | null>(null);
  const [outbreakLoading, setOutbreakLoading] = useState(false);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [readmissionResult, setReadmissionResult] = useState<ReadmissionRiskResult | null>(null);
  const [readmissionLoading, setReadmissionLoading] = useState(false);

  const { data: flowResult, loading: flowLoading, execute: runFlowAnalysis } = usePatientFlowAnalytics();

  const handleDownload = () => {
    alert("Report downloading... (Simulated)");
  };

  // Run AI patient flow analysis
  const runPatientFlowAnalysis = async () => {
    await runFlowAnalysis({
      currentQueue: opdQueue || [],
      staffingLevels: [
        { department: 'Emergency', staffCount: 5, required: 7 },
        { department: 'OPD', staffCount: 8, required: 8 },
        { department: 'ICU', staffCount: 4, required: 5 }
      ],
      departmentCapacities: [
        { department: 'Emergency', maxCapacity: 20, currentOccupancy: 15 },
        { department: 'OPD', maxCapacity: 50, currentOccupancy: 35 },
        { department: 'ICU', maxCapacity: 10, currentOccupancy: 8 }
      ]
    });
  };

  // Run outbreak detection
  const runOutbreakAnalysis = async () => {
    setOutbreakLoading(true);
    try {
      const response = await detectDiseaseOutbreak({
        facilityInfo: {
          type: 'Hospital',
          capacity: 200,
          location: { region: 'Metro Area', city: 'Healthcare City' }
        },
        timeRange: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        patientData: [
          {
            date: new Date().toISOString().split('T')[0],
            department: 'Emergency',
            diagnoses: [
              { icdCode: 'J11.1', description: 'Influenza-like Illness', count: 12 },
              { icdCode: 'A09', description: 'Gastroenteritis', count: 5 }
            ],
            symptoms: [
              { symptom: 'Fever', count: 18 },
              { symptom: 'Cough', count: 15 }
            ],
            demographics: [
              { ageGroup: '0-18', count: 8 },
              { ageGroup: '19-65', count: 15 },
              { ageGroup: '65+', count: 7 }
            ]
          }
        ]
      });
      if (response.success && response.data) {
        setOutbreakResult(response.data);
        setShowOutbreakPanel(true);
      }
    } catch (error) {
      console.error('Outbreak detection error:', error);
    } finally {
      setOutbreakLoading(false);
    }
  };

  // Run health trends analysis
  const runHealthTrendsAnalysis = async () => {
    setTrendsLoading(true);
    try {
      const response = await analyzeHealthTrends({
        facilityInfo: {
          type: 'Hospital',
          capacity: 200,
          departments: ['Emergency', 'ICU', 'Surgery', 'Medicine', 'Pediatrics']
        },
        timeRange: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        historicalData: Array.from({ length: 7 }, (_, i) => ({
          period: `Week ${i + 1}`,
          metrics: {
            patientVolume: 400 + Math.floor(Math.random() * 100),
            admissions: 80 + Math.floor(Math.random() * 20),
            emergencyVisits: 100 + Math.floor(Math.random() * 30),
            surgeries: 25 + Math.floor(Math.random() * 10),
            outpatientVisits: 200 + Math.floor(Math.random() * 50),
            averageLOS: 4 + Math.random() * 1,
            readmissionRate: 8 + Math.random() * 4,
            mortalityRate: 1 + Math.random() * 0.5,
            infectionRate: 1.5 + Math.random() * 0.5,
            bedOccupancy: 75 + Math.random() * 15,
            staffUtilization: 80 + Math.random() * 10
          }
        })),
        currentResources: {
          beds: { total: 200, available: 45 },
          staff: { physicians: 50, nurses: 150, support: 80 },
          equipment: [
            { type: 'Ventilators', count: 25, utilization: 35 },
            { type: 'Monitors', count: 100, utilization: 65 }
          ]
        },
        externalFactors: {
          season: 'Winter',
          publicHealthEvents: ['Flu season active']
        }
      });
      if (response.success && response.data) {
        setTrendsResult(response.data);
        setShowTrendsPanel(true);
      }
    } catch (error) {
      console.error('Health trends analysis error:', error);
    } finally {
      setTrendsLoading(false);
    }
  };

  // Run readmission risk prediction
  const runReadmissionAnalysis = async () => {
    setReadmissionLoading(true);
    try {
      const response = await predictReadmissionRisk({
        patientId: 'demo-patient',
        patientInfo: {
          age: 65,
          gender: 'Male',
          admissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dischargeDate: new Date().toISOString().split('T')[0],
          lengthOfStay: 5
        },
        diagnosis: {
          primary: 'Acute Decompensated Heart Failure',
          secondary: ['Type 2 Diabetes Mellitus', 'Chronic Kidney Disease Stage 3'],
          icdCodes: ['I50.21', 'E11.9', 'N18.3']
        },
        medicalHistory: {
          conditions: ['Diabetes', 'Hypertension', 'CHF', 'CKD'],
          previousAdmissions: 3,
          previousAdmissionsLast30Days: 1,
          previousAdmissionsLast90Days: 2,
          chronicConditions: ['Heart Failure', 'Chronic Kidney Disease']
        },
        currentVisit: {
          department: 'Medicine',
          admissionType: 'emergency',
          procedures: ['Cardiac Catheterization'],
          complications: ['Acute Kidney Injury'],
          dischargeDisposition: 'home'
        },
        vitals: {
          bloodPressure: '130/85',
          heartRate: 78,
          temperature: 98.6,
          respiratoryRate: 18,
          oxygenSaturation: 96
        },
        labResults: [
          { testName: 'Hemoglobin', value: '11.2', isAbnormal: true },
          { testName: 'Creatinine', value: '1.8', isAbnormal: true },
          { testName: 'BNP', value: '850', isAbnormal: true }
        ],
        medications: [
          { name: 'Lisinopril', dosage: '10mg', frequency: 'daily' },
          { name: 'Metoprolol', dosage: '25mg', frequency: 'twice daily' },
          { name: 'Furosemide', dosage: '40mg', frequency: 'daily' }
        ],
        socialDeterminants: {
          livingArrangement: 'Lives with spouse',
          supportSystem: 'Good family support',
          transportationAccess: true,
          insuranceType: 'Medicare'
        }
      });
      if (response.success && response.data) {
        setReadmissionResult(response.data);
      }
    } catch (error) {
      console.error('Readmission risk prediction error:', error);
    } finally {
      setReadmissionLoading(false);
    }
  };

  // Update AI result when data changes
  useEffect(() => {
    if (flowResult) {
      setAiFlowResult(flowResult);
      setShowAIPanel(true);
    }
  }, [flowResult]);

  const showFinancials = [UserRole.ADMIN, UserRole.ACCOUNTANT].includes(user?.role as UserRole);

  // Render different dashboards based on role
  if (user?.role === UserRole.PATIENT) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground-primary">Patient Portal</h1>
        <p className="text-foreground-secondary">Welcome back, {user.name}. Track your health journey here.</p>
        <PatientDashboard />
      </div>
    );
  }

  if (user?.role && ![UserRole.ADMIN, UserRole.DOCTOR, UserRole.ACCOUNTANT, UserRole.RECEPTIONIST].includes(user.role)) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground-primary">Staff Dashboard</h1>
        <p className="text-foreground-secondary">Welcome back, {user.name}. Here are your tasks for today.</p>
        <StaffDashboard role={user.role} />
      </div>
    );
  }

  if (user?.role === UserRole.ADMIN) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground-primary">System Administration</h1>
        <p className="text-foreground-secondary">Welcome back, Administrator. Monitoring active sessions and system health.</p>
        <AdminDashboard />
      </div>
    );
  }

  // Default Dashboard (Doctor, Receptionist, Accountant)
  const { setActiveTab } = useNav();
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Hospital Overview</h1>
          <p className="text-foreground-secondary">Welcome back, {user?.name || 'Dr. Chen'}. Here's what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('ai-hub')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium shadow-lg shadow-purple-600/20 transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} />
            AI Features Hub
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-background-secondary border border-border text-foreground-secondary rounded-lg hover:bg-background-tertiary text-sm font-medium theme-transition"
          >
            Download Report
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-lg shadow-teal-600/20 transition-colors">Add Appointment</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toString()}
          trend="+12%"
          trendUp={true}
          icon={<Users size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Appointments"
          value={stats.totalAppointments.toString()}
          trend="+4%"
          trendUp={true}
          icon={<Clock size={24} />}
          color="bg-teal-500"
        />
        {showFinancials ? (
          <StatCard
            title="Hospital Earnings"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend="+2.5%"
            trendUp={true}
            icon={<DollarSign size={24} />}
            color="bg-indigo-500"
          />
        ) : (
          <StatCard
            title="Tasks Pending"
            value={tasks.filter(t => t.status !== 'Done').length.toString()}
            icon={<ClipboardList size={24} />}
            color="bg-indigo-500"
          />
        )}
        <StatCard
          title="Bed Occupancy"
          value={`${Math.round((beds.filter(b => b.status === 'Occupied').length / beds.length) * 100)}%`}
          trend={beds.filter(b => b.status === 'Occupied').length + " / " + beds.length}
          trendUp={true}
          icon={<Activity size={24} />}
          color="bg-orange-500"
        />
      </div>

      {notices.some(n => n.priority === 'Urgent') && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full text-red-600 dark:text-red-400 shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-200">Urgent Notice: {notices.find(n => n.priority === 'Urgent')?.title}</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">{notices.find(n => n.priority === 'Urgent')?.content}</p>
          </div>
        </div>
      )}

      {/* AI Patient Flow Analytics Panel */}
      {showAIPanel && aiFlowResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-panel p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/50 relative overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 text-white">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">AI Patient Flow Analysis</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time predictions and resource optimization</p>
              </div>
            </div>
            <button
              onClick={() => setShowAIPanel(false)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 relative z-10">
            {/* Volume Predictions */}
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:border-purple-500/30 transition-all duration-300 group">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <TrendingUp size={16} />
                </div>
                Volume Predictions
              </h4>
              <div className="space-y-3">
                {aiFlowResult.volumePredictions.map((pred, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50 shadow-sm group-hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{pred.timeframe}</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">{pred.predictedPatients} pts</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-400">Peak:</span>
                      {pred.peakHours.slice(0, 2).map((hour, i) => (
                        <span key={i} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-800/50">{hour}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottleneck Analysis */}
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:border-red-500/30 transition-all duration-300 group">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} />
                </div>
                Bottlenecks
              </h4>
              <div className="space-y-3">
                {aiFlowResult.bottleneckAnalysis.map((bottleneck, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border shadow-sm group-hover:shadow-md transition-all ${
                    bottleneck.severity === 'Critical'
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30'
                      : bottleneck.severity === 'High'
                      ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30'
                      : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{bottleneck.location}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        bottleneck.severity === 'Critical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : bottleneck.severity === 'High'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>{bottleneck.severity}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{bottleneck.cause}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Staffing Recommendations */}
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500/30 transition-all duration-300 group">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <UserCheck size={16} />
                </div>
                Staffing Needs
              </h4>
              <div className="space-y-3">
                {aiFlowResult.staffingRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/50 shadow-sm group-hover:shadow-md transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{rec.department}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{rec.currentStaff}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">{rec.recommendedStaff}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Efficiency Score */}
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/60 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Overall Flow Efficiency</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Based on current metrics and AI predictions</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{aiFlowResult.flowEfficiency.overallScore}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {aiFlowResult.flowEfficiency.departmentScores.map((dept, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900/50 rounded-lg p-3 text-center border border-slate-100 dark:border-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{dept.department}</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{dept.score}%</p>
                  <p className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
                    dept.trend === 'improving' ? 'text-emerald-500' : dept.trend === 'declining' ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    {dept.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Patient Flow Analytics</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={runPatientFlowAnalysis}
                disabled={flowLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                {flowLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                AI Analyze
              </button>
              <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all" title="Time period">
                <option>This Week</option>
                <option>Last Week</option>
              </select>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDark ? '#fff' : '#0f172a' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500, color: isDark ? '#fff' : '#0f172a' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                <Area type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-between">
            Upcoming Schedule
            <button className="text-xs text-purple-600 dark:text-purple-400 font-medium hover:underline">View All</button>
          </h2>
          <div className="space-y-4">
            {appointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-sm group-hover:bg-purple-500/10 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  <span>{apt.time.split(' ')[0]}</span>
                  <span className="text-[10px] font-normal opacity-70">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{apt.patientName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{apt.type} • {apt.doctorName}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${apt.status === 'Confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              </div>
            ))}
            <button className="w-full mt-2 py-2.5 text-center text-sm text-slate-500 dark:text-slate-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
              View Full Schedule
            </button>
          </div>
        </div>
      </div>

      {/* AI Predictive Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Disease Outbreak Detection Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
                <Bug size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Outbreak Detection
                  <span className="text-[10px] uppercase font-bold bg-gradient-to-r from-rose-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">AI</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time disease surveillance</p>
              </div>
            </div>
            <button
              onClick={runOutbreakAnalysis}
              disabled={outbreakLoading}
              className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {outbreakLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Analyze
            </button>
          </div>

          {outbreakResult ? (
            <div className="space-y-4">
              {/* Risk Level Indicator */}
              <div className={`p-4 rounded-xl border relative overflow-hidden ${outbreakResult.overallRiskLevel === 'critical' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800' :
                outbreakResult.overallRiskLevel === 'high' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800' :
                  outbreakResult.overallRiskLevel === 'elevated' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800' :
                    'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                }`}>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Risk Level</span>
                  <span className={`text-lg font-bold capitalize px-3 py-1 rounded-lg bg-white/50 dark:bg-black/20 ${outbreakResult.overallRiskLevel === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                    outbreakResult.overallRiskLevel === 'high' ? 'text-orange-600 dark:text-orange-400' :
                      outbreakResult.overallRiskLevel === 'elevated' ? 'text-amber-600 dark:text-amber-400' :
                        'text-emerald-600 dark:text-emerald-400'
                    }`}>{outbreakResult.overallRiskLevel}</span>
                </div>
              </div>

              {/* Active Alerts */}
              {outbreakResult.activeAlerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Active Alerts</h4>
                  {outbreakResult.activeAlerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded-xl border ${alert.severity === 'emergency' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800' :
                      alert.severity === 'alert' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800' :
                        'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
                      }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className={
                          alert.severity === 'emergency' ? 'text-rose-600' :
                            alert.severity === 'alert' ? 'text-orange-600' :
                              'text-amber-600'
                        } />
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{alert.condition}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${alert.severity === 'emergency' ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200' :
                          alert.severity === 'alert' ? 'bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200' :
                            'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                          }`}>{alert.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">{alert.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Condition Analysis */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">Condition Trends</h4>
                {outbreakResult.conditionAnalysis.slice(0, 3).map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{condition.condition}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${condition.trend === 'increasing' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                        condition.trend === 'decreasing' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                          'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>{condition.trend}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{condition.currentCases} <span className="text-xs font-normal text-slate-500">cases</span></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bug size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click "Analyze" to run outbreak detection</p>
            </div>
          )}
        </div>

        {/* Health Trend Analysis Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-600 dark:text-cyan-400">
                <LineChart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  Health Trends
                  <span className="text-[10px] uppercase font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-cyan-500/20">AI</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Predictive analytics & forecasting</p>
              </div>
            </div>
            <button
              onClick={runHealthTrendsAnalysis}
              disabled={trendsLoading}
              className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {trendsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Analyze
            </button>
          </div>

          {trendsResult ? (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="p-4 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-800/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>
                <h4 className="text-xs font-bold uppercase text-cyan-800 dark:text-cyan-300 mb-2 flex items-center gap-2">
                  <Activity size={14} />
                  AI Summary
                </h4>
                <p className="text-sm text-cyan-900 dark:text-cyan-100 leading-relaxed">{trendsResult.executiveSummary}</p>
              </div>

              {/* Overall Trends */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Key Predictions</h4>
                <div className="space-y-3">
                  {trendsResult.overallTrends.slice(0, 3).map((trend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${
                          trend.trend === 'increasing' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                          trend.trend === 'decreasing' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <TrendingUp size={14} className={trend.trend === 'decreasing' ? 'rotate-180' : ''} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{trend.metric}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{trend.predictedValue}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${
                          trend.changePercentage > 0 ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800' :
                          trend.changePercentage < 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                          'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Demand */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 ml-1">Resource Forecast</h4>
                <div className="grid grid-cols-1 gap-3">
                  {trendsResult.resourceDemandForecasts.slice(0, 2).map((resource, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{resource.resource}</span>
                        {resource.shortageRisk && (
                          <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-800 animate-pulse">
                            Risk
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-col">
                          <span className="text-slate-400 mb-0.5">Current</span>
                          <span className="font-medium text-slate-600 dark:text-slate-300">{resource.currentDemand}</span>
                        </div>
                        <ArrowRight size={12} className="text-slate-300 dark:text-slate-600" />
                        <div className="flex flex-col items-end">
                          <span className="text-slate-400 mb-0.5">Predicted</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{resource.predictedDemand}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <LineChart size={32} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Click "Analyze" to run trend analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Readmission Risk Predictor Panel */}
      <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <HeartPulse className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-foreground-primary flex items-center gap-2">
                Readmission Risk Predictor
                <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-0.5 rounded-full">AI-Powered</span>
              </h3>
              <p className="text-xs text-foreground-secondary">30-day readmission risk assessment</p>
            </div>
          </div>
          <button
            onClick={runReadmissionAnalysis}
            disabled={readmissionLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center gap-1"
          >
            {readmissionLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Analyze
          </button>
        </div>

        {readmissionResult ? (
          <div className="space-y-4">
            {/* Risk Score Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${readmissionResult.riskLevel === 'very_high' || readmissionResult.riskLevel === 'high' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                readmissionResult.riskLevel === 'moderate' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                  'bg-success-light border border-green-200 dark:border-green-800'
                }`}>
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Risk Score</p>
                  <p className={`text-4xl font-bold ${readmissionResult.riskLevel === 'very_high' || readmissionResult.riskLevel === 'high' ? 'text-red-600' :
                    readmissionResult.riskLevel === 'moderate' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{readmissionResult.riskScore}%</p>
                  <p className="text-xs text-foreground-muted capitalize mt-1">{readmissionResult.riskLevel.replace('_', ' ')} Risk</p>
                </div>
              </div>
              <div className="p-4 bg-background-primary rounded-xl theme-transition">
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Readmission Probability</p>
                  <p className="text-2xl font-bold text-foreground-primary">{(readmissionResult.predictedReadmissionProbability * 100).toFixed(1)}%</p>
                  <p className="text-xs text-foreground-muted mt-1">30-day predicted</p>
                </div>
              </div>
              <div className="p-4 bg-background-primary rounded-xl theme-transition">
                <div className="text-center">
                  <p className="text-sm text-foreground-secondary mb-1">Confidence Interval</p>
                  <p className="text-2xl font-bold text-foreground-primary">{readmissionResult.confidenceInterval.lower}% - {readmissionResult.confidenceInterval.upper}%</p>
                  <p className="text-xs text-foreground-muted mt-1">95% CI</p>
                </div>
              </div>
            </div>

            {/* Top Risk Factors */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground-primary">Top Risk Factors</h4>
              <div className="flex flex-wrap gap-2">
                {readmissionResult.topRiskFactors.map((factor, idx) => (
                  <span key={idx} className="px-3 py-1 bg-danger-light text-danger-dark rounded-full text-xs font-medium">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Preventive Interventions */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground-primary">Recommended Interventions</h4>
              {readmissionResult.preventiveInterventions.slice(0, 3).map((intervention, idx) => (
                <div key={idx} className={`p-3 rounded-lg ${intervention.priority === 'critical' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                  intervention.priority === 'high' ? 'bg-warning-light border border-orange-200 dark:border-orange-800' :
                    'bg-background-primary theme-transition'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground-primary">{intervention.intervention}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${intervention.priority === 'critical' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                      intervention.priority === 'high' ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200' :
                        'bg-background-tertiary text-foreground-secondary'
                      }`}>{intervention.priority}</span>
                  </div>
                  <p className="text-xs text-foreground-secondary mt-1">{intervention.description}</p>
                  <p className="text-xs text-accent mt-1">Timeframe: {intervention.timeframe}</p>
                </div>
              ))}
            </div>

            {/* Recommended Follow-up */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground-primary">Recommended Follow-up</h4>
              {readmissionResult.recommendedFollowUp.map((followUp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-background-primary rounded-lg theme-transition">
                  <div className="flex items-center gap-2">
                    <CalendarClock size={14} className="text-accent" />
                    <span className="text-sm text-foreground-primary">{followUp.type.charAt(0).toUpperCase() + followUp.type.slice(1)} Follow-up</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground-primary">{followUp.timeframe}</span>
                    <p className="text-xs text-foreground-secondary">{followUp.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-foreground-secondary">
            <HeartPulse size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click "Analyze" to predict readmission risk</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
