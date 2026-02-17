import React, { useState, useMemo } from 'react';
import { VitalRecord } from '../types';
import { FileHeart, Search, Plus, X, Baby, Skull, Filter, Activity, Thermometer, Brain, AlertCircle } from 'lucide-react';

const INITIAL_RECORDS: VitalRecord[] = [
  { id: 'R-1', type: 'Birth', name: 'Baby Boy Johnson', date: '2023-10-26', time: '04:30 AM', doctor: 'Dr. John Doe' },
  { id: 'R-2', type: 'Death', name: 'Richard Roe', date: '2023-10-25', time: '11:15 PM', doctor: 'Dr. Michael Ross' },
  { id: 'R-3', type: 'Birth', name: 'Baby Girl Ahmed', date: '2023-10-27', time: '06:15 AM', doctor: 'Dr. Hina Raza' },
  { id: 'R-4', type: 'Death', name: 'Margaret Wilson', date: '2023-10-24', time: '03:45 PM', doctor: 'Dr. Faisal Malik' },
  { id: 'R-5', type: 'Birth', name: 'Baby Boy Patel', date: '2023-10-28', time: '09:00 AM', doctor: 'Dr. Sarah Ahmed' },
];


// Mock Vitals Data
const MOCK_VITALS = [
  { id: 'P-1', name: 'James Wilson', age: 65, temp: 38.5, hr: 102, bp: '110/70', rr: 24, spo2: 94, status: 'Critical' },
  { id: 'P-2', name: 'Maria Garcia', age: 42, temp: 36.8, hr: 72, bp: '120/80', rr: 16, spo2: 98, status: 'Stable' },
  { id: 'P-3', name: 'Robert Chen', age: 58, temp: 39.1, hr: 115, bp: '95/60', rr: 28, spo2: 91, status: 'Critical' },
  { id: 'P-4', name: 'Sarah Miller', age: 31, temp: 37.0, hr: 75, bp: '118/76', rr: 18, spo2: 99, status: 'Stable' },
];

const VitalRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'monitoring'>('registry');
  const [records, setRecords] = useState<VitalRecord[]>(INITIAL_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ type: 'Birth' as 'Birth' | 'Death', name: '', date: '', time: '', doctor: '' });
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [sepsisRisks, setSepsisRisks] = useState<Record<string, { risk: string, confidence: number, factors: string[] }>>({});

  const stats = useMemo(() => ({
    total: records.length,
    births: records.filter(r => r.type === 'Birth').length,
    deaths: records.filter(r => r.type === 'Death').length,
  }), [records]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const ms = !searchTerm.trim() || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      const mf = filterType === 'All' || r.type === filterType;
      return ms && mf;
    });
  }, [records, searchTerm, filterType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecords(prev => [{ id: `R-${Date.now()}`, type: formData.type, name: formData.name, date: formData.date || new Date().toISOString().slice(0, 10), time: formData.time || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), doctor: formData.doctor }, ...prev]);
    setIsModalOpen(false);
    setFormData({ type: 'Birth', name: '', date: '', time: '', doctor: '' });
  };

  const runSepsisAnalysis = async (patientId: string) => {
    setAnalyzingId(patientId);
    // Simulate AI Analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const patient = MOCK_VITALS.find(p => p.id === patientId);
    let risk = 'Low';
    let factors = [];

    // Simple mock logic for demo
    if (patient) {
      if (patient.temp > 38 || patient.hr > 90 || patient.rr > 20) {
        risk = 'High';
        if (patient.temp > 38) factors.push('Elevated Temperature');
        if (patient.hr > 90) factors.push('Tachycardia');
        if (patient.rr > 20) factors.push('Tachypnea');
        if (patient.spo2 < 95) factors.push('Low SpO2');
      }
    }

    setSepsisRisks(prev => ({
      ...prev,
      [patientId]: {
        risk,
        confidence: 0.89,
        factors
      }
    }));
    setAnalyzingId(null);
  };

  const inp = "w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500";

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vital Records & Monitoring</h1>
          <p className="text-slate-500 dark:text-slate-400">Registry of vital events and real-time patient monitoring.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'registry' ? 'bg-white dark:bg-slate-600 shadow text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Registry
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'monitoring' ? 'bg-white dark:bg-slate-600 shadow text-purple-700 dark:text-purple-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
            >
              Patient Monitor
            </button>
          </div>
          {activeTab === 'registry' && (
            <button onClick={() => setIsModalOpen(true)} className="bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center gap-2"><Plus size={18} /> Add Record</button>
          )}
        </div>
      </div>

      {activeTab === 'registry' ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[{ l: 'Total Records', v: stats.total, I: FileHeart }, { l: 'Births', v: stats.births, I: Baby }, { l: 'Deaths', v: stats.deaths, I: Skull }].map(s => (
              <div key={s.l} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start">
                  <div><p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{s.l}</p><h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{s.v}</h3></div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg"><s.I className="text-slate-500 dark:text-slate-400" size={20} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search records..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm">
              <option value="All">All Types</option><option value="Birth">Birth</option><option value="Death">Death</option>
            </select>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  <th className="px-6 py-4">ID</th><th className="px-6 py-4">Type</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Date & Time</th><th className="px-6 py-4">Attending Doctor</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{rec.id}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${rec.type === 'Birth' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>{rec.type}</span></td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{rec.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{rec.date} <span className="text-slate-400 dark:text-slate-500 text-xs ml-1">{rec.time}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{rec.doctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_VITALS.map(patient => (
            <div key={patient.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{patient.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Age: {patient.age} • status: {patient.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => runSepsisAnalysis(patient.id)}
                  disabled={analyzingId === patient.id}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {analyzingId === patient.id ? (
                    <>
                      <Activity className="animate-spin text-purple-500" size={14} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="text-purple-500" size={14} />
                      Check Sepsis Risk
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                  <span className="text-xs text-red-500 font-medium flex items-center gap-1 mb-1"><Thermometer size={12} /> Temp</span>
                  <span className="text-xl font-bold text-red-700 dark:text-red-400">{patient.temp}°C</span>
                </div>
                <div className="p-3 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-100 dark:border-pink-900/30">
                  <span className="text-xs text-pink-500 font-medium flex items-center gap-1 mb-1"><Activity size={12} /> HR</span>
                  <span className="text-xl font-bold text-pink-700 dark:text-pink-400">{patient.hr} <span className="text-xs font-normal">bpm</span></span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="text-xs text-blue-500 font-medium flex items-center gap-1 mb-1">BP</span>
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{patient.bp}</span>
                </div>
                <div className="p-3 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                  <span className="text-xs text-cyan-500 font-medium flex items-center gap-1 mb-1">SpO2</span>
                  <span className="text-xl font-bold text-cyan-700 dark:text-cyan-400">{patient.spo2}%</span>
                </div>
              </div>

              {sepsisRisks[patient.id] && (
                <div className={`mx-4 mb-4 p-3 rounded-xl border flex items-start gap-3 animate-scale-up ${sepsisRisks[patient.id].risk === 'High'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  }`}>
                  <AlertCircle className={`mt-0.5 flex-shrink-0 ${sepsisRisks[patient.id].risk === 'High' ? 'text-red-500' : 'text-green-500'
                    }`} size={18} />
                  <div>
                    <h4 className={`font-bold text-sm ${sepsisRisks[patient.id].risk === 'High' ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
                      }`}>
                      Sepsis Risk: {sepsisRisks[patient.id].risk} ({(sepsisRisks[patient.id].confidence * 100).toFixed(0)}% Confidence)
                    </h4>
                    {sepsisRisks[patient.id].risk === 'High' && (
                      <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                        Risk Factors: {sepsisRisks[patient.id].factors.join(', ')}
                      </p>
                    )}
                    {sepsisRisks[patient.id].risk === 'Low' && (
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Vitals are within normal range. No immediate sepsis indicators.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Vital Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label><select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))} className={inp}><option value="Birth">Birth</option><option value="Death">Death</option></select></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label><input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inp} placeholder="Name" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label><input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className={inp} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label><input type="text" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} className={inp} placeholder="e.g. 04:30 AM" /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attending Doctor</label><input type="text" required value={formData.doctor} onChange={e => setFormData(p => ({ ...p, doctor: e.target.value }))} className={inp} placeholder="Doctor name" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalRecords;
