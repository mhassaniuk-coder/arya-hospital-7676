import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, AlertTriangle, Sparkles, Phone, Calendar, Pill } from 'lucide-react';
import { useHealthChatbot } from '../hooks/useAI';
import { HealthChatbotResult } from '../types';

interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  isMe: boolean;
  intent?: string;
  resources?: HealthChatbotResult['resources'];
  suggestedActions?: HealthChatbotResult['suggestedActions'];
}

const AIHealthChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'assistant', 
      text: "Hello! I'm your AI health assistant. I'm here 24/7 to help you with health questions, symptom guidance, appointment scheduling, and medication information. How can I assist you today?", 
      time: 'Now', 
      isMe: false 
    },
  ]);
  const [input, setInput] = useState('');
  const [showAIBadge, setShowAIBadge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { execute: getChatbotResponse, loading, error } = useHealthChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const response = await getChatbotResponse({
        message: currentInput,
        conversationHistory: messages.map(m => ({
          role: m.isMe ? 'user' as const : 'assistant' as const,
          content: m.text,
          timestamp: m.time
        })),
        sessionType: 'general'
      });

      if (response.success && response.data) {
        const aiResult = response.data;
        const aiMessage: Message = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: aiResult.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          intent: aiResult.intent,
          resources: aiResult.resources,
          suggestedActions: aiResult.suggestedActions
        };
        setMessages(prev => [...prev, aiMessage]);

        // Show emergency warning if detected
        if (aiResult.emergencyDetected) {
          const emergencyMessage: Message = {
            id: Date.now() + 2,
            sender: 'assistant',
            text: '⚠️ If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false
          };
          setMessages(prev => [...prev, emergencyMessage]);
        }
      } else {
        const errorMessage: Message = {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team if the issue persists.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "I'm sorry, something went wrong. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <div className="fixed bottom-6 right-20 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">AI Health Assistant</span>
                  {showAIBadge && (
                    <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={10} />
                      AI-Powered
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-teal-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-teal-100 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.isMe 
                    ? 'bg-teal-600 text-white rounded-br-md' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                }`}>
                  {!msg.isMe && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={14} className="text-teal-600" />
                      <span className="text-xs font-semibold text-teal-600">AI Assistant</span>
                      {msg.intent === 'emergency_alert' && (
                        <AlertTriangle size={14} className="text-red-500" />
                      )}
                    </div>
                  )}
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  {/* Resources */}
                  {msg.resources && msg.resources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Resources:</p>
                      <div className="space-y-1">
                        {msg.resources.slice(0, 2).map((resource, idx) => (
                          <div key={idx} className="text-xs text-teal-600 hover:text-teal-700 cursor-pointer">
                            📎 {resource.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Suggested Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedActions.slice(0, 3).map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickAction(action.action)}
                            className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full hover:bg-teal-100 transition-colors"
                          >
                            {action.action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Bot size={14} className="text-teal-600" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-slate-100">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button 
                onClick={() => handleQuickAction('Check my symptoms')}
                className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                <Sparkles size={12} />
                Check Symptoms
              </button>
              <button 
                onClick={() => handleQuickAction('Schedule an appointment')}
                className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                <Calendar size={12} />
                Book Appointment
              </button>
              <button 
                onClick={() => handleQuickAction('Medication information')}
                className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                <Pill size={12} />
                Medications
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me anything about your health..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="bg-teal-600 text-white p-2.5 rounded-xl hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              AI responses are for informational purposes only. Consult a healthcare provider for medical advice.
            </p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center relative group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
            <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              AI Health Assistant
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIHealthChatWidget;
