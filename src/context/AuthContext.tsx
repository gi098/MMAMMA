import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import {
  registerWithFirebase,
  loginWithFirebase,
  logoutFromFirebase,
  subscribeToAuthState,
} from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  authError: string | null;
  register: (email: string, pass: string, displayName?: string) => Promise<{ success: boolean; error: string | null }>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user: User | null) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || null,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    const result = await registerWithFirebase(email, pass, displayName);
    if (result.error) {
      setAuthError(result.error);
      return { success: false, error: result.error };
    }
    if (result.user && displayName && displayName.trim()) {
      setCurrentUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: displayName.trim(),
      });
    }
    return { success: true, error: null };
  };

  const login = async (email: string, pass: string) => {
    setAuthError(null);
    const result = await loginWithFirebase(email, pass);
    if (result.error) {
      setAuthError(result.error);
      return { success: false, error: result.error };
    }
    return { success: true, error: null };
  };

  const logout = async () => {
    setAuthError(null);
    await logoutFromFirebase();
    setCurrentUser(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        register,
        login,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

