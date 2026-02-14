import React from 'react';
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
  Bell
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
  Legend
} from 'recharts';
import { StatCardProps, ChartDataPoint, UserRole } from '../types';
import { useData } from '../src/contexts/DataContext';
import { useAuth } from '../src/contexts/AuthContext';

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
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        {/* Fix: Explicitly type the icon as ReactElement with className to satisfy TS */}
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `text-${color.replace('bg-', '')}-600` })}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">My Appointments</h2>
          <div className="space-y-4">
            {appointments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="bg-white text-teal-600 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm border border-teal-100 shadow-sm">
                  <span>{apt.time.split(' ')[0]}</span>
                  <span className="text-xs font-normal">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{apt.type}</h4>
                  <p className="text-xs text-slate-500">Dr. {apt.doctorName}</p>
                </div>
                <div className={`px-3 py-1 text-xs font-medium rounded-full ${apt.status === 'Confirmed' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                  {apt.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Vitals</h2>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-red-500" />
                    <div>
                        <p className="text-sm font-medium text-slate-700">Heart Rate</p>
                        <p className="text-xs text-slate-400">Today, 9:00 AM</p>
                    </div>
                </div>
                <span className="text-lg font-bold text-slate-800">72 bpm</span>
             </div>
             <div className="flex justify-between items-center p-3 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <Activity size={20} className="text-blue-500" />
                    <div>
                        <p className="text-sm font-medium text-slate-700">Blood Pressure</p>
                        <p className="text-xs text-slate-400">Today, 9:00 AM</p>
                    </div>
                </div>
                <span className="text-lg font-bold text-slate-800">120/80</span>
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
          value="Tomorrow" 
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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-4">My Tasks - {role}</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
              <input type="checkbox" className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Complete daily report for {role} department</p>
                <p className="text-xs text-slate-500">Due: 5:00 PM</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">Pending</span>
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
  const stats = getStats();

  const userRoleData = [
    { name: 'Doctors', value: 45, color: '#0d9488' },
    { name: 'Nurses', value: 120, color: '#3b82f6' },
    { name: 'Admin', value: 5, color: '#6366f1' },
    { name: 'Staff', value: 80, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Active Sessions
          </h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {activeUsers.length === 0 ? (
                <p className="text-slate-500 text-sm">No active users detected.</p>
            ) : (
                activeUsers.map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                {session.userName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">{session.userName}</p>
                                <p className="text-xs text-slate-500">{session.userRole} • {session.ip}</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Online
                        </span>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* User Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">User Distribution</h2>
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
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* Recent Access Logs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">System Access Logs</h2>
            <button className="text-sm text-teal-600 font-medium hover:underline">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-sm">
                        <th className="py-3 font-medium">User</th>
                        <th className="py-3 font-medium">Role</th>
                        <th className="py-3 font-medium">Time</th>
                        <th className="py-3 font-medium">IP Address</th>
                        <th className="py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {loginHistory.slice(0, 8).map((log, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-3 font-medium text-slate-800">{log.userName}</td>
                            <td className="py-3 text-slate-600">{log.userRole}</td>
                            <td className="py-3 text-slate-500">{log.loginTime}</td>
                            <td className="py-3 text-slate-500 font-mono text-xs">{log.ip}</td>
                            <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
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
  const { getStats, appointments, beds, tasks, notices } = useData();
  const { user } = useAuth();
  const stats = getStats();

  const handleDownload = () => {
    alert("Report downloading... (Simulated)");
  };

  const showFinancials = [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.DOCTOR].includes(user?.role as UserRole);

  // Render different dashboards based on role
  if (user?.role === UserRole.PATIENT) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Patient Portal</h1>
            <p className="text-slate-500">Welcome back, {user.name}. Track your health journey here.</p>
            <PatientDashboard />
        </div>
    );
  }

  if (user?.role && ![UserRole.ADMIN, UserRole.DOCTOR, UserRole.ACCOUNTANT, UserRole.RECEPTIONIST].includes(user.role)) {
     return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
            <p className="text-slate-500">Welcome back, {user.name}. Here are your tasks for today.</p>
            <StaffDashboard role={user.role} />
        </div>
     );
  }

  if (user?.role === UserRole.ADMIN) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
            <p className="text-slate-500">Welcome back, Administrator. Monitoring active sessions and system health.</p>
            <AdminDashboard />
        </div>
    );
  }

  // Default Dashboard (Doctor, Receptionist, Accountant)
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Overview</h1>
          <p className="text-slate-500">Welcome back, {user?.name || 'Dr. Chen'}. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium"
          >
            Download Report
          </button>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-lg shadow-teal-600/20">Add Appointment</button>
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
            <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0">
                <Bell size={20} />
            </div>
            <div>
                <h3 className="font-bold text-red-800">Urgent Notice: {notices.find(n => n.priority === 'Urgent')?.title}</h3>
                <p className="text-red-700 text-sm">{notices.find(n => n.priority === 'Urgent')?.content}</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Patient Flow Analytics</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-teal-500">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="patients" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                <Area type="monotone" dataKey="appointments" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Schedule</h2>
          <div className="space-y-4">
            {appointments.slice(0, 4).map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="bg-slate-100 text-slate-600 w-12 h-12 rounded-lg flex flex-col items-center justify-center font-bold text-sm group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <span>{apt.time.split(' ')[0]}</span>
                  <span className="text-xs font-normal">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{apt.patientName}</h4>
                  <p className="text-xs text-slate-500">{apt.type} • {apt.doctorName}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${apt.status === 'Confirmed' ? 'bg-teal-500' : 'bg-orange-500'}`}></div>
              </div>
            ))}
            <button className="w-full mt-2 py-2 text-center text-sm text-teal-600 font-medium hover:text-teal-700">View Full Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
