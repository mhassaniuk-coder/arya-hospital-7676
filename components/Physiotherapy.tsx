import React from 'react';
import { TherapySession } from '../types';
import { Accessibility, Calendar, User } from 'lucide-react';

const MOCK_SESSIONS: TherapySession[] = [
    { id: '1', patientName: 'Emily Davis', therapyType: 'Post-Op Knee Rehab', therapist: 'Dr. John', date: 'Today, 10:00 AM', status: 'Scheduled' },
    { id: '2', patientName: 'Robert Wilson', therapyType: 'Stroke Recovery', therapist: 'Dr. Lisa', date: 'Yesterday, 02:00 PM', status: 'Completed' },
];

const Physiotherapy: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Physiotherapy</h1>
                  <p className="text-slate-500">Manage rehab schedules and sessions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_SESSIONS.map(session => (
                    <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-teal-50 p-4 rounded-full text-teal-600">
                            <Accessibility size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-slate-800 text-lg">{session.patientName}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${session.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {session.status}
                                </span>
                            </div>
                            <p className="text-slate-600 font-medium">{session.therapyType}</p>
                            <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                <div className="flex items-center gap-1"><User size={14} /> {session.therapist}</div>
                                <div className="flex items-center gap-1"><Calendar size={14} /> {session.date}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Physiotherapy;