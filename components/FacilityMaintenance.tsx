import React from 'react';
import { FacilityJob } from '../types';
import { Hammer, Wrench, Thermometer } from 'lucide-react';

const MOCK_JOBS: FacilityJob[] = [
    { id: '1', issue: 'AC Not Cooling', location: 'Ward 3', type: 'HVAC', status: 'Fixing', technician: 'Mike T.' },
    { id: '2', issue: 'Flickering Light', location: 'Lobby', type: 'Electrical', status: 'Reported', technician: 'Pending' },
];

const FacilityMaintenance: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Facility Maintenance</h1>
                  <p className="text-slate-500">Building repairs and infrastructure.</p>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 shadow-md">
                    Report Issue
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Issue</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Technician</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_JOBS.map(job => (
                            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{job.issue}</td>
                                <td className="px-6 py-4 text-slate-600">{job.location}</td>
                                <td className="px-6 py-4">
                                    <span className="flex items-center gap-1 text-slate-600 text-sm">
                                        {job.type === 'HVAC' ? <Thermometer size={14} /> : <Wrench size={14} />}
                                        {job.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{job.technician}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'Reported' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                         {job.status}
                                     </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FacilityMaintenance;