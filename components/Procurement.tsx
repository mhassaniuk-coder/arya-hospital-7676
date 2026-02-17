import React, { useState, useMemo } from 'react';
import { ShoppingCart, Truck, Package, Plus, CheckCircle, Clock, FileText, Search, Filter, AlertTriangle, Building, X, ChevronRight, DollarSign, Calendar, Edit, Trash2, Eye, TrendingUp, Sparkles, Loader2, BarChart2 } from 'lucide-react';
import { useInventoryForecast } from '../hooks/useAI';

type OrderStatus = 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  contact: string;
  email: string;
  status: 'Active' | 'Inactive';
}

interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
  deliveryDate?: string;
  requestedBy: string;
}

const INITIAL_VENDORS: Vendor[] = [
  { id: 'V-001', name: 'MedTech Solutions', category: 'Medical Equipment', rating: 4.8, contact: 'John Smith', email: 'orders@medtech.com', status: 'Active' },
  { id: 'V-002', name: 'PharmaCare Inc', category: 'Pharmaceuticals', rating: 4.5, contact: 'Sarah Johnson', email: 'sales@pharmacare.com', status: 'Active' },
  { id: 'V-003', name: 'CleanSafe Supplies', category: 'Sanitation', rating: 4.2, contact: 'Mike Brown', email: 'mike@cleansafe.com', status: 'Active' },
  { id: 'V-004', name: 'Office Depot', category: 'Office Supplies', rating: 4.0, contact: 'Support', email: 'b2b@officedepot.com', status: 'Inactive' },
];

const INITIAL_ORDERS: PurchaseOrder[] = [
  { id: 'PO-1001', vendorId: 'V-001', vendorName: 'MedTech Solutions', items: 'MRI Machine Maintenance Kit x2', total: 4500, status: 'Approved', date: '2024-03-10', deliveryDate: '2024-03-15', requestedBy: 'Dr. Ross' },
  { id: 'PO-1002', vendorId: 'V-002', vendorName: 'PharmaCare Inc', items: 'Amoxicillin 500mg x1000', total: 1200, status: 'Pending', date: '2024-03-12', requestedBy: 'Pharmacy' },
  { id: 'PO-1003', vendorId: 'V-003', vendorName: 'CleanSafe Supplies', items: 'N95 Masks x5000', total: 2500, status: 'Delivered', date: '2024-02-28', deliveryDate: '2024-03-02', requestedBy: 'Inventory' },
  { id: 'PO-1004', vendorId: 'V-001', vendorName: 'MedTech Solutions', items: 'Patient Monitors x5', total: 15000, status: 'Shipped', date: '2024-03-05', deliveryDate: '2024-03-14', requestedBy: 'ICU Head' },
];

