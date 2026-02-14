import React, { useState } from 'react';
import { FlaskConical, Plus, Search, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface LabTest {
  id: string;
  patientName: string;
  testName: string;
  doctorName: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Critical';
  priority: 'Routine' | 'Urgent';
}

const LabManagement: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([
    { id: 'LAB-001', patientName: 'John Doe', testName: 'Complete Blood Count (CBC)', doctorName: 'Dr. Smith', date: '2024-03-15', status: 'Completed', priority: 'Routine' },
    { id: 'LAB-002', patientName: 'Jane Smith', testName: 'Lipid Profile', doctorName: 'Dr. Chen', date: '2024-03-15', status: 'Processing', priority: 'Routine' },
    { id: 'LAB-003', patientName: 'Robert Brown', testName: 'Troponin I', doctorName: 'Dr. Wilson', date: '2024-03-15', status: 'Critical', priority: 'Urgent' },
    { id: 'LAB-004', patientName: 'Emily Davis', testName: 'Thyroid Panel', doctorName: 'Dr. White', date: '2024-03-15', status: 'Pending', priority: 'Routine' },
  ]);

  const [showAddTest, setShowAddTest] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700 animate-pulse';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Laboratory & Pathology</h1>
          <p className="text-slate-500">Manage test requests, samples, and reports.</p>
        </div>
        <button 
          onClick={() => setShowAddTest(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} /> New Test Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><FlaskConical size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Requests</p>
                    <h3 className="text-2xl font-bold text-slate-900">128</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><Clock size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Pending</p>
                    <h3 className="text-2xl font-bold text-slate-900">12</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Completed</p>
                    <h3 className="text-2xl font-bold text-slate-900">110</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Critical Results</p>
                    <h3 className="text-2xl font-bold text-slate-900">6</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search by patient or test ID..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Test ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Patient Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Test Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Referring Doctor</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tests.map((test) => (
              <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600 text-sm">{test.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{test.patientName}</td>
                <td className="px-6 py-4 text-slate-600">
                    {test.testName}
                    {test.priority === 'Urgent' && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase">Urgent</span>}
                </td>
                <td className="px-6 py-4 text-slate-600">{test.doctorName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                    {test.status === 'Completed' || test.status === 'Critical' ? (
                        <button className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1">
                            <FileText size={16} /> View Report
                        </button>
                    ) : (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Update Status
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabManagement;
