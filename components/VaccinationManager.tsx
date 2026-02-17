import React, { useState, useMemo } from 'react';
import { Vaccine } from '../types';
import { Syringe, Calendar, Plus, X, Search } from 'lucide-react';

const INITIAL_VACCINES: Vaccine[] = [
  { id: '1', name: 'COVID-19 (Pfizer)', stock: 150, batchNo: 'BATCH-001', expiry: '2024-05-01' },
  { id: '2', name: 'Influenza', stock: 50, batchNo: 'BATCH-002', expiry: '2023-12-01' },
  { id: '3', name: 'Hepatitis B', stock: 200, batchNo: 'BATCH-003', expiry: '2025-01-01' },
];

const VaccinationManager: React.FC = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>(INITIAL_VACCINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [scheduleModal, setScheduleModal] = useState<{ vaccine: Vaccine } | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ patientName: '', date: '', time: '' });
  const [formData, setFormData] = useState({ name: '', stock: 0, batchNo: '', expiry: '' });

  const filteredVaccines = useMemo(() => {
    if (!searchTerm.trim()) return vaccines;
    const t = searchTerm.toLowerCase();
    return vaccines.filter((v) => v.name.toLowerCase().includes(t) || v.batchNo.toLowerCase().includes(t));
  }, [vaccines, searchTerm]);

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const newVaccine: Vaccine = {
      id: `VAC-${Date.now()}`,
      name: formData.name,
      stock: formData.stock,
      batchNo: formData.batchNo,
      expiry: formData.expiry,
    };
    setVaccines((prev) => [newVaccine, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', stock: 0, batchNo: '', expiry: '' });
  };

  const updateStock = (id: string, delta: number) => {
    setVaccines((prev) =>
      prev.map((v) => (v.id === id ? { ...v, stock: Math.max(0, v.stock + delta) } : v))
    );
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleModal) {
      updateStock(scheduleModal.vaccine.id, -1);
      setScheduleModal(null);
      setScheduleForm({ patientName: '', date: '', time: '' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vaccination Drive</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage vaccine stock and appointments.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Vaccine
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search vaccines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Search vaccines"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              <th className="px-6 py-4">Vaccine Name</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Batch No.</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredVaccines.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                      <Syringe size={18} />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{v.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-slate-800 dark:text-white">{v.stock}</span>
                  <div className="flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => updateStock(v.id, -1)}
                      disabled={v.stock <= 0}
                      className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStock(v.id, 1)}
                      className="text-xs px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">{v.batchNo}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{v.expiry}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setScheduleModal({ vaccine: v })}
                    disabled={v.stock <= 0}
                    className="text-teal-600 dark:text-teal-400 text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    Schedule
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vaccine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Vaccine</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddVaccine} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vaccine Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. COVID-19 (Pfizer)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={formData.stock || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, stock: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Stock quantity"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Batch No.</label>
                <input
                  type="text"
                  required
                  value={formData.batchNo}
                  onChange={(e) => setFormData((p) => ({ ...p, batchNo: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="BATCH-XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
                <input
                  type="text"
                  required
                  value={formData.expiry}
                  onChange={(e) => setFormData((p) => ({ ...p, expiry: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                  Add Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Schedule Vaccination – {scheduleModal.vaccine.name}</h2>
              <button onClick={() => setScheduleModal(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={scheduleForm.patientName}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, patientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 2024-03-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                <input
                  type="text"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm((p) => ({ ...p, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. 10:00 AM"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setScheduleModal(null)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManager;
