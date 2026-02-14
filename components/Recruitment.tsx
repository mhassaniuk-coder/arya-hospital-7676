import React, { useState } from 'react';
import { Briefcase, UserPlus, FileText, Check, X, Search, Filter, MoreVertical } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  applicants: number;
  status: 'Open' | 'Closed';
  posted: string;
}

interface Applicant {
  id: number;
  name: string;
  role: string;
  experience: string;
  status: 'New' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
}

const Recruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: 'Senior Surgeon', department: 'Surgery', type: 'Full-time', applicants: 12, status: 'Open', posted: '2 days ago' },
    { id: 2, title: 'ICU Nurse', department: 'Emergency', type: 'Full-time', applicants: 8, status: 'Open', posted: '5 days ago' },
    { id: 3, title: 'Pediatrician', department: 'Pediatrics', type: 'Part-time', applicants: 4, status: 'Open', posted: '1 week ago' },
    { id: 4, title: 'Lab Technician', department: 'Laboratory', type: 'Contract', applicants: 15, status: 'Closed', posted: '2 weeks ago' },
  ]);

  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 1, name: 'Dr. Michael Chen', role: 'Senior Surgeon', experience: '10 years', status: 'Interview', date: '2024-03-10' },
    { id: 2, name: 'Sarah Johnson', role: 'ICU Nurse', experience: '5 years', status: 'New', date: '2024-03-12' },
    { id: 3, name: 'Emily Davis', role: 'Lab Technician', experience: '3 years', status: 'Rejected', date: '2024-03-08' },
    { id: 4, name: 'Dr. Robert Wilson', role: 'Pediatrician', experience: '8 years', status: 'Offer', date: '2024-03-05' },
  ]);

  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', department: '', type: 'Full-time' });

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    const job: Job = {
      id: jobs.length + 1,
      title: newJob.title,
      department: newJob.department,
      type: newJob.type as any,
      applicants: 0,
      status: 'Open',
      posted: 'Just now'
    };
    setJobs([job, ...jobs]);
    setShowAddJob(false);
    setNewJob({ title: '', department: '', type: 'Full-time' });
  };

  const updateApplicantStatus = (id: number, status: Applicant['status']) => {
    setApplicants(applicants.map(app => app.id === id ? { ...app, status } : app));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recruitment & Hiring</h1>
          <p className="text-slate-500">Manage job openings and track applicants</p>
        </div>
        <button 
          onClick={() => setShowAddJob(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Briefcase size={18} />
          Post New Job
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'jobs' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Job Openings
          {activeTab === 'jobs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setActiveTab('applicants')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'applicants' ? 'text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Applicants
          {activeTab === 'applicants' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-100 transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {job.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{job.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{job.department} • {job.type}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><UserPlus size={16} /> {job.applicants} Applicants</span>
                <span>{job.posted}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="Search applicants..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-600">
              <Filter size={18} /> Filter
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Applicant Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Applied For</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Experience</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{app.name}</td>
                  <td className="px-6 py-4 text-slate-600">{app.role}</td>
                  <td className="px-6 py-4 text-slate-600">{app.experience}</td>
                  <td className="px-6 py-4 text-slate-600">{app.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${app.status === 'Offer' ? 'bg-green-100 text-green-700' : 
                        app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : 
                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => updateApplicantStatus(app.id, 'Interview')} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Schedule Interview"><FileText size={18} /></button>
                    <button onClick={() => updateApplicantStatus(app.id, 'Offer')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Extend Offer"><Check size={18} /></button>
                    <button onClick={() => updateApplicantStatus(app.id, 'Rejected')} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Reject"><X size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Post New Job</h3>
              <button onClick={() => setShowAddJob(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddJob} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newJob.title}
                  onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newJob.department}
                  onChange={e => setNewJob({...newJob, department: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newJob.type}
                  onChange={e => setNewJob({...newJob, type: e.target.value})}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                Post Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
