import React, { useState } from 'react';
import { Calendar, Clock, MapPin, MoreVertical, CheckCircle, XCircle, AlertCircle, Video, Mic, PhoneOff, MicOff, X } from 'lucide-react';
import { Appointment } from '../types';
import { useData } from '../src/contexts/DataContext';

const Schedule: React.FC = () => {
  const { appointments, addAppointment } = useData();
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      patientName: '',
      doctorName: 'Dr. Chen',
      date: '',
      time: '',
      type: 'General Checkup',
      isOnline: false
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'text-green-600 bg-green-50 border-green-100';
      case 'Pending': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      time: formData.time,
      date: formData.date,
      type: formData.type,
      status: 'Pending',
      isOnline: formData.isOnline
    };
    addAppointment(newApt);
    setIsModalOpen(false);
    setFormData({ patientName: '', doctorName: 'Dr. Chen', date: '', time: '', type: 'General Checkup', isOnline: false });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule & Appointments</h1>
          <p className="text-slate-500">Manage doctor availability and patient visits.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-teal-600/20"
        >
          + New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Visits</h2>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button className="px-3 py-1 bg-white rounded-md text-xs font-medium shadow-sm text-slate-800">Today</button>
              <button className="px-3 py-1 text-slate-500 text-xs font-medium hover:text-slate-700">Week</button>
            </div>
          </div>
          
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group cursor-pointer bg-white">
                <div className="flex items-center gap-4 min-w-[150px]">
                  <div className="bg-slate-100 text-slate-600 p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px] group-hover:bg-white group-hover:text-teal-600 transition-colors">
                    <span className="text-xs font-bold uppercase">{apt.date}</span>
                    <span className="font-bold">{apt.time.split(' ')[0]}</span>
                  </div>
                  <div>
                     <p className="font-semibold text-slate-900">{apt.patientName}</p>
                     <p className="text-xs text-slate-500">{apt.type}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Calendar size={14} />
                        {apt.doctorName}
                    </div>
                    {apt.isOnline ? (
                        <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                            <Video size={14} />
                            Online
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                            <MapPin size={14} />
                            Room 3-B
                        </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                        {apt.status}
                    </div>
                    {apt.isOnline && apt.status === 'Pending' && (
                        <button onClick={() => setIsCallOpen(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-700 shadow-sm animate-pulse">
                            Start Call
                        </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-600/20">
                <h3 className="font-bold text-lg mb-1">Doctors Available</h3>
                <p className="text-indigo-200 text-sm mb-4">4 doctors are currently on shift.</p>
                <div className="flex -space-x-2 overflow-hidden mb-6">
                    {[1,2,3,4].map(i => (
                        <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-indigo-600" src={`https://picsum.photos/id/${i+50}/100`} alt=""/>
                    ))}
                    <div className="h-8 w-8 rounded-full bg-indigo-500 ring-2 ring-indigo-600 flex items-center justify-center text-xs font-medium">+2</div>
                </div>
                <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                    View Roster
                </button>
            </div>
        </div>
      </div>

      {/* Telemedicine Modal */}
      {isCallOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] border border-slate-700">
                  <div className="p-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
                      <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-white font-bold">Tele-Consult: Mike Ross</span>
                          <span className="text-slate-400 text-xs px-2 py-0.5 border border-slate-600 rounded">00:12</span>
                      </div>
                      <button onClick={() => setIsCallOpen(false)}><XCircle className="text-slate-400 hover:text-white" /></button>
                  </div>
                  <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
                      <div className="text-slate-600 flex flex-col items-center">
                          <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                              <span className="text-4xl">MR</span>
                          </div>
                          <p>Connecting securely...</p>
                      </div>
                      <div className="absolute bottom-4 right-4 w-48 h-32 bg-slate-800 rounded-xl border border-slate-600 flex items-center justify-center overflow-hidden">
                          <img src="https://picsum.photos/200/200" className="w-full h-full object-cover opacity-80" />
                          <span className="absolute bottom-1 left-2 text-[10px] text-white bg-black/50 px-1 rounded">You</span>
                      </div>
                  </div>
                  <div className="p-6 bg-slate-800 flex justify-center gap-6">
                      <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600"><Mic size={20} /></button>
                      <button className="p-4 rounded-full bg-slate-700 text-white hover:bg-slate-600"><Video size={20} /></button>
                      <button onClick={() => setIsCallOpen(false)} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 px-8 flex items-center gap-2 font-bold">
                          <PhoneOff size={20} /> End Call
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">New Appointment</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleAddAppointment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            value={formData.patientName}
                            onChange={e => setFormData({...formData, patientName: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                            <input 
                                required
                                type="text"
                                placeholder="e.g. Tomorrow"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                            <input 
                                required
                                type="text"
                                placeholder="e.g. 09:00 AM"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="General Checkup">General Checkup</option>
                            <option value="Specialist Consult">Specialist Consult</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Lab Review">Lab Review</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox"
                            id="isOnline"
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                            checked={formData.isOnline}
                            onChange={e => setFormData({...formData, isOnline: e.target.checked})}
                        />
                        <label htmlFor="isOnline" className="text-sm text-slate-700">Online Consultation (Telemedicine)</label>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2"
                    >
                        Schedule Appointment
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;