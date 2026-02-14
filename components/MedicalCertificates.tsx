import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { MedicalCertificate } from '../types';
import { FileBadge, Download, Printer, X } from 'lucide-react';

const MedicalCertificates: React.FC = () => {
    const { medicalCertificates, addMedicalCertificate } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        type: 'Sick Leave',
        doctor: 'Dr. Chen',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCert: MedicalCertificate = {
            id: `MC-${Math.floor(Math.random() * 10000)}`,
            patientName: formData.patientName,
            type: formData.type as 'Sick Leave' | 'Fitness' | 'Death',
            issueDate: new Date().toISOString().split('T')[0],
            doctor: formData.doctor,
            status: 'Issued'
        };
        addMedicalCertificate(newCert);
        setIsModalOpen(false);
        setFormData({ patientName: '', type: 'Sick Leave', doctor: 'Dr. Chen' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Medical Certificates</h1>
                  <p className="text-slate-500">Generate sick leave and fitness documents.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 shadow-md"
                >
                    Generate New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalCertificates.map(cert => (
                    <div key={cert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileBadge size={20} className="text-teal-600" />
                                <h3 className="font-bold text-slate-800">{cert.type} Certificate</h3>
                            </div>
                            <p className="text-sm text-slate-600">Patient: <span className="font-medium text-slate-900">{cert.patientName}</span></p>
                            <p className="text-sm text-slate-500">Doctor: {cert.doctor}</p>
                            <p className="text-xs text-slate-400 mt-2">Issued: {cert.issueDate}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold text-center ${cert.status === 'Issued' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {cert.status}
                            </span>
                            {cert.status === 'Issued' && (
                                <div className="flex gap-2">
                                    <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500"><Printer size={16} /></button>
                                    <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500"><Download size={16} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Generate Certificate</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
                                <select 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Fitness">Fitness</option>
                                    <option value="Death">Death</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.doctor}
                                    onChange={e => setFormData({...formData, doctor: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition-colors mt-2"
                            >
                                Generate Certificate
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalCertificates;