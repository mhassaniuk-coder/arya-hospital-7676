import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const LeaveManagement: React.FC = () => {
  const leaveRequests = [
    { id: 1, name: 'Dr. Sarah Chen', type: 'Annual Leave', dates: 'Mar 15 - Mar 20', days: 5, status: 'Pending' },
    { id: 2, name: 'Nurse Emily Wong', type: 'Sick Leave', dates: 'Mar 10', days: 1, status: 'Approved' },
    { id: 3, name: 'Tech. Mike Ross', type: 'Personal', dates: 'Mar 12 - Mar 13', days: 2, status: 'Rejected' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-slate-500">Review and approve staff leave requests</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Requests</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Approved (This Month)</p>
              <h3 className="text-2xl font-bold text-slate-900">45</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Staff on Leave Today</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Recent Requests</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Staff Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Leave Type</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Dates</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Days</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leaveRequests.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.type}</td>
                <td className="px-6 py-4 text-slate-600">{item.dates}</td>
                <td className="px-6 py-4 text-slate-600">{item.days}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle size={18} /></button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;
