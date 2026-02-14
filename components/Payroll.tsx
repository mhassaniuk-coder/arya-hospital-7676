import React from 'react';
import { DollarSign, Download, Search, Filter } from 'lucide-react';

const Payroll: React.FC = () => {
  const payrollData = [
    { id: 1, name: 'Dr. Sarah Chen', role: 'Chief Physician', salary: 12000, status: 'Paid', date: '2024-03-01' },
    { id: 2, name: 'Nurse Emily Wong', role: 'Head Nurse', salary: 5500, status: 'Processing', date: '2024-03-01' },
    { id: 3, name: 'Dr. James Wilson', role: 'Surgeon', salary: 15000, status: 'Paid', date: '2024-03-01' },
    { id: 4, name: 'Tech. Mike Ross', role: 'Lab Technician', salary: 4200, status: 'Pending', date: '2024-03-01' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-500">Manage staff salaries and payments</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors">
          <DollarSign size={18} />
          Run Payroll
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search staff..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-600">
          <Filter size={18} />
          Filter
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-600">
          <Download size={18} />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Staff Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Base Salary</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Payment Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payrollData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.role}</td>
                <td className="px-6 py-4 text-slate-900 font-mono">${item.salary.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600">{item.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">View Slip</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
