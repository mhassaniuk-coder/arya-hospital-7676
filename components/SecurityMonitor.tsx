import React from 'react';
import { SecurityLog, UserRole } from '../types';
import { Shield, Eye, AlertTriangle, Monitor, Smartphone, Globe, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

const MOCK_SECURITY: SecurityLog[] = [
    { id: '1', location: 'Main Entrance', event: 'ID Card Scan', timestamp: '10:45 AM', type: 'Entry', personnel: 'Staff A' },
    { id: '2', location: 'Pharmacy Store', event: 'Motion Detected', timestamp: '03:00 AM', type: 'Alert', personnel: 'Unknown' },
];

const SecurityMonitor: React.FC = () => {
    const { user, loginHistory, activeUsers } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Monitor</h1>
                    <p className="text-slate-500 dark:text-slate-400">CCTV logs, access control, and user sessions.</p>
                </div>
            </div>

            {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Sessions Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border-b border-teal-100 dark:border-teal-900/30 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <UserCheck className="text-teal-600 dark:text-teal-400" size={20} />
                                <h3 className="font-bold text-teal-800 dark:text-teal-200">Active Sessions</h3>
                            </div>
                            <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs px-2 py-1 rounded-full font-bold">{activeUsers.length} Online</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {activeUsers.map(session => (
                                <div key={session.id} className="p-4 border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs">
                                                {session.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{session.userName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{session.userRole}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                <Monitor size={12} />
                                                <span>{session.ip}</span>
                                            </div>
                                            {session.device && (
                                                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                    <Smartphone size={12} />
                                                    <span>{session.device}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Login History Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Clock className="text-slate-600 dark:text-slate-400" size={20} />
                                <h3 className="font-bold text-slate-800 dark:text-white">Login History</h3>
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {loginHistory.slice(0, 10).map(record => (
                                <div key={record.id} className="p-3 border-b border-slate-50 dark:border-slate-700 last:border-0 flex justify-between items-center text-sm hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{record.userName}</span>
                                        <span className="text-slate-400 mx-2">•</span>
                                        <span className={`text-xs ${record.status === 'Active' ? 'text-green-600 dark:text-green-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>{record.status}</span>
                                    </div>
                                    <span className="text-slate-400 text-xs">{record.loginTime}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-4">Facility Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black rounded-2xl p-4 relative overflow-hidden aspect-video flex items-center justify-center group border border-slate-800 shadow-lg">
                    <p className="text-slate-500 text-sm z-10">CCTV - Main Lobby</p>
                    <div className="absolute top-4 left-4 bg-red-600 w-3 h-3 rounded-full animate-pulse z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center z-20 backdrop-blur-sm transition-all">
                        <button className="text-white flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors"><Eye size={18} /> View Live</button>
                    </div>
                </div>
                <div className="bg-black rounded-2xl p-4 relative overflow-hidden aspect-video flex items-center justify-center group border border-slate-800 shadow-lg">
                    <p className="text-slate-500 text-sm z-10">CCTV - ICU Corridor</p>
                    <div className="absolute top-4 left-4 bg-red-600 w-3 h-3 rounded-full animate-pulse z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
                <div className="bg-black rounded-2xl p-4 relative overflow-hidden aspect-video flex items-center justify-center group border border-slate-800 shadow-lg">
                    <p className="text-slate-500 text-sm z-10">CCTV - Parking</p>
                    <div className="absolute top-4 left-4 bg-red-600 w-3 h-3 rounded-full animate-pulse z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">Access Logs</div>
                {MOCK_SECURITY.map(log => (
                    <div key={log.id} className="p-4 border-b border-slate-50 dark:border-slate-700 last:border-0 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${log.type === 'Alert' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                {log.type === 'Alert' ? <AlertTriangle size={18} /> : <Shield size={18} />}
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 dark:text-white">{log.location}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{log.event} • {log.personnel}</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{log.timestamp}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SecurityMonitor;