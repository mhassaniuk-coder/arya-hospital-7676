import React from 'react';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-red-50 p-3 rounded-xl">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Sign out?</h3>
          <p className="text-slate-500 mb-8">
            Are you sure you want to sign out? You will need to enter your credentials to access your dashboard again.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all transform active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