const Procurement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'vendors'>('orders');
  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_ORDERS);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const [vendorForm, setVendorForm] = useState<Partial<Vendor>>({
    name: '', category: '', contact: '', email: '', status: 'Active'
  });

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    vendorName: '',
    items: '',
    total: 0,
    requestedBy: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });

  const forecastTools = useInventoryForecast();

  const stats = useMemo(() => ({
    activeOrders: orders.filter(o => ['Pending', 'Approved', 'Shipped'].includes(o.status)).length,
    pendingApproval: orders.filter(o => o.status === 'Pending').length,
    totalSpend: orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.total, 0),
    lowStock: 12, // Simulated
  }), [orders]);

  const filteredOrders = useMemo(() => orders.filter(o => {
    const matchesSearch = o.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || o.items.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [orders, searchQuery, statusFilter]);

  const filteredVendors = useMemo(() => vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  ), [vendors, searchQuery]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.name === formData.vendorName);
    const newOrder: PurchaseOrder = {
      id: `PO-${1000 + orders.length + 1}`,
      vendorId: vendor?.id || 'UNKNOWN',
      vendorName: formData.vendorName!,
      items: formData.items!,
      total: Number(formData.total),
      status: 'Pending',
      date: formData.date!,
      requestedBy: formData.requestedBy!
    };
    setOrders(prev => [newOrder, ...prev]);
    setShowOrderModal(false);
    setFormData({ vendorName: '', items: '', total: 0, requestedBy: '', date: new Date().toISOString().split('T')[0], status: 'Pending' });
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setVendorForm(vendor);
    setShowVendorModal(true);
  };

  const handleCreateVendor = () => {
    setSelectedVendor(null);
    setVendorForm({ name: '', category: '', contact: '', email: '', status: 'Active' });
    setShowVendorModal(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVendor) {
      setVendors(prev => prev.map(v => v.id === selectedVendor.id ? { ...v, ...vendorForm } as Vendor : v));
    } else {
      const newVendor: Vendor = {
        id: `V-00${vendors.length + 1}`,
        rating: 5.0,
        ...(vendorForm as Vendor)
      };
      setVendors(prev => [...prev, newVendor]);
    }
    setShowVendorModal(false);
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground-primary">Procurement & Inventory</h1>
          <p className="text-foreground-secondary">Manage purchase orders and vendor relationships.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-background-secondary p-1 rounded-xl flex gap-1 theme-transition">
            <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all theme-transition ${activeTab === 'orders' ? 'bg-background-elevated text-accent shadow-sm' : 'text-foreground-secondary hover:text-foreground-primary'}`}>Orders</button>
            <button onClick={() => setActiveTab('vendors')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all theme-transition ${activeTab === 'vendors' ? 'bg-background-elevated text-accent shadow-sm' : 'text-foreground-secondary hover:text-foreground-primary'}`}>Vendors</button>
            <button onClick={() => setActiveTab('forecast' as any)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all theme-transition ${activeTab === 'forecast' ? 'bg-background-elevated text-purple-600 dark:text-purple-400 shadow-sm flex items-center gap-1' : 'text-foreground-secondary hover:text-foreground-primary flex items-center gap-1'}`}>
              <TrendingUp size={16} /> AI Forecast
            </button>
          </div>
          {activeTab === 'orders' ? (
            <button onClick={() => setShowOrderModal(true)} className="bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all theme-transition">
              <Plus size={18} /> New Request
            </button>
          ) : (
            <button onClick={handleCreateVendor} className="bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all theme-transition">
              <Plus size={18} /> Add Vendor
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders', value: stats.activeOrders, icon: <Truck size={22} />, color: 'bg-info-light text-info-dark' },
          { label: 'Pending Approval', value: stats.pendingApproval, icon: <Clock size={22} />, color: 'bg-warning-light text-warning-dark' },
          { label: 'Low Stock Items', value: stats.lowStock, icon: <AlertTriangle size={22} />, color: 'bg-danger-light text-danger-dark' },
          { label: 'Total Spend (YTD)', value: formatCurrency(stats.totalSpend), icon: <DollarSign size={22} />, color: 'bg-success-light text-success-dark' },
        ].map((s, i) => (
          <div key={i} className="bg-background-primary p-5 rounded-2xl shadow-sm border border-border theme-transition">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-foreground-secondary font-medium">{s.label}</p>
                <p className="text-xl font-bold text-foreground-primary">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
          <input type="text" placeholder={activeTab === 'orders' ? "Search PO# or items..." : "Search vendors..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background-primary border border-border rounded-xl outline-none text-sm text-foreground-primary focus:ring-2 focus:ring-teal-500 theme-transition" />
        </div>
        {activeTab === 'orders' && (
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-background-primary border border-border rounded-xl text-sm text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer theme-transition">
              <option value="All">All Status</option><option>Pending</option><option>Approved</option><option>Shipped</option><option>Delivered</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none" />
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'orders' && (
        <div className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-secondary font-semibold theme-transition">
                <tr>
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Est. Delivery</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-background-secondary transition-colors theme-transition">
                    <td className="px-6 py-4 font-mono font-medium text-foreground-secondary">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground-primary">{order.vendorName}</td>
                    <td className="px-6 py-4 text-foreground-secondary max-w-xs truncate" title={order.items}>{order.items}</td>
                    <td className="px-6 py-4 font-bold text-foreground-primary">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1.5 ${order.status === 'Delivered' ? 'bg-success-light text-success-dark' :
                        order.status === 'Approved' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' :
                          order.status === 'Shipped' ? 'bg-info-light text-info-dark' :
                            order.status === 'Pending' ? 'bg-warning-light text-warning-dark' :
                              'bg-background-tertiary text-foreground-secondary'
                        }`}>
                        {order.status === 'Delivered' && <CheckCircle size={12} />}
                        {order.status === 'Shipped' && <Truck size={12} />}
                        {order.status === 'Pending' && <Clock size={12} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-secondary text-xs">
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'Pending' && (
                          <button onClick={() => updateStatus(order.id, 'Approved')} className="p-1.5 text-accent hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary transition-colors" title="View Details">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-background-primary rounded-2xl shadow-sm border border-border overflow-hidden theme-transition">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary border-b border-border text-xs uppercase tracking-wider text-foreground-secondary font-semibold theme-transition">
                <tr>
                  <th className="px-6 py-4">Vendor Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVendors.map(vendor => (
                  <tr key={vendor.id} className="hover:bg-background-secondary transition-colors theme-transition">
                    <td className="px-6 py-4 font-bold text-foreground-primary">{vendor.name}</td>
                    <td className="px-6 py-4 text-foreground-secondary">{vendor.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="font-bold text-foreground-primary">{vendor.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 ${i < Math.floor(vendor.rating) ? 'fill-current' : 'text-foreground-muted'}`} viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-foreground-primary">{vendor.contact}</span>
                        <span className="text-foreground-secondary">{vendor.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${vendor.status === 'Active' ? 'bg-success-light text-success-dark' : 'bg-background-tertiary text-foreground-secondary'}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditVendor(vendor)} className="p-1.5 text-foreground-muted hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteVendor(vendor.id)} className="p-1.5 text-foreground-muted hover:text-danger-dark rounded-lg hover:bg-danger-light transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-background-primary rounded-2xl shadow-sm border border-border p-6 theme-transition">
            <h3 className="text-lg font-bold text-foreground-primary mb-6 flex items-center gap-2">
              <Sparkles className="text-purple-500" />
              Items Requiring Restock (AI Analysis)
            </h3>
            <div className="space-y-4">
              {[
                { name: 'N95 Masks', current: 120, predicted: 500, status: 'Critical' },
                { name: 'Surgical Gloves (L)', current: 450, predicted: 1200, status: 'Warning' },
                { name: 'Saline Solution 500ml', current: 80, predicted: 200, status: 'Warning' },
                { name: 'Syringes 5ml', current: 2000, predicted: 2200, status: 'Stable' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-background-secondary rounded-xl border border-border theme-transition">
                  <div>
                    <p className="font-bold text-foreground-primary">{item.name}</p>
                    <p className="text-xs text-foreground-secondary">Current Stock: {item.current}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400">Predicted Need</p>
                    <p className="font-bold text-foreground-primary">{item.predicted}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Critical' ? 'bg-danger-light text-danger-dark' :
                      item.status === 'Warning' ? 'bg-warning-light text-warning-dark' :
                        'bg-success-light text-success-dark'
                      }`}>
                      {item.status}
                    </span>
                  </div>
                  <button className="p-2 text-accent hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg">
                    <Plus size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-600/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Procurement Optimization</h3>
                <p className="text-purple-100 mb-6 max-w-sm">The AI suggests grouping orders for 'MedTech Solutions' to save approx. <span className="font-bold text-white">$1,250</span> in shipping and bulk discounts.</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition-colors">
                  Apply Suggestion
                </button>
              </div>
              <Sparkles className="absolute right-4 bottom-4 text-purple-500 opacity-30" size={120} />
            </div>

            <div className="bg-background-primary rounded-2xl shadow-sm border border-border p-6 theme-transition">
              <h3 className="text-lg font-bold text-foreground-primary mb-4">Demand Trend (30 Days)</h3>
              <div className="h-48 flex items-end justify-between gap-1">
                {[30, 45, 35, 50, 48, 60, 55, 70, 65, 80, 75, 90, 85, 95, 100].map((h, i) => (
                  <div key={i} className="bg-purple-200 dark:bg-purple-900/40 rounded-t w-full hover:bg-purple-300 transition-colors" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-foreground-muted">
                <span>Mar 1</span>
                <span>Mar 15</span>
                <span>Mar 30</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowOrderModal(false)}>
          <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up theme-transition" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground-primary">New Purchase Order</h2>
              <button onClick={() => setShowOrderModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Select Vendor</label>
                <select value={formData.vendorName} onChange={e => setFormData(p => ({ ...p, vendorName: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition">
                  <option value="">Choose a vendor...</option>
                  {vendors.filter(v => v.status === 'Active').map(v => <option key={v.id} value={v.name}>{v.name} ({v.category})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Items Required</label>
                <textarea rows={3} value={formData.items} onChange={e => setFormData(p => ({ ...p, items: e.target.value }))} placeholder="List items and quantities..."
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 resize-none theme-transition" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Est. Total ($)</label>
                  <input type="number" value={formData.total} onChange={e => setFormData(p => ({ ...p, total: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Date Needed</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Requested By</label>
                <input type="text" value={formData.requestedBy} onChange={e => setFormData(p => ({ ...p, requestedBy: e.target.value }))} placeholder="Department or Name"
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowOrderModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVendorModal(false)}>
          <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up theme-transition" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground-primary">{selectedVendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
              <button onClick={() => setShowVendorModal(false)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveVendor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Vendor Name</label>
                <input type="text" value={vendorForm.name} onChange={e => setVendorForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Category</label>
                  <input type="text" value={vendorForm.category} onChange={e => setVendorForm(p => ({ ...p, category: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Contact Person</label>
                  <input type="text" value={vendorForm.contact} onChange={e => setVendorForm(p => ({ ...p, contact: e.target.value }))} required
                    className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Email</label>
                <input type="email" value={vendorForm.email} onChange={e => setVendorForm(p => ({ ...p, email: e.target.value }))} required
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground-secondary mb-1.5">Status</label>
                <select value={vendorForm.status} onChange={e => setVendorForm(p => ({ ...p, status: e.target.value as any }))}
                  className="w-full px-3 py-2.5 border border-border rounded-xl bg-background-secondary text-foreground-primary outline-none focus:ring-2 focus:ring-teal-500 theme-transition">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowVendorModal(false)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors theme-transition">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all">Save Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-background-primary rounded-2xl max-w-lg w-full shadow-2xl animate-scale-up theme-transition" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground-primary">Order Details</h2>
                <p className="text-sm text-foreground-secondary">{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-foreground-muted hover:text-foreground-primary rounded-lg hover:bg-background-tertiary">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">Vendor</p>
                  <p className="text-lg font-bold text-foreground-primary">{selectedOrder.vendorName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">Total</p>
                  <p className="text-lg font-bold text-accent">{formatCurrency(selectedOrder.total)}</p>
                </div>
              </div>

              <div className="p-4 bg-background-secondary rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${selectedOrder.status === 'Approved' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' : 'bg-background-tertiary text-foreground-secondary'}`}>{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Order Date</span>
                  <span className="font-medium text-foreground-primary">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-secondary">Requested By</span>
                  <span className="font-medium text-foreground-primary">{selectedOrder.requestedBy}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">Items</p>
                <div className="p-3 border border-border rounded-xl text-foreground-secondary bg-background-tertiary">
                  {selectedOrder.items}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedOrder(null)} className="flex-1 py-2.5 border border-border rounded-xl text-foreground-secondary font-medium hover:bg-background-tertiary transition-colors theme-transition">Close</button>
                <button className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2">
                  <FileText size={18} /> Print PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procurement;
