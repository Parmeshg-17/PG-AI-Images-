import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType, PaymentRequest } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
    { id: 1, name: 'Admin', email: 'pgedit999@gmail.com', credits: 1000, isAdmin: true },
    { id: 2, name: 'Test User', email: 'user@test.com', credits: 10, isAdmin: false },
];

const mockPayments: PaymentRequest[] = [
    { id: 1, userId: 2, userName: 'Test User', plan: '100 Credits', amount: 199, utrCode: 'UTR123456789', date: new Date().toISOString().split('T')[0], status: 'pending' }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(mockPayments);

  const login = (email: string, password?: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if(foundUser) {
        // Hardcoded admin password check as per PRD
        if(foundUser.isAdmin && password !== 'Pgedit999@admin') {
            alert('Incorrect admin password.');
            return false;
        }
        setUser(foundUser);
        return true;
    }
    return false;
  };
  
  const signup = (name: string, email: string) => {
    if(users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert("User with this email already exists!");
        return;
    }
    const newUser: User = {
        id: Date.now(),
        name,
        email,
        credits: 25,
        isAdmin: false
    };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
  }

  const logout = () => {
    setUser(null);
  };
  
  const updateCredits = (newCredits: number) => {
      setUser(currentUser => {
          if (!currentUser) return null;
          const updatedUser = { ...currentUser, credits: newCredits };
          setUsers(prevUsers => prevUsers.map(u => u.id === currentUser.id ? updatedUser : u));
          return updatedUser;
      });
  };
  
  const submitPaymentRequest = (request: Omit<PaymentRequest, 'id' | 'userId' | 'userName' | 'status'>) => {
      if(!user) return;
      const newRequest: PaymentRequest = {
          ...request,
          id: Date.now(),
          userId: user.id,
          userName: user.name,
          status: 'pending'
      };
      setPaymentRequests(prev => [newRequest, ...prev]);
  };
  
  const approvePayment = (id: number) => {
      const request = paymentRequests.find(p => p.id === id);
      if(!request) return;

      const planCredits = parseInt(request.plan.split(' ')[0]);
      if(!isNaN(planCredits)){
         setUsers(prevUsers => prevUsers.map(u => u.id === request.userId ? {...u, credits: u.credits + planCredits} : u));
      } else { // Unlimited plan
         setUsers(prevUsers => prevUsers.map(u => u.id === request.userId ? {...u, credits: 999999} : u));
      }

      setPaymentRequests(prev => prev.map(p => p.id === id ? {...p, status: 'approved'} : p));
  };
  
  const rejectPayment = (id: number) => {
      setPaymentRequests(prev => prev.map(p => p.id === id ? {...p, status: 'rejected'} : p));
  };
  
  const adminUpdateUserCredits = (userId: number, newCredits: number) => {
      setUsers(prev => prev.map(u => u.id === userId ? {...u, credits: newCredits} : u));
       if(user?.id === userId) {
          setUser(u => u ? {...u, credits: newCredits} : null)
       }
  };

  return (
    <AuthContext.Provider value={{ user, users, paymentRequests, login, signup, logout, updateCredits, submitPaymentRequest, approvePayment, rejectPayment, adminUpdateUserCredits }}>
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