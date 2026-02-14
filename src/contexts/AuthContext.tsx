import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../../types';

interface LoginRecord {
  id: string;
  userName: string;
  userRole: UserRole;
  loginTime: string;
  status: 'Active' | 'Logged Out';
  ip?: string; // Simulated IP
  device?: string; // Simulated Device
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loginHistory: LoginRecord[];
  activeUsers: LoginRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('nexus_login_history');
    if (storedHistory) {
      setLoginHistory(JSON.parse(storedHistory));
    }

    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (name: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff`
    };
    
    const newRecord: LoginRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userName: name,
      userRole: role,
      loginTime: new Date().toLocaleString(),
      status: 'Active',
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
      device: ['Chrome on Windows', 'Safari on Mac', 'Firefox on Linux'][Math.floor(Math.random() * 3)]
    };

    const updatedHistory = [newRecord, ...loginHistory];
    setLoginHistory(updatedHistory);
    localStorage.setItem('nexus_login_history', JSON.stringify(updatedHistory));

    setUser(newUser);
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
  };

  const logout = () => {
    if (user) {
        // Mark latest session as logged out
        const updatedHistory = loginHistory.map((record, index) => {
            if (index === 0 && record.userName === user.name) { // Simple assumption: latest record is current user
                return { ...record, status: 'Logged Out' as const };
            }
            return record;
        });
        setLoginHistory(updatedHistory);
        localStorage.setItem('nexus_login_history', JSON.stringify(updatedHistory));
    }
    setUser(null);
    localStorage.removeItem('nexus_user');
  };

  const activeUsers = loginHistory.filter(r => r.status === 'Active');

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loginHistory, activeUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
