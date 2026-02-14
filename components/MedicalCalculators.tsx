import React, { useState } from 'react';
import { X, Calculator, Syringe } from 'lucide-react';

interface MedicalCalculatorsProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicalCalculators: React.FC<MedicalCalculatorsProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'dosage'>('bmi');
  const [bmiData, setBmiData] = useState({ height: '', weight: '', result: 0 });
  
  const calculateBMI = () => {
      const h = parseFloat(bmiData.height) / 100;
      const w = parseFloat(bmiData.weight);
      if(h > 0 && w > 0) setBmiData({...bmiData, result: parseFloat((w / (h*h)).toFixed(2))});
  };

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Calculator size={20} className="text-teal-600" />
                    Medical Tools
                </h3>
                <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
            </div>
            
            <div className="flex border-b border-slate-100">
                <button onClick={() => setActiveTab('bmi')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'bmi' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:bg-slate-50'}`}>BMI Calculator</button>
                <button onClick={() => setActiveTab('dosage')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'dosage' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:bg-slate-50'}`}>IV Drip Rate</button>
            </div>

            <div className="p-6">
                {activeTab === 'bmi' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Height (cm)</label>
                            <input type="number" className="w-full border border-slate-200 rounded-lg p-2" value={bmiData.height} onChange={(e) => setBmiData({...bmiData, height: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                            <input type="number" className="w-full border border-slate-200 rounded-lg p-2" value={bmiData.weight} onChange={(e) => setBmiData({...bmiData, weight: e.target.value})} />
                        </div>
                        <button onClick={calculateBMI} className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700">Calculate BMI</button>
                        {bmiData.result > 0 && (
                            <div className="bg-teal-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-teal-600 font-bold uppercase">BMI Result</p>
                                <p className="text-3xl font-bold text-teal-800">{bmiData.result}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-8">
                        <Syringe size={40} className="mx-auto mb-2 opacity-50" />
                        <p>IV Rate Calculator Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MedicalCalculators;