import React from 'react';
import { useData } from '../src/contexts/DataContext';
import { AlertTriangle, Package, Search, Plus } from 'lucide-react';

const Pharmacy: React.FC = () => {
  const { inventory } = useData();
  const getStatusStyle = (status: string) => {
    switch(status) {
        case 'In Stock': return 'bg-green-100 text-green-700';
        case 'Low Stock': return 'bg-orange-100 text-orange-700';
        case 'Out of Stock': return 'bg-red-100 text-red-700';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pharmacy Inventory</h1>
          <p className="text-slate-500">Track medication stock and supplies.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Search medicines..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 text-sm w-64" />
             </div>
             <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md flex items-center gap-2">
                 <Plus size={18} /> Add Item
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <AlertTriangle size={24} />
              </div>
              <div>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-sm text-red-700 font-medium">Items Low/Out of Stock</p>
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <Package size={24} />
              </div>
              <div>
                  <p className="text-2xl font-bold text-slate-900">1,240</p>
                  <p className="text-sm text-green-700 font-medium">Total Items Tracked</p>
              </div>
          </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <table className="w-full text-left border-collapse">
             <thead>
                 <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                     <th className="px-6 py-4">Item Name</th>
                     <th className="px-6 py-4">Category</th>
                     <th className="px-6 py-4">Stock Level</th>
                     <th className="px-6 py-4">Last Updated</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Action</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                 {inventory.map((item) => (
                     <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                         <td className="px-6 py-4 text-slate-600">{item.category}</td>
                         <td className="px-6 py-4 font-mono text-slate-700">
                             {item.stock} <span className="text-xs text-slate-400">{item.unit}</span>
                         </td>
                         <td className="px-6 py-4 text-sm text-slate-500">{item.lastUpdated}</td>
                         <td className="px-6 py-4">
                             <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusStyle(item.status)}`}>
                                 {item.status}
                             </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                             <button className="text-teal-600 text-sm font-medium hover:underline">Restock</button>
                         </td>
                     </tr>
                 ))}
             </tbody>
         </table>
      </div>
    </div>
  );
};

export default Pharmacy;