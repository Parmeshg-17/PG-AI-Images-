import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (email.trim() && password.trim()) {
        const success = login(email, password);
        if (success) navigate('/generate');
      }
    } else {
      if (name.trim() && email.trim() && password.trim() && password === confirmPassword) {
        signup(name, email);
        navigate('/generate');
      } else if (password !== confirmPassword) {
        alert("Passwords do not match!");
      }
    }
  };
  
  const inputStyles = "w-full px-1 py-2 bg-transparent border-b-2 border-light-border dark:border-dark-border focus:outline-none focus:border-light-text dark:focus:border-dark-text transition-colors";

  return (
    <div className="max-w-md mx-auto mt-4 md:mt-10 animate-fade-in">
      <div className="bg-light-secondary dark:bg-dark-secondary p-8 rounded-xl shadow-2xl border border-light-border dark:border-dark-border">
        <div className="flex border-b border-light-border dark:border-dark-border mb-8">
          <button onClick={() => setIsLogin(true)} className={`w-1/2 py-3 font-bold font-heading transition-colors ${isLogin ? 'border-b-2 border-black dark:border-white text-light-text dark:text-dark-text' : 'text-gray-400'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`w-1/2 py-3 font-bold font-heading transition-colors ${!isLogin ? 'border-b-2 border-black dark:border-white text-light-text dark:text-dark-text' : 'text-gray-400'}`}>
            Sign Up
          </button>
        </div>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-heading mb-2">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p className="text-gray-500 dark:text-gray-400">
                {isLogin ? 'Login to continue your creative journey.' : 'Sign up to get 25 free credits!'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                className={inputStyles}
                placeholder="Your Name" required />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
              placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className={inputStyles}
              placeholder="••••••••" required />
          </div>
          {!isLogin && (
             <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">Confirm Password</label>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputStyles}
                  placeholder="••••••••" required />
              </div>
          )}
          <button type="submit"
            className="w-full bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark py-3 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
            {isLogin ? 'Login' : 'Sign Up & Generate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;