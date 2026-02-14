import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight } from 'lucide-react';

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
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Analytics</h1>
          <p className="text-slate-500">Deep dive into hospital performance and demographics.</p>
        </div>
        <select className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-teal-500">
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>All Time</option>
        </select>
      </div>

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
