import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../../types';
import { authAPI, setToken, getToken } from '../../services/apiClient';

interface LoginRecord {
  id: string;
  userName: string;
  userRole: UserRole;
  loginTime: string;
  status: 'Active' | 'Logged Out';
  ip?: string;
  device?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginHistory: LoginRecord[];
  activeUsers: LoginRecord[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);

  // Load history from local storage on mount (keep this for UI demo purposes if needed, or remove)
  useEffect(() => {
    const storedHistory = localStorage.getItem('nexus_login_history');
    if (storedHistory) {
      setLoginHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.me();
        setUser(userData);
      } catch (error) {
        console.error("Session expired or invalid:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { access_token, user } = await authAPI.login({ email, password });
      setToken(access_token);
      setUser(user);

      // Update local history for UI demo
      const newRecord: LoginRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userName: user.name,
        userRole: user.role,
        loginTime: new Date().toLocaleString(),
        status: 'Active',
        ip: '192.168.1.1', // Mock IP
        device: 'Browser'
      };
      const updatedHistory = [newRecord, ...loginHistory];
      setLoginHistory(updatedHistory);
      localStorage.setItem('nexus_login_history', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const { access_token, user } = await authAPI.register({ name, email, password, role });
      setToken(access_token);
      setUser(user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    // Update history
    if (user) {
      const updatedHistory = loginHistory.map((record, index) => {
        if (index === 0 && record.userName === user.name) {
          return { ...record, status: 'Logged Out' as const };
        }
        return record;
      });
      setLoginHistory(updatedHistory);
      localStorage.setItem('nexus_login_history', JSON.stringify(updatedHistory));
    }
  };

  const activeUsers = loginHistory.filter(r => r.status === 'Active');

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading,
      loginHistory,
      activeUsers
    }}>
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
