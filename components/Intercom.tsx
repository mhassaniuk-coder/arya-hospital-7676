import React, { useState } from 'react';
import { IntercomLog } from '../types';
import {
    Radio, Send, Bell, Mic, Volume2, ShieldAlert,
    Users, Clock, History, CheckCircle2
} from 'lucide-react';

const MOCK_LOGS: IntercomLog[] = [
    { id: '1', sender: 'ER Desk', recipient: 'All Staff', message: 'Code Blue in Room 204', time: '10:00 AM', priority: 'Emergency', category: 'Medical' },
    { id: '2', sender: 'Admin', recipient: 'Dr. House', message: 'Please report to Admin Office', time: '09:30 AM', priority: 'Normal', category: 'General' },
    { id: '3', sender: 'Maintenance', recipient: '2nd Floor', message: 'Elevator B is under service', time: '08:45 AM', priority: 'Normal', category: 'Maintenance' },
];

const DEPARTMENTS = ['All Staff', 'ICU', 'Emergency', 'Surgery', 'Pediatrics', 'General Ward', 'Security', 'Maintenance'];
const QUICK_ALERTS = [
    { label: 'Code Blue', message: 'Code Blue - Medical Emergency', priority: 'Emergency', category: 'Medical', color: 'bg-info-dark' },
    { label: 'Code Red', message: 'Code Red - Fire Alarm', priority: 'Emergency', category: 'Security', color: 'bg-danger' },
    { label: 'Code Black', message: 'Code Black - Bomb Threat', priority: 'Emergency', category: 'Security', color: 'bg-foreground-primary' },
];

const Intercom: React.FC = () => {
    const [logs, setLogs] = useState<IntercomLog[]>(MOCK_LOGS);
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('All Staff');
    const [priority, setPriority] = useState<'Normal' | 'Emergency'>('Normal');
    const [isRecording, setIsRecording] = useState(false);

    const handleSend = (text: string = message, p: 'Normal' | 'Emergency' = priority, cat: any = 'General') => {
        if (!text) return;

        const newLog: IntercomLog = {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'Current Console',
            recipient,
            message: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            priority: p,
            category: cat
        };

        setLogs([newLog, ...logs]);
        setMessage('');
        setPriority('Normal');
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        // In a real app, this would handle audio capture
    };

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground-primary">Intercom & Paging</h1>
                    <p className="text-foreground-muted">Broadcast announcements and emergency alerts.</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-2 px-3 py-1 bg-success-light text-success-dark rounded-full text-xs font-bold animate-pulse">
                        <Radio size={14} /> System Online
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Broadcast Console */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Input */}
                    <div className="bg-background-primary rounded-2xl shadow-sm border border-border-muted p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-foreground-primary flex items-center gap-2">
                                <Volume2 className="text-accent" /> New Broadcast
                            </h2>
                            <div className="flex gap-2">
                                <select
                                    className="text-sm border border-border rounded-lg px-2 py-1 bg-background-primary text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent theme-transition"
                                    value={recipient}
                                    onChange={e => setRecipient(e.target.value)}
                                >
                                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                        </div>

                        <textarea
                            className="w-full h-32 p-4 bg-background-secondary rounded-xl border border-border focus:ring-2 focus:ring-accent outline-none text-foreground-primary resize-none mb-4 theme-transition"
                            placeholder="Type your announcement here..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        ></textarea>

                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={toggleRecording}
                                    className={`p-3 rounded-full theme-transition ${isRecording ? 'bg-danger-light text-danger animate-pulse' : 'bg-background-secondary text-foreground-muted hover:bg-background-tertiary'
                                        }`}
                                >
                                    <Mic size={20} />
                                </button>
                                <button
                                    onClick={() => setPriority(priority === 'Normal' ? 'Emergency' : 'Normal')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold theme-transition ${priority === 'Emergency' ? 'bg-danger-light text-danger-dark border border-danger' : 'bg-background-secondary text-foreground-muted border border-border'
                                        }`}
                                >
                                    {priority === 'Emergency' ? 'Priority: Emergency' : 'Priority: Normal'}
                                </button>
                            </div>
                            <button
                                onClick={() => handleSend()}
                                disabled={!message}
                                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 theme-transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            >
                                <Send size={18} /> Broadcast
                            </button>
                        </div>
                    </div>

                    {/* Quick Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {QUICK_ALERTS.map((alert, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(alert.message, 'Emergency', alert.category)}
                                className={`${alert.color} text-white p-4 rounded-xl shadow-md hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-2 text-center`}
                            >
                                <ShieldAlert size={28} />
                                <span className="font-bold">{alert.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent History */}
                <div className="bg-background-primary rounded-2xl shadow-sm border border-border-muted p-6 h-fit">
                    <h3 className="font-bold text-foreground-primary mb-4 flex items-center gap-2">
                        <History size={18} className="text-foreground-muted" /> Broadcast History
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {logs.map(log => (
                            <div key={log.id} className={`p-4 rounded-xl border-l-4 shadow-sm bg-background-secondary ${log.priority === 'Emergency' ? 'border-l-danger' : 'border-l-accent'
                                }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-foreground-primary flex items-center gap-2 text-sm">
                                        {log.priority === 'Emergency' && <Bell size={14} className="text-danger" />}
                                        {log.sender}
                                    </span>
                                    <span className="text-xs text-foreground-muted flex items-center gap-1">
                                        <Clock size={10} /> {log.time}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-foreground-muted">To: {log.recipient}</p>
                                    {log.category && <span className="text-[10px] px-1.5 py-0.5 bg-background-tertiary rounded text-foreground-secondary uppercase font-bold">{log.category}</span>}
                                </div>
                                <div className={`p-3 rounded-lg text-sm ${log.priority === 'Emergency'
                                    ? 'bg-danger-light text-danger-dark'
                                    : 'bg-background-tertiary text-foreground-secondary'
                                    }`}>
                                    "{log.message}"
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Intercom;