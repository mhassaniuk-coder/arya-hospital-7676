import React, { useState, useMemo } from 'react';
import { Briefcase, Users, FileText, CheckCircle, Clock, XCircle, Search, Filter, Plus, ChevronRight, Mail, Phone, Calendar, Download, MapPin, DollarSign, User, X } from 'lucide-react';

type JobStatus = 'Open' | 'Closed' | 'Draft';
type ApplicantStatus = 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface Job {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  location: 'On-site' | 'Remote' | 'Hybrid';
  salary: string;
  postedDate: string;
  applicants: number;
  status: JobStatus;
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  appliedDate: string;
  status: ApplicantStatus;
  score: number;
  resume: string;
  avatar: string;
}

const INITIAL_JOBS: Job[] = [
  { id: 'JOB-001', title: 'Senior Cardiologist', department: 'Cardiology', type: 'Full-time', location: 'On-site', salary: '$250k - $350k', postedDate: '2024-02-15', applicants: 12, status: 'Open' },
  { id: 'JOB-002', title: 'ER Nurse', department: 'Emergency', type: 'Full-time', location: 'On-site', salary: '$80k - $100k', postedDate: '2024-02-20', applicants: 45, status: 'Open' },
  { id: 'JOB-003', title: 'Medical Receptionist', department: 'Administration', type: 'Full-time', location: 'On-site', salary: '$40k - $50k', postedDate: '2024-02-25', applicants: 89, status: 'Closed' },
  { id: 'JOB-004', title: 'Pediatric Surgeon', department: 'Surgery', type: 'Full-time', location: 'On-site', salary: '$300k - $400k', postedDate: '2024-03-01', applicants: 5, status: 'Open' },
];

