import React, { useState } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Mike', text: 'Has the lab report for Bed 3 come in?', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Just checked, uploading it now.', time: '10:32 AM', isMe: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: input, time: 'Now', isMe: true }]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-20 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col h-96">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-bold text-sm">Staff Chat (General)</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.isMe ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                             {!msg.isMe && <p className="text-xs font-bold mb-1 opacity-70">{msg.sender}</p>}
                             {msg.text}
                         </div>
                         <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                    </div>
                ))}
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700">
                    <Send size={18} />
                </button>
            </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center relative group"
      >
        <MessageSquare size={24} />
        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
        <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Staff Chat
        </span>
      </button>
    </div>
  );
};

export default ChatWidget;