import React, { useState } from 'react';
import { ShoppingCart, Truck, Package, Plus, CheckCircle, Clock, FileText } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: string;
  total: number;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  date: string;
}

const Procurement: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    { id: 'PO-2024-001', vendor: 'MedSupply Co.', items: 'Surgical Gloves, Masks', total: 1200, status: 'Delivered', date: '2024-03-01' },
    { id: 'PO-2024-002', vendor: 'PharmaDirect', items: 'Antibiotics Batch A', total: 5400, status: 'Approved', date: '2024-03-05' },
    { id: 'PO-2024-003', vendor: 'TechSolutions', items: 'MRI Maintenance Kit', total: 850, status: 'Pending', date: '2024-03-08' },
  ]);

  const [showAddOrder, setShowAddOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({ vendor: '', items: '', total: '' });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order: PurchaseOrder = {
      id: `PO-2024-00${orders.length + 1}`,
      vendor: newOrder.vendor,
      items: newOrder.items,
      total: parseFloat(newOrder.total),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([order, ...orders]);
    setShowAddOrder(false);
    setNewOrder({ vendor: '', items: '', total: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement & Purchasing</h1>
          <p className="text-slate-500">Manage vendor orders and inventory requests</p>
        </div>
        <button 
          onClick={() => setShowAddOrder(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} />
          Create Purchase Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShoppingCart size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Orders</p>
              <h3 className="text-2xl font-bold text-slate-900">{orders.filter(o => o.status !== 'Delivered').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Truck size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Delivery</p>
              <h3 className="text-2xl font-bold text-slate-900">{orders.filter(o => o.status === 'Approved').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Completed (Month)</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">PO Number</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Vendor</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Items</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Total Cost</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                <td className="px-6 py-4 text-slate-600">{order.vendor}</td>
                <td className="px-6 py-4 text-slate-600">{order.items}</td>
                <td className="px-6 py-4 font-mono text-slate-900">${order.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-500">{order.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Approved' ? 'bg-blue-100 text-blue-700' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Order Modal */}
      {showAddOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">New Purchase Order</h3>
              <button onClick={() => setShowAddOrder(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vendor Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newOrder.vendor}
                  onChange={e => setNewOrder({...newOrder, vendor: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Items Description</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newOrder.items}
                  onChange={e => setNewOrder({...newOrder, items: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Total ($)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newOrder.total}
                  onChange={e => setNewOrder({...newOrder, total: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
                Create Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procurement;