const INITIAL_APPLICANTS: Applicant[] = [
  { id: 'APP-001', name: 'Dr. Emily Chen', role: 'Senior Cardiologist', email: 'emily.chen@email.com', phone: '+1 (555) 123-4567', appliedDate: '2024-02-16', status: 'Interview', score: 92, resume: 'resume_echen.pdf', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 'APP-002', name: 'Michael Brown', role: 'ER Nurse', email: 'm.brown@email.com', phone: '+1 (555) 234-5678', appliedDate: '2024-02-21', status: 'New', score: 85, resume: 'resume_mbrown.pdf', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 'APP-003', name: 'Sarah Wilson', role: 'Medical Receptionist', email: 's.wilson@email.com', phone: '+1 (555) 345-6789', appliedDate: '2024-02-26', status: 'Rejected', score: 65, resume: 'resume_swilson.pdf', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 'APP-004', name: 'Dr. James Lee', role: 'Senior Cardiologist', email: 'j.lee@email.com', phone: '+1 (555) 456-7890', appliedDate: '2024-02-18', status: 'Screening', score: 88, resume: 'resume_jlee.pdf', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=100&h=100' },
];

const Recruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const stats = useMemo(() => ({
    openJobs: jobs.filter(j => j.status === 'Open').length,
    activeApplicants: applicants.filter(a => ['New', 'Screening', 'Interview'].includes(a.status)).length,
    interviews: applicants.filter(a => a.status === 'Interview').length,
    hired: applicants.filter(a => a.status === 'Hired').length,
  }), [jobs, applicants]);

  const filteredJobs = useMemo(() => jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.department.toLowerCase().includes(searchQuery.toLowerCase())
  ), [jobs, searchQuery]);

  const filteredApplicants = useMemo(() => applicants.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  ), [applicants, searchQuery]);

  const getJobStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Open': return 'bg-success-light text-success-dark';
      case 'Closed': return 'bg-background-tertiary text-foreground-muted';
      case 'Draft': return 'bg-warning-light text-warning-dark';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  const getApplicantStatusColor = (status: ApplicantStatus) => {
    switch (status) {
      case 'New': return 'bg-info-light text-info-dark';
      case 'Screening': return 'bg-warning-light text-warning-dark';
      case 'Interview': return 'bg-purple-100 text-purple-700';
      case 'Offer': return 'bg-success-light text-success-dark';
      case 'Hired': return 'bg-success text-white';
      case 'Rejected': return 'bg-danger-light text-danger-dark';
      default: return 'bg-background-tertiary text-foreground-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Recruitment & Hiring</h1>
          <p className="text-foreground-secondary">Manage job postings and applicant pipeline.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-background-secondary p-1 rounded-xl flex gap-1">
            <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all theme-transition ${activeTab === 'jobs' ? 'bg-background-elevated text-accent shadow-sm' : 'text-foreground-muted hover:text-foreground-primary'}`}>Jobs</button>
            <button onClick={() => setActiveTab('applicants')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all theme-transition ${activeTab === 'applicants' ? 'bg-background-elevated text-accent shadow-sm' : 'text-foreground-muted hover:text-foreground-primary'}`}>Applicants</button>
          </div>
          <button onClick={() => setShowJobModal(true)} className="bg-accent text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent/90 shadow-lg flex items-center gap-2 transition-all theme-transition">
            <Plus size={18} /> Post Job
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Open Positions', value: stats.openJobs, icon: <Briefcase size={22} />, color: 'bg-info-light text-info-dark' },
          { label: 'Active Candidates', value: stats.activeApplicants, icon: <Users size={22} />, color: 'bg-purple-100 text-purple-600' },
          { label: 'Interviews Scheduled', value: stats.interviews, icon: <Calendar size={22} />, color: 'bg-warning-light text-warning-dark' },
          { label: 'Hired This Month', value: stats.hired, icon: <CheckCircle size={22} />, color: 'bg-success-light text-success-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-background-elevated p-5 rounded-2xl shadow-sm border border-border theme-transition">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-foreground-muted font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-foreground-primary">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
        <input type="text" placeholder={activeTab === 'jobs' ? "Search positions..." : "Search candidates..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background-elevated border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-accent shadow-sm theme-transition" />
      </div>

      {/* Content Area */}
      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-background-elevated rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all group relative overflow-hidden theme-transition">
              <div className={`absolute top-0 left-0 w-1 h-full ${job.status === 'Open' ? 'bg-accent' : 'bg-border'}`} />
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-foreground-primary text-lg group-hover:text-accent transition-colors">{job.title}</h3>
                  <p className="text-sm text-foreground-muted">{job.department}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getJobStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <MapPin size={16} className="text-foreground-muted" />
                  {job.location} ({job.type})
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <DollarSign size={16} className="text-foreground-muted" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                  <Clock size={16} className="text-foreground-muted" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-muted">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-background-tertiary border-2 border-background-elevated flex items-center justify-center text-xs text-foreground-muted font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {job.applicants > 3 && (
                    <div className="w-8 h-8 rounded-full bg-background-secondary border-2 border-background-elevated flex items-center justify-center text-xs text-foreground-secondary font-bold">
                      +{job.applicants - 3}
                    </div>
                  )}
                </div>
                <button onClick={() => setActiveTab('applicants')} className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
                  View Applicants <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-background-elevated rounded-xl shadow-sm border border-border overflow-hidden theme-transition">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
                <tr>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Applied For</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {filteredApplicants.map(app => (
                  <tr key={app.id} className="hover:bg-background-secondary transition-colors cursor-pointer theme-transition" onClick={() => setSelectedApplicant(app)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full object-cover border-2 border-background-elevated shadow-sm" />
                        <div>
                          <p className="font-semibold text-foreground-primary">{app.name}</p>
                          <p className="text-xs text-foreground-muted">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary font-medium">{app.role}</td>
                    <td className="px-6 py-4 text-foreground-muted">{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getApplicantStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-background-tertiary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${app.score >= 90 ? 'bg-success' : app.score >= 70 ? 'bg-accent' : 'bg-warning'}`} style={{ width: `${app.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-foreground-secondary">{app.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-accent font-semibold hover:underline text-sm">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applicant Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedApplicant(null)}>
          <div className="bg-background-elevated rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-muted flex justify-between items-start bg-background-secondary">
              <div className="flex gap-4">
                <img src={selectedApplicant.avatar} alt={selectedApplicant.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-background-elevated shadow-md" />
                <div>
                  <h2 className="text-xl font-bold text-foreground-primary">{selectedApplicant.name}</h2>
                  <p className="text-accent font-medium">{selectedApplicant.role}</p>
                  <div className="flex gap-4 mt-2 text-sm text-foreground-muted">
                    <span className="flex items-center gap-1"><Mail size={14} /> {selectedApplicant.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {selectedApplicant.phone}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedApplicant(null)} className="p-2 text-foreground-muted hover:text-foreground-primary hover:bg-background-tertiary rounded-lg theme-transition"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-secondary rounded-xl border border-border">
                  <p className="text-sm text-foreground-muted font-medium mb-1">Status</p>
                  <select className="bg-transparent font-bold text-foreground-primary outline-none w-full cursor-pointer" defaultValue={selectedApplicant.status}>
                    <option>New</option><option>Screening</option><option>Interview</option><option>Offer</option><option>Hired</option><option>Rejected</option>
                  </select>
                </div>
                <div className="p-4 bg-background-secondary rounded-xl border border-border">
                  <p className="text-sm text-foreground-muted font-medium mb-1">AI Match Score</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-2xl text-accent">{selectedApplicant.score}%</span>
                    <span className="text-xs text-foreground-muted bg-background-elevated px-2 py-1 rounded shadow-sm">Top 10%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground-primary mb-3">Documents</h3>
                <div className="flex gap-3">
                  <div className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-background-secondary cursor-pointer flex-1 transition-colors theme-transition">
                    <div className="p-2 bg-danger-light text-danger-dark rounded-lg"><FileText size={20} /></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground-primary text-sm">Resume.pdf</p>
                      <p className="text-xs text-foreground-muted">2.4 MB - Uploaded Feb 16</p>
                    </div>
                    <Download size={18} className="text-foreground-muted" />
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-background-secondary cursor-pointer flex-1 transition-colors theme-transition">
                    <div className="p-2 bg-info-light text-info-dark rounded-lg"><User size={20} /></div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground-primary text-sm">CoverLetter.pdf</p>
                      <p className="text-xs text-foreground-muted">1.1 MB - Uploaded Feb 16</p>
                    </div>
                    <Download size={18} className="text-foreground-muted" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground-primary mb-3">Notes</h3>
                <textarea placeholder="Add interview notes..." className="w-full h-24 border border-border rounded-xl p-3 text-sm bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent resize-none theme-transition"></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-border-muted flex gap-3">
              <button className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary theme-transition">Schedule Interview</button>
              <button className="flex-1 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg theme-transition">Send Offer</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowJobModal(false)}>
          <div className="bg-background-elevated rounded-2xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border-muted">
              <h2 className="text-xl font-bold text-foreground-primary">Post a New Job</h2>
              <button onClick={() => setShowJobModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-secondary theme-transition">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newJob: Job = {
                id: `JOB-${Date.now()}`,
                title: formData.get('title') as string,
                department: formData.get('department') as string,
                type: formData.get('type') as any,
                location: formData.get('location') as any,
                salary: formData.get('salary') as string,
                postedDate: new Date().toISOString(),
                applicants: 0,
                status: 'Open'
              };
              setJobs(prev => [newJob, ...prev]);
              setShowJobModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Job Title</label>
                <input name="title" required placeholder="e.g. Senior Neurologist" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Department</label>
                  <input name="department" required placeholder="Cardiology" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Salary Range</label>
                  <input name="salary" required placeholder="$120k - $150k" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Type</label>
                  <select name="type" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Location</label>
                  <select name="location" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-primary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition">
                    <option>On-site</option><option>Remote</option><option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowJobModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-secondary transition-colors theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg transition-all theme-transition">Post Position</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
