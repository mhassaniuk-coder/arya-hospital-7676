import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'Operational' | 'Maintenance' | 'Broken' | 'Retired';
  location: string;
  purchaseDate: string;
  lastMaintenance: string;
}

const AssetManager: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'AST-001', name: 'MRI Scanner X200', category: 'Medical Equipment', status: 'Operational', location: 'Radiology Room 1', purchaseDate: '2022-06-15', lastMaintenance: '2024-02-10' },
    { id: 'AST-002', name: 'Patient Monitor', category: 'Electronics', status: 'Maintenance', location: 'ICU Bed 4', purchaseDate: '2023-01-20', lastMaintenance: '2024-03-05' },
    { id: 'AST-003', name: 'Ambulance Van 3', category: 'Vehicle', status: 'Operational', location: 'Parking Zone B', purchaseDate: '2021-11-05', lastMaintenance: '2024-01-15' },
    { id: 'AST-004', name: 'X-Ray Machine', category: 'Medical Equipment', status: 'Broken', location: 'ER Triage', purchaseDate: '2020-03-10', lastMaintenance: '2023-12-01' },
  ]);

  const [showAddAsset, setShowAddAsset] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', category: '', location: '' });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      id: `AST-00${assets.length + 1}`,
      name: newAsset.name,
      category: newAsset.category,
      status: 'Operational',
      location: newAsset.location,
      purchaseDate: new Date().toISOString().split('T')[0],
      lastMaintenance: 'N/A'
    };
    setAssets([asset, ...assets]);
    setShowAddAsset(false);
    setNewAsset({ name: '', category: '', location: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Track hospital equipment and maintenance schedules</p>
        </div>
        <button 
          onClick={() => setShowAddAsset(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} />
          Register New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.length}</span>
          </div>
          <p className="text-sm text-slate-500">Total Assets</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Operational').length}</span>
          </div>
          <p className="text-sm text-slate-500">Operational</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Wrench size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Maintenance').length}</span>
          </div>
          <p className="text-sm text-slate-500">In Maintenance</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>
            <span className="text-2xl font-bold text-slate-900">{assets.filter(a => a.status === 'Broken').length}</span>
          </div>
          <p className="text-sm text-slate-500">Broken / Retired</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="text" placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 text-slate-600">
                <Filter size={18} /> Filter
            </button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Asset ID</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Name</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Location</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Last Service</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-slate-600 text-sm">{asset.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{asset.name}</td>
                <td className="px-6 py-4 text-slate-600">{asset.category}</td>
                <td className="px-6 py-4 text-slate-600">{asset.location}</td>
                <td className="px-6 py-4 text-slate-600">{asset.lastMaintenance}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${asset.status === 'Operational' ? 'bg-green-100 text-green-700' : 
                      asset.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Asset Modal */}
      {showAddAsset && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Register New Asset</h3>
              <button onClick={() => setShowAddAsset(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddAsset} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.name}
                  onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.category}
                  onChange={e => setNewAsset({...newAsset, category: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option>Medical Equipment</option>
                  <option>Electronics</option>
                  <option>Vehicle</option>
                  <option>Furniture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newAsset.location}
                  onChange={e => setNewAsset({...newAsset, location: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                Register Asset
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManager;
