import React from 'react';
import { TrainingModule } from '../types';
import { GraduationCap, CheckCircle, PlayCircle } from 'lucide-react';

const MOCK_TRAINING: TrainingModule[] = [
    { id: '1', title: 'HIPAA Compliance 2024', assignedTo: 'All Staff', dueDate: 'Nov 30', status: 'In Progress', score: 45 },
    { id: '2', title: 'Infection Control Basics', assignedTo: 'Nurses', dueDate: 'Oct 15', status: 'Completed', score: 100 },
];

const StaffTraining: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Staff Training (LMS)</h1>
                  <p className="text-slate-500">Compliance courses and skills development.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_TRAINING.map(module => (
                    <div key={module.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                <GraduationCap size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${module.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {module.status}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-1">{module.title}</h3>
                        <p className="text-sm text-slate-500 mb-4">Due: {module.dueDate}</p>
                        
                        {module.status === 'In Progress' && (
                            <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{width: `${module.score}%`}}></div>
                            </div>
                        )}

                        <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center gap-2">
                            {module.status === 'Completed' ? <CheckCircle size={16} /> : <PlayCircle size={16} />}
                            {module.status === 'Completed' ? 'View Certificate' : 'Continue Course'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StaffTraining;