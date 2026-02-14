import React from 'react';
import { Department } from '../types';
import { Building2, Users } from 'lucide-react';

const MOCK_DEPTS: Department[] = [
  { id: '1', name: 'Cardiology', head: 'Dr. Sarah Chen', staffCount: 14, status: 'Active' },
  { id: '2', name: 'Neurology', head: 'Dr. Michael Ross', staffCount: 8, status: 'Active' },
  { id: '3', name: 'Pediatrics', head: 'Dr. John Doe', staffCount: 12, status: 'Active' },
  { id: '4', name: 'Orthopedics', head: 'Dr. Alice Cooper', staffCount: 10, status: 'Active' },
  { id: '5', name: 'Oncology', head: 'Dr. James Wilson', staffCount: 6, status: 'Active' },
  { id: '6', name: 'Emergency', head: 'Dr. Lisa Cuddy', staffCount: 24, status: 'Active' },
];

const Departments: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
          <p className="text-slate-500">Manage hospital wards and medical units.</p>
        </div>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
          + New Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DEPTS.map((dept) => (
          <div key={dept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{dept.name}</h3>
                <p className="text-xs text-green-600 font-bold uppercase">{dept.status}</p>
              </div>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-500">Head of Dept</span>
                  <span className="font-medium text-slate-800">{dept.head}</span>
               </div>
               <div className="flex justify-between items-center text-sm py-2">
                  <span className="text-slate-500">Total Staff</span>
                  <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="font-medium text-slate-800">{dept.staffCount}</span>
                  </div>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 text-sm font-medium text-teal-600 bg-teal-50 py-2 rounded-lg hover:bg-teal-100 transition-colors">
                    Manage
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;