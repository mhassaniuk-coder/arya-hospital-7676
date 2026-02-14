import React, { useState } from 'react';
import { Video, Phone, MessageSquare, Mic, User, Calendar, Clock, Paperclip, Send } from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: 'Video' | 'Audio' | 'Chat';
  status: 'Waiting' | 'In Call' | 'Completed';
  symptoms: string;
}

const Telemedicine: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'TELE-001', patientName: 'David Kim', time: '10:00 AM', type: 'Video', status: 'Waiting', symptoms: 'Fever, Cough' },
    { id: 'TELE-002', patientName: 'Maria Garcia', time: '10:30 AM', type: 'Chat', status: 'Waiting', symptoms: 'Skin Rash' },
    { id: 'TELE-003', patientName: 'James Wilson', time: '11:00 AM', type: 'Audio', status: 'Waiting', symptoms: 'Anxiety, Insomnia' },
  ]);

  const [activeCall, setActiveCall] = useState<Appointment | null>(null);
  const [message, setMessage] = useState('');

  const startCall = (apt: Appointment) => {
    setActiveCall(apt);
  };

  const endCall = () => {
    if (activeCall) {
        setAppointments(appointments.map(a => a.id === activeCall.id ? { ...a, status: 'Completed' } : a));
        setActiveCall(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Telemedicine & Virtual Care</h1>
          <p className="text-slate-500">Remote consultations and digital health services.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-colors">
                <Calendar size={18} /> Schedule
            </button>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                <Video size={18} /> Instant Meeting
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Appointments List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
                Upcoming Consultations
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
                {appointments.map((apt) => (
                    <div 
                        key={apt.id} 
                        className={`p-4 border rounded-xl hover:shadow-sm cursor-pointer transition-all ${
                            activeCall?.id === apt.id ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-200'
                        }`}
                        onClick={() => startCall(apt)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{apt.patientName}</h4>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Clock size={12} /> {apt.time}
                                    </p>
                                </div>
                            </div>
                            <div className={`p-2 rounded-lg ${
                                apt.type === 'Video' ? 'bg-blue-100 text-blue-600' : 
                                apt.type === 'Audio' ? 'bg-purple-100 text-purple-600' : 
                                'bg-green-100 text-green-600'
                            }`}>
                                {apt.type === 'Video' ? <Video size={16} /> : apt.type === 'Audio' ? <Phone size={16} /> : <MessageSquare size={16} />}
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                            <span className="font-medium">Symptoms:</span> {apt.symptoms}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Active Call Interface */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
            {activeCall ? (
                <>
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">{activeCall.time} • {activeCall.patientName}</span>
                    </div>

                    {/* Video Area Placeholder */}
                    <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-slate-600">
                                <User size={64} className="text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-lg">Connecting to patient...</p>
                        </div>
                        
                        {/* Self View */}
                        <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-xl border border-slate-700 shadow-lg flex items-center justify-center">
                            <p className="text-xs text-slate-500">You</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6">
                        <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><Mic size={20} /></button>
                        <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><Video size={20} /></button>
                        <button 
                            onClick={endCall}
                            className="p-4 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors px-8 font-bold"
                        >
                            End Call
                        </button>
                        <button className="p-4 bg-slate-800 rounded-full text-white hover:bg-slate-700 transition-colors"><MessageSquare size={20} /></button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Video size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Active Consultation</h3>
                    <p>Select a patient from the list to start a call.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Telemedicine;
