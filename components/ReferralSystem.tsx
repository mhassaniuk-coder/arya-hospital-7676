import React, { useState } from 'react';
import { useData } from '../src/contexts/DataContext';
import { Referral } from '../types';
import { Share2, ArrowRight, ArrowLeft, X } from 'lucide-react';

const ReferralSystem: React.FC = () => {
    const { referrals, addReferral } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        direction: 'Outbound',
        hospital: '',
        reason: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReferral: Referral = {
            id: `REF-${Math.floor(Math.random() * 10000)}`,
            patientName: formData.patientName,
            direction: formData.direction as 'Inbound' | 'Outbound',
            hospital: formData.hospital,
            reason: formData.reason,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        addReferral(newReferral);
        setIsModalOpen(false);
        setFormData({ patientName: '', direction: 'Outbound', hospital: '', reason: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Referrals</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage transfers between hospitals.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md"
                >
                    Create Referral
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                            <th className="px-6 py-4">Ref ID</th>
                            <th className="px-6 py-4">Direction</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Hospital</th>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {referrals.map(ref => (
                            <tr key={ref.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{ref.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-bold ${ref.direction === 'Outbound' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                                        {ref.direction === 'Outbound' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
                                        {ref.direction}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{ref.patientName}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{ref.hospital}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{ref.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${ref.status === 'Accepted' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                                        {ref.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 m-4 animate-scale-up border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create Referral</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.patientName}
                                    onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Direction</label>
                                <select
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.direction}
                                    onChange={e => setFormData({ ...formData, direction: e.target.value })}
                                >
                                    <option value="Outbound">Outbound</option>
                                    <option value="Inbound">Inbound</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Hospital</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                                    value={formData.hospital}
                                    onChange={e => setFormData({ ...formData, hospital: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reason</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors mt-2"
                            >
                                Create Referral
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReferralSystem;