import React, { useState } from 'react';
import { X, Activity, Pill, FileText, FlaskConical, Stethoscope, File, Utensils, Clock, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient, LabResult } from '../types';

interface PatientDetailDrawerProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({ patient, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'labs' | 'docs' | 'diet' | 'history'>('overview');

  if (!patient) return null;

  const vitalsData = patient.vitals || [
    { time: '08:00', heartRate: 72, temp: 36.6, bloodPressure: '120/80' },
    { time: '10:00', heartRate: 75, temp: 36.7, bloodPressure: '122/81' },
    { time: '12:00', heartRate: 78, temp: 36.8, bloodPressure: '121/82' },
  ];

  const medications = patient.medications || [
    { name: 'Amoxicillin', dosage: '500mg', frequency: '3x Daily' },
  ];

  const labResults: LabResult[] = patient.labResults || [
    { id: '1', testName: 'Complete Blood Count', date: '2023-10-24', result: 'Normal', status: 'Normal' },
  ];

  // Mock Data for new tabs
  const docs = [
      { id: '1', name: 'MRI Scan - Head', type: 'DICOM', date: 'Oct 24, 2023', size: '45 MB' },
      { id: '2', name: 'Blood Test Report', type: 'PDF', date: 'Oct 23, 2023', size: '1.2 MB' },
  ];

  const diet = [
      { meal: 'Breakfast', description: 'Oatmeal with berries', calories: 350, status: 'Consumed' },
      { meal: 'Lunch', description: 'Grilled chicken salad', calories: 450, status: 'Planned' },
  ];

  const timeline = [
      { date: 'Oct 24, 10:00 AM', title: 'Admitted', description: 'Patient admitted via ER', type: 'Admission' },
      { date: 'Oct 24, 02:00 PM', title: 'MRI Scan', description: 'Head scan completed', type: 'Surgery' },
      { date: 'Oct 25, 09:00 AM', title: 'Consultation', description: 'Dr. Chen reviewed results', type: 'Medication' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 right-0 z-50 w-full md:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        flex flex-col
      `}>
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
              <p className="text-sm text-slate-500">ID: {patient.id} • Room: {patient.roomNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {['overview', 'labs', 'docs', 'diet', 'history'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:bg-slate-200/50'}`}
                >
                    {tab === 'history' ? 'Timeline' : tab === 'docs' ? 'Documents' : tab}
                </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
          
          {activeTab === 'overview' && (
            <>
                <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-500 font-bold uppercase">Condition</p>
                        <p className="font-semibold text-slate-800">{patient.condition}</p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                    <Activity className="text-red-500" size={20} />
                    <h3 className="font-bold text-slate-800">Vitals Monitor</h3>
                    </div>
                    <div className="h-[200px] w-full bg-white border border-slate-100 rounded-xl p-2 shadow-sm">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vitalsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                                <Tooltip />
                                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={{r: 4, fill: '#ef4444'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                    <Pill className="text-teal-500" size={20} />
                    <h3 className="font-bold text-slate-800">Medications</h3>
                    </div>
                    <div className="space-y-3">
                    {medications.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <p className="font-medium text-slate-800">{med.name}</p>
                                <p className="text-xs text-slate-500">{med.dosage}</p>
                            </div>
                            <span className="text-xs font-semibold bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                                {med.frequency}
                            </span>
                        </div>
                    ))}
                    </div>
                </div>
            </>
          )}

          {activeTab === 'labs' && (
            <div className="space-y-4">
               {labResults.map((lab) => (
                   <div key={lab.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50">
                       <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-3">
                               <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FlaskConical size={20} /></div>
                               <div>
                                   <p className="font-semibold text-slate-900">{lab.testName}</p>
                                   <p className="text-xs text-slate-500">{lab.date}</p>
                               </div>
                           </div>
                           <span className={`px-2 py-1 rounded-full text-xs font-bold ${lab.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{lab.status}</span>
                       </div>
                       <p className="text-sm ml-12">Result: <span className="font-medium">{lab.result}</span></p>
                   </div>
               ))}
            </div>
          )}

          {activeTab === 'docs' && (
              <div className="grid grid-cols-2 gap-4">
                  {docs.map(doc => (
                      <div key={doc.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-slate-50/50">
                          <div className="flex justify-between items-start mb-8">
                              <File size={32} className="text-slate-400" />
                              <span className="text-[10px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{doc.type}</span>
                          </div>
                          <p className="font-medium text-sm text-slate-800 truncate">{doc.name}</p>
                          <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-slate-400">{doc.size}</span>
                              <Download size={16} className="text-slate-400 hover:text-teal-600" />
                          </div>
                      </div>
                  ))}
                  <button className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-teal-300 hover:text-teal-600 p-4 transition-colors">
                      <File size={24} className="mb-2" />
                      <span className="text-xs font-medium">Upload File</span>
                  </button>
              </div>
          )}

          {activeTab === 'diet' && (
              <div className="space-y-4">
                  {diet.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                          <div className={`p-3 rounded-full ${item.status === 'Consumed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                              <Utensils size={20} />
                          </div>
                          <div className="flex-1">
                              <p className="font-bold text-slate-800">{item.meal}</p>
                              <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                          <div className="text-right">
                              <p className="font-mono font-bold text-slate-700">{item.calories} kcal</p>
                              <span className="text-xs text-slate-400">{item.status}</span>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'history' && (
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 py-2">
                  {timeline.map((event, idx) => (
                      <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-teal-500"></div>
                          <p className="text-xs text-slate-400 mb-1 font-mono">{event.date}</p>
                          <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientDetailDrawer;