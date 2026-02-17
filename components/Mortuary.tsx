import React, { useState, useMemo } from 'react';
import { Skull, FileText, Plus, X, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type MortuaryStatus = 'Admitted' | 'Autopsy' | 'Released';

interface MortuaryRecordSimple {
  id: string; deceasedName: string; dateOfDeath: string; freezerNo: string;
  status: MortuaryStatus; relativeName: string; causeOfDeath: string; autopsyRequired: boolean;
}

const INITIAL: MortuaryRecordSimple[] = [
  { id: 'M-001', deceasedName: 'Richard Roe', dateOfDeath: '2023-10-25', freezerNo: 'F-04', status: 'Admitted', relativeName: 'Jane Roe', causeOfDeath: 'Cardiac Arrest', autopsyRequired: true },
  { id: 'M-002', deceasedName: 'John Doe Sr.', dateOfDeath: '2023-10-24', freezerNo: 'F-02', status: 'Released', relativeName: 'Mike Doe', causeOfDeath: 'Natural Causes', autopsyRequired: false },
  { id: 'M-003', deceasedName: 'Margaret Wilson', dateOfDeath: '2023-10-26', freezerNo: 'F-06', status: 'Autopsy', relativeName: 'Thomas Wilson', causeOfDeath: 'Under Investigation', autopsyRequired: true },
];

const STATUSES_FILTER = ['All', 'Admitted', 'Autopsy', 'Released'];

const Mortuary: React.FC = () => {
  const [records, setRecords] = useState<MortuaryRecordSimple[]>(INITIAL);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ deceasedName: '', dateOfDeath: '', freezerNo: '', relativeName: '', causeOfDeath: '', autopsyRequired: false });

  const stats = useMemo(() => ({
    total: records.length,
    admitted: records.filter(r => r.status === 'Admitted').length,
    autopsy: records.filter(r => r.status === 'Autopsy').length,
    released: records.filter(r => r.status === 'Released').length,
  }), [records]);

  const filtered = useMemo(() => records.filter(r => {
    const ms = !searchTerm.trim() || r.deceasedName.toLowerCase().includes(searchTerm.toLowerCase()) || r.relativeName.toLowerCase().includes(searchTerm.toLowerCase()) || r.freezerNo.toLowerCase().includes(searchTerm.toLowerCase());
    const mf = filterStatus === 'All' || r.status === filterStatus;
    return ms && mf;
  }), [records, searchTerm, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(prev => [{ id: `M-${Date.now().toString().slice(-3)}`, ...formData, status: formData.autopsyRequired ? 'Autopsy' as MortuaryStatus : 'Admitted' as MortuaryStatus }, ...prev]);
    setIsModalOpen(false);
    setFormData({ deceasedName: '', dateOfDeath: '', freezerNo: '', relativeName: '', causeOfDeath: '', autopsyRequired: false });
  };

  const updateStatus = (id: string, status: MortuaryStatus) => setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  const getStatusColor = (s: string) => {
    if (s === 'Admitted') return 'bg-background-tertiary text-foreground-secondary';
    if (s === 'Autopsy') return 'bg-warning-light text-warning-dark';
    return 'bg-success-light text-success-dark';
  };

  const getNextAction = (s: string): { label: string; next: MortuaryStatus } | null => {
    if (s === 'Admitted') return { label: 'Mark Released', next: 'Released' };
    if (s === 'Autopsy') return { label: 'Complete Autopsy', next: 'Admitted' };
    return null;
  };

  const inp = "w-full px-3 py-2 border border-border rounded-lg bg-background-tertiary text-foreground-primary outline-none focus:ring-2 focus:ring-accent theme-transition";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Mortuary</h1>
          <p className="text-foreground-secondary">Morgue occupancy, autopsy tracking, and release records.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-slate-700 dark:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 shadow-md flex items-center gap-2 theme-transition"><Plus size={18} /> Admit Deceased</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ l: 'Total', v: stats.total, I: Skull }, { l: 'Admitted', v: stats.admitted, I: Clock }, { l: 'Autopsy', v: stats.autopsy, I: AlertCircle }, { l: 'Released', v: stats.released, I: CheckCircle }].map(s => (
          <div key={s.l} className="bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-medium text-foreground-muted uppercase">{s.l}</p><h3 className="text-2xl font-bold mt-1 text-foreground-primary">{s.v}</h3></div>
              <div className="p-2 bg-background-tertiary rounded-lg"><s.I className="text-foreground-muted" size={20} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3 bg-background-primary p-4 rounded-xl shadow-sm border border-border theme-transition">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder="Search name or freezer..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-tertiary text-foreground-primary focus:outline-none focus:ring-2 focus:ring-accent theme-transition" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-background-tertiary text-foreground-primary text-sm theme-transition">
          {STATUSES_FILTER.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
        </select>
      </div>

      <div className="bg-background-primary rounded-xl shadow-sm border border-border overflow-hidden theme-transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-background-tertiary border-b border-border text-xs uppercase tracking-wider text-foreground-muted font-semibold">
              <th className="px-5 py-4">ID</th><th className="px-5 py-4">Deceased</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Freezer</th><th className="px-5 py-4">Cause</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Relative</th><th className="px-5 py-4 text-right">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map(r => {
                const act = getNextAction(r.status); return (
                  <tr key={r.id} className="hover:bg-background-tertiary theme-transition">
                    <td className="px-5 py-4 font-mono text-xs text-foreground-muted">{r.id}</td>
                    <td className="px-5 py-4 font-medium text-foreground-primary flex items-center gap-2"><Skull size={14} className="text-foreground-muted" /> {r.deceasedName}</td>
                    <td className="px-5 py-4 text-foreground-secondary text-sm">{r.dateOfDeath}</td>
                    <td className="px-5 py-4 font-bold text-foreground-secondary">{r.freezerNo}</td>
                    <td className="px-5 py-4 text-sm text-foreground-secondary">{r.causeOfDeath}</td>
                    <td className="px-5 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(r.status)}`}>{r.status}</span></td>
                    <td className="px-5 py-4 text-foreground-secondary text-sm">{r.relativeName}</td>
                    <td className="px-5 py-4 text-right">{act && <button onClick={() => updateStatus(r.id, act.next)} className="text-accent text-xs font-semibold hover:underline">{act.label}</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-md theme-transition">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">Admit to Mortuary</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg theme-transition"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div><label className="block text-sm font-medium text-foreground-secondary mb-1">Deceased Name</label><input type="text" required value={formData.deceasedName} onChange={e => setFormData(p => ({ ...p, deceasedName: e.target.value }))} className={inp} placeholder="Full name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-foreground-secondary mb-1">Date of Death</label><input type="date" required value={formData.dateOfDeath} onChange={e => setFormData(p => ({ ...p, dateOfDeath: e.target.value }))} className={inp} /></div>
                <div><label className="block text-sm font-medium text-foreground-secondary mb-1">Freezer No.</label><input type="text" required value={formData.freezerNo} onChange={e => setFormData(p => ({ ...p, freezerNo: e.target.value }))} className={inp} placeholder="F-XX" /></div>
              </div>
              <div><label className="block text-sm font-medium text-foreground-secondary mb-1">Cause of Death</label><input type="text" required value={formData.causeOfDeath} onChange={e => setFormData(p => ({ ...p, causeOfDeath: e.target.value }))} className={inp} placeholder="Cause of death" /></div>
              <div><label className="block text-sm font-medium text-foreground-secondary mb-1">Relative Name</label><input type="text" required value={formData.relativeName} onChange={e => setFormData(p => ({ ...p, relativeName: e.target.value }))} className={inp} placeholder="Next of kin" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="autopsy" checked={formData.autopsyRequired} onChange={e => setFormData(p => ({ ...p, autopsyRequired: e.target.checked }))} className="rounded border-border text-accent focus:ring-accent" /><label htmlFor="autopsy" className="text-sm font-medium text-foreground-secondary">Autopsy Required</label></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary theme-transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-700 dark:bg-slate-600 text-white rounded-lg font-medium hover:opacity-90 theme-transition">Admit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mortuary;