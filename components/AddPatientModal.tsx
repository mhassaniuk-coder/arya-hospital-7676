import React, { useState } from 'react';
import { X } from 'lucide-react';
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-center justify-center p-4">
       <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-700/50">
             <h2 className="text-lg font-bold text-slate-800 dark:text-white">Admit New Patient</h2>
             <button onClick={onClose} className="text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Age</label>
                    <input required type="number" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all" 
                        value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Gender</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all"
                        value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Room Number</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all" 
                        value={formData.roomNumber} onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Urgency</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all"
                        value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as UrgencyLevel})}>
                        {Object.values(UrgencyLevel).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Primary Condition / Diagnosis</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white transition-all" 
                        value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">History / Notes</label>
                    <textarea className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none h-20 resize-none text-slate-900 dark:text-white transition-all" 
                        value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})} />
                </div>
             </div>
             
             <div className="pt-4 flex gap-3">
                 <button type="button" onClick={onClose} className="flex-1 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium shadow-md shadow-teal-600/20 transition-all">Admit Patient</button>
             </div>
          </form>
       </div>
    </div>
  );
};

export default AddPatientModal;
