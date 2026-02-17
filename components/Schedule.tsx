import React, { useState } from 'react';
import { Calendar, Clock, MapPin, MoreVertical, CheckCircle, XCircle, AlertCircle, Video, Mic, PhoneOff, MicOff, X, CalendarDays, Ban, AlertTriangle } from 'lucide-react';
import { Appointment } from '../types';
import { useData } from '../src/contexts/DataContext';
import AppointmentWizard from './AppointmentWizard';

type ViewFilter = 'today' | 'week';

const Schedule: React.FC = () => {
  const { appointments, updateAppointment } = useData();
  const [viewFilter, setViewFilter] = useState<ViewFilter>('today');
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'text-success-700 bg-success-50 border-success-200 dark:bg-success-900/30 dark:text-success-400 dark:border-success-800';
      case 'Pending': return 'text-warning-700 bg-warning-50 border-warning-200 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-800';
      case 'Cancelled': return 'text-danger-700 bg-danger-50 border-danger-200 dark:bg-danger-900/30 dark:text-danger-400 dark:border-danger-800';
      default: return 'text-foreground-muted bg-background-tertiary';
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const filteredAppointments = viewFilter === 'today'
    ? appointments.filter((a) => a.date === 'Today' || a.date === todayStr)
    : appointments;

  const openRescheduleModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setRescheduleData({ date: apt.date, time: apt.time });
    setIsRescheduleModalOpen(true);
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, {
        date: rescheduleData.date,
        time: rescheduleData.time,
        status: 'Confirmed'
      });
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const openCancelModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsCancelModalOpen(true);
  };

  const handleCancelAppointment = () => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, { status: 'Cancelled' });
      setIsCancelModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Schedule & Appointments</h1>
          <p className="text-foreground-secondary">Manage doctor availability and patient visits.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-600/20"
          title="Create new appointment"
        >
          + New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background-primary p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground-primary">Upcoming Visits</h2>
            <div className="flex bg-background-secondary rounded-lg p-1" role="group" aria-label="Filter by period">
              <button type="button" title="Show today's appointments" className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-colors ${viewFilter === 'today' ? 'bg-background-primary text-foreground-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-primary'}`} onClick={() => setViewFilter('today')}>Today</button>
              <button type="button" title="Show this week's appointments" className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${viewFilter === 'week' ? 'bg-background-primary text-foreground-primary shadow-sm' : 'text-foreground-muted hover:text-foreground-primary'}`} onClick={() => setViewFilter('week')}>Week</button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-border hover:border-primary-200 hover:bg-primary-50/10 transition-all group cursor-pointer bg-background-secondary/30">
                <div className="flex items-center gap-4 min-w-[150px]">
                  <div className="bg-background-tertiary text-foreground-secondary p-3 rounded-lg flex flex-col items-center justify-center min-w-[60px] group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <span className="text-xs font-bold uppercase">{apt.date}</span>
                    <span className="font-bold">{apt.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground-primary">{apt.patientName}</p>
                    <p className="text-xs text-foreground-secondary">{apt.type}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <div className="flex items-center gap-1 bg-background-tertiary px-2 py-1 rounded">
                      <Calendar size={14} />
                      {apt.doctorName}
                    </div>
                    {apt.isOnline ? (
                      <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/30">
                        <Video size={14} />
                        Online
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-background-tertiary px-2 py-1 rounded">
                        <MapPin size={14} />
                        Room 3-B
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </div>

                    {apt.status !== 'Cancelled' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openRescheduleModal(apt)}
                          className="p-1.5 text-foreground-muted hover:text-primary-600 rounded-full hover:bg-background-tertiary"
                          title="Reschedule"
                        >
                          <CalendarDays size={16} />
                        </button>
                        <button
                          onClick={() => openCancelModal(apt)}
                          className="p-1.5 text-foreground-muted hover:text-danger-600 rounded-full hover:bg-background-tertiary"
                          title="Cancel Appointment"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    )}

                    {apt.isOnline && apt.status === 'Pending' && (
                      <button onClick={() => setIsCallOpen(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-700 shadow-sm animate-pulse ml-2">
                        Start Call
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="p-8 text-center text-foreground-muted">
                <p>No appointments scheduled for this period.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Doctor Availability</h3>
              <p className="opacity-90 text-sm mb-4">You have 4 slots open today.</p>
              <div className="flex gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">09:00 AM</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">11:30 AM</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">02:15 PM</span>
              </div>
            </div>
            <Calendar className="absolute -right-4 -bottom-4 opacity-10" size={120} />
          </div>

          <div className="bg-background-primary p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="font-bold text-foreground-primary mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Appointments', val: appointments.length, color: 'text-primary-600' },
                { label: 'Completed', val: appointments.filter(a => a.status === 'Confirmed').length, color: 'text-success-600' },
                { label: 'Cancelled', val: appointments.filter(a => a.status === 'Cancelled').length, color: 'text-danger-600' }
              ].map(stat => (
                <div key={stat.label} className="flex justify-between items-center p-3 bg-background-secondary rounded-xl">
                  <span className="text-sm font-medium text-foreground-secondary">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-sm animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground-primary">Reschedule</h2>
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleReschedule} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">New Date</label>
                <input
                  type="text"
                  required
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData((p) => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Tomorrow, Oct 25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-1">New Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData((p) => ({ ...p, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., 09:30 AM"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-primary rounded-2xl shadow-xl border border-border w-full max-w-sm animate-scale-up p-6 text-center">
            <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center mx-auto mb-4 text-danger-dark">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-foreground-primary mb-2">Cancel Appointment?</h3>
            <p className="text-foreground-secondary mb-6">
              Are you sure you want to cancel the appointment for "{selectedAppointment.patientName}"?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors"
              >
                No, Keep
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 px-4 py-2 bg-danger-600 text-white rounded-lg font-medium hover:bg-danger-700 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telemedicine Modal */}
      {isCallOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-background-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] border border-border">
            <div className="p-4 bg-background-secondary flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-foreground-primary font-bold">Tele-Consult: Mike Ross</span>
                <span className="text-foreground-muted text-xs px-2 py-0.5 border border-border rounded">00:12</span>
              </div>
              <button type="button" onClick={() => setIsCallOpen(false)} title="Close call" aria-label="Close call"><XCircle className="text-foreground-muted hover:text-foreground-primary theme-transition" /></button>
            </div>
            <div className="flex-1 relative bg-background-tertiary flex items-center justify-center">
              <div className="text-foreground-muted flex flex-col items-center">
                <div className="w-32 h-32 bg-background-elevated rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">MR</span>
                </div>
                <p>Connecting securely...</p>
              </div>
              <div className="absolute bottom-4 right-4 w-48 h-32 bg-background-elevated rounded-xl border border-border flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/200/200" alt="Call participant" className="w-full h-full object-cover opacity-80" />
                <span className="absolute bottom-1 left-2 text-[10px] text-white bg-black/50 px-1 rounded">You</span>
              </div>
            </div>
            <div className="p-6 bg-background-secondary flex justify-center gap-6">
              <button type="button" className="p-4 rounded-full bg-background-tertiary text-foreground-primary hover:bg-background-elevated theme-transition" aria-label="Mute microphone"><Mic size={20} /></button>
              <button type="button" className="p-4 rounded-full bg-background-tertiary text-foreground-primary hover:bg-background-elevated theme-transition" aria-label="Toggle video"><Video size={20} /></button>
              <button type="button" onClick={() => setIsCallOpen(false)} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 px-8 flex items-center gap-2 font-bold theme-transition" aria-label="End call">
                <PhoneOff size={20} /> End Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Wizard */}
      {isWizardOpen && (
        <AppointmentWizard
          onClose={() => setIsWizardOpen(false)}
          onSuccess={() => {
            // Success actions if any
          }}
        />
      )}
    </div>
  );
};

export default Schedule;