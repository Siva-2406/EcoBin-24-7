import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, role?: 'admin' | 'operator' | 'viewer') => Promise<void>;
  logout: () => void;
  setUserRole: (role: 'admin' | 'operator' | 'viewer') => void;
}

const STORAGE_KEY = 'ecobin_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading auth state from storage', e);
    }
    // Default logged in as Campus IoT Project Admin for effortless demonstration
    return {
      uid: 'user-kiot-admin-01',
      email: '2k25csbs49@kiot.ac.in',
      displayName: 'KIOT Project Lead (Admin)',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginWithGoogle = async () => {
    // In preview / sandbox, provide smooth authentic login
    const newUser: UserProfile = {
      uid: `google-${Date.now()}`,
      email: '2k25csbs49@kiot.ac.in',
      displayName: 'KIOT Project Engineer',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
  };

  const loginWithEmail = async (email: string, role: 'admin' | 'operator' | 'viewer' = 'operator') => {
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      role,
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const setUserRole = (role: 'admin' | 'operator' | 'viewer') => {
    if (!user) return;
    setUser({ ...user, role });
  };

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoggedIn,
        loginWithGoogle,
        loginWithEmail,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
