import React, { useState } from 'react';
import { X, UserPlus, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UrgencyLevel, Patient } from '../types';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (patient: Patient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    condition: '',
    roomNumber: '',
    urgency: UrgencyLevel.LOW,
    history: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: `P-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      admissionDate: new Date().toISOString().split('T')[0],
      condition: formData.condition,
      roomNumber: formData.roomNumber,
      urgency: formData.urgency,
      history: formData.history,
      vitals: [], // Empty initially
      medications: []
    };
    onAdd(newPatient);
    onClose();
    // Reset form
    setFormData({
      name: '', age: '', gender: 'Male', condition: '', roomNumber: '', urgency: UrgencyLevel.LOW, history: ''
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-background-primary dark:bg-slate-900 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-border bg-background-secondary/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <UserPlus size={20} />
                </div>
                <h2 className="text-xl font-bold text-foreground-primary">Admit New Patient</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-full text-foreground-secondary transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Full Name *</label>
                  <input required type="text"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="Enter patient name"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Age *</label>
                    <input required type="number"
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                      value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Gender</label>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                      value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Room Number *</label>
                    <input required type="text"
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                      placeholder="e.g. 101-A"
                      value={formData.roomNumber} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Urgency Level</label>
                    <select
                      className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                      value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}>
                      {Object.values(UrgencyLevel).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">Diagnosis *</label>
                  <input required type="text"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    placeholder="Primary medical condition"
                    value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-secondary uppercase tracking-wider">History / Notes</label>
                  <textarea
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background-tertiary/50 text-foreground-primary focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none h-24 resize-none transition-all"
                    placeholder="Brief medical history or admission notes..."
                    value={formData.history} onChange={e => setFormData({ ...formData, history: e.target.value })} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 border border-transparent hover:bg-background-tertiary rounded-xl text-foreground-secondary font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-accent text-white rounded-xl font-bold hover:bg-accent/90 shadow-lg shadow-accent/20 transition-all transform hover:scale-[1.02]">
                  Admit Patient
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPatientModal;
