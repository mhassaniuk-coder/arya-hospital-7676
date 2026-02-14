import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, Monitor } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
        
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Monitor size={20} className="text-teal-600" />
                    General Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Hospital Name</label>
                        <input type="text" defaultValue="NexusHealth" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                        <input type="email" defaultValue="admin@nexushealth.com" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Bell size={20} className="text-teal-600" />
                    Notifications
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">Email Notifications</span>
                        <div className="w-10 h-6 bg-teal-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-600 text-sm">SMS Alerts (Emergency)</span>
                        <div className="w-10 h-6 bg-teal-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-teal-600" />
                    Security
                </h3>
                <button className="text-teal-600 text-sm font-medium hover:underline">Change Admin Password</button>
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                <button className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 shadow-md">Save Changes</button>
            </div>
        </div>
    </div>
  );
};

export default Settings;