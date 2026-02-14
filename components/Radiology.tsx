import React, { useState } from 'react';
import { Scan, Image, FileText, Upload, Plus, Search, Eye, X } from 'lucide-react';

interface ScanRequest {
  id: string;
  patientName: string;
  modality: 'X-Ray' | 'MRI' | 'CT Scan' | 'Ultrasound';
  bodyPart: string;
  doctor: string;
  date: string;
  status: 'Scheduled' | 'Imaging' | 'Reviewing' | 'Finalized';
  imageCount: number;
}

const Radiology: React.FC = () => {
  const [requests, setRequests] = useState<ScanRequest[]>([
    { id: 'RAD-001', patientName: 'John Doe', modality: 'X-Ray', bodyPart: 'Chest PA', doctor: 'Dr. Smith', date: '2024-03-15', status: 'Finalized', imageCount: 2 },
    { id: 'RAD-002', patientName: 'Jane Smith', modality: 'MRI', bodyPart: 'Brain', doctor: 'Dr. Chen', date: '2024-03-15', status: 'Imaging', imageCount: 0 },
    { id: 'RAD-003', patientName: 'Robert Brown', modality: 'CT Scan', bodyPart: 'Abdomen', doctor: 'Dr. Wilson', date: '2024-03-15', status: 'Reviewing', imageCount: 150 },
  ]);

  const [showViewer, setShowViewer] = useState(false);
  const [selectedScan, setSelectedScan] = useState<ScanRequest | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Finalized': return 'bg-green-100 text-green-700';
      case 'Reviewing': return 'bg-blue-100 text-blue-700';
      case 'Imaging': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const openViewer = (scan: ScanRequest) => {
    setSelectedScan(scan);
    setShowViewer(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Radiology & PACS</h1>
          <p className="text-slate-500">Diagnostic imaging workflow and reporting.</p>
        </div>
        <button 
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} /> Schedule Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Scan size={24} /></div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Scans</p>
                    <h3 className="text-2xl font-bold text-slate-900">45</h3>
                </div>
            </div>
        </div>
        {/* More stats could go here */}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search PACS..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Accession #</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Patient</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Modality</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Images</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600 text-sm">{req.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">
                    {req.patientName}
                    <p className="text-xs text-slate-500">{req.doctor}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">
                    <span className="font-bold">{req.modality}</span>
                    <p className="text-xs">{req.bodyPart}</p>
                </td>
                <td className="px-6 py-4 text-slate-600 flex items-center gap-1">
                    <Image size={14} /> {req.imageCount}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                    {req.status !== 'Scheduled' && (
                        <button 
                            onClick={() => openViewer(req)}
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1 bg-teal-50 px-2 py-1 rounded"
                        >
                            <Eye size={16} /> View
                        </button>
                    )}
                    {req.status === 'Finalized' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                            <FileText size={16} /> Report
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PACS Viewer Modal Simulation */}
      {showViewer && selectedScan && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col animate-fade-in">
            <div className="h-14 bg-slate-900 flex items-center justify-between px-4 text-slate-300 border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <Scan className="text-teal-500" />
                    <div>
                        <h3 className="font-bold text-white text-sm">{selectedScan.patientName}</h3>
                        <p className="text-xs text-slate-400">{selectedScan.id} • {selectedScan.modality} {selectedScan.bodyPart}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     {/* Toolbar Simulation */}
                     <button className="hover:text-white"><Upload size={20} /></button>
                     <button className="hover:text-white" onClick={() => setShowViewer(false)}><X size={24} /></button>
                </div>
            </div>
            <div className="flex-1 bg-black flex items-center justify-center relative">
                <div className="text-slate-600 flex flex-col items-center">
                    <Image size={64} className="mb-4 opacity-20" />
                    <p>DICOM Viewer Simulation</p>
                    <p className="text-sm opacity-50">Image rendering area</p>
                </div>
                {/* Overlay details */}
                <div className="absolute top-4 left-4 text-teal-500 font-mono text-xs">
                    <p>W: 255 L: 127</p>
                    <p>Zoom: 100%</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Radiology;
