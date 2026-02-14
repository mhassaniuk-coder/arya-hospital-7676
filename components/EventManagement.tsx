import React from 'react';
import { HospitalEvent } from '../types';
import { PartyPopper, Calendar, MapPin, Users } from 'lucide-react';

const MOCK_EVENTS: HospitalEvent[] = [
    { id: '1', title: 'Advanced Cardiology Workshop', type: 'Workshop', date: '2023-11-05', location: 'Conference Hall A', attendees: 45 },
    { id: '2', title: 'Nursing Staff Training', type: 'Training', date: '2023-11-08', location: 'Training Room 2', attendees: 20 },
    { id: '3', title: 'Annual Medical Conference', type: 'Conference', date: '2023-12-01', location: 'Main Auditorium', attendees: 150 },
];

const EventManagement: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Events & CME</h1>
                  <p className="text-slate-500">Workshops, training, and medical conferences.</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md">
                    + Schedule Event
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_EVENTS.map(event => (
                    <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                                <PartyPopper size={24} />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{event.type}</span>
                                <p className="text-sm font-semibold text-slate-800">{event.date}</p>
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-4 leading-tight">{event.title}</h3>
                        
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} /> {event.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} /> {event.attendees} Registered
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventManagement;