import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Admin } from '../types';
import { DatabaseStorage } from '../db/storage';

interface AuthContextType {
  currentUser: User | null;
  currentAdmin: Admin | null;
  activeRole: 'USER' | 'ADMIN' | 'GUEST';
  loginAsUser: (email: string) => boolean;
  loginAsAdmin: (email: string) => boolean;
  registerUser: (name: string, email: string, phone: string) => { success: boolean; error?: string };
  updateUserProfile: (data: Partial<User>) => void;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  switchDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'ts_train_sys_auth_user_id';
const AUTH_ADMIN_KEY = 'ts_train_sys_auth_admin_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [activeRole, setActiveRole] = useState<'USER' | 'ADMIN' | 'GUEST'>('GUEST');

  useEffect(() => {
    DatabaseStorage.initialize();
    const savedUserId = localStorage.getItem(AUTH_USER_KEY);
    const savedAdminId = localStorage.getItem(AUTH_ADMIN_KEY);

    if (savedAdminId) {
      const admins = DatabaseStorage.getAdmins();
      const admin = admins.find(a => a.id === savedAdminId);
      if (admin) {
        setCurrentAdmin(admin);
        setCurrentUser(null);
        setActiveRole('ADMIN');
        return;
      }
    }

    if (savedUserId) {
      const users = DatabaseStorage.getUsers();
      const user = users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setCurrentAdmin(null);
        setActiveRole('USER');
        return;
      }
    }

    // Default to demo user if not logged in to make immediate demo frictionless
    const defaultUser = DatabaseStorage.getUsers()[0];
    if (defaultUser) {
      setCurrentUser(defaultUser);
      setActiveRole('USER');
      localStorage.setItem(AUTH_USER_KEY, defaultUser.id);
    }
  }, []);

  const loginAsUser = (email: string): boolean => {
    const users = DatabaseStorage.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      if (user.status === 'BLOCKED') {
        alert('This user account has been suspended by System Administration.');
        return false;
      }
      setCurrentUser(user);
      setCurrentAdmin(null);
      setActiveRole('USER');
      localStorage.setItem(AUTH_USER_KEY, user.id);
      localStorage.removeItem(AUTH_ADMIN_KEY);
      return true;
    }
    return false;
  };

  const loginAsAdmin = (email: string): boolean => {
    const admins = DatabaseStorage.getAdmins();
    const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin) {
      setCurrentAdmin(admin);
      setCurrentUser(null);
      setActiveRole('ADMIN');
      localStorage.setItem(AUTH_ADMIN_KEY, admin.id);
      localStorage.removeItem(AUTH_USER_KEY);
      return true;
    }
    return false;
  };

  const registerUser = (name: string, email: string, phone: string) => {
    const users = DatabaseStorage.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'A user with this email address already exists.' };
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    DatabaseStorage.saveUser(newUser);
    setCurrentUser(newUser);
    setCurrentAdmin(null);
    setActiveRole('USER');
    localStorage.setItem(AUTH_USER_KEY, newUser.id);
    localStorage.removeItem(AUTH_ADMIN_KEY);
    return { success: true };
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...data };
    DatabaseStorage.saveUser(updated);
    setCurrentUser(updated);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentAdmin(null);
    setActiveRole('GUEST');
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_ADMIN_KEY);
  };

  const switchDemoUser = (userId: string) => {
    const users = DatabaseStorage.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentAdmin(null);
      setActiveRole('USER');
      localStorage.setItem(AUTH_USER_KEY, user.id);
      localStorage.removeItem(AUTH_ADMIN_KEY);
    }
  };

  const switchDemoAdmin = () => {
    const admins = DatabaseStorage.getAdmins();
    const admin = admins[0];
    if (admin) {
      setCurrentAdmin(admin);
      setCurrentUser(null);
      setActiveRole('ADMIN');
      localStorage.setItem(AUTH_ADMIN_KEY, admin.id);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentAdmin,
        activeRole,
        loginAsUser,
        loginAsAdmin,
        registerUser,
        updateUserProfile,
        logout,
        switchDemoUser,
        switchDemoAdmin
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
