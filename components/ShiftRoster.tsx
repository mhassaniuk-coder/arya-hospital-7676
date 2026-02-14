import React from 'react';
import { Shift } from '../types';
import { Clock, User } from 'lucide-react';

const MOCK_SHIFTS: Shift[] = [
    { id: '1', staffName: 'Dr. Sarah Chen', role: 'Doctor', day: 'Monday', time: '08:00 - 16:00', area: 'Cardiology' },
    { id: '2', staffName: 'Nurse Joy', role: 'Nurse', day: 'Monday', time: '08:00 - 20:00', area: 'ICU' },
    { id: '3', staffName: 'Dr. Mike Ross', role: 'Doctor', day: 'Tuesday', time: '16:00 - 00:00', area: 'Neurology' },
];

const ShiftRoster: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Shift Roster</h1>
                  <p className="text-slate-500">Weekly staff scheduling.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['Monday', 'Tuesday', 'Wednesday'].map(day => (
                    <div key={day} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">{day}</h3>
                        <div className="space-y-3">
                            {MOCK_SHIFTS.filter(s => s.day === day).map(shift => (
                                <div key={shift.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{shift.staffName}</p>
                                            <p className="text-xs text-slate-500">{shift.role} • {shift.area}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                                        <Clock size={14} className="text-teal-500" />
                                        {shift.time}
                                    </div>
                                </div>
                            ))}
                            {MOCK_SHIFTS.filter(s => s.day === day).length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">No shifts scheduled</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftRoster;