import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'employee' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: 'employee' | 'admin'): Promise<boolean> => {
    if (userType === 'admin') {
      if (email === 'admin' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          type: 'admin',
          name: 'Administrator',
          email: 'admin@company.com'
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    // Employee login
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employee = employees.find((emp: any) => 
      emp.email === email && emp.password === password && emp.isApproved
    );

    if (employee) {
      const employeeUser: User = {
        id: employee.id,
        type: 'employee',
        name: employee.fullName,
        email: employee.email
      };
      setUser(employeeUser);
      localStorage.setItem('currentUser', JSON.stringify(employeeUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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