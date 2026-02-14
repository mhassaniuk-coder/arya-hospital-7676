import React from 'react';
import { Feedback } from '../types';
import { Star, MessageSquare } from 'lucide-react';

const MOCK_FEEDBACK: Feedback[] = [
    { id: '1', patientName: 'Sarah Johnson', rating: 5, comment: 'Excellent care from Dr. Chen and the nursing staff!', date: '2023-10-26' },
    { id: '2', patientName: 'Michael Chen', rating: 4, comment: 'Facilities are great but waiting time was a bit long.', date: '2023-10-25' },
    { id: '3', patientName: 'Anonymous', rating: 3, comment: 'Food was cold.', date: '2023-10-24' },
];

const FeedbackSystem: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Patient Feedback</h1>
                  <p className="text-slate-500">Reviews and ratings from patients.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_FEEDBACK.map(f => (
                    <div key={f.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < f.rating ? "#fbbf24" : "none"} className={i < f.rating ? "text-amber-400" : "text-slate-300"} />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400">{f.date}</span>
                        </div>
                        <p className="text-slate-700 italic mb-4">"{f.comment}"</p>
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-100">
                             <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">
                                 {f.patientName.charAt(0)}
                             </div>
                             <span className="text-sm font-semibold text-slate-800">{f.patientName}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackSystem;