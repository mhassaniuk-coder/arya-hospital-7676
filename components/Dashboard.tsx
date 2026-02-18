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
    whileHover={{ y: -5 }}
    className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
  >
    {/* Background Glow */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color.replace('bg-', 'bg-opacity-10 bg-')} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-sm`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `text-${color.replace('bg-', '')}-600 dark:text-${color.replace('bg-', '')}-400` })}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${trendUp ? 'bg-success-light border-success/20 text-success-dark' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-foreground-secondary text-sm font-medium mb-1 relative z-10">{title}</h3>
    <p className="text-2xl font-bold text-foreground-primary relative z-10">{value}</p>
  </motion.div>
);

const PatientDashboard: React.FC = () => {
  const { appointments } = useData();

  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-foreground-primary mb-4 flex items-center gap-2">
            <Calendar className="text-accent" size={20} />
            My Appointments
          </h2>
          <div className="space-y-3">
            {appointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-background-primary/50 border border-border hover:border-accent/50 transition-colors group">
                <div className="bg-background-secondary text-accent w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm border border-border shadow-sm group-hover:scale-105 transition-transform">
                  <span>{apt.time.split(' ')[0]}</span>
                  <span className="text-xs font-normal opacity-70">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground-primary group-hover:text-accent transition-colors">{apt.type}</h4>
                  <p className="text-xs text-foreground-secondary">Dr. {apt.doctorName}</p>
                </div>
                <div className={`px-3 py-1 text-xs font-medium rounded-full ${apt.status === 'Confirmed' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'}`}>
                  {apt.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-foreground-primary mb-4 flex items-center gap-2">
            <Activity className="text-red-500" size={20} />
            Recent Vitals
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-background-primary/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-primary">Heart Rate</p>
                  <p className="text-xs text-foreground-muted">Today, 9:00 AM</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground-primary">72 <span className="text-xs text-foreground-muted font-normal">bpm</span></span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background-primary/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-primary">Blood Pressure</p>
                  <p className="text-xs text-foreground-muted">Today, 9:00 AM</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground-primary">120/80 <span className="text-xs text-foreground-muted font-normal">mmHg</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDashboard: React.FC<{ role: string }> = ({ role }) => {
  return (
    <div className="space-y-6 animate-fade-in">
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

      <div className="glass-panel p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-foreground-primary mb-4">My Tasks - {role}</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-background-tertiary rounded-xl transition-colors border border-transparent hover:border-border cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 border-foreground-muted flex items-center justify-center group-hover:border-accent`}>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground-primary group-hover:text-accent transition-colors">Complete daily report for {role} department</p>
                <p className="text-xs text-foreground-secondary">Due: 5:00 PM</p>
              </div>
              <span className="px-2 py-1 bg-warning-light text-warning-dark text-xs font-medium rounded-lg">Pending</span>
            </div>
          ))}
        </div>
      </div>
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('ai-hub')}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium shadow-lg shadow-purple-600/20 transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} />
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
          color="bg-green-500"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Active Sessions List */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <h2 className="text-lg font-bold text-foreground-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Active Sessions
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {activeUsers.length === 0 ? (
              <p className="text-foreground-secondary text-sm">No active users detected.</p>
            ) : (
              activeUsers.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-background-primary rounded-xl border border-border theme-transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      {session.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground-primary text-sm">{session.userName}</p>
                      <p className="text-xs text-foreground-secondary">{session.userRole} • {session.ip}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-success-dark bg-success-light px-2 py-1 rounded-full">
                    Online
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <h2 className="text-lg font-bold text-foreground-primary mb-4">User Distribution</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
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
                    color: isDark ? '#fff' : '#0f172a'
                  }}
                  itemStyle={{ color: isDark ? '#fff' : '#0f172a' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Access Logs */}
      <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-foreground-primary">System Access Logs</h2>
          <button className="text-sm text-accent font-medium hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-foreground-secondary text-sm">
                <th className="py-3 font-medium">User</th>
                <th className="py-3 font-medium">Role</th>
                <th className="py-3 font-medium">Time</th>
                <th className="py-3 font-medium">IP Address</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loginHistory.slice(0, 8).map((log, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-background-tertiary theme-transition">
                  <td className="py-3 font-medium text-foreground-primary">{log.userName}</td>
                  <td className="py-3 text-foreground-secondary">{log.userRole}</td>
                  <td className="py-3 text-foreground-secondary">{log.loginTime}</td>
                  <td className="py-3 text-foreground-muted font-mono text-xs">{log.ip}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-background-tertiary text-foreground-secondary'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

  const showFinancials = [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.DOCTOR].includes(user?.role as UserRole);

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
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-lg p-6 animate-scale-up">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Brain className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 dark:text-purple-200">AI Patient Flow Analysis</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400">Real-time predictions and recommendations</p>
              </div>
            </div>
            <button onClick={() => setShowAIPanel(false)} className="text-purple-400 hover:text-purple-600 dark:hover:text-purple-300" title="Close">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Volume Predictions */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-500" />
                Volume Predictions
              </h4>
              <div className="space-y-2">
                {aiFlowResult.volumePredictions.map((pred, idx) => (
                  <div key={idx} className="bg-background-primary rounded-lg p-2 theme-transition">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground-primary">{pred.timeframe}</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{pred.predictedPatients} pts</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-foreground-secondary">Peak:</span>
                      {pred.peakHours.slice(0, 2).map((hour, i) => (
                        <span key={i} className="text-xs bg-warning-light text-warning-dark px-1 rounded">{hour}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottleneck Analysis */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                Bottlenecks
              </h4>
              <div className="space-y-2">
                {aiFlowResult.bottleneckAnalysis.map((bottleneck, idx) => (
                  <div key={idx} className={`p-2 rounded-lg ${bottleneck.severity === 'Critical' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                    bottleneck.severity === 'High' ? 'bg-warning-light border border-orange-200 dark:border-orange-800' :
                      'bg-background-primary theme-transition'
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground-primary">{bottleneck.location}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${bottleneck.severity === 'Critical' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                        bottleneck.severity === 'High' ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200' :
                          'bg-background-tertiary text-foreground-secondary'
                        }`}>{bottleneck.severity}</span>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-1">{bottleneck.cause}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Staffing Recommendations */}
            <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
              <h4 className="font-semibold text-foreground-primary mb-3 flex items-center gap-2">
                <UserCheck size={16} className="text-green-500" />
                Staffing Needs
              </h4>
              <div className="space-y-2">
                {aiFlowResult.staffingRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-background-primary rounded-lg p-2 theme-transition">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground-primary">{rec.department}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-foreground-secondary">{rec.currentStaff}</span>
                        <span className="text-xs text-foreground-muted">→</span>
                        <span className="text-xs font-bold text-success-dark">{rec.recommendedStaff}</span>
                      </div>
                    </div>
                    <p className="text-xs text-foreground-secondary mt-1">{rec.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Efficiency Score */}
          <div className="bg-background-secondary rounded-xl p-4 border border-purple-100 dark:border-purple-800 theme-transition">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-foreground-primary">Overall Flow Efficiency</h4>
                <p className="text-xs text-foreground-secondary">Based on current metrics and AI predictions</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-accent">{aiFlowResult.flowEfficiency.overallScore}%</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {aiFlowResult.flowEfficiency.departmentScores.map((dept, idx) => (
                <div key={idx} className="bg-background-primary rounded-lg p-2 text-center theme-transition">
                  <p className="text-xs text-foreground-secondary">{dept.department}</p>
                  <p className="text-lg font-bold text-foreground-primary">{dept.score}%</p>
                  <p className={`text-xs ${dept.trend === 'improving' ? 'text-green-500' : dept.trend === 'declining' ? 'text-red-500' : 'text-foreground-muted'}`}>
                    {dept.trend}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-foreground-primary">Patient Flow Analytics</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={runPatientFlowAnalysis}
                disabled={flowLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-1"
              >
                {flowLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                AI Analyze
              </button>
              <select className="bg-background-primary border border-border rounded-lg px-3 py-1 text-sm text-foreground-secondary outline-none focus:ring-2 focus:ring-accent theme-transition" title="Time period">
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

        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <h2 className="text-lg font-bold text-foreground-primary mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            {appointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-tertiary theme-transition cursor-pointer group">
                <div className="bg-background-tertiary text-foreground-secondary w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                  <span>{apt.time.split(' ')[0]}</span>
                  <span className="text-xs font-normal">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground-primary">{apt.patientName}</h4>
                  <p className="text-xs text-foreground-secondary">{apt.type} • {apt.doctorName}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${apt.status === 'Confirmed' ? 'bg-accent' : 'bg-orange-500'}`}></div>
              </div>
            ))}
            <button className="w-full mt-2 py-2 text-center text-sm text-accent font-medium hover:text-accent/80">View Full Schedule</button>
          </div>
        </div>
      </div>

      {/* AI Predictive Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Disease Outbreak Detection Panel */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <Bug className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground-primary flex items-center gap-2">
                  Outbreak Detection
                  <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-0.5 rounded-full">AI-Powered</span>
                </h3>
                <p className="text-xs text-foreground-secondary">Real-time disease surveillance</p>
              </div>
            </div>
            <button
              onClick={runOutbreakAnalysis}
              disabled={outbreakLoading}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center gap-1"
            >
              {outbreakLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Analyze
            </button>
          </div>

          {outbreakResult ? (
            <div className="space-y-4">
              {/* Risk Level Indicator */}
              <div className={`p-4 rounded-xl ${outbreakResult.overallRiskLevel === 'critical' ? 'bg-danger-light border border-red-200 dark:border-red-800' :
                outbreakResult.overallRiskLevel === 'high' ? 'bg-warning-light border border-orange-200 dark:border-orange-800' :
                  outbreakResult.overallRiskLevel === 'elevated' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                    'bg-success-light border border-green-200 dark:border-green-800'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground-primary">Overall Risk Level</span>
                  <span className={`text-lg font-bold capitalize ${outbreakResult.overallRiskLevel === 'critical' ? 'text-red-600' :
                    outbreakResult.overallRiskLevel === 'high' ? 'text-orange-600' :
                      outbreakResult.overallRiskLevel === 'elevated' ? 'text-yellow-600' :
                        'text-green-600'
                    }`}>{outbreakResult.overallRiskLevel}</span>
                </div>
              </div>

              {/* Active Alerts */}
              {outbreakResult.activeAlerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground-primary">Active Alerts</h4>
                  {outbreakResult.activeAlerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${alert.severity === 'emergency' ? 'bg-red-100 dark:bg-red-900/30' :
                      alert.severity === 'alert' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className={
                          alert.severity === 'emergency' ? 'text-red-600' :
                            alert.severity === 'alert' ? 'text-orange-600' :
                              'text-yellow-600'
                        } />
                        <span className="text-sm font-medium text-foreground-primary">{alert.condition}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${alert.severity === 'emergency' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'alert' ? 'bg-orange-200 text-orange-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>{alert.severity}</span>
                      </div>
                      <p className="text-xs text-foreground-secondary mt-1">{alert.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Condition Analysis */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground-primary">Condition Trends</h4>
                {outbreakResult.conditionAnalysis.slice(0, 3).map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-background-primary rounded-lg theme-transition">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground-primary">{condition.condition}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${condition.trend === 'increasing' ? 'bg-danger-light text-danger-dark' :
                        condition.trend === 'decreasing' ? 'bg-success-light text-success-dark' :
                          'bg-background-tertiary text-foreground-secondary'
                        }`}>{condition.trend}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground-primary">{condition.currentCases} cases</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-foreground-secondary">
              <Bug size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click "Analyze" to run outbreak detection</p>
            </div>
          )}
        </div>

        {/* Health Trend Analysis Panel */}
        <div className="bg-background-secondary p-6 rounded-2xl shadow-sm border border-border theme-transition">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <LineChart className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-foreground-primary flex items-center gap-2">
                  Health Trend Analysis
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-0.5 rounded-full">AI-Powered</span>
                </h3>
                <p className="text-xs text-foreground-secondary">Predictive analytics & forecasting</p>
              </div>
            </div>
            <button
              onClick={runHealthTrendsAnalysis}
              disabled={trendsLoading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center gap-1"
            >
              {trendsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Analyze
            </button>
          </div>

          {trendsResult ? (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">{trendsResult.executiveSummary}</p>
              </div>

              {/* Overall Trends */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground-primary">Key Predictions</h4>
                {trendsResult.overallTrends.slice(0, 3).map((trend, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-background-primary rounded-lg theme-transition">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className={
                        trend.trend === 'increasing' ? 'text-orange-500' :
                          trend.trend === 'decreasing' ? 'text-green-500' :
                            'text-foreground-muted'
                      } />
                      <span className="text-sm text-foreground-primary">{trend.metric}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground-primary">{trend.predictedValue}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${trend.changePercentage > 0 ? 'bg-warning-light text-warning-dark' :
                        trend.changePercentage < 0 ? 'bg-success-light text-success-dark' :
                          'bg-background-tertiary text-foreground-secondary'
                        }`}>{trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resource Demand */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground-primary">Resource Demand Forecast</h4>
                {trendsResult.resourceDemandForecasts.slice(0, 2).map((resource, idx) => (
                  <div key={idx} className="p-2 bg-background-primary rounded-lg theme-transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground-primary">{resource.resource}</span>
                      {resource.shortageRisk && (
                        <span className="text-xs bg-danger-light text-danger-dark px-1.5 py-0.5 rounded">Shortage Risk</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                      <span>Current: {resource.currentDemand}</span>
                      <span>→</span>
                      <span className="font-medium text-foreground-primary">Predicted: {resource.predictedDemand}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-foreground-secondary">
              <LineChart size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click "Analyze" to run trend analysis</p>
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
