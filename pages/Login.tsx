
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/upload');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-indigo-100 border border-slate-100">
        <div className="text-center mb-12">
          <div className="w-16 h-16 prism-gradient rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none text-slate-900 font-bold transition-all shadow-inner"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none text-slate-900 font-bold transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full prism-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400 text-sm font-bold">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition-colors">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
