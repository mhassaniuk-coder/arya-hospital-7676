import React, { useState } from 'react';
import { Scissors, Clock, User, CheckSquare, Plus, AlertCircle, Calendar } from 'lucide-react';

interface Surgery {
  id: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  anesthesiologist: string;
  theater: string;
  time: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
  checklist: { preOp: boolean; anesthesia: boolean; postOp: boolean };
}

const OTManagement: React.FC = () => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([
    { 
        id: 'SURG-001', 
        patientName: 'Alice Johnson', 
        procedure: 'Appendectomy', 
        surgeon: 'Dr. Wilson', 
        anesthesiologist: 'Dr. Ray', 
        theater: 'OT-1', 
        time: '09:00 AM', 
        status: 'In Progress',
        checklist: { preOp: true, anesthesia: true, postOp: false }
    },
    { 
        id: 'SURG-002', 
        patientName: 'Mark Lee', 
        procedure: 'Knee Replacement', 
        surgeon: 'Dr. Patel', 
        anesthesiologist: 'Dr. Ray', 
        theater: 'OT-2', 
        time: '11:00 AM', 
        status: 'Scheduled',
        checklist: { preOp: true, anesthesia: false, postOp: false }
    },
    { 
        id: 'SURG-003', 
        patientName: 'Sarah Connor', 
        procedure: 'C-Section', 
        surgeon: 'Dr. Chen', 
        anesthesiologist: 'Dr. Miles', 
        theater: 'OT-3', 
        time: '02:00 PM', 
        status: 'Scheduled',
        checklist: { preOp: false, anesthesia: false, postOp: false }
    },
  ]);

  const [showAddSurgery, setShowAddSurgery] = useState(false);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700 animate-pulse';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Delayed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operation Theater Management</h1>
          <p className="text-slate-500">Surgery scheduling, team assignment, and checklists.</p>
        </div>
        <button 
          onClick={() => setShowAddSurgery(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} /> Schedule Surgery
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Scissors size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Surgeries Today</p>
                    <h3 className="text-2xl font-bold text-slate-900">8</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Theaters Active</p>
                    <h3 className="text-2xl font-bold text-slate-900">3/5</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Clock size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Avg. Duration</p>
                    <h3 className="text-2xl font-bold text-slate-900">2h 15m</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {surgeries.map((surgery) => (
            <div key={surgery.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-800">{surgery.procedure}</h3>
                        <p className="text-xs text-slate-500">{surgery.id} • {surgery.theater}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(surgery.status)}`}>
                        {surgery.status}
                    </span>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                {surgery.patientName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{surgery.patientName}</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {surgery.time}</p>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                            <p><span className="font-medium">Surgeon:</span> {surgery.surgeon}</p>
                            <p><span className="font-medium">Anesthesia:</span> {surgery.anesthesiologist}</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Safety Checklist</p>
                        <div className="flex gap-4">
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.preOp ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Pre-Op
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.anesthesia ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Anesthesia
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${surgery.checklist.postOp ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                <CheckSquare size={16} /> Post-Op
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t border-slate-100 flex gap-2">
                    <button className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        View Details
                    </button>
                    <button className="flex-1 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        Update Status
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// Simple icon wrapper for missing imports if any
function CheckCircle({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}

export default OTManagement;
