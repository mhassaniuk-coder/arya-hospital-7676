import React from 'react';
import { useData } from '../src/contexts/DataContext';
import { Megaphone, Pin } from 'lucide-react';

const NoticeBoard: React.FC = () => {
    const { notices, addNotice } = useData();
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Notice Board</h1>
                  <p className="text-slate-500">Hospital-wide announcements and updates.</p>
                </div>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md">
                    + Post Notice
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.map(notice => (
                    <div key={notice.id} className={`p-6 rounded-2xl shadow-sm border relative ${notice.priority === 'Urgent' ? 'bg-red-50 border-red-100' : 'bg-yellow-50 border-yellow-100'}`}>
                        <div className="absolute top-4 right-4 text-slate-400">
                            <Pin size={20} className="transform rotate-45" fill="currentColor" />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-3 inline-block ${notice.priority === 'Urgent' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                            {notice.priority}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{notice.title}</h3>
                        <p className="text-slate-700 text-sm leading-relaxed mb-4">{notice.content}</p>
                        <p className="text-xs text-slate-500 font-medium">{notice.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NoticeBoard;